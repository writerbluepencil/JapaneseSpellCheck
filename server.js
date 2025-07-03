const express = require('express');
const fs = require('fs');
const cors = require('cors');
const Nodehun = require('nodehun');

const app = express();
app.use(cors());
app.use(express.json());


app.use(express.static('public'));       // serves index.html, kuromoji.min.js
app.use('/dict', express.static('dict')); // serves Kuromoji dict files

const aff = fs.readFileSync('./ja_JP.aff');
const dic = fs.readFileSync('./ja_JP.dic');
const hunspell = new Nodehun(aff, dic);

app.post('/check', async (req, res) => {
    const word = req.body.word;
    const correct = await hunspell.spell(word);
    const suggestions = correct ? [] : await hunspell.suggest(word);
    res.json({ word, correct, suggestions });
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
