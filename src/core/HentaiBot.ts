import {
  Logger,
  ConsoleTransport,
  PrettyFormatter,
  LogLevel,
} from "@melike2d/logger";
import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
} from "discord-akairo";
import { HentaiEmbed } from "./structures/HentaiEmbed";
import { BotOptions } from "./index";
import { join } from "path";
import { SettingsProvider } from "./database/providers/SettingsProvider";

export class HentaiBot extends AkairoClient {
  public logger = new Logger("hentai.client", {
    transports: [
      new ConsoleTransport({
        formatter: new PrettyFormatter({
          dateFormat: "HH:mm:ss YYYY/MM/DD",
        }),
        level: LogLevel.TRACE,
      }),
    ],
  });

  public settings = new SettingsProvider();

  public cfg: BotOptions;

  public constructor(cfg: BotOptions) {
    super({
      ownerID: cfg.owners,
      disableMentions: "everyone",
      messageCacheMaxSize: 50,
      messageCacheLifetime: 60,
      messageSweepInterval: 100,
      ws: {
        intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
      },
    });

    this.cfg = cfg;
  }

  public commands: CommandHandler = new CommandHandler(this, {
    directory: join(__dirname, "..", "bot", "commands"),
    prefix: (msg) =>
      msg.guild
        ? this.settings.get<any>(msg.guild, "prefixes", config.get("bot.prefixes"))
        : config.get("bot.prefixes"),
    allowMention: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (_, phrase) =>
          new HentaiEmbed()
            .applyError()
            .setDescription(phrase)
            .setFooter('You can type "cancel" to cancel.'),
        modifyRetry: (_, phrase) =>
          new HentaiEmbed()
            .applyError()
            .setDescription(phrase)
            .setFooter('You can type "cancel" to cancel.'),
        cancel: new HentaiEmbed()
          .applyError()
          .setDescription("Okay, I've cancelled the prompt."),
        timeout: new HentaiEmbed()
          .applyError()
          .setDescription(
            "You took too long to respond, so I've cancelled the prompt."
          ),
        ended: new HentaiEmbed()
          .applyError()
          .setDescription(
            "You exceeded the retry threshold, so I've cancelled the prompt."
          ),
        time: 3e4, // 30 seconds
        retries: 3,
      },
      otherwise: "",
    },
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: 3e4,
    commandUtilSweepInterval: 6e4,
    automateCategories: true,
    blockBots: true,
    blockClient: true,
    defaultCooldown: 7e3, // 7 seconds
  });

  public events: ListenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, "..", "bot", "events"),
  });

  public inhibitors: InhibitorHandler = new InhibitorHandler(this, {
    directory: join(__dirname, "..", "bot", "events"),
  });

  public start() {
    this.commands.useListenerHandler(this.events);
    this.commands.useInhibitorHandler(this.inhibitors);

    [this.commands, this.events].map((handler) =>
      handler.loadAll()
    );

    this.settings.init();

    return super.login(this.cfg.token);
  }
}
