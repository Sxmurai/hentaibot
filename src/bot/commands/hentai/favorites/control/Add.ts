import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { sub, HentaiEmbed, Cache } from "@core";

@sub("fav:add", {
  args: [
    {
      id: "id",
      prompt: {
        start: "Please provide a ID to add",
      },
    },
  ],
})
export default class FavoriteCommand extends Command {
  public exec(message: Message, { id }: { id: string }) {
    const item = [...this.client.favorites.cache.values()].find(
      (item) => item.id.toLowerCase() === id.toLowerCase()
    );

    if (!item) {
      return message.util!.send(
        new HentaiEmbed().applyError().setDescription("Couldn't find item.")
      );
    }

    const items = this.client.usrs.get<Cache[]>(
      message.author.id,
      "favorites",
      []
    )!;
    items!.push(item);
    this.client.usrs.set(message.author.id, "favorites", items);

    return message.util!.send(
      new HentaiEmbed()
        .applyNormal()
        .setDescription(`Added material with id \`${item.id}\``)
    );
  }
}
