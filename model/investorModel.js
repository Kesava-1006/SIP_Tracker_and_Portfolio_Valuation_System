const { db } = require("../utility/dbManager")

function loginUser(email, phone) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor WHERE email = ? AND phone = ?"
    db.get(query, [email, phone], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function insertNewInvestor(
  first_name,
  middle_name,
  last_name,
  email,
  phone,
  dob,
  gender,
  pan,
  aadhaar,
  occupation,
  created_at,
) {
  return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO investor (
            first_name,
            middle_name,
            last_name,
            email,
            phone,
            dob,
            gender,
            pan,
            aadhaar,
            occupation,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    db.run(
      query,
      [
        first_name,
        middle_name,
        last_name,
        email,
        phone,
        dob,
        gender,
        pan,
        aadhaar,
        occupation,
        created_at,
      ],
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({ investor_id: this.lastID })
        }
      },
    )
  })
}

function getAllInvestors() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor"
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

function getInvestorById(investorId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM investor WHERE investor_id = ?"
    db.get(query, [investorId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function getInvestorHoldings(investorId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
            mf.fund_id,
            mf.fund_name,
            
            SUM(it.units_allocated) AS total_units,
            
            mf.current_nav,
            
            ROUND(
                SUM(it.units_allocated) * mf.current_nav,
                2
            ) AS current_value

        FROM investment_transaction it

        JOIN portfolio p
        ON p.portfolio_id = it.portfolio_id

        JOIN mutual_fund mf
        ON mf.fund_id = it.fund_id

        WHERE p.investor_id = ?

        GROUP BY mf.fund_id, mf.fund_name, mf.current_nav
    `

    db.get(query, [investorId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function getInvestorNetWorth(investorId) {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
            i.investor_id,
            
            i.first_name || ' ' || i.last_name AS investor_name,

            ROUND(
                SUM(it.units_allocated * mf.current_nav),
                2
            ) AS networth

        FROM investor i

        JOIN portfolio p
        ON p.investor_id = i.investor_id

        JOIN investment_transaction it
        ON it.portfolio_id = p.portfolio_id

        JOIN mutual_fund mf
        ON mf.fund_id = it.fund_id

        WHERE i.investor_id = ?

        GROUP BY i.investor_id
    `

    db.get(query, [investorId], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

module.exports = {
  loginUser,
  insertNewInvestor,
  getAllInvestors,
  getInvestorHoldings,
  getInvestorById,
  getInvestorNetWorth,
}
