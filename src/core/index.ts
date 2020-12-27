import "module-alias/register";

export * from "./general";
export * from "./structures";
export * from "./database";
export * from "./HentaiBot";

export interface BotOptions {
  token: string;
  prefixes: string | string[];
  owners: string | string[];
}

import { Config } from "./general";
import { PrismaClient } from "@prisma/client";
import { Logger } from "@melike2d/logger";
import { SettingsProvider } from "./database/providers/SettingsProvider";

import "discord-akairo";

declare global {
  const config: Config;
  const prisma: PrismaClient;

  interface String {
    truncate: (size?: number) => string;
  }
}

declare module "discord.js" {
  interface Message {
    quote(
      content: StringResolvable | APIMessage,
      options: MessageOptions | MessageAdditions
    ): any;
  }
}

declare module "discord-akairo" {
  interface AkairoClient {
    commands: CommandHandler;
    events: ListenerHandler;
    inhibitors: InhibitorHandler;
    settings: SettingsProvider;
    logger: Logger;
  }
}

String.prototype.truncate = function (length = 45) {
  const str = this.replace(/[*_`~]/, (r: string) => `\\${r}`);
  return str.length >= length ? `${str.substring(0, length)}...` : str;
};
