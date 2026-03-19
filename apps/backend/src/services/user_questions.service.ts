// services/user_questions.service.ts
import { UserQuestionsModel } from "../models/user_questions.model";

export const UserQuestionsService = {
  async findIdsByUser(user_id: number) {
    return UserQuestionsModel.findIdsByUser(user_id);
  },

  async saveIdsByUser(user_id: number, question_ids: number[]) {
    return UserQuestionsModel.saveIdsByUser(user_id, question_ids);
  },

  async create(user_id: number, question_id: number) {
    return UserQuestionsModel.create(user_id, question_id);
  },

  async delete(user_id: number, question_id: number) {
    return UserQuestionsModel.delete(user_id, question_id);
  },
};