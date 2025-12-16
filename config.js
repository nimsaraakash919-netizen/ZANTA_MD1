// config.js (යාවත්කාලීන කළ කේතය)

const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
const aliveMessageData = require('./plugins/aliveMsg'); 


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// 🚨 ප්‍රධාන වෙනස්කම: Owner Number එක config එකේම hardcode කරයි (හෝ Environment Variable එකකින් ගනී)
const OWNER_NUMBER = process.env.OWNER_NUMBER || "94743404814"; // 🚨 ඔබගේ Bot Owner ගේ අංකය මෙහි ඇතුළත් කරන්න (රහස්‍ය නම් ENV භාවිතා කරන්න)

// ⚠️ Database Settings Load වන තුරු අවශ්‍ය වන Hardcoded Default අගයන්.
const DEFAULT_BOT_NAME = "ZANTA-MD";
// 🆕 අලුතින් එක් කළා
const DEFAULT_OWNER_NAME = "Akash Kavindu"; 
// 🆕 අලුතින් එක් කළා
const DEFAULT_PREFIX = "."; 

const ALIVE_MSG_TEMPLATE = aliveMessageData.getAliveMessage();


// 💡 Alive Message එක සකස් කිරීම.
const FINAL_ALIVE_MSG = ALIVE_MSG_TEMPLATE
    .replace(/{BOT_NAME}/g, DEFAULT_BOT_NAME)
    .replace(/{OWNER_NUMBER}/g, OWNER_NUMBER);  


module.exports = {
    SESSION_ID: process.env.SESSION_ID || "RQ1lCRQS#R5AfWjtjbNlKQ1CkYT-kvhlk3Ma3HBOFMZ_mu3RuBBI", 
    ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/alive-new.jpg?raw=true",
    ALIVE_MSG: process.env.ALIVE_MSG || FINAL_ALIVE_MSG, 
    
    // 🚨 ප්‍රධාන යතුර: Baileys Logic සහ DB Key සඳහා අංකය භාවිතා කරයි
    OWNER_NUMBER: OWNER_NUMBER, 
    
    BOT_NAME: DEFAULT_BOT_NAME, 
    
    // 🆕 අලුතින් exports කළා: Index.js විසින් ලබා ගත යුතු අගයන්
    DEFAULT_OWNER_NAME: DEFAULT_OWNER_NAME,
    DEFAULT_PREFIX: DEFAULT_PREFIX,
    
    AUTO_STATUS_SEEN: convertToBool(process.env.AUTO_STATUS_SEEN || 'true'), 
};
