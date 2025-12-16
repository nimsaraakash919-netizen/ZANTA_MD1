// config.js

const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
const aliveMessageData = require('./plugins/aliveMsg'); 


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// 🚨 OWNER NUMBER එක Environment Variable එකෙන් ලබා ගනී (Owner JID එක සෑදීමට අත්‍යවශ්‍යයි)
// '94743404814' වෙනුවට ඔබගේ අංකය ඇතුළත් කරන්න (රහස්‍ය තබා ගැනීමට Replit Secrets භාවිතා කිරීම නිර්දේශ කරයි)
const OWNER_NUMBER_JID = process.env.OWNER_NUMBER || "94743404814"; 

// ⚠️ Database Settings Load වන තුරු අවශ්‍ය වන Hardcoded Default අගයන්.
const DEFAULT_BOT_NAME = "ZANTA-MD-v2";

const ALIVE_MSG_TEMPLATE = aliveMessageData.getAliveMessage();


// 💡 Alive Message එක සකස් කිරීම.
const FINAL_ALIVE_MSG = ALIVE_MSG_TEMPLATE
    .replace(/{BOT_NAME}/g, DEFAULT_BOT_NAME)
    .replace(/{OWNER_NUMBER}/g, OWNER_NUMBER_JID);  


module.exports = {
    SESSION_ID: process.env.SESSION_ID || "Enter your session id", 
    ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/alive-new.jpg?raw=true",
    ALIVE_MSG: process.env.ALIVE_MSG || FINAL_ALIVE_MSG, 
    
    // 🚨 ප්‍රධාන යතුර: Baileys Logic සහ DB Key සඳහා අංකය භාවිතා කරයි
    OWNER_NUMBER: OWNER_NUMBER_JID, 
    
    BOT_NAME: DEFAULT_BOT_NAME, 
    AUTO_STATUS_SEEN: convertToBool(process.env.AUTO_STATUS_SEEN || 'true'), 
    // ⚠️ Note: TEMP_MONGO_URI එක bot_db.js තුළ direct hardcode කර ඇත.
};
