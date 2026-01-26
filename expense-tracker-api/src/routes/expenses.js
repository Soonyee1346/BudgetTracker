const express = require('express');
const expensesService = require('../services/expensesService');
const categories = require('../constants/categories');

const router = express.Router();

const toPrismaDate = (dateString) => {
    if (dateString instanceof Date) return dateString;

    if (!dateString.includes('T')) {
        return new Date(dateString + 'T00:00:00.000Z');
    }

    return new Date(dateString);
};

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

    console.log(`${amount} ${category} ${description} ${date}`)

    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categories.includes(category)) {
        return res.status(400).json({
            error: `Invalid category. Must be one of: ${categories.join(', ')}`
        });
    }

    const formattedDate = toPrismaDate(date);

    try {
        const result = await expensesService.addExpense(Number(amount), category, description, formattedDate);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    let { id } = req.params;

    id = Number(id);

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
    let { id } = req.params;

    id = Number(id);

    let { amount, category, description, date } = req.body;

    amount = Number(amount);

    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!categories.includes(category)) {
        return res.status(400).json({
            error: `Invalid category. Must be one of: ${categories.join(', ')}`
        });
    }

    const formattedDate = toPrismaDate(date);

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