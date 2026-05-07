const { db } = require("../utility/dbManager")

function insertFund(amc_id, fund_name, fund_type, risk_level, current_nav, created_at) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO mutual_fund (amc_id, fund_name, fund_type, risk_level, current_nav, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(query, [amc_id, fund_name, fund_type, risk_level, current_nav, created_at], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve({ fund_id: this.lastID })
            }
        })
    })
}

function getAllFunds() {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
            mf.fund_id,
            mf.fund_name,
            mf.fund_type,
            mf.risk_level,
            mf.current_nav,
            a.amc_name

        FROM mutual_fund mf

        JOIN amc a
        ON a.amc_id = mf.amc_id
    `;
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function updateFundNavv(fundId, newNav) {
    return new Promise((resolve, reject) => {
        const query = `
        UPDATE mutual_fund
        SET current_nav = ?
        WHERE fund_id = ?
    `;
        db.run(query, [newNav, fundId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
}

module.exports = {
    insertFund,
    getAllFunds,
    updateFundNavv
}