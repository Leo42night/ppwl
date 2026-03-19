// routes/question.route.ts
import Elysia, { t } from "elysia";
import { QuestionService } from "../services/question.service";
import type { QuestionType } from "../types";
import { Cipher } from 'shared';
import { ENCRYPTION_KEY } from "../utils";

export const questionRoute = new Elysia({ prefix: "/questions" })
  // security agak sulit (tapi masih bisa diakali)
  .get("/real", async ({ status }) => {
    try {
      return await QuestionService.findAll();
    } catch (e) {
      return status(404, { message: "Questions not found" });
    }
  })

  .get("/", async ({ status }) => {
    const data = await QuestionService.findAll();
    if (!ENCRYPTION_KEY) return status(404, { message: "Env elemen not found" });
    const scrambled: string = Cipher.encode(JSON.stringify(data), ENCRYPTION_KEY);
    return { data: scrambled };
  })

  // belum saatnya
  .get("/:id", async ({ params: { id }, status }) => {
    try {
      return await QuestionService.findById(Number(id));
    } catch (e) {
      return status(404, { message: "Question not found" });
    }
  })

  // 
  .get("/length", async ({ status }) => {
    try {
      return await QuestionService.length();
    } catch (e) {
      return status(404, { message: "Question length not found" });
    }
  })

  .get("/category/:category", async ({ params: { category } }) => {
    return QuestionService.findByCategory(Number(category));
  })

  .post("/", async ({ body, status }) => {
    try {
      return await QuestionService.create(body as QuestionType);
    } catch (e) {
      return status(400, { message: "Bad request", error: e });
    }
  }, {
    body: t.Object({
      category: t.Number(),
      language: t.Number(),
      type: t.Number(),
      question: t.String(),
      answer: t.String(),
      correct_answer: t.String(),
      difficulty: t.Number(),
      points: t.Number(),
    }),
  })

  .put("/:id", async ({ params: { id }, body, status }) => {
    try {
      return await QuestionService.update(Number(id), body);
    } catch (e) {
      return status(404, { message: "Question not found" });
    }
  }, {
    body: t.Object({
      category: t.Optional(t.Number()),
      language: t.Optional(t.Number()),
      type: t.Optional(t.Number()),
      question: t.Optional(t.String()),
      answer: t.Optional(t.String()),
      correct_answer: t.Optional(t.String()),
      difficulty: t.Optional(t.Number()),
      points: t.Optional(t.Number()),
    }),
  })

  .delete("/:id", async ({ params: { id }, status }) => {
    try {
      await QuestionService.delete(Number(id));
      return { success: true };
    } catch (e) {
      return status(404, { message: "Question not found" });
    }
  });