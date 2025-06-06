const express = require('express');
const cors = require('cors');
const {Pool} = require("pg");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('DB connection error', err);
    } else {
        console.log('DB connected at:', res.rows[0]);
    }
});

// USERS ROUTES

// Get all users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by username
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create user
app.post('/users', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user
app.put('/users/:username', async (req, res) => {
    const { username } = req.params;
    const { email, password, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET email = $1, password = $2, role = $3 WHERE username = $4 RETURNING *',
            [email, password, role, username]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
app.delete('/users/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query('DELETE FROM users WHERE username = $1 RETURNING *', [username]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// MESSAGES ROUTES

// Get all messages
app.get('/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send a message
app.post('/messages', async (req, res) => {
    const { sender_username, receiver_username, message } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO messages (sender_username, receiver_username, message) VALUES ($1, $2, $3) RETURNING *',
            [sender_username, receiver_username, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get messages sent or received by a user
app.get('/messages/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE sender_username = $1 OR receiver_username = $1 ORDER BY timestamp DESC',
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= FRIENDS ROUTES =================

// Get friends of a user
app.get('/friends/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM friend 
             WHERE username_init = $1 OR username_friend = $1`,
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a friend request (inactive by default)
app.post('/friends', async (req, res) => {
    const { username_init, username_friend } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO friend (username_init, username_friend, active) VALUES ($1, $2, FALSE) RETURNING *',
            [username_init, username_friend]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Approve a friend request
app.put('/friends/activate', async (req, res) => {
    const { username_init, username_friend } = req.body;
    try {
        const result = await pool.query(
            `UPDATE friend SET active = TRUE 
             WHERE username_init = $1 AND username_friend = $2 
             RETURNING *`,
            [username_init, username_friend]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Friendship not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a friend
app.delete('/friends', async (req, res) => {
    const { username_init, username_friend } = req.body;
    try {
        const result = await pool.query(
            'DELETE FROM friend WHERE username_init = $1 AND username_friend = $2 RETURNING *',
            [username_init, username_friend]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Friendship not found' });
        }
        res.json({ message: 'Friendship removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= INTERESTS ROUTES =================

// Get all interests for a user
app.get('/interests/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT interest FROM interest WHERE username = $1',
            [username]
        );
        res.json(result.rows.map(row => row.interest));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an interest
app.post('/interests', async (req, res) => {
    const { username, interest } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO interest (username, interest) VALUES ($1, $2) RETURNING *',
            [username, interest]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove an interest
app.delete('/interests', async (req, res) => {
    const { username, interest } = req.body;
    try {
        const result = await pool.query(
            'DELETE FROM interest WHERE username = $1 AND interest = $2 RETURNING *',
            [username, interest]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Interest not found' });
        }
        res.json({ message: 'Interest removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ================= CONDITIONS ROUTES =================

// Get conditions for a user
app.get('/conditions/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(
            'SELECT condition FROM condition WHERE username = $1',
            [username]
        );
        res.json(result.rows.map(row => row.condition));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a condition
app.post('/conditions', async (req, res) => {
    const { username, condition } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO condition (username, condition) VALUES ($1, $2) RETURNING *',
            [username, condition]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove a condition
app.delete('/conditions', async (req, res) => {
    const { username, condition } = req.body;
    try {
        const result = await pool.query(
            'DELETE FROM condition WHERE username = $1 AND condition = $2 RETURNING *',
            [username, condition]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Condition not found' });
        }
        res.json({ message: 'Condition removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users/filter', async (req, res) => {
    const { condition, friendCount, interest, currentUsername } = req.body;

    try {
        let query = `
      SELECT u.*
      FROM users u
      WHERE 1=1
    `;
        const values = [];
        let idx = 1;

        // Exclude current user
        if (currentUsername) {
            query += ` AND u.username != $${idx++}`;
            values.push(currentUsername);

            query += ` AND u.username NOT IN (
               SELECT CASE
                  WHEN f.username_init = $${idx} THEN f.username_friend
                  ELSE f.username_init
                END
                FROM friend f
                WHERE (f.username_init = $${idx} OR f.username_friend = $${idx}) AND f.active = true
              )`;
            values.push(currentUsername);
        }

        // Filter by condition
        if (condition) {
            query += ` AND EXISTS (
        SELECT 1 FROM condition c WHERE c.username = u.username AND c.condition = $${idx++}
      )`;
            values.push(condition);
        }

        // Filter by interest
        if (interest) {
            query += ` AND EXISTS (
        SELECT 1 FROM interest i WHERE i.username = u.username AND i.interest = $${idx++}
      )`;
            values.push(interest);
        }

        // Filter by number of friends
        if (friendCount) {
            if (friendCount === '-5') {
                query += ` AND (
          SELECT COUNT(*) FROM friend f 
          WHERE f.username_init = u.username AND f.active = true
        ) < 5`;
            } else if (friendCount === '+5') {
                query += ` AND (
          SELECT COUNT(*) FROM friend f 
          WHERE f.username_init = u.username AND f.active = true
        ) > 5`;
            } else if (friendCount === '0') {
                query += ` AND NOT EXISTS (
          SELECT 1 FROM friend f 
          WHERE f.username_init = u.username AND f.active = true
        )`;
            }
        }

        const result = await pool.query(query, values);
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});