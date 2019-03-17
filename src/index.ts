import {Command, flags} from '@oclif/command'
import {homedir} from 'os'

import {Jsonnet} from './jsonnet'

const fs = require('fs')
const {join} = require('path')

class Archetype extends Command {
  static description = 'Generate projects using archetypes'

  static flags = {
    version: flags.version({
      char: 'v'
    }),
    help: flags.help({
      char: 'h'
    }),
    list: flags.boolean({
      char: 'l',
      description: 'lists available archetypes',
      default: false,
      exclusive: [
        'help',
        'version',
        'noninteractive',
        'disable_repo',
        'copy_project',
        'ask_trigger'
      ]
    }),
    noninteractive: flags.boolean({
      char: 'n',
      description: 'disable interactive mode',
      default: false,
      exclusive: ['ask_trigger']
    }),
    repo_type: flags.option({
      char: 't',
      description: 'the type of project repository',
      options: ['gitlab', 'github', 'unknown'],
      exclusive: ['disable_repo'],
      required: false,
      default: 'unknown'
    }),
    disable_repo: flags.boolean({
      char: 'r',
      description: 'disables repository setup steps',
      exclusive: ['repo_type']
    }),
    copy_project: flags.string({
      char: 'c',
      description: 'optional archetype args copied from project path'
    }),
    question_trigger: flags.option({
      char: 'q',
      description: 'setting conditions triggering questions',
      options: ['defaults', 'settings', 'overrides']
    }),
    mixin_ids: flags.string({
      char: 'm',
      description: 'the mixins to use',
      default: ['yarn'],
      multiple: true,
      options: fs.readdirSync(join(__dirname, '..', 'mixins'))
    }),
    archetype_id: flags.string({
      char: 'a',
      description: 'the archetype to use',
      default: 'node-ts',
      options: fs.readdirSync(join(__dirname, '..', 'archetypes'))
    })
  }

  static args = [
    {
      name: 'project_name',
      description: 'new project name'
    }
  ]

  // we want to have variable args at the end
  static strict = false

  async run() {
    const {args, flags} = this.parse(Archetype, this.argv)
    const mainDir: string = join(__dirname, '..')

    if (flags.list) {
      fs.readdirSync(join(mainDir, 'archetypes')).forEach((element: string) => {
        this.log(element, {})
      })
      this.exit(0)
    }

    if (args.project_name === undefined) {
      this.error("Can't help without a project name\n"
        + 'Get more help with -h or --help', {exit: 2})
    }

    /**
     * 1. Create the prjdir
     * 2. Process jsonnet files in archdir to dump into the prjdir
     * 3. Initialize git, create remote project and push
     */
    const projDir = join(args.project_name)
    const srcDir = join(projDir, 'src')
    const archDir = join(mainDir, 'archetypes', flags.archetype_id)

    fs.mkdirSync(projDir)
    fs.mkdirSync(srcDir)
    const files = fs.readdirSync(archDir)


    if (flags.mixin_ids !== undefined) {
      flags.mixin_ids.forEach((mixin: string) => {
        this.warn(`Ignoring mixin ${mixin}: mixins have not been implemented yet.`);
      })
    }   

    files.forEach((element: string) => {
      let srcFile = join(archDir, element)

      if (element.startsWith('dot.')) {
        fs.copyFileSync(srcFile, join(projDir, element.slice(3)))
      } else if (element.startsWith('index.')) {
        fs.copyFileSync(srcFile, join(srcDir, element))
      } else if (element.endsWith('.jsonnet')) {
        let wrapper = new Jsonnet(join(archDir, element))
        let outFile = join(projDir, element.slice(0, -3))

        wrapper
          .setOutFile(outFile)

          // make ~/.archetype/personal-settings.jsonnet available for import
          .addLibPath(join(homedir(), '.archetype'))

          .addArgs('name', args.project_name)
          .execute()
      }
    })
  }
}

export = Archetype
