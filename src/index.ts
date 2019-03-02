import { Command, flags } from "@oclif/command";

import { Jsonnet } from "./jsonnet";
import { arch, homedir } from 'os';

const fs = require("fs");
const { join } = require("path");

class Archetype extends Command {
  static description = "Generate projects using archetypes";

  static flags = {
    version: flags.version({
      char: "v"
    }),
    help: flags.help({
      char: "h"
    }),
    list: flags.boolean({
      char: "l",
      description: "lists available archetypes",
      default: false,
      exclusive: [
        "help",
        "version",
        "noninteractive",
        "disable_repo",
        "copy_project",
        "ask_trigger"
      ]
    }),
    noninteractive: flags.boolean({
      char: "n",
      description: "disable interactive mode",
      default: false,
      exclusive: ["ask_trigger"]
    }),
    repo_type: flags.enum({
      char: "t",
      description: "the type of project repository",
      options: ["gitlab", "github", "unknown"],
      exclusive: ["disable_repo"],
      required: false,
      default: "unknown"
    }),
    disable_repo: flags.boolean({
      char: "r",
      description: "disables repository setup steps",
      exclusive: ["repo_type"]
    }),
    copy_project: flags.string({
      char: "c",
      description: "optional archetype args copied from project path"
    }),
    question_trigger: flags.enum({
      char: "q",
      description: "setting conditions triggering questions",
      options: ["defaults", "settings", "overrides"]
    }),
    archetype_id: flags.string({
      char: "a",
      description: "the archetype to use",
      default: "node-ts",
      options: fs.readdirSync( join ( homedir(), ".archetype", "archetypes" ))
    })
  };

  static args = [
    {
      name: "project_name",
      description: "new project name"
    }
  ];

  // we want to have variable args at the end
  static strict = false;

  async run() {
    const { args, flags } = this.parse(Archetype);
    const confDir = join( homedir(), ".archetype" );

    if (flags.list) {
      fs.readdirSync( join( confDir, "archetypes")).forEach ((element: string) => {
          this.log(element);
        }
      );
      this.exit(0);
    }

    if (args.project_name === undefined) {
      this.error(
        "Can't help without a project name\n" +
          "Get more help with -h or --help"
      );
    }

    /**
     * 1. Create the prjdir
     * 2. Process jsonnet files in archdir to dump into the prjdir
     * 3. Initialize git, create remote project and push
     */
    fs.mkdirSync (args.project_name);
    const projDir =  join (args.project_name);
    const archDir = join (confDir, "archetypes", flags.archetype_id);
    const files   = fs.readdirSync (archDir);

    files.forEach((element: string) => {
      let srcFile = join(archDir, element);

      if (element.startsWith('dot.')) {
        fs.copyFileSync(srcFile, join(projDir, element.slice(3)));
      }
      else if (element.endsWith('.jsonnet')) {
        let wrapper = new Jsonnet (join (archDir, element));
        let outFile = join (projDir, element.slice(0, -3));
        
        wrapper.setOutFile(outFile)
          .addLibPath(confDir)
          .addArgs("name", args.project_name)
          .execute();
      }
    });
  }
}

export = Archetype;
