const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000



const prompt = (req, res) => {
    console.log("prompt:", req.body);
    const res_data = { "success": true, "data": req.body };
    res.send(res_data);
};

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(express.json())
    .post('/prompt', prompt)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
