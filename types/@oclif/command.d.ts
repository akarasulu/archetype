export class Command {
  static aliases: any[];
  static parse: boolean;
  static parserOptions: {};
  static run(argv: any, opts: any): any;
  static strict: boolean;
  constructor(argv: any, config: any);
  argv: any;
  config: any;
  id: any;
  debug: any;
  error(input: any, options: any): any;
  exit(code: any): any;
  init(): any;
  log(message: any, args: any): void;
  parse(options: any, argv: any): any;
  warn(input: any): void;
}
export class Main {
  static aliases: any[];
  static parse: boolean;
  static parserOptions: {};
  static run(argv: any, options: any): any;
  static strict: boolean;
  error(input: any, options: any): any;
  exit(code: any): any;
  init(): any;
  log(message: any, args: any): void;
  parse(options: any, argv: any): any;
  run(): any;
  warn(input: any): void;
}
export default class _default {
  static aliases: any[];
  static parse: boolean;
  static parserOptions: {};
  static run(argv: any, opts: any): any;
  static strict: boolean;
  constructor(argv: any, config: any);
  argv: any;
  config: any;
  id: any;
  debug: any;
  error(input: any, options: any): any;
  exit(code: any): any;
  init(): any;
  log(message: any, args: any): void;
  parse(options: any, argv: any): any;
  warn(input: any): void;
}
export namespace flags {
  function boolean(options: any): any;
  function build(defaults: any): any;
  function help(opts: any): any;
  function integer(options: any): any;
  function option(options: any): any;
  function string(options: any): any;
  function version(opts: any): any;
}
export function run(argv: any, options: any): any;
