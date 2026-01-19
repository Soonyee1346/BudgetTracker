import React, { useState, useEffect, useCallback } from 'react';
import AddExpenseForm from './AddExpenseForm';
import AddMonthlyExpenseSummary from './AddMonthlyExpenseSummary';
import AddExpenses from './AddExpenses';

const DashboardPage = () => {
    const [month, setMonth] = useState('2026-01');
    const [summary, setSummary] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');

    const loadSummary = useCallback(async () => {
        try {
            const res = await fetch(`/summary/monthly?month=${month}`);
            const data = await res.json();
            setSummary(data);
        } catch (err) {
            console.error('Error loading summary:', err)
        }
    }, [month]);

    const loadExpenses = useCallback(async () => {
        try {
            const res = await fetch(`/expenses?month=${month}`);
            const data = await res.json();
            setExpenses(data);
        } catch (err) {
            console.error('Error loading summary:', err)
        }
    }, [month]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([loadSummary(), loadExpenses()]);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchData();
    }, [month, loadSummary, loadExpenses]);


    const handleNewExpense = () => {
        loadSummary();
        loadExpenses();
    }

    const handleDeleteExpense = async (expenseId) => {
        const confirmed = window.confirm(`Delete expense: ${expenseId}`);
        if (!confirmed) return;

        try {
            await fetch(`/expenses/${expenseId}`, {
                method: 'DELETE'
            });

            loadSummary();
            loadExpenses();
        } catch (err) {
            console.error('Failed to delete expense:', err);
        }
    }

    return (
        <div style={{ padding: '20px' }}>

            <h1>Expenses</h1>

            <AddMonthlyExpenseSummary
                summary={summary}
                month={month}
                setMonth={setMonth}
                setCategoryFilter={setCategoryFilter}
            />

            <br></br>

            <AddExpenses
                expenses={expenses.filter(e => !categoryFilter || e.category === categoryFilter)}
                onDeleteExpense={handleDeleteExpense}
                onUpdateExpense={handleNewExpense}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
            />

            <br></br>

            <AddExpenseForm onNewExpense={handleNewExpense} />
        </div>
    );
};

export default DashboardPage;