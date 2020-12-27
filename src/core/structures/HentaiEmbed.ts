import { MessageEmbed, MessageEmbedOptions, StringResolvable } from "discord.js";

export class HentaiEmbed extends MessageEmbed {
  public constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
  }

  public applyNormal() {
    this.setColor("#e64e8d")

    return this;
  }

  public applyError() {
    this.setColor("#f55e53")

    return this;
  }

  public setDescription(content: StringResolvable) {
    if (Array.isArray(content)) {
      content = content.join("\n")
    }

    this.description = content.substring(0, 2048);

    return this;
  }
}