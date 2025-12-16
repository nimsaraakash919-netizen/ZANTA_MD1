// plugins/bot_db.js
const mongoose = require('mongoose');
// config.js වෙතින් Owner Number එක ලබා ගනී
const config = require('../config');

// 🚨 ⚠️ ආරක්ෂාව: ඔබගේ සත්‍ය MongoDB URI එක මෙහි 'YOUR_ACTUAL_MONGO_URI_HERE' වෙනුවට ඇතුළත් කරන්න.
const MONGO_URI = 'mongodb+srv://<Zanta-MD>:<Akashkavindu12345>@cluster0.mongodb.net/?retryWrites=true&w=majority'; 
// උදාහරණයක්: const MONGO_URI = 'mongodb+srv://user123:passwordXYZ@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority';


// 🚨 Owner JID එක මෙහි config එකෙන් ලබා ගනී
// මෙය එකම DB එකක් තුළ විවිධ Bots වෙන් කිරීමට භාවිතා කරන අද්විතීය යතුරයි.
const OWNER_JID = config.OWNER_NUMBER + '@s.whatsapp.net';

// -----------------------------------------------------------
// Database Schema
// -----------------------------------------------------------
const SettingsSchema = new mongoose.Schema({
    // 🚨 id එක OWNER_JID එකේ අගය ගනී
    id: { type: String, default: OWNER_JID, unique: true }, 
    botName: { type: String, default: 'ZANTA-MD-v2' },
    ownerName: { type: String, default: 'Akash Kavindu' },
    prefix: { type: String, default: '.' }
});

const Settings = mongoose.model('Settings', SettingsSchema);

// -----------------------------------------------------------
// Database Connection Logic
// -----------------------------------------------------------
async function connectDB() {
    if (!MONGO_URI || MONGO_URI === 'YOUR_ACTUAL_MONGO_URI_HERE') {
        console.error("❌ MongoDB URI එක සකසා නැත. කරුණාකර 'plugins/bot_db.js' ගොනුව පරීක්ෂා කරන්න.");
        return false;
    }
    
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB සම්බන්ධතාවය සාර්ථකයි! (Direct URI)');
        return true;
    } catch (error) {
        console.error('❌ MongoDB සම්බන්ධ වීමේ දෝෂය! (IP/URI ගැටලුවක් විය හැක):', error.message);
        return false;
    }
}

// -----------------------------------------------------------
// CRUD Operations
// -----------------------------------------------------------
async function getBotSettings() {
    try {
        // ⚠️ Owner JID එක යතුර ලෙස භාවිතා කර Document එක සොයයි
        let settings = await Settings.findOne({ id: OWNER_JID });
        
        if (!settings) {
            // Settings නොමැති නම්, මෙම Owner සඳහා Default Settings නිර්මාණය කරයි
            settings = await Settings.create({
                id: OWNER_JID, // අද්විතීය ID එක ලෙස Owner JID එක භාවිතා කරයි
                botName: 'ZANTA-MD-v2',
                ownerName: 'Akash Kavindu',
                prefix: '.'
            });
            console.log(`[DB] New Bot Settings created for Owner: ${config.OWNER_NUMBER}`);
        }
        
        return {
            botName: settings.botName,
            ownerName: settings.ownerName,
            prefix: settings.prefix
        };
        
    } catch (e) {
        console.error('Bot Settings Load කිරීමේ දෝෂය:', e);
        // දෝෂයක් ඇති වුවහොත් Default අගයන් යවයි
        return { botName: 'ZANTA-MD-v2', ownerName: 'Akash Kavindu', prefix: '.' };
    }
}

async function updateSetting(key, value) {
    try {
        const update = {};
        update[key] = value;
        
        const result = await Settings.findOneAndUpdate(
            { id: OWNER_JID }, // ⚠️ මෙහිදීත් OWNER_JID එක යතුර ලෙස භාවිතා කරයි
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
