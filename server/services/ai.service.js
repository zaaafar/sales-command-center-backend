const axios = require('axios');

const analyzeTranscript = async (transcript) => {
    try {
        const apiKey = process.env.AI_API_KEY;
        const apiUrl = process.env.AI_API_URL;

        if (!apiKey || !apiUrl) {
            throw new Error('AI service not configured: Missing API KEY or URL');
        }

        const prompt = `
        Analyze the following meeting transcript and extracting insights into a STRICT JSON format.
        
        Transcript: 
        "${transcript}"

        Return ONLY the following JSON structure (valid JSON, no markdown formatting):
        {
            "summary": "Brief summary of the meeting",
            "scheduling_intent": "If a follow-up meeting is mentioned, extract details (e.g. 'Monday at 2pm') otherwise null",
            "next_action": "Specific textual next action item (e.g. 'Send proposal')",
            "deal_signal": "Positive, Neutral, or Negative"
        }
        `;

        // Generic payload structure fitting many providers (like OpenAI/Anthropic/Local LLMs that follow common patterns)
        // Adjust payload structure if specific provider requirements are known, but keep it generic enough.
        // Assuming an OpenAI-compatible interface for now as it's the most common "generic" target.
        const payload = {
            model: "gpt-3.5-turbo", // Or user configured model
            messages: [
                { role: "system", content: "You are a helpful sales assistant. Output strict JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.3
        };

        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Defensive parsing to handle various API response structures
        let content;
        if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
            content = response.data.choices[0].message.content;
        } else if (response.data.response) { // Some other APIs
            content = response.data.response;
        } else {
             // Fallback for simple raw text responses
            content = JSON.stringify(response.data);
        }

        console.log("AI Raw Response:", content);

        // Clean up markdown code blocks if present
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(jsonString);

    } catch (error) {
        console.error('AI Service Error:', error.response?.data || error.message);
        // Fallback return validation
        return {
            summary: "Error analyzing transcript",
            scheduling_intent: null,
            next_action: null,
            deal_signal: "Neutral"
        };
    }
};

module.exports = { analyzeTranscript };
