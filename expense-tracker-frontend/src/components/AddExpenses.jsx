import React, { useState } from 'react';

const ExpenseRow = ({ expense, onDelete, onUpdate, index }) => {
    const { id, amount, category, description, date } = expense;

    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        amount: amount.toFixed(2),
        category: category,
        description: description,
        date: date
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
            await fetch(`/expenses/${expense.id}`, {
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
                amount,
                category,
                description,
                date
            }
        );

        setIsEditing(false);
    }

    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().slice(0, 10);
        return formattedDate;
    }

    const rowBg = index % 2 === 0 ? '#f9f9f9' : '#ffffff'; // Zebra striping

    return (
        <tr style={{
            backgroundColor: rowBg,
            transition: 'background-color 0.2s ease'
        }}
            onMouseEnter={(e) => {
                setIsHovered(true);
                e.currentTarget.style.backgroundColor = '#ddd';
            }}
            onMouseLeave={(e) => {
                setIsHovered(false);
                e.currentTarget.style.backgroundColor = rowBg;
            }}
        >
            <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>{id}</td>
            <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>
                {isEditing ? (
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                ) : (
                    formatDate(date)
                )}
            </td>
            <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>
                {isEditing ? (
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
                        <option value="Golf">Golf</option>
                        <option value="Other">Other</option>
                    </select>
                ) : (
                    category
                )}
            </td>
            <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>
                {isEditing ? (
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                ) : (
                    description
                )}
            </td>
            <td style={{ padding: '12px 8px', wordBreak: 'break-word' }}>{isEditing ? (
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                />
            ) : (
                amount.toFixed(2)
            )}
            </td>

            <td style={{ width: '120px' }}>
                <div style={{
                    visibility: isHovered ? 'visible' : 'hidden',
                    display: 'flex',
                    gap: '8px'
                }}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={resetForm}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                            <button style={{ marginLeft: '8px' }} onClick={() => onDelete(id)}>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

const AddExpenses = ({ expenses, onDeleteExpense, onUpdateExpense, categoryFilter, setCategoryFilter }) => {
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const visibleExpenses = expenses.filter(expense => {
        if (!categoryFilter) return true;
        return expense.category === categoryFilter;
    }).sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortBy === 'amount') {
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (sortBy === 'date') {
            return sortOrder === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
        }

        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const renderSortIndicator = (field) => {
        if (sortBy !== field) return null;
        return sortOrder === 'asc' ? ' ▲' : ' ▼';
    };

    return (
        <>
            <div style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
                <label style={{ marginTop: '10px', fontSize: '13px', color: '#555' }}>
                    Filter by category
                </label>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        minWidth: '180px'
                    }}
                >
                    <option value="">All categories</option>
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
            </div>
            {expenses && (
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: '600' }}>
                        Monthly Expenses
                    </h2>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '20px',
                        minWidth: '600px',
                    }}>
                        <thead>
                            <tr style={{
                                backgroundColor: '#333',
                                color: 'white',
                                textAlign: 'left'
                            }}>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word' }}>ID</th>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word', cursor: 'pointer' }} onClick={() => toggleSort('date')}>Date{renderSortIndicator('date')}</th>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word', cursor: 'pointer' }} onClick={() => toggleSort('category')}>Category{renderSortIndicator('category')}</th>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word' }}>Description</th>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word', cursor: 'pointer' }} onClick={() => toggleSort('amount')}>Amount{renderSortIndicator('amount')}</th>
                                <th style={{ padding: '12px 8px', wordBreak: 'break-word' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleExpenses.map((expense, index) => {
                                return <ExpenseRow
                                    key={expense.id}
                                    expense={expense}
                                    onDelete={onDeleteExpense}
                                    onUpdate={onUpdateExpense}
                                    index={index}
                                />
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default AddExpenses;