// config.js

const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
const aliveMessageData = require('./plugins/aliveMsg'); 


function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// 🚨 GLOBAL SETTINGS මත රඳා පවතී
// index.js තුළ global.CURRENT_BOT_SETTINGS set කරනු ලැබේ.
const DYNAMIC_SETTINGS = global.CURRENT_BOT_SETTINGS || { 
    BOT_NAME: "ZANTA-MD-v2", 
    OWNER_NUMBER: "94766247995",
}; 

const OWNER_NUMBER = DYNAMIC_SETTINGS.ownerName; // Owner Name එක Owner Number ලෙස භාවිතා කරයිද?
// ඔබගේ Bot Logic එකට අනුව මෙය නිවැරදි කරගන්න. ownerName යනු Owner ගේ නම මිස අංකය නොවේ.
// අපි Owner Number එක config එකේම තබමු.

const DEFAULT_BOT_NAME = DYNAMIC_SETTINGS.botName;
const ALIVE_MSG_TEMPLATE = aliveMessageData.getAliveMessage();


const FINAL_ALIVE_MSG = ALIVE_MSG_TEMPLATE
    .replace(/{BOT_NAME}/g, DEFAULT_BOT_NAME)
    .replace(/{OWNER_NUMBER}/g, OWNER_NUMBER); 


module.exports = {
    SESSION_ID: process.env.SESSION_ID || "Enter your session id", //Your session id
    ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/alive-new.jpg?raw=true",
    ALIVE_MSG: process.env.ALIVE_MSG || FINAL_ALIVE_MSG, 
    BOT_OWNER: OWNER_NUMBER, 
    BOT_NAME: DEFAULT_BOT_NAME, // මෙය alive command එකට අත්‍යවශ්‍යයි.
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN === 'false' ? false : true, 
};

// ⚠️ Note: ඔබගේ Alive Message එකේ {OWNER_NUMBER} තිබේ නම්,
// OWNER_NUMBER එක Database එකේ ownerName විචල්‍යයේ අංකයක් ලෙස ගබඩා කළ යුතුය.
