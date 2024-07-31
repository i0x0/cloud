import 'reflect-metadata';
import Server from "./Server";
import { error, info } from "./utils";
import type mongoose from 'mongoose';

try {
  if (!Bun.env.MONGODB) {
    error('no db connection')
    process.exit(1)
  }
  let x = new Server()
  x.start()
  info(x.server.db.connection.id!)

} catch (e) {
  error(`Server error: ${e}`)
}

declare module 'fastify' {
  interface FastifyInstance { // you must reference the interface and not the type
    db: typeof mongoose
  }

  interface FastifyRequest {
    id: string
  }
}