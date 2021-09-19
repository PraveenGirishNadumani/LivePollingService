'use strict';

import { DB } from "../database/connection.js";
import { handleApiErrors, Query } from "../globalFunction.js";



/**
 * controller to fetch all the active poll, no authentication needed
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @returns 
 */
export const getAll = async (req, res) => {
    try {
        const polls = await DB.all(Query.getActivePoll, []);
        return res.json({polls: polls});        
    } catch (error) {
        console.error(`Catch error inside getAll() poll: ${error.message}`);
        handleApiErrors(error, res);
    }
}
/**
 * controller for creating a poll
* @param {JSON} req API request
 * @param {JSON} res API response
 */
export const create = async (req, res) => {
    try {
        if(!req.body.name) throw { code: 400, message: 'poll name is mandatory field' };
        const createPoll = await DB.run(Query.createPoll, [req.body.name, req.body.description || null, req.user.user_id]);
        if(req.body.pollOptions) {
            req.body.pollOptions.forEach(option => {
                DB.run(Query.createPollOptions, [createPoll.lastID, option]);
            });
        }
        return res.json({
            message: 'Success',
            result: createPoll
        });
    } catch (error) {
        console.error(`Catch error inside create() poll : ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 * controller for fetching poll details
 * @param {JSON} req API request
 * @param {JSON} res API response
 */
export const get = async (req, res) => {
    try {
        const poll = await DB.get(Query.getPoll, [req.params.id]);
        const pollOptions = await DB.all(Query.getPollOptions, [req.params.id]);
        let pollResult = [];
        for(let i=0; i<pollOptions.length; i++) {
            const result = await DB.get(Query.getVoteCount, [req.params.id, pollOptions[i].poll_option_id]);
            pollResult.push({
                Value : pollOptions[i].poll_option,
                numberOfVotes: result['COUNT(user_id)']
            });
        }
        return res.json({
            poll,
            pollResult,
            pollOptions
        });
    } catch (error) {
        console.error(`Catch error inside get() poll : ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 *  controller for updating the poll and the poll options
 * @param {JSON} req API request
 * @param {JSON} res API response
 */
export const update = async (req, res) => {
    try {
        if(req.body.name) {
            const updatedPoll = await DB.run(Query.updatePoll, [req.body.name, req.params.id]);
        }
        if(req.body.active) {
            const updatedPoll = await DB.run(Query.updatePolStatus, [req.body.active, req.params.id]);
        }
        return res.json({
            message: 'Success'
        });
        
    } catch (error) {
        console.error(`Catch error inside update() poll : ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 * controller to delete/archive a poll
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @returns 
 */
export const archive = async (req, res) => {
    try {
        const poll = await DB.get(Query.getPoll, [req.params.id]);
        if(!(poll.created_by == req.user.user_id)) throw { code: 401, message: 'you are not authorized to delete this poll'};
        const deletePoll = await DB.run(Query.archivePoll, [req.params.id]);
        return res.json({

        });
    } catch (error) {
        console.error(`Catch error inside archive() poll : ${error.message}`);
        handleApiErrors(error, res);
    }
}

/**
 * controller to fetch the email list who are subscribed to receive the poll final result
 * @param {JSON} req API request
 * @param {JSON} res API response
 * @returns 
 */
 export const getEmailListToNotifyResult = async (req, res) => {
    try {
        const emailList = await DB.all(Query.getEmailListToNotifyResult, [req.params.id]);
        return res.json({
            emailList: emailList
        });
    } catch (error) {
        console.error(`Catch error inside getEmailListToNotifyResult(): ${error.message}`);
        handleApiErrors(error, res);
    }
}