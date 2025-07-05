import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import summarizeRoute from './summarize.js';  

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount your route
app.use('/api', summarizeRoute);   

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
