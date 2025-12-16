// plugins/bot_db.js
const mongoose = require('mongoose');
// config.js වෙතින් Owner Number එක ලබා ගනී
const config = require('../config');

// 🚨 ⚠️ ආරක්ෂාව: ඔබගේ සත්‍ය MongoDB URI එක මෙහි ඇතුළත් කරන්න.
const MONGO_URI = 'mongodb+srv://Zanta-MD:Akashkavindu12345@cluster0.y7xsqsi.mongodb.net/?appName=Cluster0'; 

// 🚨 ප්‍රධාන යතුර: OWNER_NUMBER පමණක් භාවිතා කරයි (Domain/Suffix රහිතව)
const OWNER_KEY = config.OWNER_NUMBER;

// -----------------------------------------------------------
// Database Schema
// -----------------------------------------------------------
const SettingsSchema = new mongoose.Schema({
    // 🚨 id එක OWNER_NUMBER එකේ අගය ගනී
    id: { type: String, default: OWNER_KEY, unique: true }, 
    botName: { type: String, default: 'ZANTA-MD-v2' },
    ownerName: { type: String, default: 'Akash Kavindu' },
    prefix: { type: String, default: '.' }
});

const Settings = mongoose.model('Settings', SettingsSchema);

// ... (connectDB Logic එක එලෙසම පවතී) ...

// -----------------------------------------------------------
// CRUD Operations
// -----------------------------------------------------------
async function getBotSettings() {
    if (!OWNER_KEY) {
        console.error("❌ Owner Number not found in config. Cannot fetch settings.");
        return { botName: 'Default', ownerName: 'Default', prefix: '.' };
    }
    
    try {
        // ⚠️ OWNER_KEY (දුරකථන අංකය) යතුර ලෙස භාවිතා කර Document එක සොයයි
        let settings = await Settings.findOne({ id: OWNER_KEY });
        
        if (!settings) {
            // Settings නොමැති නම්, මෙම Owner අංකය සඳහා Default Settings නිර්මාණය කරයි
            settings = await Settings.create({
                id: OWNER_KEY, // අද්විතීය ID එක ලෙස Owner අංකය භාවිතා කරයි
                botName: 'ZANTA-MD-v2',
                ownerName: 'Akash Kavindu',
                prefix: '.'
            });
            console.log(`[DB] New Bot Settings created for Owner: ${OWNER_KEY}`);
        }
        
        return {
            botName: settings.botName,
            ownerName: settings.ownerName,
            prefix: settings.prefix
        };
        
    } catch (e) {
        console.error('Bot Settings Load කිරීමේ දෝෂය:', e);
        return { botName: 'ZANTA-MD-v2', ownerName: 'Akash Kavindu', prefix: '.' };
    }
}

async function updateSetting(key, value) {
    if (!OWNER_KEY) return false;
    
    try {
        const update = {};
        update[key] = value;
        
        const result = await Settings.findOneAndUpdate(
            { id: OWNER_KEY }, // ⚠️ OWNER_KEY (දුරකථන අංකය) යතුර ලෙස භාවිතා කරයි
            { $set: update },
            { new: true, upsert: true } 
        );
        
        return !!result; 
        
    } catch (e) {
        console.error(`Setting '${key}' යාවත්කාලීන කිරීමේ දෝෂය:`, e);
        return false;
    }
}

module.exports = {
    connectDB,
    getBotSettings,
    updateSetting
};
