let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const robberyCooldown = 7200000; // 2 hours cooldown
    const robberyPercentage = Math.floor(Math.random() * 25) + 1; // Random percentage between 1 and 25

    const currentTime = new Date();
    const lastRobberyTime = global.db.data.users[m.sender].lastrob || 0;

    if (currentTime - lastRobberyTime < robberyCooldown) {
      const remainingTime = msToTime(robberyCooldown - (currentTime - lastRobberyTime));
      throw `⏱️ Hey! Please wait *${remainingTime}* before attempting to rob again.`;
    }
    

    let targetUser = m.isGroup ? (m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)) : m.sender;
    if (!targetUser) throw `✳️ Please tag someone to rob.`;

    if (!(targetUser in global.db.data.users)) throw `✳️ User not found in the database.`;

    const targetUserData = global.db.data.users[targetUser];
    const robberyAmount = Math.floor((robberyPercentage / 100) * targetUserData.credit);

    if (targetUserData.credit < robberyAmount) {
      throw `🔖 @${targetUser.split`@`[0]} has less than *${robberyAmount}* gold. Robbing failed.`;
    }

    global.db.data.users[m.sender].credit += robberyAmount;
    global.db.data.users[targetUser].credit -= robberyAmount;
    global.db.data.users[m.sender].lastrob = currentTime;

    conn.reply(m.chat, `
    ✨ Successfully robbed *${robberyAmount} credits* (${robberyPercentage}%) from @${targetUser.split`@`[0]}.
    `, m);
  } catch (error) {
    conn.reply(m.chat, error, m);
  }
}

handler.help = ['rob'];
handler.tags = ['economy'];
handler.command = ['robar', 'rob'];

export default handler;

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const hoursStr = (hours < 10) ? "0" + hours : hours;
  const minutesStr = (minutes < 10) ? "0" + minutes : minutes;
  const secondsStr = (seconds < 10) ? "0" + seconds : seconds;

  return hoursStr + " hours " + minutesStr + " minutes";
}
