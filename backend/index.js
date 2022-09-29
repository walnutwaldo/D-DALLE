const ethers = require('ethers');
const { BigNumber } = ethers;
const axios = require('axios');
require('dotenv').config();
const { getSigner } = require("./web3");


const DDALLE_DEPLOYMENT = require("./abi/DDALLE_DEPLOYMENT.json");

const fetch = require("node-fetch-commonjs");
const fs = require('fs').promises;
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const express = require('express');
const { Server } = require('ws');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


let dalle;

const setup = async () => {
    const { Dalle } = await import("dalle-node");
    dalle = new Dalle(process.env.OPENAI_BEARER_TOKEN); // Bearer Token from .env file
};


const PORT = process.env.PORT || 5000;
const DOMAIN = "https://storage.googleapis.com/decentralized-dall-e.appspot.com";
const FIREBASE_BUCKET = "decentralized-dall-e.appspot.com";

// read firebase file from config var (for heroku)
const fb_key_content = (process.env.firebase_key
    ? JSON.parse(process.env.firebase_key)
    : require("./firebase_account_key.json"));

// init firebase
initializeApp({
    credential: cert(fb_key_content), // need to set GOOGLE_APPLICATION_CREDENTIALS env var
    storageBucket: FIREBASE_BUCKET,
});
const bucket = getStorage().bucket();


const init = async () => {

    const creditsSummary = await dalle.getCredits();
    const totalCreditsLeft = creditsSummary.aggregate_credits;
    console.log("Total credits left:", totalCreditsLeft);
    console.log('Free credits refresh on:', new Date(creditsSummary.next_grant_ts * 1000).toLocaleString());
};

const downloadImage = async (url, path) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);

    console.log("downloaded:", path);
    const res = await bucket.upload(path, {
        gzip: true,
    });
    //const linkFB = res[0].metadata.mediaLink;
    console.log("uploaded to firebase: ", path);
}

const urls_from_prompt = async (prompt) => {
    const generations = (await dalle.generate(prompt)).data;
    console.log("generations:", generations);
    /*
[
  {
    id: 'generation-sCnERSYDPP0Zu14fsdXEcKmL',
    object: 'generation',
    created: 1553332711,
    generation_type: 'ImageGeneration',
    generation: {
      image_path: 'https://openailabsprodscus.blob.core.windows.net/private/user-hadpVzldsfs28CwvEZYMUT/generations/generation...'
    },
    task_id: 'task-nERkiKsdjVCSZ50yD69qewID',
    prompt_id: 'prompt-2CtaLQsgUbJHHDoJQy9Lul3T',
    is_public: false
  },
    */
    // download all images to local folder
    await Promise.all(generations.map(generation => {
        const url = generation.generation.image_path;
        // download image from url
        return downloadImage(url, "public/" + generation.id + ".jpg");
    }));
    // return list of ddalle urls
    const urls = generations.map(g => `${DOMAIN}/${g.id}.jpg`);
    return urls;
}
// TODO deprecated
const prompt = async (req, res) => {
    req.setTimeout(120 * 1000); // long timeout as DALLE takes 40s+
    console.log("request:", req.body);
    const prompt = req.body.prompt;
    const res_data = { success: true, urls: await urls_from_prompt(prompt) };
    res.send(res_data);
};

const wsOnConnect = (ws) => {
    ws.on('message', async (data) => {
        console.log('received: %s', data);
        const prompt = JSON.parse(data).prompt;
        const res_data = { type: "result", success: true, urls: await urls_from_prompt(prompt) };
        ws.send(JSON.stringify(res_data));
    });

    // keep heroku ws alive
    var intervalId = setInterval(() => {
        const data = { type: "keepalive" };
        ws.send(JSON.stringify(data), () => { /* ignore errors */ });
    }, 5000);

    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
    });
};

const submit = async (req, res) => {
    const {
        submissionsContract,
        uri,
        prompt,
        chainId
    } = req.body;

    const address = DDALLE_DEPLOYMENT.address[chainId];
    if (!address) return res.status(500).send({ success: false, error: "chainId not supported" });

    const signer = await getSigner(chainId);
    // console.log("Made signer");

    const contract = new ethers.Contract(submissionsContract, DDALLE_DEPLOYMENT.submissions_abi, signer);
    // console.log("Made contract");

    const url = signer.provider.connection.url;
    const response = await axios.post(url, {
        'jsonrpc': '2.0',
        'id': 0,
        'method': 'klay_gasPrice',
    })
    const { result: gasPrice } = response.data;
    const estimation = await contract.estimateGas.submit(uri, prompt);

    try {
        const txn = await contract.submit(uri, prompt, {
            gasLimit: estimation,
            gasPrice: gasPrice,
        });
        res.send({
            success: true,
            txn
        });
    } catch (e) {
        console.log("Error submitting", e);
        return res.status(500).send({ success: false, error: e });
    }
}

const submissions = async (req, res) => {
    const {
        chainid: chainId,
        submissionsContract,
        submissionId
    } = req.params;

    const address = DDALLE_DEPLOYMENT.address[chainId];
    if (!address) return res.status(500).send({ success: false, error: "chainId not supported" });

    const signer = await getSigner(chainId);
    const contract = new ethers.Contract(submissionsContract, DDALLE_DEPLOYMENT.submissions_abi, signer);

    return res.status(200).send({
        "description": await contract.getPrompt(submissionId),
        "external_url": `https://ddalle.xyz/propose/${submissionsContract}`,
        "image": await contract.getImageURL(submissionId),
        "name": `${await contract.name()} #${submissionId}`
    })
}

setup().then(() => {
    init();
    downloadImage("https://storage.googleapis.com/decentralized-dall-e.appspot.com/generation-q5lkwJFPwIcMvcWK0PRbh1U0.jpg", "public/test.jpg");

    const server = express()
        .use(express.static(path.join(__dirname, 'public')))
        .use(express.json())
        .use(cors({
            origin: '*'
        }))
        .post('/prompt', prompt) // TODO deprecated
        .post('/submit', submit)
        .get('/submissions/:chainid/:submissionsContract/:submissionId', submissions)
        .listen(PORT, () => console.log(`Listening on ${PORT}`));

    const wss = new Server({ server });
    wss.on('connection', wsOnConnect);
});