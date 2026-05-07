const {signJWT} = require('../utility/authManager');
const {loginUser,insertNewInvestor,getAllInvestors,getInvestorById,getInvestorHoldings,getInvestorNetWorth} = require('../model/investorModel')

const login = async (request, response) => {
  const { email, phone } = request.body
  const user = await loginUser(email, phone)
  const token = signJWT({
    email: user.email,
  })
  return response.json({
    token: token,
  })
}

const insertInvestor = async (request, response) => {
  const {
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
    } = req.body;
  const result = await insertNewInvestor(first_name, middle_name, last_name, email, phone, dob, gender, pan, aadhaar, occupation, created_at)
  return response.json(result)
}

const allinvestors = async (request, response) => {
  const investors = await getAllInvestors()
  return response.json(investors)
}

const investorById = async (request, response) => {
  const investorId = request.params.investorId
  // Fetch investor details from the database
  const investor = await getInvestorById(investorId)
  if (investor) {
    return response.json(investor)
  } else {
    return response.status(404).json({ message: "Investor not found" })
  }
}

const investorHoldings = async (request, response) => {
  const investorId = request.params.investorId
  // Fetch investor holdings from the database
  const holdings = await getInvestorHoldings(investorId)
  if (holdings) {
    return response.json(holdings)
  } else {
    return response.status(404).json({ message: "Holdings not found" })
  }
}

const investorNetworth = async (request, response) => {
  const investorId = request.params.investorId
  // Fetch investor net worth from the database
  const netWorth = await getInvestorNetWorth(investorId)
  if (netWorth) {
    return response.json(netWorth)
  } else {
    return response.status(404).json({ message: "Net worth not found" })
  }
}

module.exports = {
  login,
  insertInvestor,
  allinvestors,
  investorById,
  investorHoldings,
  investorNetworth
}