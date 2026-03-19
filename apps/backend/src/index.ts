import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { userRoute } from "./routes/user.route";
import { questionRoute } from "./routes/question.route";
import 'dotenv/config';
import { prisma } from "@/prisma/db";

const app = new Elysia()
  .use(cors({ origin: [process.env.FRONTEND_URL ?? "", process.env.TEST_URL ?? ""] }))
  .use([swagger()])
  .onError(({ code, status, set }) => {
    if (code === 'NOT_FOUND') return status(404, 'Not Found :(')
  })
  .group('/api', (app) =>
    app.use([userRoute, questionRoute])
      .get('/', () => 'Hello API')
      .get('/test-user/:id', ({ params }) => {
        const id = Number(params.id);
        return prisma.users.findUnique({
          where: { id },
        });
      })
  )
  .get("/", () => {
    return {
      data: { status: "ok" },
      message: "server running"
    }
  });

app.listen(process.env.PORT ?? 3000);
if (process.env.NODE_ENV != "production") {
  console.log(`🦊 Backend → http://localhost:3000`);
  console.log(`🦊 TEST_URL: ${process.env.TEST_URL}`);
  console.log(`🦊 DATABASE_URL: ${process.env.DATABASE_URL}`);
}

export default app;
// POST login -> savelogin -> setcookie -> go to frontend (check cookie) -> get questions
// GET list questions
// questions/<i>
// questions/<i>/answers
// 