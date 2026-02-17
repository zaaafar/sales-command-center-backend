const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Transcribe audio file using Groq Whisper API
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<string>} - The transcribed text
 */
const transcribeAudio = async (filePath) => {
    try {
        const apiKey = process.env.AI_API_KEY;
        const apiUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';

        if (!apiKey) {
            throw new Error('AI_API_KEY is not configured');
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('model', 'whisper-large-v3');

        // Groq API expects Content-Type header from FormData
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            ...form.getHeaders()
        };

        const response = await axios.post(apiUrl, form, {
            headers: headers,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        return response.data.text;

    } catch (error) {
        console.error('Transcription Service Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Failed to transcribe audio');
    }
};

module.exports = { transcribeAudio };
