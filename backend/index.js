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
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const setup = async () => {};


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
    // const creditsSummary = await dalle.getCredits();
    // const totalCreditsLeft = creditsSummary.aggregate_credits;
    // console.log("Total credits left:", totalCreditsLeft);
    // console.log('Free credits refresh on:', new Date(creditsSummary.next_grant_ts * 1000).toLocaleString());
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
    //const generations = (await dalle.generate(prompt)).data;
    //console.log("generations:", generations);
    const response = await openai.createImage({
        prompt: prompt,
        n: 4,
        size: "1024x1024",
    });
    console.log("response:", response.data.data);
    //image_url = response.data.data[0].url;
    // download all images to local folder
    const ids = await Promise.all(response.data.data.map(generation => {
        const url = generation.url;
        const id = uuidv4();
        // download image from url
        return downloadImage(url, "public/" + id + ".jpg").then(() => id);
    }));
    console.log("ids:", ids);
    // return list of ddalle urls
    const urls = ids.map(id => `${DOMAIN}/${id}.jpg`);
    return urls;
}

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
    //urls_from_prompt("A dog").then(console.log);

    const server = express()
        .use(express.static(path.join(__dirname, 'public')))
        .use(express.json())
        .use(cors({
            origin: '*'
        }))
        .post('/submit', submit)
        .get('/submissions/:chainid/:submissionsContract/:submissionId', submissions)
        .listen(PORT, () => console.log(`Listening on ${PORT}`));

    const wss = new Server({ server });
    wss.on('connection', wsOnConnect);
});