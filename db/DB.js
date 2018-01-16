import jsonAPI from 'json-server';
import { resolve } from 'path';
import fetch from 'isomorphic-fetch';
import uuid from 'uuid/v4';
import config from 'config';

import { User, Comment, job, Like } from '../db/models';

export default () => {
    const server = jsonAPI.create();
    server.use(jsonAPI.defaults());
    server.use(jsonAPI.bodyParser);
    server.post((req, res, next) => {
        req.body.id = uuid();
        req.body.date = new Date().getTime();
        return next();
    });
    server.post('/users', (req, res, next) => {
        req.body = new User(req.body);
        return next();
    });
    server.post('/comments', async (req, res, next) => {
        req.body = new Comment(req.body);
        req.body.user = await fetch(
            `${config.get('ENDPOINT')}/users/${req.body.userId}`
        ).then(res => res.json());
        return next();
    });
    server.post('/jobs', async (req, res, next) => {
        req.body = new job(req.body);
        req.body.user = await fetch(
            `${config.get('ENDPOINT')}/users/${req.body.userId}`
        ).then(res => res.json());
        return next();
    });
    server.put ('/jobs', async (req, res, next) => {
        req.body = new job(req.body);
        const updatedjob = await fetch(`${config.get('ENDPOINT')}/jobs/${req.body.id}`, {
            method: 'PUT',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        return res.json(updatedjob);
        
    });
    server.put('/jobs/:jobId/likes/:userId', async (req, res) => {
        console.log( " a new likes for user");
        const { userId, jobId } = req.params;
        req.body = new Like({ userId, jobId });
        
        // Get the job to update and check to see if we've liked it already
        const job = await fetch(
            `${config.get('ENDPOINT')}/jobs/${jobId}?_embed=comments&_expand=user&_embed=likes`
        ).then(res => res.json());
        // Check to see if we already liked the job
        const alreadyLiked = job.likes.find(p => p.userId === userId);
        if (alreadyLiked) {
            // No-content; i.e. we already
            return res.status(204).json(job);
        }
        const likePayload = {
            userId,
            jobId
        };
        // Create new like
        console.log( "Create a new like");
        const like = await fetch(`${config.get('ENDPOINT')}/likes`, {
            method: 'POST',
            body: JSON.stringify(likePayload),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        // Update the job
        job.likes.push(like);

        // Save to DB
        console.log("update job with likes");
        const updatedJob = await fetch(
            `${config.get('ENDPOINT')}/jobs/${jobId}?_embed=comments&_expand=user&_embed=likes`,
            {
                method: 'PUT',
                body: JSON.stringify(job),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => res.json());
        return res.json(updatedjob);
    });
    server.delete('/jobs/:jobId/likes/:userId', async (req, res) => {
        const { userId, jobId } = req.params;
        const job = await fetch(
            `${config.get('ENDPOINT')}/jobs/${jobId}?_embed=comments&_expand=user&_embed=likes`
        ).then(res => res.json());
        const existingLikeIndex = job.likes.map(like => like.userId).indexOf(userId);
        if (existingLikeIndex === -1) {
            return res.status(204).json(job);
        }

        // Delete like
        await fetch(`${config.get('ENDPOINT')}/likes/${job.likes[existingLikeIndex].id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());

        // Remove the item from the array
        job.likes.splice(existingLikeIndex, 1);

        // Update the job
        const updatedjob = await fetch(`${config.get('ENDPOINT')}/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        return res.json(updatedjob);
    });
    server.use(jsonAPI.router(resolve(__dirname, '..', 'db', 'db.json')));
    return server;
};
