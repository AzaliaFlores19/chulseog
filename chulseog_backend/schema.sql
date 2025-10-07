-- Extensión necesaria para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE tipo_usuario AS ENUM ('Administrador', 'Usuario');
CREATE TYPE tipo_matricula AS ENUM ('Estudiante', 'Docente');

-- Tablas
CREATE TABLE universidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  icono TEXT
);

CREATE TABLE persona (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT
);

CREATE TABLE usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario TEXT UNIQUE NOT NULL,
  contrasena TEXT NOT NULL,
  id_persona UUID NOT NULL REFERENCES persona(id),
  avatar TEXT
);

CREATE TABLE usuario_universidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES usuario(id),
  id_universidad UUID NOT NULL REFERENCES universidad(id),
  tipo_usuario tipo_usuario NOT NULL
);

CREATE TABLE clase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT UNIQUE NOT NULL,
  id_universidad UUID NOT NULL REFERENCES universidad(id)
);

CREATE TABLE seccion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_clase UUID NOT NULL REFERENCES clase(id),
  capacidad INT NOT NULL CHECK (capacidad > 0),
  modalidad TEXT NOT NULL,
  hora_inicio TIMESTAMPTZ NOT NULL,
  hora_fin TIMESTAMPTZ NOT NULL,
  periodo TEXT NOT NULL,
  activa BOOL DEFAULT true NOT NULL
);

CREATE TABLE matricula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_matricula TIMESTAMPTZ NOT NULL,
  id_usuario UUID NOT NULL REFERENCES usuario(id),
  id_seccion UUID NOT NULL REFERENCES seccion(id),
  tipo tipo_matricula NOT NULL
);

CREATE TABLE asistencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha TIMESTAMPTZ NOT NULL,
  id_matricula UUID NOT NULL REFERENCES matricula(id),
  asistencia BOOL DEFAULT false NOT NULL
);

CREATE TABLE anuncio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_seccion UUID NOT NULL REFERENCES seccion(id),
  fecha_publicacion TIMESTAMPTZ NOT NULL,
  mensaje TEXT NOT NULL
);
