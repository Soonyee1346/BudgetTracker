require('./db/database');
const express = require('express');

const app = express();
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