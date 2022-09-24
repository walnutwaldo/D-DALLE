//import { Dalle } from "dalle-node";
let dalle;

const setup = async () => {
    const { Dalle } = await import("dalle-node");
    dalle = new Dalle("sess-i8tCsrjc3qVcqoBGOLMV1q0wYYfNSw4NpRWIGHjL"); // Bearer Token 
};

const fetch = require("node-fetch-commonjs");
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;



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
}



const run_prompt = async (prompt) => {
    const generations = await dalle.generate("a cat driving a car");
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
    generations.forEach(generation => {
        const url = generation.generation.image_path;
        // download image from url
        downloadImage(url, "images/" + generation.id + ".jpg")
    });
}

const prompt = (req, res) => {
    console.log("prompt:", req.body);
    const res_data = { "success": true, "data": req.body };
    res.send(res_data);
};





setup().then(() => {

    init();
    url = "https://openai-labs-public-images-prod.azureedge.net/user-WAOFRt6Xqw1eXVzsqjHrsvbg/generations/generation-CmovJQoXMMTLc6iBGOzyKZSi/image.webp";
    downloadImage(url, "test.jpg");

    express()
        .use(express.static(path.join(__dirname, 'public')))
        .use(express.json())
        .post('/prompt', prompt)
        .listen(PORT, () => console.log(`Listening on ${PORT}`))

});