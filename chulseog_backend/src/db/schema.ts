import { timeStamp } from "console";
import { relations, sql } from "drizzle-orm";
import { check } from "drizzle-orm/gel-core";
import {
  uuid,
  integer,
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

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

export const universityTable = pgTable("universidad", {
  id: uuid().primaryKey().defaultRandom(),
  codigo: text().notNull().unique(),
  nombre: text().notNull(),
  direccion: text().notNull(),
  icono: text(),
});

export const tipo_usuario = pgEnum("tipo_Usuario", [
  "Administrador",
  "Usuario",
]);

export const user_universityTable = pgTable("usuario_universidad", {
  id: uuid().primaryKey().defaultRandom(),
  id_usuario: uuid().notNull(), //falta referencia usuario id
  id_universidad: uuid().notNull(), //falta referencia universidad id
  tipo_usuario: tipo_usuario("tipo_usuario").notNull(),
});

export const classTable = pgTable("clase", {
  id: uuid().primaryKey().defaultRandom(),
  nombre: text().notNull().unique(),
  id_universidad: uuid().notNull(), //falta referencia universidad id
});

export const sectionTable = pgTable(
  "seccion",
  {
    id: uuid().primaryKey().defaultRandom(),
    id_clase: uuid().notNull(), //falta referencia clase id
    capacidad: integer().notNull(),
    modalidad: text().notNull(),
    hora_inicio: timestamp("hora_inicio", { withTimezone: true }).notNull(),
    hora_fin: timestamp("hora_fin", { withTimezone: true }).notNull(),
    periodo: text().notNull(),
    activa: boolean().notNull().default(true),
  },
  (table) => ({
    capacidadMayorCero: sql`CHECK (${table.capacidad} > 0)`,
  })
);

export const tipo_matricula = pgEnum("tipo_Matricula", [
  "Estudiante",
  "Docente",
]);

export const enrollmentTable = pgTable("matricula", {
  id: uuid().primaryKey().defaultRandom(),
  fecha_matricula: timestamp("fecha_matricula", { withTimezone: true })
    .notNull()
    .defaultNow(),
  id_usuario: uuid().notNull(), //falta referencia usuario id
  id_seccion: uuid().notNull(), //falta referencia seccion id
  tipo: tipo_matricula("tipo").notNull(),
});

export const atendanceTable = pgTable("asistencia", {
  id: uuid().primaryKey().defaultRandom(),
  fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
  id_matricula: uuid().notNull(), //falta referencia matricula id
  asistencia: boolean().notNull().default(true),
});

export const announcementTable = pgTable("anuncio", {
  id: uuid().primaryKey().defaultRandom(),
  id_seccion: uuid().notNull(), //falta referencia seccion id
  fecha_publicacion: timestamp("fecha_publicacion", { withTimezone: true })
    .notNull()
    .defaultNow(),
  mensaje: text().notNull(),
});

export const usersRelations = relations(userTable, ({ one }) => ({
  persona: one(personTable, {
    fields: [userTable.id_persona],
    references: [personTable.id],
  }),
}));

export const personRelations = relations(personTable, ({ one }) => ({
  usuario: one(userTable, {
    fields: [personTable.id],
    references: [userTable.id_persona],
  }),
}));
