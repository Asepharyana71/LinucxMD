let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
    function number(x = 0) {
        x = parseInt(x);
        return !isNaN(x) && typeof x == 'number';
    }

    let fa = `🟥 *Provide the amount of gold to bet*

*Example:*
${usedPrefix + command} 1000`.trim()
    if (!args[0]) throw fa
    if (isNaN(args[0])) throw fa

    let users = global.db.data.users[m.sender]
    let credit = users.credit
    let amount = (args[0] && number(parseInt(args[0])) ? Math.max(parseInt(args[0]), 1) : /all/i.test(args[0]) ? Math.floor(parseInt(users.credit)) : 1) * 1

    let time = users.lastcf + 5000
    if (new Date - users.lastcf < 5000) throw `You can play cock-fight again in ${msToTime(time - new Date())}`
    if (amount < 100) throw `🟥 *You can't bet gold less than 100*`
    if (amount > 10000000000000000000000000000) throw `🟥 *You can't bet gold more than 1000000*`
    if (users.credit < amount) throw `🟥 *You don't have enough money for this bet.*\n*You currently have only ${credit} in gold.*`
    if (users.chicken < 1) {
        throw `🟥 *You do not have any chicks to bet* \nUse the command ${usedPrefix}buy-chicken`
    }

    let randomMultiplier = Math.floor(Math.random() * 5) + 1; // Generate a random multiplier between 1 and 5
    let botScore = (Math.ceil(Math.random() * 101)) *1; // Random score for the bot (1 to 51)
    let playerScore = (Math.floor(Math.random() * 101)) * 1; // Random score for the player (1 to 100)
    let status = `Rungkad,Ayam Anda mati 🪦`;
    let prize = amount * randomMultiplier; // Calculate the prize based on the random multiplier

    if (botScore < playerScore) {
        users.credit += prize;
        status = `Gacor kang 🤑🤑, Dapat 🪙 ${prize} Emas! 🐥`;
    } else {
        users.credit -= amount * 1;
        users.chicken -= 1;
        users.lastcf = new Date * 1;
    }

    let result = `${status}
      `.trim();

    m.reply(result);
}

handler.help = ['cock-fight <amount>'];
handler.tags = ['economy'];
handler.command = ['cock-fight', 'cf'];
handler.group = true;

export default handler;
