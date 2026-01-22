const prisma = require('../db/prismaClient');

const getMonthlySummary = async (month) => {

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
    let budgetStatus = {};

    expenses.forEach(({ amount, category}) => {
        totalSpent += amount;

        if(!byCategory[category]) {
            byCategory[category] = 0;
        }

        byCategory[category] += amount;
        byCategory[category] = Number(byCategory[category].toFixed(2));
    });

    totalSpent = Number(totalSpent.toFixed(2));

    budgets.forEach(({ category, monthly_limit }) => {
        const spent = Number((byCategory[category] || 0).toFixed(2));

        budgetStatus[category] = {
            limit: monthly_limit,
            spent,
            overBudget: spent > monthly_limit
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