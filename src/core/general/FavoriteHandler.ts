import { MessageReaction, User, Message } from "discord.js";
import { AkairoClient } from "discord-akairo";

export interface Cache {
  id: string;
  url: string;
}

export class FavoriteHandler {
  public cache = new Map<string, Cache>();

  public add(data: Cache, message: Message) {
    message.react("❤️");
    this.cache.set(message.id, data);
  }

  public handle(
    event: "messageReactionAdd" | "messageReactionRemove",
    reaction: MessageReaction,
    user: User
  ) {
    const client = reaction.client as AkairoClient;

    if (
      reaction.emoji.name !== "❤️" ||
      (user && user.bot) ||
      reaction.message.author.id !== client.user!.id
    ) {
      return;
    }

    const cached = this.cache.get(reaction.message.id);
    if (!cached) {
      return;
    }

    switch (event) {
      case "messageReactionAdd": {
        const items = client.usrs.get<Cache[]>(user.id, "favorites", []);
        items!.push(cached);

        client.usrs.set(user.id, "favorites", items);

        break;
      }

      case "messageReactionRemove": {
        const items = client.usrs.get<Cache[]>(user.id, "favorites", []);
        items!.splice(items!.indexOf(cached), 1);

        client.usrs.set(user.id, "favorites", items);

        break;
      }
    }
  }
}
