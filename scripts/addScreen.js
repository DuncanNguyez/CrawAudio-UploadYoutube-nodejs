import readline from 'readline';

import { Screens } from '../src/models/index.js';
import { connectDB } from '../src/utils/index.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

await connectDB();

const projectId = await new Promise((resolve) =>
    rl.question('projectId: ', resolve)
);
const clientId = await new Promise((resolve) =>
    rl.question('clientId: ', resolve)
);
const clientSecret = await new Promise((resolve) =>
    rl.question('clientSecret: ', resolve)
);
const redirectUrl = await new Promise((resolve) =>
    rl.question('redirectUrl: ', resolve)
);
const email = await new Promise((resolve) => rl.question('email: ', resolve));

const screen = await Screens.findOneAndUpdate(
    { projectId },
    {
        $set: {
            clientId,
            projectId,
            clientSecret,
            redirectUrl,
            email,
        },
    },
    { upsert: true, lean: true, new: true }
);
console.log({ screen });
process.exit();
