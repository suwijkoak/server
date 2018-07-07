import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import LocalStrategy from "passport-local";
import User from "./schema/User";

import config from "./config";

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, callback) => {
      try {
        let user = await User.findOne({ username: username });
        if (!user)
          return callback(null, false, {
            message: "Incorrect username or password"
          });
        let isValid = await user.validatePassword(password);
        if (isValid) {
          return callback(null, user, { message: "Logged in successfully" });
        } else {
          return callback(null, false, {
            message: "Incorrect username or password"
          });
        }
      } catch (error) {
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.APP_SECRET
    },
    (payload, callback) => {
      return User.findById(payload._id)
        .then(user => {
          return callback(null, user);
        })
        .catch(error => {
          return callback(error);
        });
    }
  )
);

export default passport;
