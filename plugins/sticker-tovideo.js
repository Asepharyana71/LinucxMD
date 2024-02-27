import sharp from 'sharp';
import { execSync } from 'child_process';
import fs from 'fs';
import { tmpdir } from 'os';
import { tmpNameSync } from 'tmp';

const TIMEOUT = 10000; // 10 detik
const tmpDir = tmpdir(); // Gunakan direktori temporer sistem untuk menyimpan file sementara

const handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `Reply sticker dengan command *${usedPrefix + command}*`;

  if (!m.quoted) throw notStickerMessage;

  const q = m.quoted || m;
  const mime = q.mimetype || '';

  if (!/image\/webp/.test(mime)) throw notStickerMessage;

  try {
    // Download sticker
    const media = await q.download();

    // Decode WebP to PNG
    const decodedBuffer = await sharp(media).toFormat('png').toBuffer();

    // Convert sticker to video
    if (decodedBuffer.length > 0) {
      const frameDuration = 100; // Durasi setiap frame (ms) -> diubah menjadi 100 untuk 0,1 detik
      const numFrames = 50; // Jumlah frame dalam video (50 frame)
      const frameFiles = []; // Menyimpan nama file frame

      // Simpan setiap frame gambar ke dalam file sementara
      for (let i = 0; i < numFrames; i++) {
        const frameFilename = tmpNameSync({ dir: tmpDir, postfix: '.png' });
        fs.writeFileSync(frameFilename, decodedBuffer); // Simpan buffer ke file
        frameFiles.push(frameFilename);
      }

      // Buat video dari setiap frame
      for (let i = 0; i < numFrames; i++) {
        const outputVideo = tmpNameSync({ dir: tmpDir, postfix: '.mp4' });
        const ffmpegCommand = `ffmpeg -loop 1 -i ${frameFiles[i]} -c:v libx264 -t ${frameDuration / 1000} -pix_fmt yuv420p ${outputVideo}`;
        execSync(ffmpegCommand, { cwd: tmpDir });
      }

      // Susun daftar input video
      const inputVideos = frameFiles.map((filename) => `-i ${filename}`).join(' ');

      // Gabungkan daftar input video menjadi satu video
      const outputVideo = tmpNameSync({ dir: tmpDir, postfix: '.mp4' });
      const ffmpegMergeCommand = `ffmpeg ${inputVideos} -filter_complex "concat=n=${numFrames}:v=1:a=0" -c:v libx264 -pix_fmt yuv420p -t 5 ${outputVideo}`;
      execSync(ffmpegMergeCommand, { cwd: tmpDir });

      // Kirim video yang dihasilkan sebagai balasan
      await conn.sendFile(m.chat, outputVideo, 'sticker_video.mp4', '*DONE (≧ω≦)ゞ*', m);

      // Hapus file sementara video-frame dan video hasil gabungan
      frameFiles.forEach((filename) => fs.unlinkSync(filename));
      fs.unlinkSync(outputVideo);
    } else {
      throw 'Gagal mengonversi stiker menjadi gambar.';
    }
  } catch (error) {
    console.error(error);
    if (error.message === `Timeout of ${TIMEOUT}ms exceeded`) {
      m.reply('Proses konversi terlalu lama. Silakan coba lagi.');
    } else {
      m.reply(`Terjadi kesalahan: ${error.message}`);
    }
  }
};

handler.help = ['tovideo (reply)'];
handler.tags = ['sticker'];
handler.command = ['tovideo'];

handler.register = true;
handler.limit = true;

export default handler;
