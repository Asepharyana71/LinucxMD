import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

/**
 * Convert WebP image to MP4 video using ffmpeg.
 * @param {string|Buffer} source Input WebP image as file path or buffer.
 * @returns {Promise<string>} Promise resolving to base64-encoded MP4 video data URI.
 */
async function webp2mp4(source) {
  try {
    // If source is a string, assume it's a file path and read the file
    const inputBuffer = typeof source === 'string' ? await fs.readFile(source) : source;

    // Define the output file path for the MP4 video
    const outputPath = join(__dirname, '../tmp', `output.mp4`);

    // Convert WebP image buffer to MP4 video buffer using sharp
    await sharp(inputBuffer)
      .toFormat('h264') // Convert to H.264 codec
      .toFile(outputPath);

    // Read the output MP4 video file
    const mp4Buffer = await fs.readFile(outputPath);

    // Return the MP4 video buffer as base64-encoded data URI
    return `data:video/mp4;base64,${mp4Buffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to convert WebP to MP4: ${error.message}`);
  }
}

/**
 * Convert MP4 video to WebP image using sharp.
 * @param {string|Buffer} source Input MP4 video as file path or buffer.
 * @returns {Promise<string>} Promise resolving to base64-encoded WebP image data URI.
 */
async function mp42webp(source) {
  try {
    // If source is a string, assume it's a file path and read the file
    const inputBuffer = typeof source === 'string' ? await fs.readFile(source) : source;

    // Define the output file path for the WebP image
    const outputPath = join(__dirname, '../tmp', `output.webp`);

    // Convert MP4 video buffer to WebP image buffer using sharp
    await sharp(inputBuffer)
      .webp() // Convert to WebP format
      .toFile(outputPath);

    // Read the output WebP image file
    const webpBuffer = await fs.readFile(outputPath);

    // Return the WebP image buffer as base64-encoded data URI
    return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to convert MP4 to WebP: ${error.message}`);
  }
}

/**
 * Convert PNG image to WebP image using sharp.
 * @param {string|Buffer} source Input PNG image as file path or buffer.
 * @returns {Promise<string>} Promise resolving to base64-encoded WebP image data URI.
 */
async function png2webp(source) {
  try {
    // If source is a string, assume it's a file path and read the file
    const inputBuffer = typeof source === 'string' ? await fs.readFile(source) : source;

    // Convert PNG image buffer to WebP image buffer using sharp
    const webpBuffer = await sharp(inputBuffer)
      .webp() // Convert to WebP format
      .toBuffer();

    // Return the WebP image buffer as base64-encoded data URI
    return `data:image/webp;base64,${webpBuffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to convert PNG to WebP: ${error.message}`);
  }
}

/**
 * Convert WebP image to PNG image using sharp.
 * @param {string|Buffer} source Input WebP image as file path or buffer.
 * @returns {Promise<string>} Promise resolving to base64-encoded PNG image data URI.
 */
async function webp2png(source) {
  try {
    // If source is a string, assume it's a file path and read the file
    const inputBuffer = typeof source === 'string' ? await fs.readFile(source) : source;

    // Convert WebP image buffer to PNG image buffer using sharp
    const pngBuffer = await sharp(inputBuffer)
      .png() // Convert to PNG format
      .toBuffer();

    // Return the PNG image buffer as base64-encoded data URI
    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to convert WebP to PNG: ${error.message}`);
  }
}

export { webp2mp4, mp42webp, png2webp, webp2png };
