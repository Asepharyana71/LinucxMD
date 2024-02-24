import { webp2mp4 } from '../lib/webp2mp4.js'; // Sesuaikan dengan lokasi file Anda
import { sticker } from '../lib/sticker.js'; // Sesuaikan dengan lokasi file Anda

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/sticker/g.test(mime)) {
      let img = await q.download?.();
      if (!img) throw `Balas stiker dengan *${usedPrefix + command}*`;
      let mp4 = await webp2mp4(img);
      if (!mp4) throw 'Gagal mengonversi stiker ke MP4';
      conn.sendFile(m.chat, mp4, 'sticker.mp4', '', m, null, { mimetype: 'video/mp4' });
    } else {
      m.reply('Mohon balas dengan stiker untuk mengonversinya ke MP4.');
    }
  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat mengonversi stiker ke MP4.');
  }
};

handler.help = ['tovideo'];
handler.tags = ['sticker'];
handler.command = ['tovideo', 'tomp4'];
handler.register = true;
handler.limit = true;

export default handler;
