import express, { Request, Response } from 'express'
import { rateLimiter } from './rateLimiter'


const app = express()

app.get('/', rateLimiter({ interval: 10_000, limit:10 }), async (req: Request, res: Response) => {
  res.status(200).send("OK")
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
