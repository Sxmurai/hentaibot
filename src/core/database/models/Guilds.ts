import { Model } from "../Model";
import { Column } from "../../general/Decorators";

export class Guilds extends Model {
	@Column({ primary: true, nullable: false })
	public id!: string;

	@Column({ defaults: "{}" })
	public data!: string;
}
