import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import { event, HentaiEmbed } from "@core";

@event("blocked", { event: "commandBlocked", emitter: "commands" })
export default class BlockedEvent extends Listener {
  public exec(message: Message, _: any, reason: string) {
    switch (reason) {
      case "owner": {
        message.util!.send(
          new HentaiEmbed()
            .applyError()
            .setDescription("This command is restricted to owner only.")
        );

        break;
      }

      case "guild": {
        message.util!.send(
          new HentaiEmbed()
            .applyError()
            .setDescription("This command is restricted servers only.")
        );

        break;
      }

      case "nsfw": {
        message.util!.send(
          new HentaiEmbed()
            .applyError()
            .setDescription("This command is restricted to NSFW channels only.")
        );

        break;
      }
    }
  }
}
