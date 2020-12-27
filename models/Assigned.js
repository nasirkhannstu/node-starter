const mongoose = require("mongoose");

const TerminalSchema = new mongoose.Schema(
  {
    account: {
      type: ObjectId,
      ref: "Account",
    },
    terminal: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: 0,
    },
    location: String,
    distributor: {
      type: ObjectId,
      ref: "User",
    },
    merchant: {
      type: ObjectId,
      ref: "User",
    },
    txs: Number,
    notes: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = Terminal = mongoose.model("Terminal", TerminalSchema);
