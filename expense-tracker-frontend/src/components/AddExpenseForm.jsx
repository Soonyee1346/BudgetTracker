import React, { useState } from 'react';

const AddExpenseForm = ({ onNewExpense }) => {
    const [expense, setExpense] = useState({
        amount: '',
        category: '',
        description: '',
        date: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setExpense({
            ...expense,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch('/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            });

            const data = await res.json();
            console.log('Success:', data);

            setExpense({
                amount: '',
                category: '',
                description: '',
                date: ''
            })

            if (onNewExpense) onNewExpense();
        } catch (err) {
            console.error('Error:', err)
        }
    }

    return (
        <div style={{
            border: '2px dashed #aaa',
            borderRadius: '8px',
            padding: '16px',
            background: '#fafafa'
        }}>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                />

                <select
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                >
                    <option value="">Select category</option>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Golf">Golf</option>
                    <option value="Other">Other</option>
                </select>


                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={expense.description}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                />

                <input
                    type="date"
                    name="date"
                    value={expense.date}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                />

                <button type="submit" style={{ width: '100%', marginBottom: '12px' }}>Add Expense</button>
            </form>
        </div>
    )
}

export default AddExpenseForm;