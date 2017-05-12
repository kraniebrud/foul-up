'USER STRICT'

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/foul_up', {})

mongoose.Promise = require('bluebird')