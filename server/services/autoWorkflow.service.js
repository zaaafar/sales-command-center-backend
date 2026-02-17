const Meeting = require('../models/Meeting');
const Action = require('../models/Action');
const { transcribeAudio } = require('./transcription.service');
const { analyzeTranscript } = require('./ai.service');
const { parseAction } = require('./intentParser');

/**
 * Orchestrates the full audio-to-action workflow
 * @param {string} meetingId - ID of the meeting
 * @param {string} filePath - Path to the uploaded audio file
 * @returns {Promise<Object>} - Result of the workflow
 */
const autoProcessMeetingAudio = async (meetingId, filePath) => {
    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            throw new Error('Meeting not found');
        }

        // 1. Transcribe Audio
        console.log(`[AutoWorkflow] Transcribing audio for meeting ${meetingId}...`);
        const transcript = await transcribeAudio(filePath);
        meeting.transcript = transcript;
        await meeting.save();

        // 2. Analyze Transcript
        console.log(`[AutoWorkflow] Analyzing transcript...`);
        const aiResponse = await analyzeTranscript(transcript);
        meeting.aiSummary = aiResponse.summary || 'No summary generated';
        await meeting.save();

        // 3. Parse Intent & Create Actions
        console.log(`[AutoWorkflow] Parsing intent...`);
        const parsedActions = parseAction(aiResponse);
        const createdActions = [];
        const createdMeetings = [];

        for (const actionData of parsedActions) {
            let status = 'pending';
            
            // AUTOMATION LOGIC:
            if (actionData.type === 'followup') {
                 // Auto-approve followups
                 status = 'approved';
            }

            const action = await Action.create({
                meetingId: meeting._id,
                type: actionData.type,
                suggestedData: actionData.suggestedData,
                status: status
            });

            createdActions.push(action);

            // 4. Auto-Execute Schedule Actions
            if (actionData.type === 'schedule') {
                console.log(`[AutoWorkflow] Auto-scheduling meeting...`);
                // Create new meeting immediately
                const { title, dateTime } = actionData.suggestedData;
                
                // Need contactId from original meeting
                // Ensure meeting is populated if needed, or just use the ID if it's there
                // But wait, we just fetched 'meeting' at the top, does it have contactId? Yes.
                
                const newMeeting = await Meeting.create({
                    title: title || 'Follow-up Meeting (Auto)',
                    contactId: meeting.contactId,
                    dateTime: dateTime || new Date(Date.now() + 86400000), // Default tomorrow
                    transcript: '',
                    aiSummary: ''
                });

                createdMeetings.push(newMeeting);
                
                // Mark action as approved since we executed it
                action.status = 'approved';
                await action.save();
            }
        }

        return {
            transcript,
            summary: meeting.aiSummary,
            createdMeetings,
            actions: createdActions
        };

    } catch (error) {
        console.error('Auto Workflow Error:', error);
        throw error; // Re-throw to be handled by controller
    }
};

module.exports = { autoProcessMeetingAudio };
