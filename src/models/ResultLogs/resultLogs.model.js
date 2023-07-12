import { Schema, model } from 'mongoose';

const logsSchema = new Schema(
    {
        info: {
            status: Boolean,
            message: String,
            metadata: Object,
        },
        workspace: String,
        durations: String,
    },
    { timestamps: true }
);
const ResultLogs = model('logs', logsSchema);

export default ResultLogs;
