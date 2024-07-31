import { cleanEnv, num, str } from "envalid";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import Fastify from "fastify";
import { error, info, ok } from "./utils";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import router from "./router";
import mongoose from "mongoose";

export default class Server {
  // @ts-expect-error
  public server: FastifyInstance = Fastify({
    logger: {
      transport: {
        target: "@fastify/one-line-logger",
        // @ts-expect-error
        colorize: false,
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>()

  public env = cleanEnv(Bun.env, {
    SECRET: str({
      default: 'idk_tbh'
    }),
    PORT: num({
      default: 3000
    })
  })

  constructor() {
    this.addPlugins()
    this.addRandom()
  }

  async addPlugins() {
    this.server.register(import('@fastify/rate-limit'))
    this.server.register(import('@fastify/sensible'))
    this.server.register(import('@fastify/compress'))
    this.server.register(import('@fastify/jwt'), {
      secret: this.env.SECRET
    })
    this.server.register(import('@fastify/helmet'), {
      contentSecurityPolicy: false
    })

    this.server.register(router)
    this.server.decorate('db', mongoose)
  }

  addRandom() {
    this.server.addHook('onReady', async () => {
      info('connecting to mongodb')
      mongoose.connect(Bun.env.MONGODB!, { serverApi: { version: '1', strict: true, deprecationErrors: true } })
    })

    this.server.addHook('onClose', async () => {
      info('disconnected to mongodb')
      await mongoose.disconnect()
    })

    this.server.decorate("authenticate", async function (req: FastifyRequest, rep: FastifyReply) {
      try {
        await req.jwtVerify()
      } catch (err) {
        req.unauthorized()
        //reply.send(err)
      }
    })
  }
  start(port: number = this.env.PORT) {
    this.server.listen({
      host: '0.0.0.0',
      port
    }).then(() => {
      ok("server started successfully!")
      //this.socketStuff()
    }).catch((err) => {
      error(`error starting server: ${err}`)
    })
  }
}