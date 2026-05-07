const express = require("express")
const { verifyJWT } = require("../utility/authManager")
const {
  InsertFunds,
  allFunds,
  updateFundNav,
} = require("../controller/fundController")
const router = express.Router()

router.post("/funds", InsertFunds)
router.get("/funds", allFunds)
router.put("/funds/:fundId/nav", updateFundNav)
module.exports = router
