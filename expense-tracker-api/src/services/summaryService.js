const db = require('../db/database');

const getMonthlySummary = async (month) => {
    const getExpenses = () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM expenses WHERE date LIKE ?';
            let params = [`${month}-%`];

            db.all(query, params, (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            })
        })
    }

    const getBudgets = () => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM budgets';

            db.all(query, [], (err, rows) => {
                if (err) return reject(err);

                resolve(rows);
            })
        })
    }

    try {
        const [expenses, budgets] = await Promise.all([getExpenses(month), getBudgets()]);
        let totalSpent = 0;
        let byCategory = {};
        let budgetStatus = {};

        expenses.forEach(expense => {
            totalSpent += expense.amount;

            if (!byCategory[expense.category]) {
                byCategory[expense.category] = 0;
            }

            byCategory[expense.category] += expense.amount;
            byCategory[expense.category] = Number(byCategory[expense.category].toFixed(2));
        });
        totalSpent = Number(totalSpent.toFixed(2));

        budgets.forEach(budget => {
            let spent = byCategory[budget.category] || 0;
            let limit = budget.monthly_limit;

            let overBudget = spent > limit;

            spent = Number(spent.toFixed(2));

            budgetStatus[budget.category] = {
                limit,
                spent,
                overBudget
            }
        })

        return {
            totalSpent,
            byCategory,
            budgetStatus
        }
    }
    catch (err) {
        throw (err);
    }
}

module.exports = {
    getMonthlySummary
}