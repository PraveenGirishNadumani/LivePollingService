'use strict';

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
import { DB } from "./database/connection.js";

export const Query = {
    getActivePoll: 'SELECT * FROM Poll WHERE Archive = 0 AND Active = 1',
    createPoll: 'INSERT INTO Poll (Name, Description, created_by) Values (?, ?, ?)',
    getPoll: 'SELECT * FROM Poll WHERE poll_id = ?',
    updatePolName: 'UPDATE Poll SET Name = ? WHERE poll_id = ? ',
    updatePolStatus: 'UPDATE Poll SET Active = ? WHERE poll_id = ? ',
    archivePoll: 'UPDATE Poll SET Archive = 1 WHERE poll_id = ? ',
    getPollOptions: 'SELECT * FROM Poll_option WHERE poll_id = ?',
    createPollOptions: 'INSERT INTO Poll_option (poll_id, poll_option) Values (?, ?)',
    getPollByUser: 'SELECT * FROM Poll WHERE created_by = ? AND Archive = 0',
    getUserPollsByUser: 'SELECT * FROM user_poll WHERE user_id = ?',
    getUserPollsByUserAndPollID: 'SELECT * FROM user_poll WHERE user_id = ? AND poll_id = ?',
    getUserPollsBuPoll: 'SELECT * FROM user_poll WHERE poll_id = ?',
    addVoteForPoll: 'INSERT INTO user_poll (user_id, poll_id, poll_option_id, notifyResult) VALUES (?, ?, ?, ?)',
    getVoteCount: 'SELECT COUNT(user_id) FROM user_poll WHERE poll_id = ? AND poll_option_id = ?',
    getEmailListToNotifyResult: 'SELECT Email from Users WHERE user_id IN ( Select user_id FROM user_poll WHERE poll_id = ? AND notifyResult = 1 )'
}

/**
 * function for handling the API error response
 * @param {JSON} error error object 
 * @param {JSON} res API response object
 * @returns API response
 */
export const handleApiErrors = (error, res) => {
    if(error.code){
        return res.status(error.code).json({ message: 'Error', result: error.message});
    } else {
        return res.status(500).json({ message: 'Server Error', result: 'Server encountered an error'});
    }
}

/**
 * function for validating the email structure is right or not
 * @param {String} email email
 * @returns Boolean
 */
export const validateEmail = (email) => {
    try {
        // return email.value.match(emailRegex) || false;
        return emailRegex.test(email) || false;
    } catch (error) {
        console.error(`Catch error inside validateEmail(): ${error.message}`);
        return false;
    }
}

/**
 * function to check if the user already exist in the DB or not
 * @param {String} email email ID of the user
 * @returns Boolean
 */
export const checkIfUserExist = async (email) => {
    try {
        const userExist = await DB.get(`SELECT * FROM Users WHERE email = ?`, email);
        return userExist || false;
    } catch (error) {
        console.error(`Catch error inside checkIfUserExist(): ${error.message}`);
        return false;
    }
}