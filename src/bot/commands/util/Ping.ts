import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { command, HentaiEmbed } from "@core";

@command("ping", {
  aliases: ["latency"],
  description: {
    content: "Displays the clients' latency",
  },
})
export default class PingCommmand extends Command {
  public async exec(message: Message) {
    let date = Date.now();

    return new Promise((res) => {
      (this.client["api"] as any).channels[message.channel.id].typing
        .post()
        .then(() => {
          res(
            message.util!.send(
              new HentaiEmbed()
                .applyNormal()
                .setDescription([
                  `📡 **Roundtrip**: ${Date.now() - date}ms`,
                  `💓 **Heartbeat**: ${this.client.ws.ping}ms`,
                ])
            )
          );
        });
    });
  }
}