import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { HentaiEmbed, command } from "@core";
import fetch from "node-fetch";

@command("search", {
  aliases: ["hsearch"],
  description: {
    content: "Searches for hentai",
    usage: "[search] <page>",
    examples: ["uncensored", "milf 2"],
  },
  args: [
    {
      id: "query",
      match: "rest",
      prompt: {
        start: "Please provide a search query",
      },
    },

    {
      id: "page",
      type: "number",
      match: "option",
      flag: ["-page ", "-p "],
      default: 0,
    },
  ],
})
export default class SearchCommand extends Command {
  public cache = new Map<string, any[]>();

  public async exec(
    message: Message,
    { query, page }: { query: string; page: number }
  ) {
    if (["shotacon", "loli", "lolicon"].includes(query.toLowerCase())) {
      return message.util!.send(
        new HentaiEmbed()
          .applyError()
          .setDescription("I couldn't find anything for that query.")
      );
    }

    const json =
      this.cache.get(query.toLowerCase()) ??
      JSON.parse(
        (
          await (
            await fetch(
              `https://hentaihaven.org/wp-json/wp/v2/posts?per_page=100&search=${query}`,
              {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  Cookie: config.get<string>("apis.hentaihaven")!,
                },
              }
            )
          ).text()
        ).replace(/\n+/g, " ")
      );

    if (!json || !json.length) {
      return message.util!.send(
        new HentaiEmbed()
          .applyError()
          .setDescription("I couldn't find anything for that query.")
      );
    }

    if (!this.cache.has(query.toLowerCase())) {
      this.cache.set(query.toLowerCase(), json);
    }

    const embed = new HentaiEmbed()
      .setAuthor(
        query.truncate(),
        message.author.displayAvatarURL({ dynamic: true }),
        `https://hentaihaven.org/search/${encodeURIComponent(query)}`
      )
      .applyNormal();

    const itemsPerPage = 3;
    const max = Math.ceil(json.length / itemsPerPage);
    if (page > max || page < 1) {
      page = 1;
    }

    const display = json.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    embed.setFooter(`Page ${page}/${max}`);

    for (let i = 0; i < display.length; ++i) {
      const item = display[i];

      const authors = item._links.author.map(
        async (author: any) => await this.getAuthor(author)
      );

      embed.addField(`#${i + 1} | ${item.title.rendered}`.truncate(), [
        `**› URL** [here](${item.link})`,
        `**› Authors**: ${
          item._links.author.length
            ? (await Promise.all(authors))
                .map((author: any) => `[${author.slug}](${author.link})`)
                .join(", ")
            : `Author ID: ${item.author}`
        }`,
      ]);
    }

    return message.util!.send(embed);
  }

  private async getAuthor(url: string) {
    return fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Cookie: config.get<string>("apis.hentihaven")!,
      },
    }).then((res) => res.json());
  }
}
