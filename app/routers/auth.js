import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../schema/User";
const router = express.Router();

router.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Incorrect username or password"
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        return res.send(err);
      }
      const token = jwt.sign(user.toJSON(), config.jwt.APP_SECRET, {
        expiresIn: config.jwt.EXPIRE_IN
      });
      return res.json({ user, token });
    });
  })(req, res);
});

router.post("/register", async (req, res, next) => {
  const { email, name, username, password, confirmPassword } = req.body;
  if (password != confirmPassword)
    return res
      .status(422)
      .json({ message: "ท่านกรอกช่องรหัสผ่าน กับ ยืนยันรหัสผ่านไม่ตรงกัน" });

  let user = new User();
  user.name = name;
  user.username = username;
  user.email = email;
  user.password = user.generateHash(password);
  try {
    await user.save();
    return res.json({ user, message: "ทำการสมัครผู้ใช้งานเรียบร้อยแล้ว !" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

router.post("/checkhash", async (req, res, next) => {
  const { username, password } = req.body;
  let user = await User.findOne({ username: username });
  if ((await new User().validPassword(password)) == user.password) {
    return res.json({ message: "matches! " });
  } else {
    return res.json({ message: "Mismatch !" });
  }
});

router.post("/logout", (req, res, next) => {
  req.logout();
  return res.redirect("/");
});

export default router;
