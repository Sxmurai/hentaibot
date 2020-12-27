import { Inhibitor, Command } from "discord-akairo";
import { Message, TextChannel } from "discord.js";
import { inhibitor } from "@core";

@inhibitor("nsfw", { reason: "nsfw" })
export default class NSFWInhibitor extends Inhibitor {
  public exec(message: Message, command: Command): boolean {
    if (command.categoryID !== "hentai" || message.channel.type !== "text") {
      return false;
    }

    return !(message.channel as TextChannel).nsfw;
  }
}
