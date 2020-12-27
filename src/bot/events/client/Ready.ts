import { Listener } from "discord-akairo";
import { event } from "@core";

@event("ready", { event: "ready", emitter: "client" })
export default class ReadyEvent extends Listener {
  public exec() {
    this.client.logger.info(`Logged in as ${this.client.user!.username}`);
  }
}
