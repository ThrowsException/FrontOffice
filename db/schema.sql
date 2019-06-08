CREATE TABLE groups (
  id bigserial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE events (
  id bigserial PRIMARY KEY,
  name text,
  "group" bigint REFERENCES groups NOT NULL
);

CREATE TABLE invites (
  id bigserial PRIMARY KEY,
  email text,
  reply boolean,
  event bigint REFERENCES events NOT NULL
);
