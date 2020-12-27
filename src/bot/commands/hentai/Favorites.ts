import { Command, Flag } from "discord-akairo";

import { command } from "@core";

@command("favorites", { 
  aliases: ["favs", "fav", "favourites"],
  description: {
    content: "Configures your favorite hentai",
    usage: "<add|remove, rm|view> [...arg]",
    examples: [
      "",
      "view",
      "view ssbigq2buds",
      "add ssbigq2buds",
      "remove ssbigq2buds",
    ]
  },
  channel: "guild"
})
export default class FavoritesCommand extends Command {
  public *args() {
    const method = yield {
      type: [
        ["fav:view", "view"],
        ["fav:add", "add"],
        ["fav:remove", "remove", "rm"]
      ],
      default: "fav:view"
    };

    return Flag.continue(method);
  }
}