Leaderboard Voting System

This project is a full-stack leaderboard voting system where users can vote for participants, and the leaderboard updates in real time. The system consists of a React frontend, Node.js/Express backend, and MongoDB database. WebSockets (Socket.io) are used to enable real-time updates.

Features

* Users can vote for participants with a score (1-100).
* Only the latest vote from a user is counted.
* Leaderboard updates dynamically without refreshing the page.
* Uses MongoDB to store participant scores.
* Real-time updates via Socket.io.
* Backend API built with Node.js and Express.

Prerequisites

Make sure you have the following installed on your machine:
* Node.js (v14+ recommended)
* MongoDB (local or Atlas cloud instance)
* npm (Node Package Manager)

Installation & Setup

1. Clone the Repository
* git clone https://github.com/your-repository/leaderboard-app.git
* cd leaderboard-app

Setup Backend
* cd backend
* npm install

Create a .env file in the backend directory with the following:
* MONGO_URI=your_mongodb_connection_string
* PORT=5000

Start the Backend Server
* npm start

3. Setup Frontend
* cd ../frontend
* npm install

The frontend will run on http://localhost:3000/, and the backend will be on http://localhost:5000/.


API Endpoints

Get Leaderboard
* GET /api/leaderboard

Vote for a Participant
* POST /api/leaderboard/vote

* Body (JSON):
{
  "participantId": "<PARTICIPANT_ID>",
  "voterId": "<VOTER_ID>",
  "score": 85
}

Real-Time WebSocket Events

* Client Listens for: leaderboardUpdate
* Backend Emits: leaderboardUpdate (sends updated leaderboard data)


Approach :

Our leaderboard algorithm is designed to ensure fairness, scalability, and real-time updates while keeping it efficient. Below is the step-by-step approach we followed while implementing the system.

1. Ensuring Fairness
* Each voter can vote for a participant with a score between 1-100.
* The latest vote counts, meaning if a voter changes their vote, their previous vote is removed and replaced with the new score.
* To track previous votes, we use a Map data structure inside the MongoDB Participant schema.
* This prevents vote inflation and ensures that each voter has equal influence on the leaderboard.

Implementation
* The votes are stored as a Map<voterId, score> inside the participant document.
* Before adding a new vote, we subtract the old score from the total score.
* The new vote is then added, ensuring only the latest vote per user is counted.

2. Scalability Considerations
* Efficient Database Design

        * Each participant document contains a votes map, reducing database queries.
        * Instead of storing multiple votes separately, we update in-place, reducing storage needs.
        * Leaderboard retrieval is O(n log n) due to sorting but optimized by only sorting when necessary.
* Handling High Traffic

        * Using MongoDB Indexing on score for faster sorting.
        * Using Socket.io to prevent excessive API calls for leaderboard updates.
* Optimized API Design

        * The backend exposes only two essential endpoints:
            * GET /api/leaderboard - Fetch sorted leaderboard.
            * POST /api/leaderboard/vote - Update a participant's score.
        * This ensures minimal API calls and reduces unnecessary database writes.

3. Real-Time Updates with Socket.io
* To keep the leaderboard live, we implemented WebSockets with Socket.io.
* Every time a vote is cast, the backend emits an event with the updated leaderboard.
* The frontend listens for these events and updates the UI dynamically.
* This ensures that all users see the latest ranking without refreshing the page.



Implementation

Backend

* Express.js is used to create RESTful APIs.
* MongoDB stores participant data.
* Socket.io is used to push real-time updates to all clients.
* Leaderboard Algorithm:

        * When a user votes, their previous vote is removed before adding the new one to ensure only the latest vote counts.

        * Votes are stored in a Map structure within each participant document.

        * The leaderboard is sorted dynamically based on updated scores.

        * The approach ensures fairness by allowing only the most recent vote to count, preventing vote inflation.

        * Scalability is achieved using efficient database operations and real-time WebSocket communication.

        * The system ensures real-time updates by broadcasting leaderboard changes to all connected clients via Socket.io.

Frontend

* React is used to create a dynamic UI.
* Socket.io-client listens for leaderboard updates in real-time.
* Axios is used for API requests.
* Component-Based Architecture: UI is broken into reusable components like Leaderboard.js and VoteForm.js.
* Real-time Updates: The leaderboard state is updated dynamically whenever a new vote is cast.


Future Improvements

* Add user authentication for secure voting.
* Improve UI with better design and animations.
* Implement admin panel for managing participants.


