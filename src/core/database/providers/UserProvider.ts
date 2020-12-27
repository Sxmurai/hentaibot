import { Cache } from "../../general/FavoriteHandler";
import { Guild } from "discord.js";
import { get, set, delete as del } from "dot-prop";
import { Users } from "../models/Users";
import { User } from "discord.js";

interface Setting {
  favorites: Cache[];
}

const defaults: Setting = {
  favorites: [],
};

export class UserProvider {
  private items: Map<string, Setting> = new Map();

  public async init() {
    for (const { id, data } of await Users.all()) {
      this.items.set(id, JSON.parse(data));
    }
  }

  public get<t>(
    user: null | string | User,
    path: string,
    defaultValue?: t
  ): t | undefined {
    const item = this.items.get(UserProvider.id(user)) ?? defaults;

    return get<t>(item, path) ?? defaultValue;
  }

  public raw(user: string | null | User) {
    return this.items.get(UserProvider.id(user)) ?? defaults;
  }

  public async set(user: string | null | User, path: string, value: any) {
    const item =
      this.items.get(UserProvider.id(user)) ?? (await this.ensure(user));

    set(item, path, value);
    this.items.set(UserProvider.id(user), item);

    const server = await Users.find({ id: UserProvider.id(user) });
    server.data = JSON.stringify(item);

    return await server.save();
  }

  public async delete(user: string | null | User, path: string) {
    const item =
      this.items.get(UserProvider.id(user)) ?? (await this.ensure(user));

    del(item, path);
    this.items.set(UserProvider.id(user), item);

    const server = await Users.find({ id: UserProvider.id(user) });
    server.data = JSON.stringify(item);

    return await server.save();
  }

  public async clear(user: string | null | User) {
    const item = this.items.get(UserProvider.id(user));
    if (!item) return;

    this.items.delete(UserProvider.id(user));

    const server = await Users.find({ id: UserProvider.id(user) });
    return await server.delete();
  }

  private async ensure(user: string | null | User) {
    let item = this.items.get(UserProvider.id(user));

    if (!item) {
      const server = new Users();
      server.id = UserProvider.id(user);
      server.data = JSON.stringify(defaults);

      await server.save();

      this.items.set(UserProvider.id(user), defaults);

      item = defaults;
    }

    return item;
  }

  private static id(user: string | null | User) {
    if (user instanceof User) return user.id;
    if (user === "global" || user === null) return "0";
    if (typeof user === "string" && /^\d+$/.test(user)) return user;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
