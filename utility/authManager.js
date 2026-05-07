const jwi = require("jsonwebtoken")

const secret = "rgtjkjnilyhrilthrlirt54y4"

function signJWT(payload) {
  try {
    const token = jwi.sign(payload, secret, { expiresIn: "30m" })
    return token
  } catch (exception) {
    console.log(exception)
    return undefined
  }
}

function verifyJWT(token) {
  try {
    const payload = jwi.verify(token, secret)
    return payload
  } catch (exception) {
    console.log(exception)
  }
}

module.exports = {
  signJWT,
  verifyJWT,
}
