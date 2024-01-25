global.owner = ['62856248231153']  
global.mods = ['62856248231153'] 
global.prems = ['62856248231153']
global.nameowner = 'Irfaan Official'
global.numberowner = '62856248231153'
global.mail = 'irfaanabdulhafidzh10@gmail.com' 
global.gc = 'https://chat.whatsapp.com/KrK9JaqkSSpL6ARG15Envx'
global.instagram = 'https://instagram.com/irfaan_offcial567'
global.wm = '© Irfaan'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'Made With'
global.author = 'Bot WhatsApp'
global.maxwarn = '2' // Peringatan maksimum

//INI WAJIB DI ISI!//
global.lann = 'Alamak567' 
//Daftar terlebih dahulu https://api.betabotz.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.btc = 'Alamak567'
//Daftar https://api.botcahx.eu.org 

global.APIs = {   
  lann: 'https://api.betabotz.eu.org',
  btc: 'https://api.botcahx.eu.org'
}
global.APIKeys = { 
  'https://api.betabotz.eu.org': 'Alamak567', 
  'https://api.botcahx.eu.org': 'Alamak567'
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})
