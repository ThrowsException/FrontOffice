CREATE TABLE teams (
  id bigserial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE members (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  team bigint REFERENCES teams NOT NULL
);

CREATE TABLE events (
  id bigserial PRIMARY KEY,
  name text,
  team bigint REFERENCES teams NOT NULL
);

CREATE TABLE invites (
  id bigserial PRIMARY KEY,
  reply boolean,
  event bigint REFERENCES events NOT NULL,
  member bigint REFERENCES members NOT NULL
);
