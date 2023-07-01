import { Schema, model } from 'mongoose';

const logsSchema = new Schema(
    {
        status: Boolean,
        descriptions: String,
        error: Object,
        workspace: String,
        durations: String,
    },
    { timestamps: true }
);
const ResultLogs = model('logs', logsSchema);

export default ResultLogs;
