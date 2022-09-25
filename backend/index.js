const ethers = require('ethers');
const axios = require('axios');
require('dotenv').config();
const {getSigner} = require("./web3");

let dalle;

const DDALLE_DEPLOYMENT = require("./abi/DDALLE_DEPLOYMENT.json");


const setup = async () => {
    const {Dalle} = await import("dalle-node");
    dalle = new Dalle("sess-i8tCsrjc3qVcqoBGOLMV1q0wYYfNSw4NpRWIGHjL"); // Bearer Token TODO move to .env
};

const fetch = require("node-fetch-commonjs");
const fs = require('fs').promises;
const {initializeApp, cert} = require('firebase-admin/app');
const {getStorage} = require('firebase-admin/storage');
const cors = require('cors');


const express = require('express');
const path = require('path');


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

const prompt = async (req, res) => {
    console.log("request:", req.body);
    const prompt = req.body.prompt;
    const res_data = {success: true, urls: await urls_from_prompt(prompt)};
    res.send(res_data);
};

const submit = async (req, res) => {
    const {
        taskId,
        uri,
        prompt,
        chainId
    } = req.body;

    const address = DDALLE_DEPLOYMENT.address[chainId];
    if (!address) return res.status(500).send({success: false, error: "chainId not supported"});

    const signer = await getSigner(chainId);
    // console.log("Made signer");

    const contract = new ethers.Contract(address, DDALLE_DEPLOYMENT.abi, signer);
    // console.log("Made contract");

    const url = signer.provider.connection.url;
    const response = await axios.post(url, {
        'jsonrpc': '2.0',
        'id': 0,
        'method': 'klay_gasPrice',
    })
    const { gasPrice } = response.data;
    const estimation = await contract.estimateGas.submit(taskId, uri, prompt);

    try {
        const txn = await contract.submit(taskId, uri, prompt, {
            gasLimit: estimation,
            gasPrice: gasPrice,
        });
        // console.log("Made txn");
        res.send({
            success: true,
            txn
        });
    } catch (e) {
        console.log("Error submitting", e);
        return res.status(500).send({success: false, error: e});
    }
}

setup().then(() => {
    init();
    downloadImage("https://storage.googleapis.com/decentralized-dall-e.appspot.com/generation-q5lkwJFPwIcMvcWK0PRbh1U0.jpg", "public/test.jpg");

    express()
        .use(express.static(path.join(__dirname, 'public')))
        .use(express.json())
        .use(cors({
            origin: '*'
        }))
        .post('/prompt', prompt)
        .post('/submit', submit)
        .listen(PORT, () => console.log(`Listening on ${PORT}`))
});