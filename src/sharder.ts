import { Logger, ConsoleTransport, PrettyFormatter, LogLevel } from "@melike2d/logger";
import { ShardingManager } from "discord.js";
import { join } from "path";

const manager = new ShardingManager(join(__dirname, "bot", "bot.js"), {
	token: "",
	totalShards: "auto",
	respawn: true,
	mode: "worker",
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

manager.on("shardCreate", ({ id }) => logger.info(`Spawned shard ${id}.`));
