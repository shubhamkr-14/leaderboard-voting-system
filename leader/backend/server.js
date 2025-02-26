const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const leaderboardRoutes = require("./routes/leaderboard");
const Participant = require("./models/Participant");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(express.json());
app.use(cors());

// Attach io to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        seedDatabase();
    })
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/leaderboard", leaderboardRoutes);

// Real-time WebSocket connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send the leaderboard when a user connects
    sendLeaderboard(socket);

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Function to send leaderboard updates to all clients
async function sendLeaderboard(socket = null) {
    try {
        const leaderboard = await Participant.find().sort({ score: -1 });

        if (socket) {
            socket.emit("leaderboardUpdate", leaderboard);
        } else {
            io.emit("leaderboardUpdate", leaderboard);
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error.message);
    }
}

// Seed database with 5 participants (if empty)
async function seedDatabase() {
    const count = await Participant.countDocuments();
    if (count === 0) {
        const participants = [
            { name: "Alice", score: 0, votes: new Map() },
            { name: "Bob", score: 0, votes: new Map() },
            { name: "Charlie", score: 0, votes: new Map() },
            { name: "David", score: 0, votes: new Map() },
            { name: "Eve", score: 0, votes: new Map() },
        ];
        await Participant.insertMany(participants);
        console.log("Database seeded with 5 participants!");
        sendLeaderboard();
    }
}

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
