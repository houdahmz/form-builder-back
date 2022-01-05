const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.page = require("./page.model.js")(mongoose);
db.form = require("./form.model.js")(mongoose);
db.field = require("./field.model.js")(mongoose);

module.exports = db;