# concurrently-await

[![GitHub release](https://img.shields.io/github/release/bameyrick/concurrently-await.svg)](https://github.com/bameyrick/concurrently-await/releases)
[![Build Status](https://travis-ci.com/bameyrick/concurrently-await.svg?branch=master)](https://travis-ci.com/bameyrick/concurrently-await)

Run multiple commands concurrently with the option to supply a condition to pass before running the next command.

**Table of contents**

- [concurrently-await](#concurrently-await)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Conditions](#conditions)
      - [Condition types](#condition-types)
  - [Options](#options)
    - [names](#names)
    - [name-seperator](#name-seperator)
    - [wait-seperator](#wait-seperator)

## Installation

```
npm i -D concurrently-await
```

or

```
yarn -D concurrently-await
```

## Usage

Remember to surround separate commands with quotes:

```
concurrently-await "command1 arg await --<condition> value" "command2 arg await --<condition> value"
```

In package.json, escape quotes:

```json
"start" : "concurrently-await \"command1 arg await --<condition> value\" \"command2 arg await --<condition> value\""
```

### Conditions

Conditions are optional, but must be seperated from the command and its arguments by the [wait seperator](#wait-seperator)

#### Condition types

| Type     | Description                                                                                                        | Value type | Example                        |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------ |
| delay    | Wait for a given number number of milliseconds before executing the next command                                   | number     | `--delay 500`                  |
| quiet    | Wait until the command provided stops logging for a given number of milliseconds before executing the next command | number     | `--quiet 3000`                 |
| includes | Wait until the command logs a message that includes the provided value (case insensitive)                          | string     | `--includes done`              |
| matches  | Wait until the command logs a message that exactly matches the provided value                                      | string     | `--matches Finished Compiling` |

## Options

- [-n, --names](#names)
- [-ns, --name-seperator](#name-seperator)
- [-ws, --wait-seperator](#wait-seperator)
- -v, --version - Show version
- -h, --help - Show help

### names

You can provide a list of custom names to be used in prefix template for logging, otherwise the prefix will just be the index of the command.

```
concurrently-await --names ui,server "command1 arg await --<condition> value" "command2 arg await --<condition> value"
```

### name-seperator

The character to split [names](#names) on, the default is `,`. Example usage:

```
concurrently-await --names ui|server --name-seperator | "command1 arg await --<condition> value" "command2 arg await --<condition> value"
```

### wait-seperator

The default wait seperator is `await` but this may conflict with your command. You can set your own wait seperator by setting the wait seperator option:

```
concurrently-await --wait-seperator ~> "command1 arg ~> --<condition> value" "command2 arg ~> --<condition> value"
```
