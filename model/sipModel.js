const { db } = require("../utility/dbManager")

function insertNewSip(portfolio_id, fund_id, sip_amount, sip_date, start_date, end_date, status) {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO sip_registration (
            portfolio_id,
            fund_id,
            sip_amount,
            sip_date,
            start_date,
            end_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        db.run(query, [portfolio_id, fund_id, sip_amount, sip_date, start_date, end_date, status], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve({ sip_id: this.lastID })
            }
        })
    })
}

function getSip(sipId) {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT 
            s.sip_id,
            s.sip_amount,
            s.sip_date,
            s.start_date,
            s.end_date,
            s.status,

            mf.fund_name,

            p.portfolio_name

        FROM sip_registration s

        JOIN mutual_fund mf
        ON mf.fund_id = s.fund_id

        JOIN portfolio p
        ON p.portfolio_id = s.portfolio_id

        WHERE s.sip_id = ?
    `;
        db.get(query, [sipId], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

module.exports = {
    insertNewSip,
    getSip
}
