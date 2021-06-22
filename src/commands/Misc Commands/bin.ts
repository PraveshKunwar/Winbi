import { DiscordAPIError, MessageEmbed } from "discord.js";
import sourcebin from "sourcebin";
import { CommandFunc } from "../../typedefs/commandEvent";
import { ERROR } from "../../typedefs/constants";

export const run: CommandFunc = async (client, message, args) => {
  const code = args.join(" ");
  if (!code) {
    message.channel.send(ERROR.NO_ARGS);
  } else {
    try {
      const bin = await sourcebin.create(
        [
          {
            content: code,
            language: "text",
          },
        ],
        {
          title: `${message.author.tag}'s bin.`,
          description: `${message.author.tag}'s code. Check it out.`,
        }
      );
      message
        .delete()
        .then((msg) => {
          msg.channel.send(`Here is your url: ${bin.url}`);
        })
        .catch((err: DiscordAPIError) => {
          if (err.message) {
            message.channel.send(
              `${ERROR.UNKNOWN}${client.oneblock(
                `Message: ${err.message} | Code: ${err.code}`
              )}`
            );
          }
        });
    } catch (e) {
      if (e) {
        message.channel.send(ERROR.UNKNOWN);
      }
    }
  }
};

export const name: string = "bin";
export const aliases: string[] = ["sourcebin", "code"];
export const desc: string = "Upload code to sourcebin easily.";
export const perms: string | string[] | null = null;
export const cooldown: number = 120;
