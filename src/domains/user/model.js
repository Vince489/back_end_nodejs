const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  gamerTag: {
    type: String, 
    required: true
  },
  email: { 
    type: String, 
    unique: true,
    required: true 
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
