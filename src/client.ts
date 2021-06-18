import { Client, Collection, Intents } from "discord.js";
import glob from "glob";
import { Pattern } from "./typedefs/pattern";
import { promisify } from "util";
import { CommandStruct, EventStruct } from "./typedefs/commandEvent";

class Winbi extends Client {
  public constructor() {
    super({
      ws: {
        intents: Intents.ALL,
      },
      partials: ["MESSAGE", "GUILD_MEMBER", "REACTION", "USER", "CHANNEL"],
      retryLimit: Number.POSITIVE_INFINITY,
    });
  }
  public commands = new Collection<string, CommandStruct>();
  public events = new Collection<string, EventStruct>();
  public globPromised = promisify(glob);
  public async cmdEvtHandler({
    CmdPattern,
    EvtPattern,
  }: Partial<Readonly<Omit<Pattern, "OtherPattern">>>) {
    glob(CmdPattern as string, (err: Error, cmdFiles: string[]) => {
      if (err) return console.error(err);
      cmdFiles.map(async (file: string, i: number) => {
        if (file.endsWith(".js") || file.match(/.*\.js$/)) {
          const cmd: CommandStruct = (await import(file)) as CommandStruct;
          this.commands.set(cmd.name, cmd);
        }
      });
    });
    glob(EvtPattern as string, (err: Error, evtFiles: string[]) => {
      if (err) return console.error(err);
      evtFiles.map(async (file: string, i: number) => {
        if (file.endsWith(".js") || file.match(/.*\.js$/)) {
          const evt: EventStruct = (await import(file)) as EventStruct;
          this.events.set(evt.name, evt);
        }
      });
    });
  }

  public async start(token: string): Promise<void> {
    this.login(token);
    this.cmdEvtHandler({
      CmdPattern: `${__dirname}/commands/**/*{.js,.ts}`,
      EvtPattern: `${__dirname}/events/**/*{.js,.ts}`,
    });
  }
}

export { Winbi };
