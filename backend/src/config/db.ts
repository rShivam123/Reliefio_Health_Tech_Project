
import mongoose from "mongoose";

const dns = require("dns")
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};
console.log("Mongo URI exists:", !!process.env.MONGODB_URI);
console.log(
  "Mongo host:",
  process.env.MONGODB_URI?.split("@")[1]?.split("/")[0]
);

export default connectDB;


// import mongoose from "mongoose";

// const connectDB = async (): Promise<void> => {
//   try {
//     const mongoURI = process.env.MONGODB_URI;

//     console.log(
//       "Mongo URI:",
//       mongoURI?.replace(/\/\/([^:]+):([^@]+)@/, "//$1:*****@")
//     );

//     if (!mongoURI) {
//       throw new Error("MONGODB_URI is not defined");
//     }

//     await mongoose.connect(mongoURI);

//     console.log("MongoDB Connected");
//   } catch (error) {
//     console.error("MongoDB Connection Failed:", error);
//     process.exit(1);
//   }
// };

// export default connectDB;