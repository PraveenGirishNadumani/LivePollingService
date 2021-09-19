'use strict';

import { DB } from "../database/connection.js";
import { handleApiErrors, Query } from "../globalFunction.js";

/**
 * controller to vote for a poll
 * @param {JSON} req API request object
 * @param {JSON} res API response object
 * @returns 
 */
 export const voteToPoll = async (req, res) => {
    try {
        if(!req.body.poll_id || !req.body.poll_option_id) throw { code: 400, message: 'poll_id and poll_option are the mandatory fields for this API' };
        const voteExist = await DB.get(Query.getUserPollsByUserAndPollID, [req.user.user_id, req.body.poll_id]);
        if(voteExist) throw { code: 400, message: 'User already voted for this poll'};
        const addVote = await DB.run(Query.addVoteForPoll, [req.user.user_id, req.body.poll_id, req.body.poll_option_id, req.body.notifyResult]);
        return res.json({
            message: 'Success',
            result: 'your vote is registered for this poll'
        });
    } catch (error) {
        console.error(`Catch error inside voteToPoll() - user: ${error.message}`);
        handleApiErrors(error, res);
    }
}