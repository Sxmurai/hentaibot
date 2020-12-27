import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { sub, HentaiEmbed, Cache } from "@core";
import { MessageEmbed } from "discord.js";

@sub("fav:view", {
  args: [
    {
      id: "id",
      unordered: true,
    },

    {
      id: "page",
      type: "number",
      unordered: true,
      match: "option",
      flag: ["-page ", "-p "],
      default: 1,
    },
  ],
})
export default class FavoriteCommand extends Command {
  public exec(message: Message, { id, page }: { id: string; page: number }) {
    if (!id) {
      const favorites = this.client.usrs.get<Cache[]>(
        message.author.id,
        "favorites",
        []
      )!;
      if (!favorites.length) {
        return message.util!.send(
          new HentaiEmbed()
            .applyError()
            .setDescription("You have nothing favorited!")
        );
      }

      const embed = new HentaiEmbed()
        .setAuthor(
          `Favorites | ${message.author.username}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .applyNormal();

      const itemsPerPage = 5;
      const max = Math.ceil(favorites.length / itemsPerPage);

      if (page > max || page < 1) {
        page = 1;
      }

      const display = favorites.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );

      display.map((item, index) => {
        embed
          .appendDescription(
            `\`#${(index + 1).toString().padStart(2, "0")}\` | ${item.id}`
          )
          .appendDescription("\n")
          .appendDescription(`\u3000 **› Image**: [click here](${item.url})`)
          .appendDescription("\n")
          .appendDescription(
            `\u3000 **› Date**: ${
              item.date
                ? new Date(item.date).toLocaleDateString()
                : "Unknown Date"
            }`
          )
          .appendDescription("\n")
          .appendDescription(
            `\u3000 **› Color**: ${
              item.color
                ? ("00000" + item.color.toString(16)).slice(-6)
                : "No color"
            }`
          )
          .appendDescription("\n")
          .appendDescription("\n");
      });

      return message.util!.send(embed.setFooter(`Page: ${page}/${max}`));
    } else {
      const favorites = this.client.usrs.get<Cache[]>(
        message.author.id,
        "favorites",
        []
      )!;

      const item = favorites.find(
        (item) => item.id.toLowerCase() === id.toLowerCase()
      );

      if (!item) {
        return message.util!.send(
          new HentaiEmbed().applyError().setDescription("Couldn't find item.")
        );
      }

      return message.util!.send(
        new MessageEmbed()
          .setColor(item.color ?? "#e64e8d")
          .setImage(item.url)
          .setFooter(
            `${item.id} | ${
              item.date
                ? new Date(item.date).toLocaleDateString()
                : "Unknown Date Added"
            }`
          )
      );
    }
  }
}
