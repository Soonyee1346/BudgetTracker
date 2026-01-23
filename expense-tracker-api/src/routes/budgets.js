const express = require('express');
const router = express.Router();
const budgetsService = require('../services/budgetsService');

router.post('/', async (req, res) => {
    let { category, monthly_limit } = req.body;

    if (!category || typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ error: 'Category is required and must be a string' });
    }

    if (monthly_limit === undefined || typeof monthly_limit !== 'string' || monthly_limit < 0) {
        return res.status(400).json({ error: 'monthly_limit is required and must be a positive number' });
    }

    monthly_limit = Number(monthly_limit);

    try {
        const result = await budgetsService.upsertBudget(category, monthly_limit);
        res.status(result.update ? 200 : 201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { category, monthly_limit } = req.body;

    if(!id || typeof id !== 'string' || id < 1){
        return res.status(400).json({ error: 'ID is required and must be a positive number' });
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ error: 'Category is required and must be a string' });
    }

    if (monthly_limit === undefined || typeof monthly_limit !== 'string' || monthly_limit < 0) {
        return res.status(400).json({ error: 'monthly_limit is required and must be a positive number' });
    }

    try {
        const result = await budgetsService.updateBudget(id, category, monthly_limit);

        if (result.updated) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ error: 'Category not found' });

    } catch (err) {
        res.status(500).json({ error: err.message});
    }

})

router.delete('/:id', async (req, res) => {
    let { id } = req.params;

    id = Number(id);

    try {
        const result = await budgetsService.deleteBudget(id);

        if (result.deleted) {
            return res.status(204).send()
        }
        return res.status(404).json({ error: 'Budget not found' });

    } catch (err) {
        res.status(500).json({ error: err.message});
    }

})

router.get('/', async (req, res) => {
    try {
        const budgets = await budgetsService.getBudgets();
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
})

module.exports = router;