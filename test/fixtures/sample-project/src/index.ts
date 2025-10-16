import express from 'express';
import { authenticateUser } from './auth/login';
import { formatResponse } from './utils/helper';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authenticateUser(username, password);
    res.json(formatResponse(result));
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
