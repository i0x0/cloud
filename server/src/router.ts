import { type FastifyInstance } from 'fastify';
export default async (app: FastifyInstance) => {
  app.get("/", (_req, reply) => {
    reply.send('boo')
  })
}
