const mongoose = require("mongoose");
const validator = require("validator");

//-------mongoose schema --------------

const employeeSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

// ---- creating model ---------

const user = new mongoose.model("user", employeeSchema);

//------------mongoose schema for list data -----------------

const postschema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "Email is already in use"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid opreation");
      }
    },
  },
  mobileNo: {
    type: String,
    require: true,
    unique: [true, "Mobile number already exist"],
  },
  Designation: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  course: {
    type: String,
    require: true,
  },
  created_date: {
    type: Date,
  },
  updated_date: {
    type: Date,
  },
});

//--------model for posts / lists ----------

const postModel = new mongoose.model("postModel", postschema);

module.exports = { user, postModel };
