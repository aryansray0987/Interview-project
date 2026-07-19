import 'dotenv/config'
import mongoose from 'mongoose';
import { dbName } from './DBname.js'

const connectToDB= async ()=> {
  try {
    const mongoDbInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);

    console.log(`MongoDB Connected :::: DB_Host-~~~~~ ${mongoDbInstance.connection.host}`);
  } catch (err) {
      console.log(`DB connection Error: ${err}`);
      process.exit(1)// kill all the process and stop the program
  }
}

export { connectToDB };
