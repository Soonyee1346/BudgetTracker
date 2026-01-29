
const AddMonthlyExpenseSummary = ({ summary, month, setMonth, setCategoryFilter }) => {

    if(!summary || !summary.budgetStatus) {
        return <p>Loading summary data...</p>
    }

    return (
        <>
            <h2>Monthly Expense Summary</h2>
            <label>
                Select Month:
                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        minWidth: '180px',
                        marginLeft: '10px'
                    }}
                />
            </label>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '16px',
                marginTop: '24px'
            }}>

                {summary && (
                    <>
                        {Object.entries(summary.budgetStatus).sort(([catA], [catB]) => {
                            if (catA === 'Other') return 1;
                            if (catB === 'Other') return -1;
                            return 0;
                        }).map(([category, { limit, spent, overBudget }]) => {

                            const remaining = limit - spent;
                            const percent = limit > 0 ? (spent / limit) * 100 : 0;
                            const cappedPercent = Math.min(percent, 100);

                            let barColor = '#4caf50';

                            if (percent >= 80 && percent <= 100) {
                                barColor = '#ff9800';
                            }

                            if (percent > 100) {
                                barColor = '#f44336';
                            }

                            return (
                                <div
                                    key={category}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        backgroundColor: overBudget ? '#fdd' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onClick={() => setCategoryFilter(category)}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ddd'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = overBudget ? '#fdd' : 'transparent'}
                                >
                                    <h3>{category}</h3>
                                    <p>Spent: ${spent.toFixed(2)}</p>
                                    <p>Limit: ${limit.toFixed(2)}</p>

                                    <p
                                        style={{
                                            color: overBudget ? 'red' : 'green',
                                            fontWeight: 600
                                        }}
                                    >
                                        {overBudget
                                            ? `Over by $${Math.abs(remaining).toFixed(2)}`
                                            : `Remaining $${remaining.toFixed(2)}`}
                                    </p>
                                    <div style={{
                                        height: '10px',
                                        backgroundColor: '#eee',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        marginTop: '8px'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${cappedPercent}%`,
                                            backgroundColor: barColor,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                </div>
                            )
                        })}
                        <div style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '16px',
                        }}>
                            <h2>Total Spent</h2>
                            <h4>Spent: ${summary.totalSpent.toFixed(2)}</h4>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default AddMonthlyExpenseSummary