const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Creates a temporary file from a buffer
 * @param {Buffer} buffer - The data to write
 * @param {string} extension - File extension (e.g., 'webm', 'wav')
 * @returns {string} - The absolute path to the temp file
 */
const createTempFile = (buffer, extension = 'webm') => {
    const tempDir = os.tmpdir();
    const fileName = `live_audio_${Date.now()}.${extension}`;
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, buffer);
    return filePath;
};

/**
 * Deletes a temporary file
 * @param {string} filePath - Path to the file to delete
 */
const deleteTempFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

module.exports = { createTempFile, deleteTempFile };
