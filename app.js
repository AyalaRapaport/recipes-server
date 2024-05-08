import express, { json, urlencoded } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRouter from './routes/user.route.js';
import categoryRouter from './routes/category.route.js';
import { pageNotFound, serverNotFound } from './middlewares/handleErrors.js';
// import recipeRouter from './routes/recipe.route.js';
// import dotenv from 'dotenv';
// dotenv.config();
import 'dotenv/config';
import './config/db.js';


const app = express();

app.use(json()); 
app.use(urlencoded({ extended: true }));
app.use(morgan("dev")); 
// app.use(cors({origin:'http:// localhost:4200'})); 
app.use(cors());

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
// app.use("/recipes",recipeRouter);
app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
