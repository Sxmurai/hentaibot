import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { sub, HentaiEmbed, Cache } from "@core";

@sub("fav:remove", {
  args: [
    {
      id: "id",
      prompt: {
        start: "Please provide a ID to remove",
      },
    },
  ],
})
export default class FavoriteCommand extends Command {
  public exec(message: Message, { id }: { id: string }) {
    const items = this.client.usrs.get<Cache[]>(
      message.author.id,
      "favorites",
      []
    )!;

    const item = items.find(
      (item) => item.id.toLowerCase() === id.toLowerCase()
    );

    if (!item) {
      return message.util!.send(
        new HentaiEmbed().applyError().setDescription("Couldn't find item.")
      );
    }

    items!.splice(items.indexOf(item), 1);
    this.client.usrs.set(message.author.id, "favorites", items);

    return message.util!.send(
      new HentaiEmbed()
        .applyNormal()
        .setDescription(`Removed material with id \`${item.id}\``)
    );
  }
}
