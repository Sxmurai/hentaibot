import { readFileSync, existsSync } from "fs";
import { get } from "dot-prop";
import { parse } from "yaml";
import { join } from "path";

export class Config {
	public path: string;
	public parsed: Record<string, any> = {};

	public constructor(file: string) {
		const path = join(process.cwd(), file);

		if (!existsSync(path)) {
			throw new Error(`please create a ${file}`);
		}

		this.path = path;
		this.parse();
	}

	private parse() {
		return (this.parsed = parse(readFileSync(this.path, { encoding: "utf-8" })));
  }
  
  public get<T>(path: string): T | undefined {
    return get<T>(this.parsed, path);
  }
}
