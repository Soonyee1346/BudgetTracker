const prisma = require('../db/prismaClient')

const upsertBudget = async (category, monthly_limit) => {

    const limit = Number(monthly_limit);

    const existing = await prisma.budget.findFirst({
        where: { category }
    });

    if (existing) {
        const updated = await prisma.budget.update({
            where: { id: existing.id },
            data: { monthly_limit: limit }
        });

        return {
            category,
            monthly_limit: updated.monthly_limit.toNumber(),
            updated: true
        };
    }

    const created = await prisma.budget.create({
        data: { category, monthly_limit: limit }
    });

    return {
        id: created.id,
        category,
        monthly_limit: created.monthly_limit.toNumber(),
        updated: false
    };
};

const getBudgets = async () => {
    const rows = await prisma.budget.findMany({
        orderBy: {
            id: 'asc'
        }
    })

    const formattedRows = rows.map(budget = ({
        ...budget,
        monthly_limit: budget.monthly_limit.toNumber()
    }));

    return { rows: formattedRows };
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
            monthly_limit: updated.monthly_limit.toNumber(),
            updated: true
        };
    } catch {
        return {
            id,
            category,
            monthly_limit: Number(monthly_limit),
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