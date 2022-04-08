exports.base64MimeType = (encoded) => {
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}