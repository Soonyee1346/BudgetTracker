const db = require('../db/database')

const addExpense = (amount, category, description, date) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO expenses (amount, category, description, date)
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [amount, category, description, date], function (err) {
            if (err) return reject(err);

            resolve({
                id: this.lastID,
                amount,
                category,
                description,
                date
            });
        })
    })
}

const getExpenses = (month) => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM expenses';
        let params = [];

        if (month) {
            query += ' WHERE date LIKE ? ORDER BY date ASC';
            params.push(`${month}-%`);
        }

        db.all(query, params, (err, rows) => {
            if (err) return reject(err);

            resolve(rows);
        });
    })
}

const deleteExpense = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
            if (err) return reject(err);

            if (this.changes === 0) {
                return resolve({ deleted: false });
            }

            return resolve({ deleted: true });
        })
    })
}

const updateExpense = (id, amount, category, description, date) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
            if (err) return reject(err);

            if (row) {
                const query = 'UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?';
                db.run(query, [amount, category, description, date, id], function (err) {
                    if (err) return reject(err);

                    resolve({
                        id,
                        amount,
                        category,
                        description,
                        date,
                        updated: true
                    });
                })
            } else {
                resolve({
                    id,
                    amount,
                    category,
                    description,
                    date,
                    updated: false
                });
            }
        })
    })
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
}