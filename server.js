const express = require("express")
const app = express()
app.use(express.json())

app.use("/api", require("./routes/investorRoute"))
app.use("/api", require("./routes/fundRoute"))
app.use("/api", require("./routes/sipRoute"))
//const db = require('./utility/dbManager').db;

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
