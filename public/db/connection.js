'USER STRICT'

const connection = require(__base+'/../configuration/config').db

const mongoose = require('mongoose')
mongoose.createConnection(connection.uri, connection.options)

mongoose.Promise = require('bluebird')