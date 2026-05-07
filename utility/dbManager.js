const sqlite3 = require("sqlite3").verbose()
const db = new sqlite3.Database(
  "D:\\KfinTraining\\SPI_tracker db\\spi server",
  (err) => {
    if (err) {
      console.error("Error opening database:", err)
    } else {
      console.log("Database opened successfully")
    }
  },
)

module.exports = {
  db,
}
