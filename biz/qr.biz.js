const QrCode = require("qrcode");
const BaseException = require("../exceptions/base.exception");

class QRCodeBiz {
  async toAddURL(data) {
    try {
      const url = await QrCode.toDataURL(data, {
        width: 300,
      });
      return url;
    } catch (error) {
      throw BaseException("Unablet able to generate URL");
    }
  }
}
module.exports = QRCodeBiz;