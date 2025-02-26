/*import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VoteForm.css';

const VoteForm = ({ refreshLeaderboard }) => {
  const [participantId, setParticipantId] = useState('');
  const [voterId, setVoterId] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leaderboard/vote', { participantId, voterId, score });
      refreshLeaderboard();  // Refresh leaderboard after voting
      setParticipantId('');
      setVoterId('');
      setScore('');
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <form className="vote-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Participant ID" 
        value={participantId} 
        onChange={(e) => setParticipantId(e.target.value)}
        required 
      />
      <input 
        type="text" 
        placeholder="Your Voter ID" 
        value={voterId} 
        onChange={(e) => setVoterId(e.target.value)}
        required 
      />
      <input 
        type="number" 
        placeholder="Score" 
        value={score} 
        onChange={(e) => setScore(e.target.value)}
        required 
      />
      <button type="submit">Vote</button>
    </form>
  );
};

export default VoteForm;
*/
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function VoteForm() {
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState("");
    const [score, setScore] = useState(10); // Default vote value

    // Fetch leaderboard on load
    useEffect(() => {
        socket.on("leaderboardUpdate", (data) => {
            setParticipants(data);
        });

        return () => socket.off("leaderboardUpdate");
    }, []);

    // Handle voting
    const handleVote = async () => {
        if (!selectedParticipant) {
            alert("Please select a participant!");
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/leaderboard/vote", {
                participantId: selectedParticipant,
                score: parseInt(score, 10),
            });
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    return (
        <div>
            <h2>Vote for a Participant</h2>
            <select onChange={(e) => setSelectedParticipant(e.target.value)}>
                <option value="">-- Select --</option>
                {participants.map((p) => (
                    <option key={p._id} value={p._id}>
                        {p.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="1"
                max="100"
            />
            <button onClick={handleVote}>Vote</button>
        </div>
    );
}

export default VoteForm;

