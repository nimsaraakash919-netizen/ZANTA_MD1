const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "Displays all available commands",
    category: "main",
    filename: __filename,
  },
  async (
    zanta,
    mek,
    m,
    {
      from,
      pushname,
      reply
    }
  ) => {
try {
      const config = await readEnv();
      let menu = {
        main: "",
        download: "",
        group: "",
        owner: "",
        convert: "",
        search: "",
      };

      for (let i = 0; i < commands.length; i++) {
        if (commands[i].pattern && !commands[i].dontAddCommandList) {
          menu[
            commands[i].category
          ] += `${config.PREFIX}${commands[i].pattern}\n`;
        }
      }

      let madeMenu = `👋 *Hello  ${pushname}*


| *MAIN COMMANDS* |
    ▫️.alive
    ▫️.menu
    ▫️.ai <text>
    ▫️.system
    ▫️.owner
| *DOWNLOAD COMMANDS* |
    ▫️.song <text>
    ▫️.video <text>
    ▫️.fb <link>
| *GROUP COMMANDS* |
${menu.group}
| *OWNER COMMANDS* |
    ▫️.restart
    ▫️.update
| *CONVERT COMMANDS* |
    ▫️.sticker <reply img>
    ▫️.img <reply sticker>
    ▫️.tr <lang><text>
    ▫️.tts <text>
| *SEARCH COMMANDS* |
    ▫️.tts <text>
${menu.search}


🥶𝐌𝐚𝐝𝐞 𝐛𝐲 Akash🥶

> ZANTA MENU MSG
`;
      await zanta.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/ChatGPT%20Image%20Nov%2021,%202025,%2001_49_53%20AM.png?raw=true",
          },
          caption: madeMenu,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log(e);
      reply(`${e}`);
    }
  }
);




