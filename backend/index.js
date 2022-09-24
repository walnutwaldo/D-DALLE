//import { Dalle } from "dalle-node";
let dalle;

const setup = async () => {
    const { Dalle } = await import("dalle-node");
    dalle = new Dalle("sess-i8tCsrjc3qVcqoBGOLMV1q0wYYfNSw4NpRWIGHjL"); // Bearer Token TODO move to .env
};

const fetch = require("node-fetch-commonjs");
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const DOMAIN = "https://ddalle-backend.herokuapp.com";

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
    const res_data = { success: true, urls: await urls_from_prompt(prompt) };
    res.send(res_data);
};

const submit = async(req, res) => {
    const {
        taskId,
        uri,
        prompt,
        chainId
    } = req.body;

    const provider = await getProvider(chainId);
}

setup().then(() => {
    init();
    express()
        .use(express.static(path.join(__dirname, 'public')))
        .use(express.json())
        .post('/prompt', prompt)
        .post('/submit', submit)
        .listen(PORT, () => console.log(`Listening on ${PORT}`))
});