import express from "express";
import userRoutes from "./users/index.js";
import pollRoutes from "./poll/index.js";
import voteRoutes from "./vote/index.js";
import { DB } from "./database/connection.js";
import * as dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(express.json())
app.use(morgan('dev'));

app.use('/user', userRoutes);
app.use('/poll', pollRoutes);
app.use('/vote', voteRoutes);

const PORT = 3000;
app.listen(PORT, ()=> {
  console.log(`Server started on port: ${PORT}`);
})