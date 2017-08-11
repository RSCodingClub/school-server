# School (Student Council) Server
**Index**
- [About](#about)
- [Usage](#usage)
  - [Installation](#installation)
  - [Running](#running)
    - [Environment](#environment)

## About
This repository is dedicated to a more sophisticated version of [rscodingclub/STUCO-Backend](https://rscodingclub/STUCO-Backend).  The previous version has been refactored several times and is at a stable point (relatively).  However the code styles and methods of implementing were fated for failure from the beginning.  The goal of this repository is to recreate the functionality of the other project whilst improving the structuring and methodology behind the scenes.

This means
* We will be using GraphQL instead of request
* All features will be async if possible out of the box
* Actual code written will be at a minimum
* No pointless files
 * The other repo used this for a hierarchy of routes and resulted in needing to change multiple files to add a single router
* Logging will be simple and only output to stdout.  
  This will most likely use [npmlog](https://github.com/npm/npmlog)
* Redis will be used for application storage or at least items likely to change
  * Events
    * Attendees on events will change often
  * Leaderboard
    * Places on the leaderboard will change often
  * Bug reports
    * Bug reports are only necessary long enough to export them to an issue tracker
  * Google OAuth2 Certificates
    * We used a cache library to store in memory certificates and remove them after their expiration.  This is the exact intention behind Redis, and we would be missing a huge opportunity by not using it for this.
* A database will be used to hold long term information
  * Users
  * Badges *Image for badge storing is unknown*
* Permissions will be deeply engrained into GraphQL authorization
  * No more group base authorization.  Each request or mutation will have a permission node associated with it.  For example, to change a users name `user.name.update` & `me.name.update` would be checked.  *Note: these are mock permissions and just an idea and may not be the final implementation*
    * Groups may still be a necessity for easy recognition of permissions as a whole but each user will have their own individual permissions
  * Another alternative is, each field is treated much like a unix file system.  This means each property has a read, write, and execute flag for each potential user.  These being: self, group, and world.  Self is the user or the creator of the object, for users this is that user.  Group is the primary need here, if we want to allow users to edit their own information that is easy with the self flag, but to allow other select users as well requires this group flag.  This over complicates things a lot, so it is unlikely this will be the entire implementation if at all.  World being the last potential user is anyone not in the group or the user themself.
* Proper authentication
  * Passport will be used correctly with the cached certificates.
  * Match specs for HTTP authorization
    * Correct header and header formats on requests
    * Correct error codes for authentication errors

With a long todo-list it makes sense to just start fresh rather than piece by piece rollover the old system with new bits.  The long list above is just a star and will most likely change, but it serves as a staring place and reference for the direction this project will be taking.

## Usage

### Installation
Installation is simple if you want to use the latest cutting edge version.  Just clone the repo and viola.
```bash
git clone git@github.com:itotallyrock/school-server.git
```
After installation, you need to install dependencies by running
```bash
npm install
```

This is the minimum to run the app itself, but to actually use it, you will need to have a Redis and MongoDB server running locally or internet accessible.  I cannot outline the installation of these here.  For more information on Redis [click here](https://redis.io/) for information on MongoDB [click here](https://www.mongodb.com/).
### Running
When all the dependencies have been acquired you will need to set some environment variables.  Listed [below](#environment); afterwards, you may start the app simply by using NPM, this will automatically run the correct file.
```bash
npm run start
```
#### Environment
##### PORT
The port the webserver will listen on.

Defaults to: `3000`
##### GOOGLE_AUD
Google JWT Audience for your application.
##### GOOGLE_SUITE_DOMAIN
Google Suite Domain name to check with.  For exmaple if you only want accounts on the domain school.edu use `school.edu`
##### MONGODB_HOST
The host the current MongoDB server running on.

Defaults to: `127.0.0.1`
##### MONGODB_PORT
The port to connect to MongoDB through.

Defaults to: `27017`
##### MONGODB_DB
The database to store and retrieve information from.

Defaults to: `school-server`
##### MONGODB_PASSWORD
The password to authenticate the user `school-server-mongoose`.  This means to correctly use MongoDB you will need to create a database user for the database specified by `MONGODB_DB`.
##### REDIS_HOST
The host the current Redis server running on.

Defaults to: `127.0.0.1`
##### REDIS_PORT
The port to connect to Redis through.

Defaults to: `6379`
##### REDIS_DB
The database to store and retrieve information from.

Defaults to: `0`
##### REDIS_PASSWORD
The password to authorize the use of Redis commands.
