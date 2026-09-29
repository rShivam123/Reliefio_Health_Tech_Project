// const dns = require("dns")
// dns.setServers([
//   '1.1.1.1',
//   '8.8.8.8'
// ])

import dotenv from "dotenv";
dotenv.config();


import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
connectDB();
    
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



