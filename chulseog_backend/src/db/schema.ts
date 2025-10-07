import { relations, sql } from "drizzle-orm";
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

export const usersRelations = relations(userTable, ({ one, many }) => ({
  persona: one(personTable, {
    fields: [userTable.id_persona],
    references: [personTable.id],
  }),
  universidades: many(user_universityTable),
  matriculas: many(enrollmentTable),
}));

export const personRelations = relations(personTable, ({ one }) => ({
  usuario: one(userTable, {
    fields: [personTable.id],
    references: [userTable.id_persona],
  }),
}));

export const universityRelations = relations(universityTable, ({ many }) => ({
  usuarios: many(user_universityTable),
  clases: many(classTable),
}));

export const user_universityRelations = relations(
  user_universityTable,
  ({ one }) => ({
    usuario: one(userTable, {
      fields: [user_universityTable.id_usuario],
      references: [userTable.id],
    }),
    universidad: one(universityTable, {
      fields: [user_universityTable.id_universidad],
      references: [universityTable.id],
    }),
  })
);

export const classRelations = relations(classTable, ({ one, many }) => ({
  universidad: one(universityTable, {
    fields: [classTable.id_universidad],
    references: [universityTable.id],
  }),
  secciones: many(sectionTable),
}));

export const sectionRelations = relations(sectionTable, ({ one, many }) => ({
  clase: one(classTable, {
    fields: [sectionTable.id_clase],
    references: [classTable.id],
  }),
  matriculas: many(enrollmentTable),
  anuncios: many(announcementTable),
}));

export const enrollmentRelations = relations(
  enrollmentTable,
  ({ one, many }) => ({
    usuario: one(userTable, {
      fields: [enrollmentTable.id_usuario],
      references: [userTable.id],
    }),
    seccion: one(sectionTable, {
      fields: [enrollmentTable.id_seccion],
      references: [sectionTable.id],
    }),
    asistencias: many(atendanceTable),
  })
);

export const atendanceRelations = relations(atendanceTable, ({ one }) => ({
  matricula: one(enrollmentTable, {
    fields: [atendanceTable.id_matricula],
    references: [enrollmentTable.id],
  }),
}));

export const announcementRelations = relations(
  announcementTable,
  ({ one }) => ({
    seccion: one(sectionTable, {
      fields: [announcementTable.id_seccion],
      references: [sectionTable.id],
    }),
  })
);
