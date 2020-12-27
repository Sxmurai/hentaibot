import { HentaiEmbed } from "../structures/HentaiEmbed";
import { Command, AkairoClient } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import fetch from "node-fetch";

interface CommandOptions {
  id: string;
  aliases?: string[];
  category?: string;
  description?: string;
}

export class CommandGenerator {
  public client: AkairoClient;

  public constructor(client: AkairoClient) {
    this.client = client;
  }

  public register(baseUrl: string, commands: CommandOptions[]) {
    for (const command of commands) {
      class GeneratedCommand extends Command {
        public constructor() {
          super(command.id, {
            aliases: [command.id, ...(command.aliases ?? [])],
            category: command.category ?? "hentai",
            description: {
              content:
                command.description ?? "Displays a hentai related picutre",
            },
            channel: "guild",
          });
        }

        public async exec(message: Message) {
          try {
            const json = await this.image();

            let id = Math.random().toString(36);
            id = id.slice(2, id.length);

            message
              .util!.send(
                new MessageEmbed()
                  .setColor(json.color)
                  .setImage(json.message)
                  .setFooter(
                    `${id} | ${message.author.username.truncate(25)}`,
                    message.author.displayAvatarURL({ dynamic: true })
                  )
              )
              .then((msg) =>
                this.client.favorites.add(
                  {
                    url: json.message,
                    id,
                    date: Date.now(),
                    color: json.color,
                  },
                  msg
                )
              );
          } catch (error) {
            message.util!.send(
              new HentaiEmbed()
                .applyError()
                .setDescription(`Couldn't fetch data\n\`\`\`js\n${error}\`\`\``)
            );
          }
        }

        public async image() {
          const json = await (
            await fetch(`${baseUrl}?type=${command.id}`)
          ).json();

          return json;
        }
      }

      this.client.commands.register(new GeneratedCommand());
    }
  }
}
