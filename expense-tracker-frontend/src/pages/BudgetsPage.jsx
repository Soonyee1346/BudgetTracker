import React, { useState, useEffect } from 'react';
import BudgetGrid from '../components/BudgetCard';
import AddBudgetCard from '../components/BudgetForm';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);

    const loadBudgets = async () => {
        try {
            const res = await fetch('/budgets');
            const data = await res.json();
            setBudgets(data.rows);
        } catch (err) {
            console.error('Error loading budgets', err)
        }
    }

    const handleDeleteBudget = async (budgetId) => {
        const confirmed = window.confirm(`Delete budget: ${budgetId}?`);
        if (!confirmed) return;

        try {
            await fetch(`/budgets/${budgetId}`, {
                method: 'DELETE'
            });

            loadBudgets()
        } catch (err) {
            console.error('Failed to delete budget:', err);
        }
    }
    const handleNewBudget = () => {
        loadBudgets();
    }

    useEffect(() => {
        loadBudgets();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Budgets Management</h1>
            <BudgetGrid
                budgets={budgets}
                onDeleteBudget={handleDeleteBudget}
                onUpdateBudget={handleNewBudget}
            />
            <br></br>
            <AddBudgetCard onNewBudget={handleNewBudget}/>
        </div>
    )
}

export default BudgetsPage;