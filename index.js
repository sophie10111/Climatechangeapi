const PORT = 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/international'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/'
    }
];

const app = express();

app.get('/sanson', (req, res) => {
    res.json('Welcome to my climate change News Api');
});

app.get('/news', (req, res) => {
    const articles = [];

    axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: 'https://www.theguardian.com' + url,
                    source: 'The Guardian'
                });
            });

            res.json(articles);
        })
        .catch(err => console.log(err));
});

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;
    const newspaper = newspapers.filter(newspaper => newspaper.name === newspaperId)[0];

    if (!newspaper) {
        res.status(404).json({ error: 'Newspaper not found' });
    }

    const articles = [];

    axios.get(newspaper.address)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: newspaper.address + url,
                    source: newspaper.name
                });
            });

            res.json(articles);
        })
        .catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));


