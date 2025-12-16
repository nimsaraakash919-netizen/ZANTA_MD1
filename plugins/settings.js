// plugins/settings.js
const { updateSetting, getBotSettings } = require('./bot_db'); 
const { cmd } = require('../command'); // ඔබගේ Command Registrer එක

// 🚨 isBotAdmin Check එක සඳහා ඔබට config.js හි අංක ලැයිස්තුව අවශ්‍ය විය හැක
// දැනට අපි උපකල්පනය කරමු isOwner Check එක ප්‍රමාණවත් බව.

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
        // ⚠️ Global State එක යාවත්කාලීන කිරීම අත්‍යවශ්‍යයි
        global.CURRENT_BOT_SETTINGS.botName = newName; 
        
        await reply(`✅ Bot නාමය සාර්ථකව '${newName}' ලෙස යාවත්කාලීන කරන ලදී.`);
        // ඊළඟට යවන alive, menu, ping වල නව නම ලැබෙනු ඇත.
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
        global.CURRENT_BOT_SETTINGS.ownerName = newName; 
        await reply(`✅ Bot Owner නාමය සාර්ථකව '${newName}' ලෙස යාවත්කාලීන කරන ලදී.`);
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
        global.CURRENT_BOT_SETTINGS.prefix = newPrefix; 
        await reply(`✅ Bot Prefix එක සාර්ථකව '${newPrefix}' ලෙස යාවත්කාලීන කරන ලදී.`);
        // ⚠️ වැදගත්: index.js හි body.startsWith(prefix) තවමත් . (dot) එකට Hardcode වී ඇත.
        // මෙය ක්‍රියාත්මක වීමට නම්, ඔබ index.js හි prefix විචල්‍යය Global Settings වලින් ගත යුතුය.
        // (පෙර පියවර 2 හි එය යාවත්කාලීන කර ඇත).
    } else {
        await reply('❌ Prefix වෙනස් කිරීමට නොහැකි විය.');
    }
});
