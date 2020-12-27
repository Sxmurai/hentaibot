import { Guild } from "discord.js";
import { get, set, delete as del } from "dot-prop";
import { Guilds } from "../models/Guilds";

interface Setting {
	prefixes: string[];
}

const defaults: Setting = {
	prefixes: ["hb!", "hentai, "],
};

export class SettingsProvider {
	private items: Map<string, Setting> = new Map();

	public async init() {
		for (const { id, data } of await Guilds.all()) {
			this.items.set(id, JSON.parse(data));
		}
	}

	public get<t>(guild: null | string | Guild, path: string, defaultValue?: t): t | undefined {
		const item = this.items.get(SettingsProvider.id(guild)) ?? defaults;

		return get<t>(item, path) ?? defaultValue;
	}

	public raw(guild: string | null | Guild) {
		return this.items.get(SettingsProvider.id(guild)) ?? defaults;
	}

	public async set(guild: string | null | Guild, path: string, value: any) {
		const item = this.items.get(SettingsProvider.id(guild)) ?? (await this.ensure(guild));

		set(item, path, value);
		this.items.set(SettingsProvider.id(guild), item);

		const server = await Guilds.find({ id: SettingsProvider.id(guild) });
		server.data = JSON.stringify(item);

		return await server.save();
	}

	public async delete(guild: string | null | Guild, path: string) {
		const item = this.items.get(SettingsProvider.id(guild)) ?? (await this.ensure(guild));

		del(item, path);
		this.items.set(SettingsProvider.id(guild), item);

		const server = await Guilds.find({ id: SettingsProvider.id(guild) });
		server.data = JSON.stringify(item);

		return await server.save();
	}

	public async clear(guild: string | null | Guild) {
		const item = this.items.get(SettingsProvider.id(guild));
		if (!item) return;

		this.items.delete(SettingsProvider.id(guild));

		const server = await Guilds.find({ id: SettingsProvider.id(guild) });
		return await server.delete();
	}

	private async ensure(guild: string | null | Guild) {
		let item = this.items.get(SettingsProvider.id(guild));

		if (!item) {
			const server = new Guilds();
			server.id = SettingsProvider.id(guild);
			server.data = JSON.stringify(defaults);

			await server.save();

			this.items.set(SettingsProvider.id(guild), defaults);

			item = defaults;
		}

		return item;
	}

	private static id(guild: string | null | Guild) {
		if (guild instanceof Guild) return guild.id;
		if (guild === "global" || guild === null) return "0";
		if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

		throw new TypeError('Guild instance is undefined. Valid instances: guildID, "global" or null.');
	}
}
