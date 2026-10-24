/**
 * PDF & Document Extraction Service
 * Extracts and cleans text from PDF, TXT, and Markdown files uploaded by users.
 */
const pdfParse = require('pdf-parse');

/**
 * Extracts clean textual content from an uploaded file buffer.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} mimeType - MIME type of the uploaded file
 * @param {string} originalName - Original filename
 * @returns {Promise<{text: string, wordCount: number, readingTimeMinutes: number, pageCount: number}>}
 */
async function extractTextFromFile(buffer, mimeType, originalName = '') {
  let rawText = '';
  let pageCount = 1;

  if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    rawText = data.text || '';
    pageCount = data.numpages || 1;
  } else {
    // Plain text or markdown
    rawText = buffer.toString('utf-8');
  }

  // Clean and normalize text:
  // 1. Remove excessive empty lines
  // 2. Normalize unicode quotation marks and dashes for better TTS flow
  const cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '—')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleanedText ? cleanedText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  // Standard audiobook pacing is approx ~150 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 150));

  return {
    text: cleanedText,
    wordCount,
    readingTimeMinutes,
    pageCount,
  };
}

module.exports = {
  extractTextFromFile,
};
