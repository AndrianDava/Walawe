//Thanks To Irfaan Official

const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@adiwajshing/baileys')
process.env.TZ = 'Asia/Jakarta'
let fs = require('fs')
let path = require('path')
let fetch = require('node-fetch')
let moment = require('moment-timezone')
let levelling = require('../lib/levelling')
let tags = {
  'main': 'Main Menu',
  'downloader': 'Download Menu', 
  'sticker': 'Convert Menu',
  'advanced': 'Advanced Menu',
  'absen': 'Absen Menu',
  'xp': 'Exp Menu',
  'fun': 'Fun Menu',
  'game': 'Game Menu',
  'github': 'Github Menu',
  'group': 'Group Menu',
  'image': 'Image Menu',
  'info': 'Info Menu',
  'internet': 'Internet Menu',
  'kerang': 'Kerang Menu',
  'maker': 'Maker Menu',
  'owner': 'Owner Menu',
  'Pengubah Suara': 'Voice Menu',
  'premium': 'Premium Menu',
  'quotes' : 'Quotes Menu',
  'rpg': 'Rpg Menu',
  'stalk': 'Stalk Menu',
  'shortlink': 'Short Link Menu',
  'tools': 'Tools Menu', 
  'asupan': 'Asupan Menu',    
}
const defaultMenu = {
  before: `
Hai, %ucapan %name! 👋

I am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.

┌  *_Info Waktu_*
│  ◦ Uptime : %uptime (%muptime)
│  ◦ Hari : %week %weton
│  ◦ %wib WIB
│  ◦ %wita WITA
│  ◦ %wit WIT
│  ◦ Waktu : %time
│  ◦ Tanggal : %date
└-----------------------------------------------
┌  ◦ *_Info Bot_*
│  ◦ Library : Baileys
│  ◦ Function : Role
│  ◦ Version : %version
│  ◦ Prefix Used : *[ %p ]*
└-----------------------------------------------
┌  ◦ *_Info User_*
│  ◦ Limit : %limit
│  ◦ Level : %level
│  ◦ XP : %exp
└-----------------------------------------------
`.trimStart(),
  header: '┌  ◦ *%category*',
  body: '│  ◦ %cmd %islimit %isPremium',
  footer: '└  ',
  after:  `*Made by Irfaan Official*
*Alfarabotz* | %version
${'```%npmdesc```'}
`,
}


let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let package = JSON.parse(await fs.promises.readFile(path.join(__dirname, '../package.json')).catch(_ => '{}'))
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = levelling.xpRange(level, global.multiplier)
    let name = m.name
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
    const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
    const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
    let tag = `@${m.sender.split('@')[0]}`
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
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
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
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, tag, muptime,
      me: conn.getName(conn.user.jid),
      ucapan: ucapan(),
      npmname: package.name,
      npmdesc: package.description,
      version: package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: package.homepage ? package.homepage.url || package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, wib, wit, wita, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    let audio = `${pickRandom(['https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane22.mp3', 'https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane15.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane1.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane2.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane20.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane10.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane23.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane17.mp3','https://raw.githubusercontent.com/hyuura/Rest-Sound/main/HyuuraKane/mangkane21.mp3', 'https://file.betabotz.eu.org/file/3xv80a4l5mkb.opus'])}`
    await conn.sendFile(m.chat, audio, 'error.mp3', null, m, true)
    const thumbnail = ["https://cdn.btch.bz/file/449937fd4e22da6c45b7e.jpg"]

await conn.sendMessage(m.chat, {
      video: { url: "https://ik.imagekit.io/lui/2024-01-06_04_08_36__0000_UTC"},
      gifPlayback: true,
      caption: 'ʜᴀʟᴏ ᴋᴀᴋ. sᴀʏᴀ ᴀᴅᴀʟᴀʜ ʟᴇʟɪᴀ ᴡʜᴀᴛsᴀᴘᴘ ᴏᴛᴏᴍᴀᴛɪs ʏᴀɴɢ ᴅᴀᴘᴀᴛ ᴍᴇᴍʙᴀɴᴛᴜ ᴍᴇʟᴀᴋᴜᴋᴀɴ sᴇsᴜᴀᴛᴜ,  ᴍᴇɴᴄᴀʀɪ ᴅᴀɴ ᴍᴇɴᴅᴀᴘᴀᴛᴋᴀɴ ᴅᴀᴛᴀ ᴀᴛᴀᴜ ɪɴғᴏʀᴍᴀsɪ ᴍᴇʟᴀʟᴜɪ ᴡʜᴀᴛsᴀᴘᴘ.\n\nɪ ᴀᴍ ᴀɴ ᴀᴜᴛᴏᴍᴀᴛᴇᴅ sʏsᴛᴇᴍ ᴡʜᴀᴛsᴀᴘᴘ ʟᴇʟɪᴀ ʙᴏᴛ ᴛʜᴀᴛ ᴄᴀɴ ʜᴇʟᴘ ᴛᴏ ᴅᴏ sᴏᴍᴇᴛʜɪɴɢ. sᴇᴀʀᴄʜ ᴀɴᴅ ɢᴇᴛ ᴅᴀᴛᴀ ɪɴғᴏʀᴍᴀsɪ ᴏɴʟʏ ᴛʜʀᴏᴜɢʜ ᴡʜᴀᴛsᴀᴘᴘ\n\n ➦ *.ᴀʟʟᴍᴇɴᴜ* (semua fitur)\n ➦ *.ᴍᴇɴᴜʟɪꜱᴛ* (Coming soon)',
      contextInfo: {
      externalAdReply: {
      title: 'AndzzMD',
      body: global.author,
      thumbnailUrl: 'https://ik.imagekit.io/lui/2024-01-06_04_01_36__0000_UTC',
      sourceUrl: `https://chat.whatsapp.com/HjYiYBKUmSGHKhoZP1VoWU`,
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, { quoted: m})
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(allmenu|menu|help|tod|menunya)$/i

handler.exp = 3

module.exports = handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)]
  }
function ucapan() {
	const time = moment.tz('Asia/Jakarta').format('HH')
	let res = "Selamat malam 🌌"
	if(time >= 1) {
		res = "Selamat Dini hari 🌌"
	}
        	if(time >= 4) {
		res = "Selamat pagi ⛅"
	}
	if(time > 10) {
		res = "Selamat siang 🌅"
	}
	if(time >= 15) {
		res = "Selamat sore 🌇"
	}
	if(time >= 18) {
		res = "Selamat malam 🌃"
	}
	return res
	}
