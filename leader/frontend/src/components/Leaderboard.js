import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./Leaderboard.css"; // Import CSS for styling

const socket = io("http://localhost:5000");

const Leaderboard = () => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/leaderboard")
            .then((res) => setParticipants(res.data))
            .catch((err) => console.log("Error fetching leaderboard:", err));

        socket.on("leaderboardUpdate", (updatedLeaderboard) => {
            setParticipants([...updatedLeaderboard]);
        });

        return () => socket.off("leaderboardUpdate");
    }, []);

    return (
        <div className="leaderboard-container">
            <h2 className="title">🏆 Leaderboard</h2>
            <ul className="leaderboard-list">
                {participants.map((p, index) => (
                    <li 
                        key={p._id} 
                        className={`leaderboard-item rank-${index + 1}`}
                    >
                        <span className="rank">#{index + 1}</span> 
                        <span className="name">{p.name}</span> 
                        <span className="score">{p.score} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
