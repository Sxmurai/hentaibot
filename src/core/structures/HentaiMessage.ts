import {
  Structures,
  StringResolvable,
  APIMessage,
  MessageOptions,
  MessageAdditions,
} from "discord.js";

export default Structures.extend(
  "Message",
  (Message) =>
    class HentaiMessage extends Message {
      public async quote(
        content: StringResolvable | APIMessage,
        options?: MessageOptions | MessageAdditions
      ): Promise<any> {
        let msg;

        if (content instanceof APIMessage) {
          msg = content.resolveData();
        } else {
          //@ts-expect-error
          msg = APIMessage.create(this, content, options!).resolveData();
          //@ts-expect-error
          if (Array.isArray(msg.data!.content)) {
            //@ts-expect-error
            return Promise.all(msg.split().map(this.quote.bind(this)));
          }
        }

        const { data: parsed, files } = await msg.resolveFiles();
        const message_reference = {
          message_id: this.id,
          //channel_id: this.channel.id,
          //guild_id: this.guild!.id,
        };

        return (this.client["api"] as any).channels[this.channel.id].messages.post({
          data: { ...parsed, options, message_reference },
          files,
        });
      }
    }
);
