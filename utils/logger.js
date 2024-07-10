const fs = require('fs')
const pretty = require('pino-pretty')

class Logger{
  #prettyStream
  pino_http
  pino
  #logStream

  constructor(){
    this.#setLogstream()
    this.#setprettyStream()
    this.pino_http = require('pino-http')(process.env.npm_lifecycle_event != 'test' ? this.#prettyStream: this.#logStream)
    this.pino = require('pino')(process.env.npm_lifecycle_envet !== 'test'? this.#prettyStream: this.#logStream)
  }

  #setLogstream(){
    this.#logStream = fs.createWriteStream(`logs/${new Date().toLocaleString().split('/')
    .join('-').split(':').join('_')}__${process.env.npm_lifecycle_event !== 'test' 
        ? "PRODUCTION": "TESTING"}.log`, { flags: 'a' });
  }

  #setprettyStream(){
    this.#prettyStream = pretty()
    this.#prettyStream.pipe(this.#logStream)
  }
}

module.exports.logger = new Logger()