// config.js

const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
const aliveMessageData = require('./plugins/aliveMsg'); 

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// ⚠️ Bot ආරම්භයේදී Database Load වන තුරු අවශ්‍ය වන Default අගයන්.
// index.js තුළ global.CURRENT_BOT_SETTINGS සජීවීව Load වේ.
const DEFAULT_BOT_NAME = "ZANTA-MD-v2";
// 🚨 Owner Number එක Environment Variable එකෙන් (Replit Secrets) හෝ Default අගයකින් ලබා ගනී.
// Database එකේ ගබඩා කරන්නේ Owner Name මිස Number එක නොවේ.
const OWNER_JID = process.env.OWNER_NUMBER || "94743404814"; // 🚨 ඔබගේ Owner අංකය මෙහි ඇතුළත් කරන්න

const ALIVE_MSG_TEMPLATE = aliveMessageData.getAliveMessage();


// 💡 Alive Message එක සකස් කිරීම.
// {OWNER_NUMBER} එක වෙනුවට අපි මෙහිදී OWNER_JID යොදා ගනිමු.
const FINAL_ALIVE_MSG = ALIVE_MSG_TEMPLATE
    .replace(/{BOT_NAME}/g, DEFAULT_BOT_NAME)
    .replace(/{OWNER_NUMBER}/g, OWNER_JID);  // OWNER_JID යනු දුරකථන අංකයයි.


module.exports = {
    SESSION_ID: process.env.SESSION_ID || "Enter your session id", //Your session id
    ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/alive-new.jpg?raw=true",
    
    // Alive Message එක Environment Variable එකෙන් හෝ Default එකෙන් ලබා ගනී.
    ALIVE_MSG: process.env.ALIVE_MSG || FINAL_ALIVE_MSG, 
    
    // Baileys Logic සඳහා අංකය භාවිතා කරයි
    OWNER_NUMBER: OWNER_JID, 
    
    BOT_NAME: DEFAULT_BOT_NAME, // මෙය Database Settings Load වන තුරු Default නම ලෙස භාවිතා වේ.
    AUTO_STATUS_SEEN: convertToBool(process.env.AUTO_STATUS_SEEN || 'true'), 
    // ⚠️ Note: TEMP_MONGO_URI අපි bot_db.js තුළ Direct Set කළ නිසා මෙහි අවශ්‍ය නොවේ.
};
