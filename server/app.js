const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const activityLogRoutes = require('./routes/activityLogRoutes')

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Backend of Trello-lite-App');
}) 

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/boards', require('./routes/boardRoutes'));
app.use('/api/lists', require('./routes/listRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'))
app.use('/api/activity-logs', activityLogRoutes)

const PORT  = 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`); 
});