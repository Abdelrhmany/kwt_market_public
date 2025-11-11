const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require('@whiskeysockets/baileys');
const qrcode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

let qrCodeData = null;
let socket = null;
let isReady = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Ensure auth folder exists
const authFolder = path.join(__dirname, '../auth_info_baileys');
if (!fs.existsSync(authFolder)) {
  fs.mkdirSync(authFolder, { recursive: true });
}

const initializeWhatsApp = async () => {
  // Reset socket if not ready
  if (socket && !isReady) {
    socket = null;
  }

  if (socket && isReady) {
    return socket;
  }

  try {
    // Fetch latest version info
    const { version } = await fetchLatestBaileysVersion();
    console.log(`Using Baileys version: ${version.join('.')}`);

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    socket = makeWASocket({
      auth: state,
      version,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['KMT Backend', 'Chrome', '1.0.0'],
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 10000,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: false,
      syncFullHistory: false,
    });

    socket.ev.on('creds.update', saveCreds);

    // QR Code generation
    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('📱 QR Code received, generating...');
        reconnectAttempts = 0; // Reset on QR code
        try {
          qrCodeData = await qrcode.toDataURL(qr);
          console.log('✅ QR Code generated. Visit /back/qr to scan it.');
        } catch (err) {
          console.error('❌ Error generating QR Code:', err);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

        console.log(
          `⚠️ Connection closed. Status: ${statusCode}, Reason: ${DisconnectReason[statusCode] || 'Unknown'}`
        );

        if (shouldReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`🔄 Reconnecting... (Attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
          
          // Wait before reconnecting
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Reset socket
          socket = null;
          isReady = false;
          
          // Retry connection
          initializeWhatsApp().catch(err => {
            console.error('❌ Reconnection failed:', err.message);
          });
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error('❌ Max reconnection attempts reached. Please restart the server.');
          qrCodeData = null;
          isReady = false;
          socket = null;
        } else {
          console.log('❌ Logged out. Please scan QR code again.');
          qrCodeData = null;
          isReady = false;
          socket = null;
          
          // Delete auth files to force new QR code
          try {
            const files = fs.readdirSync(authFolder);
            files.forEach(file => {
              fs.unlinkSync(path.join(authFolder, file));
            });
            console.log('🗑️ Auth files cleared. New QR code will be generated.');
          } catch (err) {
            console.error('Error clearing auth files:', err);
          }
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp Client is ready!');
        isReady = true;
        reconnectAttempts = 0;
        qrCodeData = null; // Clear QR code after successful connection
      } else if (connection === 'connecting') {
        console.log('🔄 Connecting to WhatsApp...');
      }
    });

    return socket;
  } catch (error) {
    console.error('❌ Error initializing WhatsApp:', error.message);
    socket = null;
    isReady = false;
    throw error;
  }
};

// Send message function
const sendMessage = async (phoneNumber, message) => {
  if (!socket || !isReady) {
    throw new Error('WhatsApp client is not ready yet');
  }

  try {
    // Format phone number (remove + and add @s.whatsapp.net)
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    
    // Validate phone number
    if (cleanNumber.length < 10) {
      throw new Error('Invalid phone number format');
    }
    
    const jid = `${cleanNumber}@s.whatsapp.net`;

    await socket.sendMessage(jid, {
      text: message,
    });

    console.log(`✅ Message sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    throw error;
  }
};

const getQRCode = () => qrCodeData;
const getSocket = () => socket;
const isClientReady = () => socket && isReady;

module.exports = {
  initializeWhatsApp,
  getQRCode,
  getSocket,
  sendMessage,
  isClientReady,
};
