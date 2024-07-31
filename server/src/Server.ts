import { cleanEnv, num, str } from "envalid";
import type { FastifyInstance } from "fastify";
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
    [{
      name: '@fastify/helmet',
      contentSecurityPolicy: false
    },
    {
      name: '@fastify/jwt',
      opt: {
        secret: this.env.SECRET
      },
    }, {
      name: '@fastify/compress'
    },
    {
      name: '@fastify/sensible'
    },
    {
      name: '@fastify/rate-limit'
    }].forEach(x => {
      this.server.register(import(x.name), {
        ...x.opt
      })
      info(`added ${x.name}`)
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