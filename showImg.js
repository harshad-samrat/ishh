const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const MONGO_URL =
  "mongodb+srv://mrsilent759:mrSilent75969143@cluster0.iq6vvgp.mongodb.net/mydatabase?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log("✅ Connected");

    const doc = await mongoose.connection.db
      .collection("memories")
      .findOne({ note: "nothing" }); // Search by note

    if (doc && doc.image && doc.image.data) {
      const buffer = Buffer.from(doc.image.data);
      const filePath = path.join(__dirname, "extracted_image.jpg");

      fs.writeFileSync(filePath, buffer);
      console.log("✅ Image saved as extracted_image.jpg");

      exec(`start ${filePath}`); // Auto open on Windows
    } else {
      console.log("❌ No image found with note: 'nothing'");
    }

    mongoose.disconnect();
  })
  .catch((err) => console.error(err));
