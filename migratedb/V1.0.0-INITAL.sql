CREATE TABLE CLAN (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    clantag VARCHAR NOT NULL
);

CREATE TABLE MEMBER (
    id INTEGER PRIMARY KEY,
    clanid INTEGER,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    wtr INTEGER NOT NULL   
);

CREATE TABLE TEAM (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR,
    payload TEXT NOT NULL
);

CREATE TABLE CAMPAIGN (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    payload TEXT NOT NULL
);

CREATE TABLE DATA (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    payload TEXT NOT NULL
);