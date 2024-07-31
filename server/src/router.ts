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
    let i = await User.findOne({
      email
    })
    if (i) {
      return rep.badRequest('email already taken')
    }
    let x = await User.create({
      email, pwd: await Bun.password.hash(pwd)
    })
    info(x)
  })

  app.post("/login", {
    schema: {
      body: Type.Object({
        email: Type.String(),
        pwd: Type.String()
      })
    }
  }, async (req, rep) => {
    const { email, pwd } = req.body

    let x = await User.findOne({
      email
    })
    if (x) {
      let y = await Bun.password.verify(pwd, x.pwd)
      if (y) {
        return rep.send({
          token: app.jwt.sign({
            email
          })
        })
      } else {
        return rep.badRequest('invalid pwd')
      }
    } else {
      return rep.badRequest('no account found with that email')
    }
  })

  app.post("/upload", {
    schema: {
      body: Type.Optional(Type.Object({
        settings: Type.String(),
        mods: Type.Array(Type.String()),
        saves: Type.Array(Type.String()),
      }))
    }
  }, async (req, rep) => { })
}

