const { cmd, commands } = require("../command");

const checkAdminRights = (reply, isGroup, isBotAdmins, isAdmins) => {
    if (!isGroup) {
        reply("*This command can only be used in a Group!* 🙁");
        return false;
    }
    if (!isBotAdmins) {
        reply("*I need to be an Admin in this group to use this command!* 🤖❌");
        return false;
    }
    if (!isAdmins) {
        reply("*You must be an Admin to use Group Management commands!* 👮‍♂️❌");
        return false;
    }
    return true;
};

const getTargetJid = (mentionedJid, quoted) => {
    let targetJid = null;
    if (mentionedJid && mentionedJid.length > 0) {
        targetJid = mentionedJid[0];
    } else if (quoted) {
        targetJid = quoted.sender;
    }
    return targetJid;
};

// --- KICK COMMAND ---
cmd(
  {
    pattern: "kick",
    alias: ["remove"],
    react: "👋",
    desc: "Kicks a mentioned/replied user from the group.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins, mentionedJid, quoted }) => {
    try {
      if (!checkAdminRights(reply, isGroup, isBotAdmins, isAdmins)) return;

      const targetJid = getTargetJid(mentionedJid, quoted);

      if (!targetJid) {
        return reply("*Please mention or reply to the user you want to kick.* 🧑‍💻");
      }
      
      reply("*Kicking user... 👋*");
      
      await zanta.groupParticipantsUpdate(from, [targetJid], "remove");
      
      return reply(`*User successfully kicked! 🫡✅*`);
      
    } catch (e) {
      console.error(e);
      // More specific error handling needed for 403 (Target is higher admin)
      reply(`*Error:* Failed to perform the kick operation. The target might be an admin. ${e.message || e}`);
    }
  }
);

// --- PROMOTE COMMAND ---
cmd(
  {
    pattern: "promote",
    react: "👑",
    desc: "Promotes a mentioned/replied user to Group Admin.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins, mentionedJid, quoted }) => {
    try {
      if (!checkAdminRights(reply, isGroup, isBotAdmins, isAdmins)) return;

      const targetJid = getTargetJid(mentionedJid, quoted);

      if (!targetJid) {
        return reply("*Please mention or reply to the user you want to promote.* 👑");
      }
      
      reply("*Promoting user... ⬆️*");
      
      await zanta.groupParticipantsUpdate(from, [targetJid], "promote");
      
      return reply(`*User successfully promoted to Admin! 👑✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to perform the promote operation. ${e.message || e}`);
    }
  }
);

// --- DEMOTE COMMAND ---
cmd(
  {
    pattern: "demote",
    react: "🔻",
    desc: "Demotes a mentioned/replied Group Admin to a regular member.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins, mentionedJid, quoted }) => {
    try {
      if (!checkAdminRights(reply, isGroup, isBotAdmins, isAdmins)) return;

      const targetJid = getTargetJid(mentionedJid, quoted);

      if (!targetJid) {
        return reply("*Please mention or reply to the Admin you want to demote.* 🔻");
      }
      
      reply("*Demoting user... ⬇️*");
      
      await zanta.groupParticipantsUpdate(from, [targetJid], "demote");
      
      return reply(`*Admin successfully demoted! 🧑‍💻✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to perform the demote operation. ${e.message || e}`);
    }
  }
);
