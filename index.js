const express = require('express');
const Leaderboard = require('./lib/leaderboard'); // Importing the leaderboard module
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Create a Redis-backed leaderboard instance
const leaderboard = new Leaderboard('game_leaderboard', { pageSize: 10 }, { host: 'redis', port: 6379 });

// REST endpoint to add a member to the leaderboard
app.post('/add', (req, res) => {
    const { member, score } = req.body;
    leaderboard.add(member, score, (err) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send({ message: `${member} added with score ${score}` });
    });
});

// REST endpoint to retrieve the rank of a member
app.get('/rank/:member', (req, res) => {
    const member = req.params.member;
    leaderboard.rank(member, (err, rank) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send({ member, rank });
    });
});

// REST endpoint to retrieve the score of a member
app.get('/score/:member', (req, res) => {
    const member = req.params.member;
    leaderboard.score(member, (err, score) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send({ member, score });
    });
});

// REST endpoint to list leaderboard members with their scores
app.get('/list/:page', (req, res) => {
    const page = parseInt(req.params.page, 10);
    leaderboard.list(page, (err, members) => {
        if (err) return res.status(500).send({ error: err.message });
        res.status(200).send(members);
    });
});

// Start the server and listen on port 3000
app.listen(port, () => {
    console.log(`Leaderboard app listening at http://localhost:${port}`);
});
