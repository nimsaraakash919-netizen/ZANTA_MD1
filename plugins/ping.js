const { cmd } = require("../command");
const os = require('os');
const { runtime, sleep } = require('../lib/functions'); // Assuming 'runtime' is available here

// Helper function to format bytes to a readable string
function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

cmd(
    {
        pattern: "ping",
        react: "⏱️",
        desc: "Check the bot's response time and display system information.",
        category: "main",
        filename: __filename,
    },
    async (
        zanta,
        mek,
        m,
        {
            from,
            reply,
        }
    ) => {
        try {
            // 1. Response Time (Latency) Calculation
            const startTime = Date.now();
            await reply("*Pong!* ⚡️ Calculating latency...");
            const endTime = Date.now();
            const latency = endTime - startTime;

            // 2. System and Bot Data Collection
            // Get memory usage of the current Node.js process
            const memoryUsage = process.memoryUsage(); 
            // Get total system memory and free memory
            const totalMemory = os.totalmem();
            const freeMemory = os.freemem();
            
            // Note: PM2 specific details (ID, PID, Mode) require a separate PM2 API call 
            // which is complex to add to a plugin. We will provide standard Node.js/OS data.
            
            let pm2_details = "";
            
            // Check if running under PM2 (using common PM2 environment variable)
            if (process.env.NODE_APP_INSTANCE !== undefined) {
                 pm2_details = `
**⚙️ Process Details (PM2)**
- *Mode:* Fork (Assumed)
- *PID:* ${process.pid}
- *Uptime:* ${runtime(process.uptime())}
- *Status:* Online (Assumed)
`;
            } else {
                 pm2_details = `
**⚙️ Process Details**
- *PID:* ${process.pid}
- *Uptime:* ${runtime(process.uptime())}
`;
            }


            // 3. Constructing the formatted Reply Message
            const pingMessage = `
*╭━━━*「 *ZANTA-MD STATUS* 」*━━━╮*
*┃ ⏱️ Latency:* ${latency} ms
*┃ 🌐 Platform:* ${os.platform()}
*┃ 💻 Node Version:* ${process.version}
*╰━━━━━━━━━━━━━━━━━━╯*

*╭━━━*「 *System Resources* 」*━━━╮*
*┃ 🧠 Process RAM:* ${bytesToSize(memoryUsage.rss)}
*┃ 📊 Total System RAM:* ${bytesToSize(totalMemory)}
*┃ 📊 Free System RAM:* ${bytesToSize(freeMemory)}
*╰━━━━━━━━━━━━━━━━━━╯*
${pm2_details}
`;
            
            // 4. Send the final formatted message (replacing the initial "Pong" reply)
            await zanta.sendMessage(from, { text: pingMessage }, { quoted: mek });


        } catch (e) {
            console.error("[PING ERROR]", e);
            reply("*🚨 Error:* Bot තොරතුරු ලබා ගැනීමට අසමත් විය.");
        }
    }
);
