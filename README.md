one-night-werewolf
======================

A multiuser web game of deception and deduction.

![Screenshot](http://i.imgur.com/B1rRHbY.png)

Front end: React, Redux, Sass, SemanticUI, jQuery, SocketIO.

Back end: Node, Express, Pug, Passport, Mongodb with Mongoose, SocketIO.

Build: Gulp, Browserify, Babel (front end).

Latest version: 0.4.2.

## Installation ##

Install node v6.x.

Install mongodb, have it in your path.

> git clone https://github.com/cozuya/one-night-werewolf.git

> cd one-night-werewolf

> mkdir data logs

> npm i -g gulp

> npm i

## Running in dev mode ##

start mongo:

> mongod

start server:

> npm start

build assets (first time only):

> gulp build

start development task runner:

> gulp

navigate to: http://localhost:8080

You'll most likely need a browser extension such as Chrome's Multilogin to have multiple sessions on the same browser.  No, incognito will not work.

Server side code for the game is contained in routes/socket and code quality is decent.  Code quality of the express and front end ajax stuff is sloppy.. don't judge me too harshly - that wasn't the fun part so bogging through it with some not so DRY code was an easy way to get it done.

## Tests ##

> npm test
