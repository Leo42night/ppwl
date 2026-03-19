// services/user.service.ts
import { UserModel } from "../models/user.model";
import type { UserMaxType } from "../types";

export const UserService = {
  async findByEmail(email: string) {
    return await UserModel.findByEmail(email);
  },

  async create(email: string, name: string, profile_url: string, score_max: number, score: number) {
    return UserModel.create(email, name, profile_url, score_max, score);
  },

  async findAll() {
    return UserModel.findAll();
  },

  async findById(id: number) {
    const user = await UserModel.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async update(id: number, data: { email?: string; name?: string, profile_url?: string, score_max?: number, score?: number }) {
    await UserService.findById(id);
    return UserModel.update(id, data);
  },
  async updateScore(email: string, data: { score_max?: number, score?: number }) {
    return UserModel.updateScore(email, data);
  },

  async delete(id: number) {
    await UserService.findById(id);
    return UserModel.delete(id);
  }
};