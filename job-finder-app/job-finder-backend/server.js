require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Job = require('./models/job'); 
const cors = require('cors')
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("✅ mongoDB connected");
})
.catch((err)=>{
    console.log("❌ connection error", err);
})

app.post('/api/jobs', async (req, res) => {
try {
    // 2. Ab 'Job' (Capital) upar wale se match karega
    const newJob = await Job.create(req.body); 
    console.log("DATA SAVED:", newJob);
    res.status(201).json({
      message: "Job Posted Successfully!",
      job: newJob
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({
      count: jobs.length,
      jobs: jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job Delete karne ka raasta
// DELETE Route: Job udaane ke liye
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params; // URL se ID nikaalo
    const deletedJob = await Job.findByIdAndDelete(id); // MongoDB se delete karo

    if (!deletedJob) {
      return res.status(404).json({ message: "Job nahi mili!" });
    }

    res.status(200).json({ message: "Job uda di gayi! 🗑️" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server mein locha hai, delete nahi hua." });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email pehle se hai!" });

    // Password ko hash (encrypt) karo
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User ban gaya! 🚀" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User nahi mila!" });

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Galat password!" });

    // Token banao (Jo browser mein save hoga)
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});