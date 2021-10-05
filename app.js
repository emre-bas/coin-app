// Modules
express = require("express");
mongoose = require("mongoose");
require('dotenv').config();
env = process.env;

// DB & Interfaces
db = require("./src/db");
api = require("./src/api");
ui = require("./src/ui");

// App
const app = express();
app.use(ui.router);
app.use("/api",api.router);

// Run
const mongooseOptions = {}; //{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify:false, useCreateIndex:true}
mongoose.connect(env.DB, mongooseOptions)
.then(()=>{
	console.log(`>>> DataBase Connected! 🟢`);
	app.listen(env.PORT, ()=>console.log(`>>> Server running on port:${env.PORT} 🏃🏃🏃`));
}).catch((err)=>{
	console.log(`>>> Could not connect to the DataBase! 🔴`, err);
})