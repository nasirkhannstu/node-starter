const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema();

module.exports = Transaction = mongoose.model("Transaction", TransactionSchema);
