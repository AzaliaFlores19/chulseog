import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";

const app = express();
const EXPRESS_PORT = 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running at http://localhost:${EXPRESS_PORT}`);
});
