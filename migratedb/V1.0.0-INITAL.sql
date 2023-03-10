CREATE TABLE CLAN (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    clantag VARCHAR NOT NULL
);

CREATE TABLE MEMBER (
    id INTEGER PRIMARY KEY,
    clanid INTEGER,
    clantag VARCHAR,
    clanname VARCHAR,
    name VARCHAR NOT NULL,
    role VARCHAR NOT NULL,
    wtr INTEGER NOT NULL   
);

CREATE TABLE TEAM (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    campaignid INTEGER,
    payload TEXT NOT NULL
);

CREATE TABLE CAMPAIGN (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    startdate DATE NOT NULL,
    enddate DATE NOT NULL,
    payload TEXT NOT NULL
);

CREATE TABLE DATA (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    payload TEXT NOT NULL
);

CREATE TABLE CAMPAIGNREGISTRATION ( 
    campaignid INTEGER NOT NULL,
    memberid INTEGER NOT NULL,
    fullyavailable BOOLEAN NOT NULL,
    availability TEXT NOT NULL,
    PRIMARY KEY(campaignid, memberid)
);

CREATE TABLE MESSAGE ( 
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    reference INTEGER,
    memberid integer NOT NULL,
    text TEXT NOT NULL,
    created timestamp NOT NULL DEFAULT NOW(),
    updated timestamp NOT NULL DEFAULT NOW()
);