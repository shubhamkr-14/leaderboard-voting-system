const express = require("express");
const router = express.Router();
const Participant = require("../models/Participant");

// Fetch leaderboard
router.get("/", async (req, res) => {
    try {
        const participants = await Participant.find().sort({ score: -1 });
        res.json(participants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cast a vote (Latest vote counts)
router.post("/vote", async (req, res) => {
    try {
        console.log("Incoming Vote Request:", req.body);

        const { participantId, voterId, score } = req.body;

        if (!participantId || !voterId || score === undefined) {
            return res.status(400).json({ error: "Missing participant ID, voter ID, or score" });
        }

        const participant = await Participant.findById(participantId);
        if (!participant) {
            return res.status(404).json({ error: "Participant not found" });
        }

        // Remove previous vote before applying the new vote
        const previousVote = participant.votes.get(voterId);
        if (previousVote !== undefined) {
            participant.score -= previousVote;
        }

        // Apply new vote
        participant.votes.set(voterId, score);
        participant.score += score;

        await participant.save();

        // Fetch latest leaderboard and emit update
        const leaderboard = await Participant.find().sort({ score: -1 });
        req.io.emit("leaderboardUpdate", leaderboard); // Send updated leaderboard to all clients

        res.json({ message: "Vote recorded", participant });
    } catch (error) {
        console.error("Error handling vote:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
