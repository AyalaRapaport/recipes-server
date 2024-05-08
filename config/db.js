import { default as mongoose } from "mongoose";
mongoose.connect(process.env.DB_URL)
  .then(() => console.log('mongo db connected'))
  .catch(err => console.log("error"+err.message));