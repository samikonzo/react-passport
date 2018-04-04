const gulp = require('gulp')
const exec = require('child_process').exec
const config = require('./etc/config.json')
const mongo = config.mongo
const mongoPath = mongo.path
const l = console.log



function runCommand(command) {
  return function (cb) {
    exec(command, function (err, stdout, stderr) {
      l('command : ', command)
      l('stdout : ', stdout);
      l('stderr : ', stderr);

      if (err !== null) {
        l('exec error: ' + err);
      }

      if (cb) cb()
    });
  }
}
  
var mongodStartPath = `${mongoPath}mongod -f ${mongoPath}mongod.conf`
var mongodStopPath = `${mongoPath}mongo --eval "db.getSiblingDB('admin').shutdownServer()"`


gulp.task('mongodStart', runCommand(mongodStartPath))
gulp.task('mongodStop', runCommand(mongodStopPath))
gulp.task('default', ['mongodStart'])