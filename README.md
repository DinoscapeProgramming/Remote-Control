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
* Cross platform
  - Windows, macOS and Linux ready.
* In-built Tutorial Page

## How To Use

To install this package, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ npm install electron-remote-control
```

### Building your own installable

```js
const moveProject = { buildInstallable, openInstallable } = require("electron-remote-control");

moveProject.then((err, stdout, stderr) => {
  if (err) throw err;
  buildInstallable().then((err, stdout, stderr) => {
    if (err) throw err;
    openInstallable().then((err, stdout, stderr) => {
      if (err) throw err;
      console.log("Successfully built and opened installable");
    });
  });
});
```

### Hosting your own server

```js
const moveProject = { hostServer } = require("electron-remote-control");

moveProject.then((err, stdout, stderr) => {
  if (err) throw err;
  hostServer().then((err, stdout, stderr) => { // logs "Server is now ready on port {PORT}"
    if (err) throw err;
  });
});

```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.
>
> If you're not using Windows, change the ```./node_modules/electron-remote-control/client/package.json``` file accordingly to [this guide](https://www.electron.build/index.html/).


## Download

You can [download](https://github.com/DinoscapeProgramming/Remote-Control/releases/tag/v1.0.1) the latest installable version of Remote Control for Windows, macOS and Linux.

## Credits

This software uses the following open source packages:

- [Electron](https://electronjs.org)
- [electron-builder](https://www.electron.build)
- [Node.js](https://nodejs.org)
- [PeerServer](https://github.com/peers/peerjs-server)
- [@jitsi/robotjs](https://github.com/jitsi/robotjs)
- [socket.io](https://socket.io)
- [socket.io-client](https://socket.io)
- [dotenv](https://github.com/motdotla/dotenv)
- [update-electron-app](https://github.com/electron/update-electron-app)
- [express](https://github.com/expressjs/express)
- [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)
- [body-parser](https://github.com/expressjs/body-parser)
- [Crossnote](https://github.com/shd101wyy/crossnote)

## Support

<a href="https://www.patreon.com/DinoscapeArmy">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## You may also like...

- [Youtube Offline](https://github.com/DinoscapeProgramming/Youtube-Offline) - A lightweight YouTube video downloader
- [Appify](https://github.com/DinoscapeProgramming/Appify) - A tiny tool that allows you to turn your website into an app
- [Meetings](https://github.com/DinoscapeProgramming/Meetings) - A meetings app with lots of features
- [DinoChess](https://github.com/DinoscapeProgramming/DinoChess) - A chess platform for chess lovers

## License

[Apache-2.0](https://raw.githubusercontent.com/DinoscapeProgramming/Remote-Control/master/LICENSE)

---

> [dinoscape.com](https://dinoscape.com) &nbsp;&middot;&nbsp;
> GitHub [@DinoscapeProgramming](https://github.com/DinoscapeProgramming) &nbsp;&middot;&nbsp;
> Scratch [@Dinoscape](https://scratch.mit.edu/users/Dinoscape)