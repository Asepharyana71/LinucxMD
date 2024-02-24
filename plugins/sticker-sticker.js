import { png2webp, mp42webp } from '../lib/webp2mp4.js';
import { sticker, createSticker, addExif } from '../lib/sticker.js';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/video/g.test(mime)) {
      if ((q.msg || q).seconds > 10) return m.reply('Maximum duration allowed is 10 seconds.');
      let video = await q.download?.();
      if (!video) throw `Reply to a video with *${usedPrefix + command}*`;
      let webp = await mp42webp(video);
      if (!webp) throw 'Failed to convert video to WebP.';
      conn.sendFile(m.chat, webp, 'sticker.webp', '', m, null);
    } else if (/image/g.test(mime)) {
      let [packname, ...author] = args.join` `.split`|`;
      author = (author || []).join`|`;
      let image = await q.download?.();
      let webp = false;
      try {
        webp = await png2webp(image);
      } catch (e) {
        console.error(e);
      } finally {
        if (!webp) {
          webp = await addExif(image, packname || '', author || '');
        }
      }
      m.reply(webp);
    } else {
      m.reply('Unknown media type.');
    }
  } catch (e) {
    console.error(e);
    m.reply('An error occurred.');
  }
};

handler.help = ['sticker'];
handler.tags = ['sticker'];
handler.command = /^s(tic?ker)?(gif)?$/i;
handler.limit = true;

export default handler;
