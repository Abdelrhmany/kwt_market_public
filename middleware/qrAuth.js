// Simple authentication middleware for QR code route
// This protects the QR code from unauthorized access

const qrAuth = (req, res, next) => {
  // Get secret from query parameter or header
  const secret = req.query.secret || req.headers['x-qr-secret'];
  const expectedSecret = process.env.QR_SECRET || 'kmt-admin-2024';

  if (!secret) {
    return res.status(401).send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>غير مصرح - QR Code</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin-top: 50px;
                  background-color: #f5f5f5;
              }
              .error {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  max-width: 500px;
                  margin: 0 auto;
              }
              h1 {
                  color: #d32f2f;
              }
              p {
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="error">
              <h1>⚠️ غير مصرح بالوصول</h1>
              <p>يجب توفير رمز سري للوصول إلى صفحة QR Code</p>
              <p>استخدم: <code>/back/qr?secret=YOUR_SECRET</code></p>
          </div>
      </body>
      </html>
    `);
  }

  if (secret !== expectedSecret) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>رمز خاطئ - QR Code</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin-top: 50px;
                  background-color: #f5f5f5;
              }
              .error {
                  background: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  max-width: 500px;
                  margin: 0 auto;
              }
              h1 {
                  color: #d32f2f;
              }
              p {
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="error">
              <h1>❌ رمز سري خاطئ</h1>
              <p>الرمز السري المقدم غير صحيح</p>
          </div>
      </body>
      </html>
    `);
  }

  next();
};

module.exports = qrAuth;

