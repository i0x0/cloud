import { cleanEnv, num, str } from "envalid";
import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { error, ok } from "./utils";

export default class Server {
  public server: FastifyInstance = Fastify({
    logger: true,
  })

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
  }

  addPlugins() {
    [{
      name: '@fastify/helmet',
      contentSecurityPolicy: false
    },
    {
      name: '@fastify/jwt',
      opt: {
        secret: this.env.SECRET
      }
    }].forEach(x => {
      this.server.register(import(x.name), {
        ...x.opt
      })
    })
    this.server.register
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