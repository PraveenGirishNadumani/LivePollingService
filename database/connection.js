'use strict';

import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const DB = await open({
    filename: './database/test.db',
    driver: sqlite3.Database
});

await DB.run(`CREATE TABLE IF NOT EXISTS Users ( 
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    Name TEXT, 
    Email TEXT, 
    Password TEXT
    )`);

await DB.run(`CREATE TABLE IF NOT EXISTS Poll (
    poll_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    Name TEXT, 
    Description TEXT, 
    created_by INTEGER,
    Archive INTEGER DEFAULT 0,
    Active INTEGER DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
    )`);

await DB.run(`CREATE TABLE IF NOT EXISTS Poll_option (
    poll_option_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    poll_id INTEGER,
    poll_option TEXT,
    FOREIGN KEY (poll_id) REFERENCES Poll(poll_id)
    )`);

await DB.run(`CREATE TABLE IF NOT EXISTS user_poll (
    user_id INTEGER,
    poll_id INTEGER,
    poll_option_id INTEGER,
    notifyResult INTEGER,
    FOREIGN KEY (poll_id) REFERENCES Poll(poll_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    FOREIGN KEY (poll_option_id) REFERENCES Poll_option(poll_option_id)
    )`);