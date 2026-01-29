const prisma = require('../db/prismaClient');

const getMonthlySummary = async (month) => {

    console.log("hi")

    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const [expenses, budgets] = await Promise.all([
        prisma.expense.findMany({
            where: {
                date: {
                    gte: start,
                    lt: end
                }
            }
        }),
        prisma.budget.findMany()
    ]);

    let totalSpent = 0;
    let byCategory = {};

    expenses.forEach(({ amount, category }) => {
        const val = amount.toNumber();
        totalSpent += amount;
        byCategory[category] = (byCategory[category] || 0) + val;
    });

    totalSpent = Number(totalSpent.toFixed(2))

    const budgetStatus = {};
    budgets.forEach(({ category, monthly_limit }) => {
        const limit = monthly_limit.toNumber();
        const spent = byCategory[category] || 0;
        budgetStatus[category] = {
            limit,
            spent: Number(spent.toFixed(2)),
            overBudget: spent > limit
        };
    });

    return {
        totalSpent,
        byCategory,
        budgetStatus
    };
};

module.exports = {
    getMonthlySummary
}