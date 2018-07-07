import mongoose from "mongoose";
import bcrypt from "bcrypt";
import timestamps from "mongoose-timestamp";

const SALT_WORK_FACTOR = 8;

const schema = mongoose.Schema({
  name: String,
  avatar: { type: String, default: "https://via.placholder.com/64x64" },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

schema.plugin(timestamps, {
  createdAt: "createdAt",
  updatedAt: "updatedAt"
});

schema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR));
};

schema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("users", schema);
export default User;
