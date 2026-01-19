const db = require('../db/database')

const upsertBudget = (category, monthly_limit) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM budgets WHERE category = ?', [category], (err, row) => {
            if (err) return reject(err);

            if (row) {
                const query = 'UPDATE budgets SET monthly_limit = ? WHERE category = ?';
                db.run(query, [monthly_limit, category], function (err) {
                    if (err) return reject(err);

                    resolve({
                        category,
                        monthly_limit,
                        updated: true
                    });
                })
            } else {
                const query = `INSERT INTO budgets (category, monthly_limit) VALUES (?, ?)`;
                db.run(query, [category, monthly_limit], function (err) {
                    if (err) return reject(err);

                    resolve({
                        id: this.lastID,
                        category,
                        monthly_limit,
                        updated: false
                    });
                });
            }
        })
    })
}

const getBudgets = () => {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM budgets';

        db.all(query, [], (err, rows) => {
            if (err) return reject(err);
            resolve({rows});
        });
    })
}

const updateBudget = (id, category, monthly_limit) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM budgets WHERE id = ?', [id], (err, row) => {
            if (err) return reject(err);

            if (row) {
                const query = 'UPDATE budgets SET monthly_limit = ? WHERE id = ?';
                db.run(query, [monthly_limit, id], function (err) {
                    if (err) return reject(err);

                    resolve({
                        id,
                        category,
                        monthly_limit,
                        updated: true
                    });
                })
            } else {
                resolve({
                    id,
                    category,
                    monthly_limit,
                    updated: false
                });
            }
        })
    })
}

const deleteBudget = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM budgets WHERE id = ?', [id], function(err) {
            if (err) return reject(err);

            if (this.changes === 0){
                return resolve({ deleted: false});
            }

            return resolve({ deleted: true});
        })
    })
}

module.exports = {
    upsertBudget,
    getBudgets,
    updateBudget,
    deleteBudget
}