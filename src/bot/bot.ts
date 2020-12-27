import { HentaiBot, BotOptions, Config } from "@core";
import { PrismaClient } from "@prisma/client";

(global as any).config = new Config("config.yml");
(global as any).prisma = new PrismaClient();

const bot = new HentaiBot(config.get<BotOptions>("bot")!);

import "../core/structures/HentaiMessage";

(async () => {
  prisma
    .$connect()
    .then(() => bot.logger.info("Connected to PostgreSQL with prisma"))
    .catch((error: Error) =>
      bot.logger.error(
        `CUNT CUNT CUNT BITCH PUSSY FUCK ME SILLY GOD FUCKING DAMNITTTT\n\n${error}`
      )
    );

  bot.start();
})();
