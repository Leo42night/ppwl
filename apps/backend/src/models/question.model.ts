// models/question.model.ts
import { prisma } from "@/prisma/db";
import type { QuestionType } from "@/src/types";

export const QuestionModel = {
  async create(data: QuestionType) {
    const result = await prisma.questions.create({ data });
    return { success: true, lastInsertRowid: result.id };
  },

  async findAll() {
    return prisma.questions.findMany();
  },
  async length() {
    return prisma.questions.findMany();
  },

  async findById(id: number) {
    return prisma.questions.findUnique({
      where: { id }
    });
  },

  async findByCategory(category: number) {
    return prisma.questions.findMany({
      where: { category }
    });
  },

  async update(id: number, data: Partial<QuestionType>) {
    return prisma.questions.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return await prisma.$transaction(async (tx) => {
      await tx.user_questions.deleteMany({ where: { user_id: id } });
      return await tx.questions.delete({
        where: { id }
      });
    });
  },
};