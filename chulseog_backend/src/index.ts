import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express from "express";
import cors from "cors";
import { personTable } from "./db/schema";

const app = express();
const EXPRESS_PORT = 3000;

const db = drizzle(process.env.DATABASE_URL!);

app.use(cors());

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.get("/person", async (req: express.Request, res: express.Response) => {
  const persons = await db.select().from(personTable);
  console.log("Retrieved persons:", persons);
  res.json(persons);
});

app.listen(EXPRESS_PORT, () => {
  console.log(`Server is running at http://localhost:${EXPRESS_PORT}`);
});
