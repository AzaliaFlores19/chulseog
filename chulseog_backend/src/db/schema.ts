import { relations } from "drizzle-orm";
import { uuid, integer, pgTable, text } from "drizzle-orm/pg-core";

export const personTable = pgTable("persona", {
  id: uuid().primaryKey().defaultRandom(), // todo: ver si esta bien implementado el uuid como pk
  nombre: text().notNull(),
  telefono: text().notNull(),
});

export const userTable = pgTable("usuario", {
  id: uuid().primaryKey().defaultRandom(),
  usuario: text().notNull().unique(),
  contrasena: text().notNull(),
  id_persona: uuid().notNull(),
  avatar: text(),
});

// export const usersRelations = relations(userTable, ({ one }) => ({
//   persona: one(personTable, {
//     references: [personTable.id],
//   }),
// }));
