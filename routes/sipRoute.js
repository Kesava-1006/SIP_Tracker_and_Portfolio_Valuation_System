const express = require("express")
const { verifyJWT } = require("../utility/authManager")
const { insertSip, getSipById, processSip} = require("../controller/sipController")
const router = express.Router()

router.post("/sip", insertSip)
router.get(
  "/sip/:sipId",
  (request, response, next) => {
    const token = request.headers.authorization
    try {
      const payload = verifyJWT(token)
      if (payload) {
        next()
      } else {
        return response.json("Invalid Permissions")
      }
    } catch (e) {
      console.log(`Error verifying token: ${e}`)
      response.json(e)
    }
  },
  getSipById,
)

// router.post("/sips/:sipId/process",
//     (request, response, next) => {
//     const token = request.headers.authorization
//     try {
//       const payload = verifyJWT(token)
//       if (payload) {
//         next()
//       } else {
//         return response.json("Invalid Permissions")
//       }
//     } catch (e) {
//       console.log(`Error verifying token: ${e}`)
//       response.json(e)
//     }
//   },
//   processSip,
// )

module.exports = router
