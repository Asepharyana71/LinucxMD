import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
import fetch from 'node-fetch'
import jimp from 'jimp'
import PhoneNumber from 'awesome-phonenumber'

const { generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default
const quotes = [
    "Saya tidak malas, saya hanya dalam mode hemat energi.",
    "Hidup singkat, tersenyumlah selagi masih punya gigi.",
    "Saya mungkin pengaruh buruk, tapi sial saya menyenangkan!",
    "Saya sedang menjalani diet wiski. Saya sudah kehilangan tiga hari.",
    "Kenapa beberapa pasangan tidak pergi ke gym? Karena beberapa hubungan tidak berhasil.",
    "Saya katakan kepada istri saya bahwa dia harus merangkul kesalahannya... Dia memberi saya pelukan.",
    "Saya hebat dalam melakukan beberapa hal sekaligus. Saya bisa menyia-nyiakan waktu, tidak produktif, dan menunda-nunda semua sekaligus.",
    "Anda tahu Anda sudah tua ketika Anda membungkuk untuk mengikat tali sepatu dan bertanya-tanya apa lagi yang bisa Anda lakukan saat berada di sana.",
    "Saya sangat pandai tidur, saya bisa melakukannya dengan mata tertutup.",
    "Jika Anda pikir tidak ada yang peduli jika Anda hidup, coba lewatkan beberapa pembayaran.",
    "Dulu saya pikir saya sangat ragu-ragu, tapi sekarang saya tidak begitu yakin.",
    "Jika Anda tidak bisa meyakinkan mereka, bingungkan mereka.",
    "Saya katakan kepada istri saya bahwa dia menggambar alisnya terlalu tinggi. Dia terlihat terkejut.",
    "Saya tidak canggung, saya hanya sedang mencoba gravitasi.",
    "Saya katakan kepada istri saya bahwa dia harus melakukan lebih banyak push-up. Dia berkata, 'Saya bisa melakukan seratus!' Jadi saya menghitung sampai sepuluh dan berhenti.",
    "Hidup itu seperti kotak cokelat; tidak lama jika Anda lapar.",
    "Saya tidak mengatakan saya Wonder Woman, saya hanya mengatakan tidak ada yang pernah melihat saya dan Wonder Woman berada di ruangan yang sama bersama-sama.",
    "Kenapa mereka menyebutnya tidur cantik saat Anda bangun terlihat seperti troll?",
    "Saya tidak selalu kehilangan ponsel saya, tapi ketika saya melakukannya, selalu dalam mode senyap.",
    "Tempat tidur saya adalah tempat ajaib di mana tiba-tiba saya ingat semua yang seharusnya saya lakukan.",
    "Saya suka suara yang kamu buat ketika kamu diam.",
    "Saya tidak sedang bertengkar, saya hanya menjelaskan mengapa saya benar.",
    "Saya bukanlah idiot yang lengkap, ada beberapa bagian yang hilang.",
    "Jika hidup memberimu lemon, semprotkan ke mata seseorang.",
    "Saya tidak perlu pengendalian kemarahan. Anda hanya perlu berhenti membuat saya marah.",
    "Saya tidak mengatakan saya Batman. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Batman berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya Superman. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Superman berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya Spider-Man. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Spider-Man berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya seorang superhero. Saya hanya mengatakan tidak ada yang pernah melihat saya dan seorang superhero berada di ruangan yang sama bersama-sama.",
    "Burung yang cepat dapat memiliki cacing karena cacing itu menjijikkan dan pagi itu bodoh.",
    "Jika hidup memberimu lemon, buatlah lemonade. Lalu temukan seseorang yang hidupnya memberinya vodka dan adakan pesta!",
    "Jalan menuju kesuksesan selalu dalam tahap pembangunan.",
    "Saya sangat pintar sehingga kadang-kadang saya tidak mengerti sepatah kata pun dari yang saya ucapkan.",
    "Beberapa orang hanya perlu high-five. Di wajah. Dengan kursi.",
    "Saya tidak mengatakan saya sempurna, tapi saya cukup dekat.",
    "Sehari tanpa sinar matahari seperti, tahu kan, malam.",
    "Cara terbaik untuk meramalkan masa depan adalah dengan menciptakannya sendiri.",
    "Jika Anda tidak bisa menjadi contoh yang baik, maka Anda harus menjadi peringatan buruk.",
    "Saya tidak tahu mengapa saya terus menekan tombol escape. Saya hanya mencoba keluar dari sini.",
    "Saya tidak malas. Saya dalam mode hemat energi.",
    "Saya tidak membutuhkan penata rambut, bantal saya memberi saya gaya rambut baru setiap pagi.",
    "Saya tidak memiliki tulisan tangan buruk, saya memiliki font saya sendiri.",
    "Saya tidak canggung. Ini hanya lantai yang membenci saya, meja dan kursi adalah penindas, dan dinding menghalangi jalur saya.",
    "Saya tidak mengatakan saya Batman. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Batman berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya Wonder Woman. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Wonder Woman berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya Superman. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Superman berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya Spider-Man. Saya hanya mengatakan tidak ada yang pernah melihat saya dan Spider-Man berada di ruangan yang sama bersama-sama.",
    "Saya tidak mengatakan saya seorang superhero. Saya hanya mengatakan tidak ada yang pernah melihat saya dan seorang superhero berada di ruangan yang sama bersama-sama.",
    "Waktu mengajarkan kita begitu banyak hal, terutama ketika kita tidak punya waktu.",
    "Hidup seperti sebuah buku, setiap hari mengubah halaman baru. Kadang kita tertawa, kadang kita menangis, tetapi setiap cerita memiliki akhir yang tak sempurna!",
    "Belajar tanpa hati terasa tidak ada gunanya, sedangkan bersemangat tanpa pikiran tidak akan pernah ada gunanya.",
    "Bangun persahabatan sedalam hati sehingga Anda berada di sana, jaga persahabatan dengan cara yang membuat kami bangga menjadi teman Anda.",
    "Kawan saya, Anda sangat saya rindukan, setiap kali saya lapar saya sangat merindukan samosa.",
    "Kesenangan sejati dalam hidup datang ketika orang lain berusaha untuk menjalani hidup Anda.",
    "Beberapa orang begitu tidak berguna, mereka bahkan tidak bisa menghadapi hidup mereka sendiri dan malah menjadi penghambat bagi kehidupan orang lain."
];
let quote = quotes[Math.floor(Math.random() * quotes.length)];

const defaultMenu = {
    before: `</> *${ucapan()} %name!\n${quote}*   

● *Nama:*  %name 
● *Nomor:* %tag
● *Premium:* %prems
● *Limit:* %limit
● *Role:* %role
● *Level:* %level
● *Xp:* %exp / %maxexp
● *Total Xp:* %totalexp

● *Tanggal:* %week %weton
● *Date:* %date
● *Tanggal Islam:* %dateIslamic
● *Waktu:* %time

● *Platform:* %platform
● *Type:* Node.JS V20
● *Uptime:* %muptime %readmore

`.trimStart(),
    header: '╭─────『 %category 』',
    body: '  ⫸ %cmd %isPremium %islimit',
    footer: '╰–––––––––––––––༓',
    after: ``,
}
let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {

    if (m.isGroup && !global.db.data.chats[m.chat].menu) {
        throw `Admin telah mematikan menu`;
    }

    let tags = {
        'main': 'Main',
        'ai': 'Ai feature',
        'waifu': 'Random Anime',
        'anime': 'Anime Menu',
        'downloader': 'Sosial Downloader',
        'ytdl': 'Youtube Downloader',
        'sticker': 'Sticker',
        'quotes': 'quotes',
        'internet': 'Internet',
        'game': 'game',
        'fun': 'fun',
        'owner': 'Owner',
        'group': 'Group',
        'info': 'Info',
        'tools': 'Tools',

    }

    try {
        // DEFAULT MENU
        let dash = global.dashmenu
        let m1 = global.dmenut
        let m2 = global.dmenub
        let m3 = global.dmenuf
        let m4 = global.dmenub2

        // COMMAND MENU
        let cc = global.cmenut
        let c1 = global.cmenuh
        let c2 = global.cmenub
        let c3 = global.cmenuf
        let c4 = global.cmenua

        // LOGO L P
        let lprem = global.lopr
        let llim = global.lolm
        let tag = `@${m.sender.split('@')[0]}`

        //-----------TIME---------
        let ucpn = `${ucapan()}`
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        let week = d.toLocaleDateString(locale, { weekday: 'long' })
        let date = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
        // d.getTimeZoneOffset()
        // Offset -420 is 18.00
        // Offset    0 is  0.00
        // Offset  420 is  7.00
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
        let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(d)
        let time = d.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        })
        let _uptime = process.uptime() * 1000
        let _muptime
        if (process.send) {
            process.send('uptime')
            _muptime = await new Promise(resolve => {
                process.once('message', resolve)
                setTimeout(resolve, 1000)
            }) * 1000
            if (m.isGroup && !global.db.data.chats[m.chat].menu) {
                throw `Admin telah mematikan menu`;
            }

            let tags = {
                'main': 'Main',
                'economy': 'economy',
                'game': 'game',
                'fun': 'fun',
                'ai': 'Ai feature',
                'AI': 'AI',
                'sticker': 'Sticker',
                'waifu': 'Random Anime',
                'downloader': 'Sosial Downloader',
                'ytdl': 'Youtube Downloader',
                'quotes': 'quotes',
                'internet': 'Internet',
                'owner': 'Owner',
                'group': 'Group',
                'info': 'Info',
                'tools': 'Tools',



            }

            try {
                // DEFAULT MENU
                let dash = global.dashmenu
                let m1 = global.dmenut
                let m2 = global.dmenub
                let m3 = global.dmenuf
                let m4 = global.dmenub2

                // COMMAND MENU
                let cc = global.cmenut
                let c1 = global.cmenuh
                let c2 = global.cmenub
                let c3 = global.cmenuf
                let c4 = global.cmenua

                // LOGO L P
                let lprem = global.lopr
                let llim = global.lolm
                let tag = `@${m.sender.split('@')[0]}`

                //-----------TIME---------
                let ucpn = `${ucapan()}`
                let d = new Date(new Date + 3600000)
                let locale = 'id'
                let week = d.toLocaleDateString(locale, { weekday: 'long' })
                let date = d.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
                let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
                // d.getTimeZoneOffset()
                // Offset -420 is 18.00
                // Offset    0 is  0.00
                // Offset  420 is  7.00
                let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
                let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(d)
                let time = d.toLocaleTimeString(locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                })
                let _uptime = process.uptime() * 1000
                let _muptime
                if (process.send) {
                    process.send('uptime')
                    _muptime = await new Promise(resolve => {
                        process.once('message', resolve)
                        setTimeout(resolve, 1000)
                    }) * 1000
                }
                let muptime = clockString(_muptime)
                let uptime = clockString(_uptime)
                let _mpt
                if (process.send) {
                    process.send('uptime')
                    _mpt = await new Promise(resolve => {
                        process.once('message', resolve)
                        setTimeout(resolve, 1000)
                    }) * 1000
                }
                let mpt = clockString(_mpt)
                let usrs = db.data.users[m.sender]

                let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
                let wibh = moment.tz('Asia/Jakarta').format('HH')
                let wibm = moment.tz('Asia/Jakarta').format('mm')
                let wibs = moment.tz('Asia/Jakarta').format('ss')
                let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
                let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
                let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

                let mode = global.opts['self'] ? 'Private' : 'Publik'
                let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
                let { age, exp, limit, level, role, registered, money } = global.db.data.users[m.sender]
                let { min, xp, max } = xpRange(level, global.multiplier)
                let name = await conn.getName(m.sender)
                let premium = global.db.data.users[m.sender].premiumTime
                let prems = `${premium > 0 ? 'Premium' : 'Free'}`
                let platform = os.platform()

                //---------------------

                let totalreg = Object.keys(global.db.data.users).length
                let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
                let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
                    return {
                        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
                        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                        prefix: 'customPrefix' in plugin,
                        limit: plugin.limit,
                        premium: plugin.premium,
                        enabled: !plugin.disabled,
                    }
                })
                let groups = {}
                for (let tag in tags) {
                    groups[tag] = []
                    for (let plugin of help)
                        if (plugin.tags && plugin.tags.includes(tag))
                            if (plugin.help) groups[tag].push(plugin)
                }
                conn.menu = conn.menu ? conn.menu : {}
                let before = conn.menu.before || defaultMenu.before
                let header = conn.menu.header || defaultMenu.header
                let body = conn.menu.body || defaultMenu.body
                let footer = conn.menu.footer || defaultMenu.footer
                let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
                let _text = [
                    before,
                    ...Object.keys(tags).map(tag => {
                        return header.replace(/%category/g, tags[tag]) + '\n' + [
                            ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
                                return menu.help.map(help => {
                                    return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                                        .replace(/%islimit/g, menu.limit ? llim : '')
                                        .replace(/%isPremium/g, menu.premium ? lprem : '')
                                        .trim()
                                }).join('\n')
                            }),
                            footer
                        ].join('\n')
                    }),
                    after
                ].join('\n')
                let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
                let replace = {
                    '%': '%',
                    p: uptime, muptime,
                    me: conn.getName(conn.user.jid),
                    npmname: _package.name,
                    npmdesc: _package.description,
                    version: _package.version,
                    exp: exp - min,
                    maxexp: xp,
                    totalexp: exp,
                    xp4levelup: max - exp,
                    github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
                    tag, dash, m1, m2, m3, m4, cc, c1, c2, c3, c4, lprem, llim,
                    ucpn, platform, wib, mode, _p, money, age, tag, name, prems, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
                    readmore: readMore
                }
                text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

                let fkon = {
                    key: {
                        fromMe: false,
                        participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
                        ...(m.chat ? { remoteJid: '16500000000@s.whatsapp.net' } : {})
                    },
                    message: {
                        contactMessage: {
                            displayName: `${name}`,
                            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                            verified: true
                        }
                    }
                };

                conn.relayMessage(m.chat, {
                    extendedTextMessage: {
                        text: text,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                title: wm,
                                body: global.author,
                                mediaType: 1,
                                previewType: 0,
                                renderLargerThumbnail: true,
                                thumbnailUrl: 'https://telegra.ph/file/0b2ae3086883446ad2e1e.jpg',
                                sourceUrl: sgc,
                            }
                        }, mentions: [m.sender]
                    }
                }, { quoted: fkon });
            }
            catch (e) {
                conn.reply(m.chat, 'Maaf, menu sedang error', m)
                throw e
                }
        }
        handler.help = ['menu']
        handler.tags = ['main']
        handler.command = /^(allmenu|menu|help|\?)$/i

handler.register = true
handler.exp = 3

export default handler

//----------- FUNCTION -------

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}
function clockStringP(ms) {
    let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
    let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [ye, ' *Years 🗓️*\n', mo, ' *Month 🌙*\n', d, ' *Days ☀️*\n', h, ' *Hours 🕐*\n', m, ' *Minute ⏰*\n', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
}
function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Kok Belum Tidur Kak? 🥱"
    if (time >= 4) {
        res = "Pagi Kak 🌄"
    }
    if (time >= 10) {
        res = "Siang Kak ☀️"
    }
    if (time >= 15) {
        res = "Sore Kak 🌇"
    }
    if (time >= 18) {
        res = "Malam Kak 🌙"
    }
    return res
}

