const { db } = require("../utility/dbManager")

function insertNewSip(
  portfolio_id,
  fund_id,
  sip_amount,
  sip_date,
  start_date,
  end_date,
  status,
) {
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
    `
    db.run(
      query,
      [
        portfolio_id,
        fund_id,
        sip_amount,
        sip_date,
        start_date,
        end_date,
        status,
      ],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({ sip_id: this.lastID })
        }
      },
    )
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
    `
    db.get(query, [sipId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function processNewSip(sipId) {
  return new Promise((resolve, reject) => {
    db.run("BEGIN TRANSACTION")

    const fetchQuery = `
        SELECT 
            s.sip_id,
            s.portfolio_id,
            s.fund_id,
            s.sip_amount,
            mf.current_nav

        FROM sip_registration s

        JOIN mutual_fund mf
        ON mf.fund_id = s.fund_id

        WHERE s.sip_id = ?
    `

    db.get(fetchQuery, [sipId], (err, sip) => {
      if (err) {
        db.run("ROLLBACK")

        reject(err)
      }

      if (!sip) {
        db.run("ROLLBACK")

        reject(new Error("SIP not found"))
      }

      // ===============================
      // Calculate Units
      // ===============================

      const unitsAllocated = sip.sip_amount / sip.current_nav

      // ===============================
      // Insert Transaction
      // ===============================

      const insertQuery = `
            INSERT INTO investment_transaction (
                sip_id,
                portfolio_id,
                fund_id,
                transaction_amount,
                nav_at_purchase,
                units_allocated,
                transaction_date,
                transaction_type
            )
            VALUES (?, ?, ?, ?, ?, ?, DATE('now'), ?)
        `

      db.run(
        insertQuery,
        [
          sip.sip_id,
          sip.portfolio_id,
          sip.fund_id,
          sip.sip_amount,
          sip.current_nav,
          unitsAllocated,
          "SIP",
        ],
        function (err) {
          if (err) {
            // ===============================
            // ROLLBACK
            // ===============================

            db.run("ROLLBACK")

            reject(err)
          }

          // ===============================
          // COMMIT
          // ===============================

          db.run("COMMIT")

          // res.json({
          //     message: 'SIP processed successfully',
          //     transaction_id: this.lastID,
          //     units_allocated: unitsAllocated
          // });
          resolve({
            message: "SIP processed successfully",
            transaction_id: this.lastID,
            units_allocated: unitsAllocated,
          })
        },
      )
    })
  })
}

function getSipTransactionByID(sipId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
            transaction_id,
            transaction_amount,
            nav_at_purchase,
            units_allocated,
            transaction_date,
            transaction_type

        FROM investment_transaction

        WHERE sip_id = ?
    `
    db.all(query, [sipId], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

module.exports = {
  insertNewSip,
  getSip,
  processNewSip,
  getSipTransactionByID,
}
