import { promises } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

/**
 * Execute ffmpeg command to convert audio or video buffer to another format.
 * @param {Buffer} buffer Input buffer to convert.
 * @param {Array<string>} args Additional ffmpeg arguments.
 * @param {string} inputExt Input file extension.
 * @param {string} outputExt Output file extension.
 * @returns {Promise<{data: Buffer, filename: string, delete: Function}>} Converted data with metadata.
 */
function ffmpeg(buffer, args = [], inputExt = '', outputExt = '') {
  return new Promise(async (resolve, reject) => {
    try {
      const tmp = join(global.__dirname(import.meta.url), '../tmp', `${+new Date}.${inputExt}`);
      const out = `${tmp}.${outputExt}`;
      
      await promises.writeFile(tmp, buffer);

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', tmp,
        ...args,
        out
      ]);

      ffmpegProcess.on('error', (err) => {
        reject(err);
      });

      ffmpegProcess.on('close', async (code) => {
        try {
          await promises.unlink(tmp);
          if (code !== 0) {
            reject(new Error(`ffmpeg process exited with code ${code}`));
          }
          resolve({
            data: await promises.readFile(out),
            filename: out,
            delete: () => promises.unlink(out)
          });
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Convert audio buffer to a WhatsApp playable audio format (OGG).
 * @param {Buffer} buffer Input audio buffer.
 * @param {string} ext File extension of the input audio.
 * @returns {Promise<{data: Buffer, filename: string, delete: Function}>} Converted audio with metadata.
 */
function toPTT(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
  ], ext, 'ogg');
}

/**
 * Convert audio buffer to a WhatsApp playable audio format (OPUS).
 * @param {Buffer} buffer Input audio buffer.
 * @param {string} ext File extension of the input audio.
 * @returns {Promise<{data: Buffer, filename: string, delete: Function}>} Converted audio with metadata.
 */
function toAudio(buffer, ext) {
  return ffmpeg(buffer, [
    '-vn',
    '-c:a', 'libopus',
    '-b:a', '128k',
    '-vbr', 'on',
    '-compression_level', '10'
  ], ext, 'opus');
}

/**
 * Convert video buffer to a WhatsApp playable video format (MP4).
 * @param {Buffer} buffer Input video buffer.
 * @param {string} ext File extension of the input video.
 * @returns {Promise<{data: Buffer, filename: string, delete: Function}>} Converted video with metadata.
 */
function toVideo(buffer, ext) {
  return ffmpeg(buffer, [
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-ab', '128k',
    '-ar', '44100',
    '-crf', '32',
    '-preset', 'slow'
  ], ext, 'mp4');
}

export {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
};
