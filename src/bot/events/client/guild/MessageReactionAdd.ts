import { Listener } from "discord-akairo";
import { event } from "@core";
import { MessageReaction, User } from "discord.js";

@event("reactionAdd", { emitter: "client", event: "messageReactionAdd" })
export default class ReactionAddEvent extends Listener {
  public async exec(reaction: MessageReaction, user: User) {
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();

    this.client.favorites.handle("messageReactionAdd", reaction, user);
  }
}
