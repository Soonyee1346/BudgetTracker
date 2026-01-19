const express = require('express');
const summaryService = require('../services/summaryService');

const router = express.Router();

router.get('/monthly', async (req, res) => {
    let { month } = req.query;
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/

    if(!month){
        return res.status(400).json({ error: 'Month is required'});
    }

    if(!monthRegex.test(month)){
        return res.status(400).json({ error: 'Invalid month format (YYYY-MM)'});
    }

    try {
        let summary = await summaryService.getMonthlySummary(month);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

module.exports = router;