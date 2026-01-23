require('./db/prismaClient');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok'});
});

const expensesRoutes = require('./routes/expenses');
app.use('/expenses', expensesRoutes);

const budgetsRoutes = require('./routes/budgets');
app.use('/budgets', budgetsRoutes);

const summaryRoutes = require('./routes/summary');
app.use('/summary', summaryRoutes);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);  
});