const mongoose = require('mongoose');

// ----------------------------------------------------
// ⚠️ තාවකාලික භාවිතය සඳහා: ඔබගේ URI එක මෙහි ඇතුළත් කරන්න
// ----------------------------------------------------
const TEMP_MONGO_URI = 'mongodb+srv://<Zanta-MD>:<Akashkavindu12345>@cluster0.mongodb.net/?retryWrites=true&w=majority'; 
// ----------------------------------------------------

const MONGODB_URI = process.env.MONGO_DB_URI || TEMP_MONGO_URI; 

// ----------------------------------------------------
// 1. SCHEMA DEFINITION
// ----------------------------------------------------
const botSettingsSchema = new mongoose.Schema({
    id: { type: String, required: true, default: 'bot_config', unique: true }, 
    botName: { type: String, default: 'ZANTA-MD' }, 
    ownerName: { type: String, default: 'Akash Kavindu' }, 
    prefix: { type: String, default: '.' }, 
});

const BotSettings = mongoose.model('BotSettings', botSettingsSchema);

// ----------------------------------------------------
// 2. CONNECTION & DATA FUNCTIONS
// ----------------------------------------------------

let isConnected = false;

async function connectDB() {
    if (isConnected || !MONGODB_URI) {
        if (!MONGODB_URI) {
            console.error('❌ MONGO_DB_URI is not set. Database features will be unavailable.');
        }
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('✅ MongoDB සම්බන්ධතාවය සාර්ථකයි! (TEMP URI)');
    } catch (error) {
        console.error('❌ MongoDB සම්බන්ධ වීමේ දෝෂය!:', error.message); 
    }
}

async function getBotSettings() {
    await connectDB();
    // සම්බන්ධතාවය නැත්නම් Default අගයන් යවයි
    if (!isConnected) return { botName: 'ZANTA-MD', ownerName: 'Akash Kavindu', prefix: '.' }; 
    
    try {
        // Document එකක් නැත්නම්, Default අගයන් සහිත අලුත් Document එකක් සාදා Retrun කරයි
        const settings = await BotSettings.findOneAndUpdate(
            { id: 'bot_config' }, 
            {}, 
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return settings;
    } catch (error) {
        console.error('Error fetching Bot Settings:', error);
        return { botName: 'ZANTA-MD', ownerName: 'Akash Kavindu', prefix: '.' };
    }
}

async function updateSetting(key, value) {
    await connectDB();
    if (!isConnected) return false;

    try {
        await BotSettings.findOneAndUpdate(
            { id: 'bot_config' }, 
            { [key]: value }, 
            { new: true, upsert: true }
        );
        return true;
    } catch (error) {
        console.error(`Error updating ${key}:`, error);
        return false;
    }
}

module.exports = {
    connectDB,
    getBotSettings,
    updateSetting
};
