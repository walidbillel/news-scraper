const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render('index', {title: 'Insider news scraper!'});
});

module.exports = router;