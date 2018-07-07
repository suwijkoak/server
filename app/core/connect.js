import mongoose from "mongoose";
import { database as db } from "../config";

const connection = !db.username
  ? `mongodb://${db.host}:${db.port}/${db.name}`
  : `mongodb://${db.username}:${db.password}@${db.host}:${db.port}/${db.name}`;
mongoose.connect(connection);
