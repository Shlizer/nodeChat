module.exports = function ScreenBuffer(process) {
    const argv = require('minimist')(process.argv.slice(2));

    return {
        logDir: argv.logDir || '', // directory to log data
        port: argv.p || argv.port || '', // port where to run ws
        verbal: argv.v || argv.verbal, // verbal mode (show everything what is happening
    }
}
