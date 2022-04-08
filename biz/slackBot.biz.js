const BaseException = require('../exceptions/base.exception');
const S3Biz = require('./helpers/s3.biz');
const QRCodeBiz = require('./qr.biz');
const uuid = require("uuid").v4;
const fileType = require("file-type");

class SlackBotBiz {
  constructor() {
    this.qrBiz = new QRCodeBiz();
    this.s3Biz = new S3Biz();
  }

  // async init() {
  //   try {
  //     await this.app.start();
  //     console.log("Bot started");
  //   } catch (error) {
  //     throw BaseException("Unable to start");
  //   }
  // }

  async onQrCommand(payload) {
    try {
      console.log("payload", payload);
      const qr = await this.qrBiz.toAddURL(payload.text);
      const imageBase64 = qr.replace(/^data:image\/\w+;base64,/, "");
      let imageBuffer = Buffer.from(imageBase64, 'base64')
      let imageType = await fileType.fromBuffer(imageBuffer)
      let imageS3Path = `${payload.user_id.toLowerCase()}/${uuid()}.${imageType.ext}`;
      console.log("qr", imageS3Path, imageType);
      console.log('imageBuffer', imageBuffer);
      const imageUploadResult = await this.s3Biz.putImageObject(imageS3Path, imageBuffer, imageType.ext)
      console.log("imageUploadResult", imageUploadResult);
      return {
        url: `https://s3.amazonaws.com/${process.env.BUCKET_NAME}/${imageS3Path}`,
      };

    } catch (error) {
      console.error("error", error);
      throw BaseException("Unable to start");

    }
  }


}
module.exports = SlackBotBiz;