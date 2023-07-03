import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const { FPT_API_KEY: fptApiKey } = process.env;

export default async ({ text }) => {
    const res = await axios({
        method: 'POST',
        url: 'https://api.fpt.ai/hmi/tts/v5',
        headers: {
            'api-key': fptApiKey,
            voice: 'banmai',
            speed: '0',
            prosody: '1',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: text,
    });
    const audioUrl = res.data.error === 0 ? String(res.data.async) : '';
    return audioUrl;
};
