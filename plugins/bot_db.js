// plugins/bot_db.js
const mongoose = require('mongoose');

// 🚨 ⚠️ ආරක්ෂාව: ඔබගේ සත්‍ය MongoDB URI එක මෙහි 'YOUR_ACTUAL_MONGO_URI_HERE' වෙනුවට ඇතුළත් කරන්න.
// මෙම URI එක කිසිවෙකුට ප්‍රසිද්ධියේ දැකීමට නොහැකි වන පරිදි සලකා බලන්න.
const MONGO_URI = 'mongodb+srv://<Zanta-MD>:<Akashkavindu12345>@cluster0.mongodb.net/?retryWrites=true&w=majority'; 
// උදාහරණයක්: const MONGO_URI = 'mongodb+srv://user123:passwordXYZ@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority';


// -----------------------------------------------------------
// Database Schema
// -----------------------------------------------------------
const SettingsSchema = new mongoose.Schema({
    id: { type: String, default: 'bot_settings' }, // Unique ID
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
        let settings = await Settings.findOne({ id: 'bot_settings' });
        
        if (!settings) {
            // Settings නොමැති නම්, Default Settings නිර්මාණය කරයි
            settings = await Settings.create({
                id: 'bot_settings',
                botName: 'ZANTA-MD-v2',
                ownerName: 'Akash Kavindu',
                prefix: '.'
            });
            console.log('Database හි Default Bot Settings නිර්මාණය කරන ලදී.');
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
            { id: 'bot_settings' },
            { $set: update },
            { new: true, upsert: true } // upsert: true මගින් නොමැති නම් අලුතින් නිර්මාණය කරයි
        );
        
        return !!result; // Successful නම් true, නැතිනම් false යවයි
        
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
