<p align="center">
  <a href="https://DinoscapeProgramming.github.io/Remote-Control">
    <picture>
      <source height="125" media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/DinoscapeProgramming/Remote-Control/master/docs/static/logo-dark.svg">
      <img height="125" alt="Remote Control" src="https://raw.githubusercontent.com/DinoscapeProgramming/Remote-Control/master/docs/static/logo.svg">
    </picture>
  </a>
  <br>
  <a href="https://www.npmjs.com/package/electron-remote-control">
    <img src="https://badge.fury.io/js/electron-remote-control.svg">
  </a>
  <a href="https://opensource.org/license/apache-2-0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-brightgreen.svg">
  </a>
  <a href="https://github.com/DinoscapeProgramming/Remote-Control/releases/tag/v1.0.0">
    <img src="https://img.shields.io/badge/Release-1.0.0-brightgreen.svg">
  </a>
</p>
<p align="center">
  <em><b>Remote Control</b> is a minimal <b>remote desktop app</b> built on top of <a href="http://electron.atom.io" target="_blank">Electron</a>. Designed to <b>ease</b> things up for <b>better and faster</b> technical support with low effort in mind.</em>
</p>

---

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://raw.githubusercontent.com/DinoscapeProgramming/Remote-Control/master/docs/static/demonstration.gif)

