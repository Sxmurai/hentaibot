import { Config } from "./core/general/Config";
import { Logger, ConsoleTransport, PrettyFormatter, LogLevel } from "@melike2d/logger";
import { ShardingManager } from "discord.js";
import { join } from "path";

(global as any).config = new Config("config.yml");

const manager = new ShardingManager(join(__dirname, "bot", "bot.js"), {
	token: config.get("bot.token"),
	totalShards: "auto",
});

const logger = new Logger("hentai.sharding", {
	transports: [
		new ConsoleTransport({
			formatter: new PrettyFormatter({
				dateFormat: "HH:mm:ss YYYY/MM/DD",
			}),
			level: LogLevel.TRACE,
		}),
	],
});

manager.spawn("auto")
manager.on("shardCreate", ({ id }) => logger.info(`Spawned shard ${id}.`));
