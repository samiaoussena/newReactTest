import { join } from 'path';
import { writeFile } from 'fs';
import { promisify } from 'util';
import { address, date, random } from 'faker';
import starwars from 'starwars';
import starWarsWords from 'forcem-ipsum';
import mkdirp from 'mkdirp';
import _ from 'lodash';
import uuid from 'uuid/v4';
import ora from 'ora';

const { sample, random: rand, words } = _;

import { User, Comment, Like, job } from './models';
const write = promisify(writeFile);

function generateFakeContent(type, lim) {
    return starWarsWords(type, lim);
}

function generateProfilePicture() {
    const pics = [];
    for (let i = 0; i < 67; i++) {
        pics.push(`/static/assets/users/${i + 1}.jpeg`);
    }
    return function selectRandomProfilePicture() {
        return sample(pics);
    };
}
const createProfilePicture = generateProfilePicture();

function generateShareablePicture() {
    const pics = [];
    for (let i = 0; i < 16; i++) {
        pics.push(`/static/assets/images/${i + 1}.jpg`);
    }
    return function selectRandomjobImage() {
        return sample(pics);
    };
}
const createShareableImage = generateShareablePicture();

async function generateUser() {
    const config = {};
    config.name = generateFakeContent('characters', 1)[0];
    config.uid = uuid();
    config.photoURL = createProfilePicture();
    return new User(config);
}

// possible categories
function generatejob(userId) {
    const config = {};
    config.id = uuid();
    config.content = starwars();
    config.date = new Date(date.recent(sample([1, 2, 3, 4, 5, 10, 15]))).getTime();
    config.image = Math.random() * 10 > 3 ? null : createShareableImage();
    config.likes = [];
    config.link = random.boolean()
        ? null
        : {
              url: 'https://ifelse.io/book',
              title: generateFakeContent('planets', 1)[0],
              description:
                  words(generateFakeContent('e6', 1)[0])
                      .slice(0, rand(5, 15))
                      .join(' ') + '.'
          };
    config.userId = userId;
    config.location =
        random.boolean() && !config.link && !config.image
            ? {
                  lat: Number.parseFloat(address.latitude(), 10),
                  lng: Number.parseFloat(address.longitude(), 10),
                  name: generateFakeContent('planets', 1)[0]
              }
            : null;
    return new job(config);
}

function generateComment(userId, jobId) {
    const config = {};
    config.id = uuid();
    config.content =
        words(generateFakeContent(`e${rand(4, 6)}`, 1)[0])
            .slice(0, rand(5, 75))
            .join(' ') + '.';
    config.date = date.recent(sample([1, 2, 3, 4, 5, 10, 15]));
    config.jobId = jobId;
    config.userId = userId;
    return new Comment(config);
}

function generateLike(userId, jobId) {
    const config = {};
    config.userId = userId;
    config.jobId = jobId;
    return new Like(config);
}

async function generateUsers(n) {
    return await Promise.all([...Array(n).keys()].map(async () => await generateUser()));
}

function generateComments(n, users, jobs) {
    const comments = [];
    for (let i = 0; i < n; i++) {
        const userIds = users.map(u => u.id);
        const jobIds = jobs.map(u => u.id);
        const randomUserId = sample(userIds);
        const randomjobId = sample(jobIds);
        comments.push(generateComment(randomUserId, randomjobId));
    }
    return comments;
}

function generatejobs(n, users) {
    const jobs = [];
    for (let i = 0; i < n; i++) {
        jobs.push(generatejob(sample(users).id));
    }
    return jobs;
}

function generateLikes(n, jobs, users) {
    const likes = [];
    for (let i = 0; i < n; i++) {
        const userIds = users.map(u => u.id);
        const jobIds = jobs.map(u => u.id);
        for (let j = 0; j < rand(0, users.length); j++) {
            const randomUserId = sample(userIds);
            const randomjobId = sample(jobIds);
            const job = jobs.find(p => p.id === randomjobId);
            const newLike = generateLike(randomUserId, randomjobId);
            job.likes.push(newLike.id);
            likes.push(newLike);
        }
    }
    return likes;
}

(async function seed(nUsers = 10, njobs = 50, nComments = 75, nLikes = 50) {
    const spinner = ora('Generating sample data...').start();
    mkdirp.sync(join(__dirname, 'seed'));
    const users = await generateUsers(nUsers);
    const jobs = generatejobs(njobs, users);
    const comments = generateComments(nComments, users, jobs);
    const likes = generateLikes(nLikes, jobs, users);
    try {
        await Promise.all([
            write(
                join(__dirname, 'db.json'),
                JSON.stringify({
                    users,
                    jobs,
                    comments,
                    likes
                })
            )
        ]);
        spinner.stop();
        console.log(`🎉 🎉 🎉 🎉  Done writing sample data 🎉 🎉 🎉 🎉
        generated:
        ${users.length} users
        ${jobs.length} jobs
        ${comments.length} comments
        ${likes.length} likes
        `);
    } catch (err) {
        console.error(err);
        spinner.stop();
    }
})();
