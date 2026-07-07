import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import { authRepository } from "./auth.repository";
import { AuthResponse, LoginInput, RegisterInput } from "./auth.types";

export const authService = {
  async registerUser(data: RegisterInput): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(data.email);
    if (user) {
      throw new Error("Email already in use");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await authRepository.createUser({
      ...data,
      password: passwordHash,
    });
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      token,
    };
  },
  async loginUser(data: LoginInput): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  },
};
