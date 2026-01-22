const express = require('express');
const expensesService = require('../services/expensesService');
const categories = require('../constants/categories');

const router = express.Router();

router.get('/', async (req, res) => {
    const { month } = req.query;

    try {
        const result = await expensesService.getExpenses(month);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categories.includes(category)) {
        return res.status(400).json({
            error: `Invalid category. Must be one of: ${categories.join(', ')}`
        });
    }


    const [year, monthPart, dayPart] = date.split('-');
    const monthPadded = monthPart.padStart(2, '0');
    const dayPadded = dayPart.padStart(2, '0');
    const formattedDate = `${year}-${monthPadded}-${dayPadded}`;

    try {
        const result = await expensesService.addExpense(amount, category, description, formattedDate);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await expensesService.deleteExpense(id);
        if (result.deleted) {
            return res.status(204).send()
        }
        return res.status(404).json({ error: 'Expense not found' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categories.includes(category)) {
        return res.status(400).json({
            error: `Invalid category. Must be one of: ${categories.join(', ')}`
        });
    }


    const [year, monthPart, dayPart] = date.split('-');
    const monthPadded = monthPart.padStart(2, '0');
    const dayPadded = dayPart.padStart(2, '0');
    const formattedDate = `${year}-${monthPadded}-${dayPadded}`;

    try {
        const result = await expensesService.updateExpense(id, amount, category, description, formattedDate);
        if (result.updated) {
            return res.status(200).json(result);
        }
        return res.status(404).json({ error: 'Expense not found' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }    
})

module.exports = router;