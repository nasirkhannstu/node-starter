const mongoose = require("mongoose");

const TerminalSchema = new mongoose.Schema(
  {
    terminal: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    provience: {
      type: String,
    },
    make: {
      type: String,
    },
    status: {
      type: Boolean,
      required: true,
      default: 0,
    },
    assigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assigned",
    },
    txs: {
      type: Number,
      default:0
    },
    notes: {
      type: Number,
      default:0
    },
    constat: {
      type: Boolean,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Terminal = mongoose.model("Terminal", TerminalSchema);
