const getTime = () => new Date().toISOString();

exports.logger = {
  info: (message) => {
    console.log(`[${getTime()}] INFO: ${message}`);
  },
  error: (message) => {
    console.error(`[${getTime()}] ERROR: ${message}`);
  }
};
