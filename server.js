// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const app = express();
// const PORT = 3000;
// const USERS_FILE = "users.json";

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

// // Load users from file
// const loadUsers = () => {
//     if (!fs.existsSync(USERS_FILE)) return [];
//     const data = fs.readFileSync(USERS_FILE);
//     return JSON.parse(data);
// };

// // Save users to file
// const saveUsers = (users) => {
//     fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
// };

// // Fetch SpaceX Launches
// app.get("/launches", async (req, res) => {
//     try {
//         const response = await axios.get("https://api.spacexdata.com/v4/launches");
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch SpaceX launches." });
//     }
// });

// // // Get all users
// app.get("/users", (req, res) => {
//     res.json(loadUsers());
// });

// // Register new user
// app.post("/users", (req, res) => {
//     console.log("Received request body:", req.body);
//     const { username, password, email, fullname } = req.body;
//     let users = loadUsers();

//     if (users.find(u => u.username === username)) {
//         return res.status(400).json({ error: "Username already taken!" });
//     }

//     users.push({ username, password, email, fullname });
//     saveUsers(users);
//     res.json({ message: "User registered successfully!" });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });

// server.js - Backend Code
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT;
const USERS_FILE = "users.json";
const SECRET_KEY = "your_secret_key";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Load users from file
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};
// Fetch SpaceX Launches
app.get("/launches", async (req, res) => {
  try {
    const response = await axios.get("https://api.spacexdata.com/v4/launches");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch SpaceX launches." });
  }
});

// // Get all users
app.get("/users", (req, res) => {
  res.json(loadUsers());
});

// Register new user
app.post("/users", (req, res) => {
  console.log("Received request body:", req.body);
  const { username, password, email, fullname } = req.body;
  let users = loadUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username already taken!" });
  }

  users.push({ username, password, email, fullname });
  saveUsers(users);
  res.json({ message: "User registered successfully!" });
});

// Register User with Validation
// app.post("/register", async (req, res) => {
//     const { username, password, email, fullname } = req.body;
//     const users = loadUsers();

//     if (users.find(u => u.username === username)) {
//         return res.status(400).json({ error: "Username already taken!" });
//     }

//     if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
//         return res.status(400).json({ error: "Invalid email format!" });
//     }

//     if (password.length < 6) {
//         return res.status(400).json({ error: "Password must be at least 6 characters long!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     users.push({ username, password: hashedPassword, email, fullname, favorites: [] });
//     saveUsers(users);
//     console.log(res.body)
//     res.json({ message: "User registered successfully!" });
// });

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    console.log(bcrypt.compare(password, user.password));
    return res.status(400).json({ error: "Invalid credentials!" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, username });
});

// Add Favorite Launch
app.post("/favorites", (req, res) => {
  const { username, launchId } = req.body;
//   let users = loadUsers();
//   let user = users.find((u) => u.username === username);
  const users = loadUsers();
  const userIndex = users.findIndex((u) => u.username === username);

  if (!userIndex) return res.status(404).json({ error: "User not found!" });

  // Ensure the user's favorites array exists
  if (!users[userIndex].favorites) {
    users[userIndex].favorites = [];
  }

    // Add the launch to favorites if not already present
    if (!users[userIndex].favorites.includes(launchId)) {
        users[userIndex].favorites.push(launchId);
        saveUsers(users); // Save back to users.json
        console.log("Launch added to favorites:", launchId);
        return res.json({ message: "Launch added to favorites!" });
    } else {
        return res.json({ message: "Launch already in favorites." });
    }
});

// Get User Favorites
app.get("/favorites/:username", (req, res) => {
  const { username } = req.params;
  const users = loadUsers();
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ error: "User not found!" });
  res.json(user.favorites);
});

app.post("/favorites/remove", (req, res) => {
    const { username, launchId } = req.body;
    const users = loadUsers();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found!" });
    }

    // Remove the selected launch from favorites
    users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== launchId);
    saveUsers(users); // Save updated favorites

    res.json({ message: "Launch removed from favorites!" });
});


app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
