import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { HentaiEmbed, command } from "@core";

@command("help", {
  aliases: ["commands"],
  description: {
    content: "View info about a command, or view all commands",
    usage: "[?command]",
    examples: ["", "help"],
  },
  args: [
    {
      id: "command",
      type: "commandAlias",
    },
  ],
})
export default class HelpCommand extends Command {
  public async exec(message: Message, { command }: { command: Command }) {
    const embed = new HentaiEmbed().applyNormal();

    if (!command) {
      for (const [name, category] of this.handler.categories.filter(
        this.categoryFilter(message)
      )) {
        embed.addField(
          `› ${name.replace(/(\b\w)/gi, (str) => str.toUpperCase())} (${
            category.size
          })`,
          category
            .filter((cmd) => (cmd.aliases ? cmd.aliases.length > 0 : false))
            .map((cmd) => `\`${cmd.aliases[0]}\``)
            .join(", ") ?? "oof"
        );
      }

      return message.util?.send(
        embed
          .setAuthor(
            `Commands available for ${message.author.username}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `Hello, I'm ${
              this.client.user!.username
            }! I am a hentai bot, and here are my commands:`
          )
          .setFooter(`© ${this.client.user!.username}`)
          .setTimestamp(Date.now())
      );
    }

    const { description, aliases, id } = command;
    //@ts-expect-error
    const prefix = this.handler.prefix(message);

    if (description.examples)
      embed.addField(
        `› Examples (${description.examples.length})`,
        description.examples
          .map(
            (example: string) =>
              `\`${prefix[0]}${id}${example.length ? ` ${example}` : ""}\``
          )
          .join(",\n")
      );

    return message.util?.send(
      embed
        .setAuthor(
          `Help for ${id}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription([
          description.content ?? "No content",
          `\n**Aliases**: ${aliases.map((alias) => `\`${alias}\``).join(", ")}`,
          `\n**Usage**: \`${prefix[0]}${id}${
            description.usage ? ` ${description.usage}` : ""
          }\``,
        ])
        .setFooter(`[] = Strict, [?<var>] = Optional`)
    );
  }

  private categoryFilter(message: Message) {
    return (c: any) =>
      ![
        "flag",
        ...(this.client.ownerID.includes(message.author.id) || !message.guild
          ? []
          : message.member?.hasPermission("MANAGE_GUILD", {
              checkAdmin: true,
              checkOwner: true,
            })
          ? ["owner", "flag"]
          : ["flag", "owner", "settings"]),
      ].includes(c.id);
  }
}
