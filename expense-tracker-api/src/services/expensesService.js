const prisma = require('../db/prismaClient')

const getExpenses = async (month) => {
    let where = {};

    if (month) {
        const start = new Date(`${month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        where = {
            date: {
                gte: start,
                lt: end
            }
        };
    }
    const rows = await prisma.expense.findMany({
        where,
        orderBy: { date: 'asc' }
    });

    return rows;
}

const addExpense = async (amount, category, description, date) => {
    
    return await prisma.expense.create({
        data: { amount, category, description, date }
    });
}

const deleteExpense = async (id) => {
    try {
        await prisma.expense.delete({
            where: { id }
        });

        return { deleted: true };
    } catch {
        return { deleted: false };
    }
}

const updateExpense = async (id, amount, category, description, date) => {
    try {
        const updated = await prisma.expense.update({
            where: { id },
            data: {
                amount, 
                category, 
                description, 
                date
            }
        });

        return {
            ...updated,
            updated: true
        };
    } catch {
        return {
            id,
            amount,
            category,
            description,
            date,
            updated: false
        }
    }
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
}