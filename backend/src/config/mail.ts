// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // console.log("EMAIL_USER:", process.env.EMAIL_USER);
// // console.log(
// //   "EMAIL_PASS:",
// //   process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"
// // );

// export default transporter;


import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});


export default transporter;