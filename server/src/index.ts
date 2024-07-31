import 'reflect-metadata';
import Server from "./Server";
import { error } from "./utils";

try {
  new Server().start()
} catch (e) {
  error(`Server error: ${e}`)
}
