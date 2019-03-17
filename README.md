archetype
=========

Project archetypes using jsonnet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/archetype.svg)](https://npmjs.org/package/archetype)
[![CircleCI](https://circleci.com/gh/akarasulu/archetype/tree/master.svg?style=shield)](https://circleci.com/gh/akarasulu/archetype/tree/master)
[![Codecov](https://codecov.io/gh/akarasulu/archetype/branch/master/graph/badge.svg)](https://codecov.io/gh/akarasulu/archetype)
[![Downloads/week](https://img.shields.io/npm/dw/archetype.svg)](https://npmjs.org/package/archetype)
[![License](https://img.shields.io/npm/l/archetype.svg)](https://github.com/akarasulu/archetype/blob/master/package.json)

# Itch to scratch

Got tired of doing the same shit over and over again to setup a new project so I created this super simple project templating system for different kinds of JavaScript projects.

I tried Yeoman but it always gave me more than I needed and was more of a hassle than it was worth. Plus I think I can make it super simple to create new project configurations (archetypes) thanks to the power of jsonnet for configuration files.

I want to keep this as simple as possible.

## Build Requirements

* Git
* Node
* Jsonnet

## Organization / Design

Some points as they come to mind: no specific organization.

### Precedence of Settings

Layered settings are used with specificity driving overriding power. Huhh?

Some values are personal user settings like your author name. You usually use the same author value most of the time. In special cases you can decide to use an override for the specific project. So we can have at least 3 levels:

1. Archetype Defaults: Default values used by the archetype when no other values for the configuration parameter are provided.
2. User Settings: Settings in the user's `personal-settings.jsonnet` file the `~/.archetype` directory.
3. Project Overrides: Overrides provided when creating a project instance from an archetype.

Specificity increases as numbers increase, and so does overriding power.

### Jsonnet Does the Work

Most of the configuration is done by the configuration file itself. Jsonnet handles pretty much everything for us. Add to that inheritence and the power of mixins and we have everything we could ask for.

## Development

Use npm link and unlink to setup the test archetype command. The bin attribute sets up the archetype command to be executed.

## Switch Parameters and Behavior

> The git_type parameter might not be necessary if we can autodetect it. I think we can do that from the repository attribute value URL itself and/or from a simple test to the REST service.

## Arguments

1. Required archetype identifier
2. Required project name
3. Optional vararg list of value overrides use JSON Path dot notation

Examples:

```shell
archetype node-ts-cli mycli
archetype node-ts mywebsite author=jackblack description="crazy shit"
```

## Mixins

These are additive union based merges of attributes and other things like link or script tags for an index.html for example. The other files make sense too on their own right. We can merge in packages.
