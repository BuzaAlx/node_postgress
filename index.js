const express = require("express");
const userRouter = require("./routes/user.routes");
const followerRouter = require("./routes/follower.routes");
const PORT = process.env.NODE_PORT || 8080;

const app = express();

app.use(express.json());

app.use("/api", userRouter);
app.use("/api", followerRouter);

app.listen(PORT, () => console.log("server run on 8080"));
