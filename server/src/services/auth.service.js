import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import { publicUser } from "../utils/response.js";
import UserModel from "../models/user.model.js";

export default {
  async register({ name, email, password }) {
    if (await UserModel.findByEmail(email)) throw new ApiError(409, "An account already exists with that email");
    const user = await UserModel.create({ id: randomUUID(), email, passwordHash: await bcrypt.hash(password, 12), name });
    return { user: publicUser(user), token: generateToken(user) };
  },
  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new ApiError(401, "Invalid email or password");
    return { user: publicUser(user), token: generateToken(user) };
  },
};
