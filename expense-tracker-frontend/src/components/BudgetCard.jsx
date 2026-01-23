import React, { useState } from 'react';

const BudgetCard = ({ budget, onDelete, onUpdate }) => {
    const { category, id, monthly_limit } = budget;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        category: category,
        monthly_limit: monthly_limit,
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSave = async () => {
        try {
            await fetch(`/budgets/${budget.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            setIsEditing(false);
            resetForm();
            onUpdate();
        } catch (err) {
            console.error('Failed to update expense', err)
        }
    }

    const resetForm = () => {
        setFormData(
            {
                category,
                monthly_limit
            }
        );

        setIsEditing(false);
    }

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px'
        }}>
            {isEditing ? (
                <>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select category</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Rent">Rent</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Subscriptions">Subscriptions</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="number"
                        name="monthly_limit"
                        value={formData.monthly_limit}
                        onChange={handleChange}
                    />

                    <div>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={resetForm}>Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <h3>{category}</h3>
                    <p>Monthly Limit: ${monthly_limit}</p>

                    <div style={{
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(id)}>Delete</button>
                    </div>
                </>
            )}
        </div>
    )
}

const BudgetGrid = ({ budgets, onDeleteBudget, onUpdateBudget }) => {

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            marginTop: '24px'
        }}>

            {budgets.map((budget) => {
                return <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onDelete={onDeleteBudget}
                    onUpdate={onUpdateBudget}
                />
            })}
        </div>
    )
}

export default BudgetGrid