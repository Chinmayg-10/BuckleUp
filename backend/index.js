const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const routes = require("./routes/todo");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(cors({
  origin: "https://buckleup.onrender.com",
  credentials: true
}));

app.use(express.static(path.join(__dirname, "../public")));

app.use(userRoutes);
app.use(routes);

app.get("/healthy", (req, res) => res.send("I am Healthy"));

//  start writing your routes here
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public/notFound.html"));
});

// app.get('/home',  (req, res) => {
//     // Implement logic for getting todos for a user
//     res.sendFile(path.join(__dirname,"../../public/landing.html"));
// });

app.listen(port, () => {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => {
      console.log(`server is running at http://localhost:${port}`);
    })
    .catch((err) => {
      console.log(`error in connecting to mongo db \n ${err}`);
    });
});