_<h6>Feel free to give us a ⭐ on our [GitHub repository](https://github.com/DinoscapeProgramming/Remote-Control)!</h6>_

## Key Features

* Instant Connection
* Control over connected devices
  - Be able to control the keyboard and mouse of your connected devices.
* Device History
  - Connect to known devices with one click.
* File Sharing across multiple devices
* Smart Bar with commands
  - Navigate faster by typing commands in the upper smart bar.
* Device Monitoring for CPU, Memory and WLAN Usage
* Script Execution with Node.js Integration
* Script Store for non-programmers
* Dark/Light Mode
* Feedback Writing and Viewing
* Full screen mode
  - Work distraction free.
* Auto Launch
  - Remote Control launches automatically after you start your device.
* Auto Update
  - Remote Control automatically updates when new updates are released.
* Custom WebRTC Server
  - Configure Remote Control in order to use your custom WebRTC server.
* Debug Mode
  - Activate debug mode to help us fix issues faster.
* Cross platform
  - Windows, macOS and Linux ready.
* In-built Tutorial Page

## How To Use

To install this package, ensure that [Node.js](https://nodejs.org/en/download/) (which includes [npm](http://npmjs.com)) is installed on your system. You can use either `npm` or `yarn` to install the package:

### Installation

Using npm:

```bash
# Initialize your project and install Remote Control
$ npm init -y
$ npm install electron-remote-control
```

Using yarn:

```bash
# Initialize your project and install Remote Control
$ yarn init -y
$ yarn add electron-remote-control
```

### Programmatic usage

#### Move project
Moving the project is automatically done when using other methods.

```js
const { moveProject } = require("electron-remote-control");

moveProject()
  .then(({ exitCode, stdout, stderr }) => {
    // handle results
  })
  .catch(({ exitCode, stdout, stderr }) => {
    // handle error
  });
```

#### Building your own client
To build and open your own installable, you'll need [Python 3](https://www.python.org/downloads/) installed on your computer.

During the creation of a new client, all running instances of the application are closed, the application is silently uninstalled, the previous build folder is removed, and a new build is silently created, installed, and launched, all without any user interaction required.

```js
const { buildClient } = require("electron-remote-control");

buildClient()
  .then(({ exitCode, stdout, stderr }) => {
    // handle results
  })
  .catch(({ exitCode, stdout, stderr }) => {
    // handle error
  });
```

#### Hosting your own server
The Remote Control server listens on port `:3000`.

```js
const { hostServer } = require("electron-remote-control");

hostServer()
  .then(({ exitCode, stdout, stderr }) => {
    // handle results
  })
  .catch(({ exitCode, stdout, stderr }) => {
    // handle error
  });
```

For more information, including deprecated methods, check our [full documentation](https://remote-control-cnp2.onrender.com/docs).

### Command Line Interface (CLI)

#### Commands in the Root Directory

| **Command**    | **Bin (npx)**                  | **Script (npm run)**               |
|----------------|---------------------------------|------------------------------------|
| Test           | `$ npx test` / `$ npx t`        | `$ npm run test` / `$ npm run t`   |
| Move Project   | `$ npx moveProject` / `$ npx mp`| `$ npm run moveProject` / `$ npm run mp` |
| Build Client   | `$ npx buildClient` / `$ npx bc`| `$ npm run buildClient` / `$ npm run bc` |
| Host Server    | `$ npx hostServer` / `$ npx hs` | `$ npm run hostServer` / `$ npm run hs`  |

#### Commands in the Client Directory

Change to the client directory:

```bash
$ cd client
```

| **Command**        | **Bin (npx)**                        | **Script (npm run)**               |
|--------------------|--------------------------------------|------------------------------------|
| Test               | `$ npx test` / `$ npx t`             | `$ npm run test` / `$ npm run t`   |
| Build for All (MWL) | `$ npx build -mwl` / `$ npx b -mwl`  | `$ npm run buildMWL` / `$ npm run bmwl` |
| Build for Windows  | `$ npx build --win` / `$ npx b --win` | `$ npm run buildWindows` / `$ npm run bw` |
| Build for macOS    | `$ npx build --mac` / `$ npx b --mac` | `$ npm run buildMacOS` / `$ npm run bm` |
| Build for Linux    | `$ npx build --linux` / `$ npx b --linux`| `$ npm run buildLinux` / `$ npm run bl` |

> **Note**: macOS builds can only be generated on macOS systems.

#### Commands in the Server Directory

Change to the server directory:

```bash
$ cd server
```

| **Command**    | **Bin (npx)**                | **Script (npm run)**               |
|----------------|------------------------------|------------------------------------|
| Test           | `$ npx test` / `$ npx t`      | `$ npm run test` / `$ npm run t`   |
| Host Server    | `$ npx host` / `$ npx h`      | `$ npm run host` / `$ npm run h`   |

> **Note**: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or run `node` from the command prompt.


## Download

You can [download the latest installable](https://github.com/DinoscapeProgramming/Remote-Control/releases/tag/v1.0.0) version of Remote Control for Windows, macOS and Linux.

## Credits

This software uses the following open source packages:

- [Node.js](https://nodejs.org)
- [Electron](https://electronjs.org)
- [electron-builder](https://www.electron.build)
- [PeerServer](https://github.com/peers/peerjs-server)
- [@jitsi/robotjs](https://github.com/jitsi/robotjs)
- [socket.io](https://socket.io)
- [socket.io-client](https://socket.io)
- [Express.js](https://github.com/expressjs/express)
- [Express Docs](https://github.com/DinoscapeProgramming/Express-Docs)
- [Crossnote](https://github.com/shd101wyy/crossnote)

## Support
If you find this project useful, consider supporting us on [Patreon](https://www.patreon.com/DinoscapeArmy).

<a href="https://www.patreon.com/DinoscapeArmy">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## You may also like...

- [Express Docs](https://github.com/DinoscapeProgramming/Express-Docs) - An easy-to-use documentation site creator
- [Youtube Offline](https://github.com/DinoscapeProgramming/Youtube-Offline) - A lightweight YouTube video downloader
- [Appify](https://github.com/DinoscapeProgramming/Appify) - A tiny tool that allows you to turn your website into an app
- [Meetings](https://github.com/DinoscapeProgramming/Meetings) - A meetings app with lots of features
- [DinoChess](https://github.com/DinoscapeProgramming/DinoChess) - A chess platform for chess lovers

## License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](https://raw.githubusercontent.com/DinoscapeProgramming/Remote-Control/master/LICENSE) file for more details.

---

> [dinoscape.com](https://dinoscape.com) &nbsp;&middot;&nbsp;
> GitHub [@DinoscapeProgramming](https://github.com/DinoscapeProgramming) &nbsp;&middot;&nbsp;
> Scratch [@Dinoscape](https://scratch.mit.edu/users/Dinoscape)