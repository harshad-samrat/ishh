const express = require("express");
const app = express();
const path = require("path");
const PORT = 8080;
const expressLayouts = require("express-ejs-layouts");
const MONGO_URL =
  "mongodb+srv://mrsilent759:mrSilent75969143@cluster0.iq6vvgp.mongodb.net/mydatabase?retryWrites=true&w=majority";
const sisterMessage = require("./models/sister");

const Memory = require("./models/memory");
const multer = require("multer");

// app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout/boilerplate");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));

//===================== DATABASE CONNECTION ======================
const mongoose = require("mongoose");
const SlashSecret = require("./models/secret");
const ReelAnswer = require("./models/reel");
const Feedback = require("./models/feedback");
const { title } = require("process");
mongoose
  .connect(MONGO_URL, {
    tls: true,
    tlsAllowInvalidCertificates: true, // ← Temporary fix
    // tlsAllowInvalidHostnames: true     // Uncomment if needed
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ====================== ROUTES ======================
// Setup multer for single image
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.redirect("/ishh");
});

app.get("/ishh", (req, res) => {
  res.render("anaya", {
    title: "Hey My Princess! 🎀",
    currentPage: "anaya",
  });
});

app.get("/ishh/me", (req, res) => {
  res.render("me", {
    title: "Choose One Door, Princess 👑",
    currentPage: "me",
  });
});

app.get("/ishh/me/audio", async (req, res) => {
  const messageCount = await sisterMessage.countDocuments(); // Better than exists({})

  res.render("meAudio", {
    title: "My Sweet Princess 💖",
    currentPage: "meAudio",
    hasSubmittedMessage: messageCount > 0,
  });
});

app.post("/ishh/msgtome", (req, res) => {
  const message = req.body.message;
  console.log("Message from sister:", message);
  let newMessage = new sisterMessage({
    content: message,
  });
  newMessage.save();
  // Save to database if you want
  res.redirect("/ishh/me/audio"); // or next page
});

// Next Page - Only allow if she has sent at least one message
// Final Secret / Flip Cards Page
app.get("/ishh/secret", async (req, res) => {
  const messageCount = await SlashSecret.countDocuments();

  res.render("secret", {
    title: "Secret IDs 👀",
    currentPage: "secret",
    hasSubmittedMessage: messageCount > 0, // ← This was missing
  });
});

app.post("/ishh/msgtome/secret", (req, res) => {
  const message = req.body.message;
  console.log("Message from sister:", message);
  let newMessage = new SlashSecret({
    content: message,
  });
  newMessage.save();
  res.redirect("/ishh/secret");
});

// Render Reels Page
app.get("/ishh/reels", async (req, res) => {
  try {
    const answers = await ReelAnswer.find({});

    res.render("reel", {
      title: "Special Reels for My Princess 💖",
      currentPage: "reel",
      hasAnswered: answers.length > 0,
    });
  } catch (err) {
    console.error("Error fetching reel answers:", err);

    // Still render the page,   but with safe fallback
    res.render("reel", {
      title: "Special Reels for My Princess 💖",
      currentPage: "reel",
      hasAnswered: false, // safe default
    });
  }
});

// Handle Answer Submission
app.post("/ishh/reels/answer", async (req, res) => {
  try {
    const { reelId, answer } = req.body;

    if (!reelId || !answer) {
      return res.status(400).send("Missing data");
    }

    const newAnswer = new ReelAnswer({
      reelId: parseInt(reelId),
      answer: answer.trim(),
    });

    await newAnswer.save();
    console.log(`Answer saved for Reel ${reelId}`);

    res.json({ success: true, message: "💕 Jawab save ho gaya behen!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.get("/ishh/askme", (req, res) => {
  res.render("askme", {
    title: "Ask Me Anything, Princess! 🌟",
    currentPage: "askme",
  });
});

// Render Page
app.get("/ishh/feedback", (req, res) => {
  res.render("feedback", {
    title: "What Do You Think About Me? 💖",
    currentPage: "feedback",
  });
});

app.get("/ishh/myfeeling", (req, res) => {
  res.render("myfeeling", {
    title: "My Feelings for You, Princess! 💕",
    currentPage: "myfeeling",
  });
});

// Handle Submission
app.post("/ishh/feedback", async (req, res) => {
  try {
    console.log("📥 Received Feedback Data:", req.body); // ← For debugging

    const newFeedback = new Feedback(req.body);
    const savedFeedback = await newFeedback.save();

    console.log("✅ Feedback Saved Successfully! ID:", savedFeedback._id);
    res.render("pic", {
      title: "Thank You for Your Feedback! 🌟",
      currentPage: "pic",
    }); // or send success message
  } catch (error) {
    console.error("❌ Feedback Save Error:", error);
    res.status(500).send(`
      <h2 style="color:red; text-align:center; margin-top:50px;">
        Something went wrong 💔<br><br>
        Error: ${error.message}
      </h2>
    `);
  }
});

app.get("/ishh/seeme", (req, res) => {
  res.render("seeme", {
    title: "See Me, Princess! 👀",
    currentPage: "seeme",
  });
});
app.post("/ishh/upload-memory", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No image uploaded");
    }

    const newMemory = new Memory({
      title: req.body.title || "My Memory",
      note: req.body.note || "",
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await newMemory.save();
    res.redirect("/ishh/seeme?success=true"); // Redirect back to the page or show success message
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving image");
  }
});

// ==================== VIEW IMAGE ROUTE ====================
// Display Single Image
//visit : http://localhost:8080/ishh/show-memory/<paste id>
app.get("/ishh/memory-image/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory || !memory.image || !memory.image.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", memory.image.contentType);
    res.send(memory.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading image");
  }
});
app.get("/ishh/show-memory/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    res.render("show-image", {
      title: "Show Memory",
      currentPage: "show-image",
      memory,
    });
  } catch (err) {
    res.send("Error loading memory");
  }
});

app.get("/ishh/thought", (req, res) => {
  res.render("bhaiManogi", {
    title: "Will You Be My Sister, Princess? 💖",
    currentPage: "bhaiManogi     ",
  });
});
// Save Yes Response
app.post("/ishh/bhai-accept", async (req, res) => {
  try {
    const newMsg = new sisterMessage({
      content: "Ishh ne mujhe apna sage bhai maan liya 💖",
      type: "bhai-accept",
    });
    await newMsg.save();
    console.log("✅ Sister accepted as brother");
  } catch (e) {}
  res.render("thankyou", {
    title: "Thank You, Princess! 🌟",
    currentPage: "thankyou",
  });
});

app.get("/ishh/thankyou", (req, res) => {
  res.render("thankyou", {
    title: "Thank You, Princess! 🌟",
    currentPage: "thankyou",
  });
});

app.post("/ishh/final-msg", async (req, res) => {
  const { message } = req.body;
  if (message) {
    const newMsg = new sisterMessage({ content: message });
    await newMsg.save();
  }
  res.redirect("/ishh/thankyou");
});

app.get("/ishh/end", (req, res) => {
  res.render("end", {
    title: "Our Journey Begins, Princess! 💖",
    currentPage: "end",
  });
});
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/ishh/effort", (req, res) => {
  res.render("effort", {
    title: "Efforts for My Princess 💕",
    currentPage: "effort",
  });
});
app.get("/ishh/endwithnote", (req, res) => {
  res.render("endwithnote", {
    title: "Our Journey Begins, Princess! 💖",
    currentPage: "endwithnote",
  });
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
