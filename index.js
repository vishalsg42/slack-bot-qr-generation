const { SocketModeClient } = require('@slack/socket-mode');
const { WebClient } = require('@slack/web-api');
require("dotenv").config();
// const QRCodeBiz = require("./biz/qr.biz");
const SlackBotBiz = require("./biz/slackBot.biz");

async function main() {
  try {
    // const appToken = config.get("SLACK_APP_TOKEN")
    // const botToken = config.get("BOT_TOKEN")
    const appToken = process.env.SLACK_APP_TOKEN;
    const botToken = process.env.BOT_TOKEN;
    const socketModeClient = new SocketModeClient({ appToken });
    const slackBotBiz = new SlackBotBiz();
    await socketModeClient.start();
    const webClient = new WebClient(botToken);

    socketModeClient.on('slash_commands', async ({ body, ack }) => {
      console.log("body", body)
      if (body.command === "/qr") {
        if (body.text && body.text.length > 1) {
          let commandResult = await slackBotBiz.onQrCommand(body);
          console.log("commandResult", commandResult);
          // Only previewed to the user
          await ack({
            "text": "Generating QR Code...",
            "attachments": [
              {
                "color": "#3AA3E3",
                "image_url": `${commandResult.url}`,
                // "thumb_url": "https://st1.bollywoodlife.com/wp-content/uploads/2020/09/FotoJet382.jpg",
              },
            ],
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "View",
                "emoji": true
              },
              "value": "view_alternate_1"
            }
          });

          // Posted in the channel as a new message
          // await webClient.chat.postMessage({
          //   "attachments": [
          //     {
          //       "fallback": "QR generated",
          //       "color": "#3AA3E3",
          //       "attachment_type": "default",
          //       // "callback_id": "select_simple_1234",
          //       "image_url": "https://st1.bollywoodlife.com/wp-content/uploads/2020/09/FotoJet382.jpg",
          //       "thumb_url": "https://st1.bollywoodlife.com/wp-content/uploads/2020/09/FotoJet382.jpg",
          //     }
          //   ],
          //   text: "Generating QR Code.!!!!",
          //   channel: body.channel_id,
          // });
        } else {
          await ack({ "text": "Please provide the text" });
        }
      }
    });
  } catch (error) {
    console.log("main in script error", error);
  }
}
main()
  .then(() => {
    console.log("Successfully executed the script")
  })
  .catch((error) => {
    console.log("Script has some error")
    process.exit(1);
  })