const fs = require('fs');
const path = require('path');

// Buat folder logs kalau belum ada
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Path untuk file log
const accessLogPath = path.join(logsDir, 'access.log');
const errorLogPath = path.join(logsDir, 'error.log');

// Fungsi untuk menulis log ke file
const writeLog = (filePath, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFile(filePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms - IP: ${req.ip}`;

    // Log ke console (untuk development)
    console.log(message);

    // Log ke file access.log (semua request)
    writeLog(accessLogPath, message);

    // Log ke file error.log (hanya error 4xx dan 5xx)
    if (res.statusCode >= 400) {
      writeLog(errorLogPath, `ERROR - ${message}`);
    }
  });

  next();
};

module.exports = logger;
