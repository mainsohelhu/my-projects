const mongoose = require('mongoose');

// Compass wala working link (Password: sohel)
const workingURI = "mongodb+srv://@cluster0.hitpkzn.mongodb.net/?appName=Cluster0";

console.log("--- 🚀 Starting Final Connection Test ---");

mongoose.connect(workingURI)
  .then(() => {
    console.log("*****************************************");
    console.log("✅ JAI HO! Backend is now connected!");
    console.log("Duniya ki koi taqat ab ise nahi rok sakti.");
    console.log("*****************************************");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Abhi bhi error hai? Dekho kya bol raha hai:");
    console.error(err.message);
    process.exit(1);
  });