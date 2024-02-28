let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    let emojis = ["🍒", "🍇", "🍊", "🍋", "🍉", "🍎", "🍓", "🍏", "🍍", "7️⃣"]; // Customizable emojis for the slot machine
    let gridSize = 3; // Size of the slot machine grid
    let winLength = 3; // Number of aligned emojis required to win
    let emojiRewards = {
        "🍒": 1000,
        "🍇": 2000,
        "🍊": 3000,
        "🍋": 4000,
        "🍉": 5000,
        "🍎": 6000,
        "🍓": 7000,
        "🍏": 8000,
        "🍍": 9000,
        "7️⃣": 100000
    };

    let fa = `🟥 *Provide the amount of gold to bet*\n\n*Example : ${usedPrefix + command} 5000*`.trim();
    if (!args[0] || isNaN(args[0])) throw fa;
    let amount = parseInt(args[0]);

    let users = global.db.data.users[m.sender];
    let time = users.lastslot + 3000;
    if (new Date - users.lastslot < 3000) throw `⏳ Wait *${msToTime(time - new Date())}* to use again`;

    if (users.credit < amount) {
        throw `🟥 *You do not have enough gold to bet*`;
    }

    let end;
    let emojisLength = emojis.length;
    let slotResults = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        let randomIndex = Math.floor(Math.random() * emojisLength);
        slotResults.push(emojis[randomIndex]);
    }

    // Check for winning combinations
    let winningCombinations = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j <= gridSize - winLength; j++) {
            let row = [];
            let column = [];
            let diagonal1 = [];
            let diagonal2 = [];
            for (let k = 0; k < winLength; k++) {
                row.push(slotResults[i * gridSize + j + k]);
                column.push(slotResults[j * gridSize + i + k]);
                diagonal1.push(slotResults[(i + k) * gridSize + j + k]);
                diagonal2.push(slotResults[(i + k) * gridSize + j + winLength - k - 1]);
            }
            winningCombinations.push(row, column, diagonal1, diagonal2);
        }
    }

    let win = false;
    let winAmount = 0;
    for (let combination of winningCombinations) {
        if (new Set(combination).size === 1) {
            win = true;
            winAmount += emojiRewards[combination[0]];
        }
    }

    winAmount *= amount / 50; // Scale the winAmount based on the bet amount
    users.credit += win ? winAmount : -amount;

    end = win ? `🎉 *Congratulations!* You won ${winAmount} gold` : `😔 *You lost* ${amount} *gold*`;

    users.lastslot = new Date * 1;
    return await m.reply(
        `
     🎰 ┃ *SLOTS* ┃ 🎰
     ───────────
         ${slotResults.slice(0, 3).join(' : ')}
         ${slotResults.slice(3, 6).join(' : ')}
         ${slotResults.slice(6, 9).join(' : ')}
     ───────────
${end}
`);

}

handler.help = ['slot <amount>'];
handler.tags = ['game'];
handler.command = ['slot'];
handler.group = true;

export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return seconds + " seconds";
}
