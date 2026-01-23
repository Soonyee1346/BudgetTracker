const prisma = require('../db/prismaClient')

const upsertBudget = async (category, monthly_limit) => {

    const existing = await prisma.budget.findFirst({
        where: { category }
    });

    if (existing) {
        const updated = await prisma.budget.update({
            where: { id: existing.id },
            data: { monthly_limit }
        });

        return {
            category,
            monthly_limit,
            updated: true
        };
    }

    const created = await prisma.budget.create({
        data: { category, monthly_limit }
    });
   
    return {
        id: created.id,
        category,
        monthly_limit,
        updated: false
    };
};

const getBudgets = async () => {
        const rows = await prisma.budget.findMany()
        return { rows }; 
};

const updateBudget = async (id, category, monthly_limit) => {
    try {

        budget_monthly_limit = Number(monthly_limit);
        budgetId = Number(id);

        const updated = await prisma.budget.update({
            where: { id: budgetId },
            data: { monthly_limit: budget_monthly_limit }
        });

        return {
            id,
            category,
            monthly_limit,
            updated: true
        };
    } catch {
        return {
            id,
            category,
            monthly_limit,
            updated: false
        }
    }
}

const deleteBudget = async (id) => {

    try {
        await prisma.budget.delete({
            where: { id }
        });

        return { deleted: true };
    } catch {
        return { deleted: false };
    }
}

module.exports = {
    upsertBudget,
    getBudgets,
    updateBudget,
    deleteBudget
}