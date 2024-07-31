import { Type } from '@sinclair/typebox';
import { type FastifyInstance } from 'fastify';
export default async (app: FastifyInstance) => {
  app.get("/", (_req, reply) => {
    reply.send('boo')
  })

  app.post("/create", {
    schema: {
      body: Type.Object({
        email: Type.String({ format: 'email' }),
        password: Type.String()
      })
    }
  }, async (req, rep) => {
    const { name, email } = req.body

  })
}

