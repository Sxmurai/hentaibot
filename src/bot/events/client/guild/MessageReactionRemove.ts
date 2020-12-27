import { Listener } from "discord-akairo";
import { event } from "@core";
import { MessageReaction, User } from "discord.js";

@event("reactionRemove", { emitter: "client", event: "messageReactionRemove" })
export default class ReactionRemoveEvent extends Listener {
  public async exec(reaction: MessageReaction, user: User) {
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    this.client.favorites.handle("messageReactionRemove", reaction, user);
  }
}
