import { Schema } from "mongoose"

interface IUser {
  email: string,
  pwd: string,
  settings: string
  mods: string[]
  saves: string[]
}

const userSchema = new Schema<IUser>({
  email: {
    type: String, required: true
  }, pwd: {
    type: String, required: true
  },
  settings: {
    type: String, required: true
  },
  mods: {
    type: []
  }
})