# Self Hosting


## Using git
To clone and self host the Remote Control server, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/DinoscapeProgramming/Remote-Control

# Go into the repository
$ cd Remote-Control/server

# Install dependencies
$ npm install

# Start server
$ node . 
```

## Using npm
To install this package, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Using npm
$ npm install express-remote-control

# Using yarn
$ yarn add express-remote-control
```

## Dependencies
The Remote Control server uses several dependencies to be hosted properly. Here is a list of all npm packages one needs.


| Library | Purpose |
| --- | --- |
| express | Creating the web server |
| peer | Creating the WebRTC server |
| socket.io | Creating the WebSocket server
| ejs | Creates ejs pages for express-documentation |
| express-documentation | Creating the docs site |
| express-rate-limit | Limiting traffic to the feedback api |
| crossnote | Creating the help page |