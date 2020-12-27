import { Command } from "discord-akairo";
import { Message } from "discord.js";

import { command } from "@core";
import { inspect } from "util";

@command("eval", {
  aliases: ["evaluate"],
  description: {
    content: "Evaluates JavaScript code",
    usage: "<code> -d int -s",
    examples: ["2 + 2", "this.client -d 2", 'message.channel.send("cunt") -s'],
  },
  args: [
    {
      id: "code",
      match: "restContent",
      prompt: {
        start: "Please provide something to evaluate",
      },
    },

    {
      id: "depth",
      type: "number",
      unordered: true,
      match: "option",
      flag: ["-d ", "-depth "],
      default: 0,
    },

    {
      id: "silent",
      unordered: true,
      match: "flag",
      flag: ["-s", "-silent"],
    },
  ],
  ownerOnly: true,
})
export default class EvalCommand extends Command {
  public async exec(
    message: Message,
    { code, depth, silent }: { code: string; depth: number; silent: boolean }
  ) {
    try {
      const start = process.hrtime();
      let toEval = eval(code);
      let hr = process.hrtime(start);

      if (this.isPromise(toEval)) {
        toEval = await toEval;
        hr = process.hrtime(start);
      }

      let evaluated = inspect(toEval, false, depth ?? 0).toString();
      evaluated = this.removeSensativeInformation(evaluated);

      if (silent) {
        message.react("👍");
        this.client.logger.info("Silently evaluated code")
      } else {
        return message.util?.send([
          `⏱️ Took: ${hr[0] > 0 ? `${hr[0]}s ` : ""}${hr[1] / 1000000}ms`,
          `🔎 Type: ${this.type(toEval)}`,
          `\`\`\`js\n${evaluated.substring(0, 1950)}\`\`\``,
        ]);
      }
    } catch (error) {
      this.client.logger.error(error);

      return message.util?.send(
        `Whoopies, there was an error while evaluating!\`\`\`js\n${this.removeSensativeInformation(
          error.toString()
        ).substring(0, 1950)}\`\`\``
      );
    }
  }

  public type(value: any) {
    const type = typeof value;
    switch (type) {
      case "object":
        return value === null
          ? "null"
          : value.constructor
          ? value.constructor.name
          : "any";
      case "function":
        return `${value.constructor.name}(${value.length})`;
      case "undefined":
        return "void";
      default:
        return type;
    }
  }

  public isPromise(value: any) {
    return (
      value &&
      typeof value.then === "function" &&
      typeof value.catch === "function"
    );
  }

  public removeSensativeInformation(data: string) {
    const blacklist = [
      config.get("bot.token"),
    ];

    return data.replace(new RegExp(blacklist.join("|"), "gi"), "[redacted]");
  }
}
