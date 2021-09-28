const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");



const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI|| "mongodb://localhost/budget", {
  useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}).then(() => {
  console.info("MongoDB Client 🏃🏾‍♂️");
})
.catch((err) => {
  console.error("Error starting MongoDB Client", err.message);

  process.exit(1);
});

// routes
app.use(require("./routes/api.js"));

app.listen(process.env.PORT || 5000, () => {
  console.log(`App running!`);
});