const { signJWT } = require("../utility/authManager")
const {
  insertFund,
  getAllFunds,
  updateFundNavv,
} = require("../model/fundModel")

const InsertFunds = async (request, response) => {
  const { amc_id, fund_name, fund_type, risk_level, current_nav, created_at } =
    request.body
  const fundresult = await insertFund(
    amc_id,
    fund_name,
    fund_type,
    risk_level,
    current_nav,
    created_at,
  )
  return response.json(fundresult)
}

const allFunds = async (request, response) => {
  const funds = await getAllFunds()
  return response.json(funds)
}

const updateFundNav = async (request, response) => {
  const fundId = request.params.fundId
  const { newNav } = request.body
  const result = await updateFundNavv(fundId, newNav)
  return response.json(result)
}

module.exports = {
  InsertFunds,
  allFunds,
  updateFundNav,
}
