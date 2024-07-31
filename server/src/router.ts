import { Type } from '@sinclair/typebox';
import { type FastifyInstance } from 'fastify';
import { User } from './db';
import { info } from './utils';
export default async (app: FastifyInstance) => {

  app.get("/", (_req, reply) => {
    reply.send('boo')
  })

  app.post("/create", {
    schema: {
      body: Type.Object({
        email: Type.String(),
        pwd: Type.String()
      }),
    }
  }, async (req, rep) => {
    //info(req.body)
    const { email, pwd } = req.body
    let x = await User.create({
      email, pwd
    })
    info(x)
  })
}

