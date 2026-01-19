import React, { useState } from 'react';

const AddBudgetCard = ({ onNewBudget }) => {
    const [budget, setBudget] = useState({
        category: '',
        monthly_limit: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setBudget({
            ...budget,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch('/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(budget)
            });

            const data = await res.json();
            console.log('Success:', data);

            setBudget({
                category: '',
                monthly_limit: ''
            })

            if (onNewBudget) onNewBudget();
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
            <h3>Add New Budget</h3>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={budget.category}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                />

                <input
                    type="number"
                    name="monthly_limit"
                    placeholder="Monthly limit"
                    value={budget.monthly_limit}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '12px' }}
                />

                <button type="submit" style={{ width: '100%' }}>
                    Add Budget
                </button>
            </form>
        </div>
    )
}

export default AddBudgetCard;