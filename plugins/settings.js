// plugins/settings.js
const { updateSetting, getBotSettings } = require('./bot_db'); 
const { cmd } = require('../command'); // ඔබගේ Command Registrer එක

// =========================================================================
// 🔄 HELPER FUNCTION FOR RESTART
// =========================================================================
const restartBot = async (client, reply, successMessage) => {
    await reply(successMessage + '\n\n🔄 යාවත්කාලීන කිරීම් ක්‍රියාත්මක කිරීම සඳහා Bot එක නැවත ආරම්භ වේ...');
    
    // ⚠️ වැදගත්: Baileys connection එක close කර process එක exit කිරීම.
    // Hosting platform එක මගින් Bot එක ස්වයංක්‍රීයව නැවත ආරම්භ කරනු ඇත.
    setTimeout(() => {
        try {
            client.end(); // Baileys connection එක අවසන් කරයි
        } catch (e) {
            console.error("Error closing Baileys client:", e);
        }
        process.exit(0); // Process එක Exit කරයි.
    }, 2000); // තත්පර 2ක ප්‍රමාදයක්
};
// =========================================================================


cmd({
    pattern: 'setbotname',
    category: 'Settings', // Settings Category එක
    desc: 'Bot නාමය වෙනස් කරයි.',
    fromMe: true, // Bot Owner ට පමණක් අවසර
    react: '⚙️'
}, async (client, message, m, { command, args, isOwner, reply }) => {
    
    if (!isOwner) return reply('🚫 මෙම විධානය භාවිතා කළ හැක්කේ Bot Owner ට පමණි.');
        
    const newName = args.join(' ');
    if (!newName) {
        return reply(`කරුණාකර නව නමක් ඇතුළත් කරන්න. භාවිතය: .${command} [නව නම]`);
    }

    const success = await updateSetting('botName', newName);

    if (success) {
        // 1. Global State එක යාවත්කාලීන කරයි
        global.CURRENT_BOT_SETTINGS.botName = newName; 
        
        // 2. Restart Logic
        await restartBot(client, reply, `✅ Bot නාමය සාර්ථකව *${newName}* ලෙස යාවත්කාලීන කරන ලදී.`);
        
    } else {
        await reply('❌ Bot නම වෙනස් කිරීමට නොහැකි විය. Database ගැටලුවක් විය හැක.');
    }
});

cmd({
    pattern: 'setownername',
    category: 'Settings',
    desc: 'Bot Owner නාමය වෙනස් කරයි.',
    fromMe: true,
    react: '👤'
}, async (client, message, m, { command, args, isOwner, reply }) => {
    
    if (!isOwner) return reply('🚫 මෙම විධානය භාවිතා කළ හැක්කේ Bot Owner ට පමණි.');
        
    const newName = args.join(' ');
    if (!newName) {
        return reply(`කරුණාකර නව නමක් ඇතුළත් කරන්න. භාවිතය: .${command} [නව නම]`);
    }

    const success = await updateSetting('ownerName', newName);

    if (success) {
        // ⚠️ Global State යාවත්කාලීන කිරීම (Restart අවශ්‍ය නැත)
        global.CURRENT_BOT_SETTINGS.ownerName = newName; 
        await reply(`✅ Bot Owner නාමය සාර්ථකව *${newName}* ලෙස යාවත්කාලීන කරන ලදී.`);
    } else {
        await reply('❌ Owner නම වෙනස් කිරීමට නොහැකි විය.');
    }
});

cmd({
    pattern: 'setprefix',
    category: 'Settings',
    desc: 'Bot Prefix එක වෙනස් කරයි.',
    fromMe: true,
    react: '🅿️'
}, async (client, message, m, { command, args, isOwner, reply }) => {
    
    if (!isOwner) return reply('🚫 මෙම විධානය භාවිතා කළ හැක්කේ Bot Owner ට පමණි.');
        
    const newPrefix = args[0] || '';
    if (!newPrefix || newPrefix.length > 2) {
        return reply(`කරුණාකර අක්ෂර 1ක් හෝ 2ක් සහිත නව Prefix එකක් ඇතුළත් කරන්න. භාවිතය: .${command} [!]`);
    }

    const success = await updateSetting('prefix', newPrefix);

    if (success) {
        // 1. Global State යාවත්කාලීන කරයි
        global.CURRENT_BOT_SETTINGS.prefix = newPrefix; 
        
        // 2. Restart Logic
        await restartBot(client, reply, `✅ Bot Prefix එක සාර්ථකව *${newPrefix}* ලෙස යාවත්කාලීන කරන ලදී.`);

    } else {
        await reply('❌ Prefix වෙනස් කිරීමට නොහැකි විය.');
    }
});
