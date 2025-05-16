import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
}

main()
  .then(() => {
    console.log("Connected to the db");
  })
  .catch((err) => console.log(err));
