const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const itemRoutes = require('./items');
const { getQRCode } = require('../config/whatsapp');
const qrAuth = require('../middleware/qrAuth');

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// QR Code route (protected)
router.get('/qr', qrAuth, (req, res) => {
  const qrCodeData = getQRCode();
  if (qrCodeData) {
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code - WhatsApp</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin-top: 50px;
                  background-color: #f5f5f5;
              }
              h1 {
                  color: #333;
              }
              img {
                  border: 5px solid #25D366;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
          </style>
      </head>
      <body>
          <h1>امسح رمز QR هذا باستخدام WhatsApp</h1>
          <img src="${qrCodeData}" alt="QR Code" />
      </body>
      </html>
    `);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>QR Code - WhatsApp</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  margin-top: 50px;
                  background-color: #f5f5f5;
              }
              h1 {
                  color: #666;
              }
          </style>
      </head>
      <body>
          <h1>جاري انتظار رمز QR...</h1>
      </body>
      </html>
    `);
  }
});

// Main admin page
router.get('/', (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>نظام المصادقة</title>
          <style>
              * {
                  box-sizing: border-box;
              }
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
              }
              .container {
                  max-width: 1200px;
                  margin: 0 auto;
              }
              h1 {
                  text-align: center;
                  color: white;
                  margin-bottom: 30px;
              }
              .forms-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                  gap: 20px;
              }
              .form-card {
                  background: white;
                  padding: 25px;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .form-card h2 {
                  margin-top: 0;
                  color: #333;
                  border-bottom: 2px solid #667eea;
                  padding-bottom: 10px;
              }
              .form-group {
                  margin-bottom: 15px;
              }
              label {
                  display: block;
                  margin-bottom: 5px;
                  color: #555;
                  font-weight: 500;
              }
              input {
                  width: 100%;
                  padding: 10px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  font-size: 14px;
              }
              input:focus {
                  outline: none;
                  border-color: #667eea;
              }
              button {
                  width: 100%;
                  padding: 12px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 16px;
                  font-weight: 600;
                  transition: transform 0.2s;
              }
              button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
              }
              .message {
                  margin-top: 10px;
                  padding: 10px;
                  border-radius: 5px;
                  display: none;
              }
              .message.success {
                  background-color: #d4edda;
                  color: #155724;
                  border: 1px solid #c3e6cb;
              }
              .message.error {
                  background-color: #f8d7da;
                  color: #721c24;
                  border: 1px solid #f5c6cb;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>نظام المصادقة</h1>
              <div class="forms-grid">
                  <div class="form-card">
                      <h2>تسجيل مستخدم جديد</h2>
                      <form id="register-form">
                          <div class="form-group">
                              <label for="register-phone">رقم الهاتف</label>
                              <input type="text" id="register-phone" required>
                          </div>
                          <div class="form-group">
                              <label for="register-username">اسم المستخدم</label>
                              <input type="text" id="register-username" required>
                          </div>
                          <div class="form-group">
                              <label for="register-password">كلمة المرور</label>
                              <input type="password" id="register-password" required>
                          </div>
                          <button type="submit">تسجيل</button>
                          <div class="message" id="register-message"></div>
                      </form>
                  </div>

                  <div class="form-card">
                      <h2>التحقق من الحساب</h2>
                      <form id="verify-form">
                          <div class="form-group">
                              <label for="verify-phone">رقم الهاتف</label>
                              <input type="text" id="verify-phone" required>
                          </div>
                          <div class="form-group">
                              <label for="verify-code">رمز التحقق</label>
                              <input type="text" id="verify-code" required>
                          </div>
                          <button type="submit">تحقق</button>
                          <div class="message" id="verify-message"></div>
                      </form>
                  </div>

                  <div class="form-card">
                      <h2>تسجيل الدخول</h2>
                      <form id="login-form">
                          <div class="form-group">
                              <label for="login-phone">رقم الهاتف</label>
                              <input type="text" id="login-phone" required>
                          </div>
                          <div class="form-group">
                              <label for="login-password">كلمة المرور</label>
                              <input type="password" id="login-password" required>
                          </div>
                          <button type="submit">دخول</button>
                          <div class="message" id="login-message"></div>
                      </form>
                  </div>

                  <div class="form-card">
                      <h2>إعادة تعيين كلمة المرور</h2>
                      <form id="reset-password-form">
                          <div class="form-group">
                              <label for="reset-phone">رقم الهاتف</label>
                              <input type="text" id="reset-phone" required>
                          </div>
                          <button type="submit">إرسال رمز التحقق</button>
                          <div class="message" id="reset-message"></div>
                      </form>
                  </div>

                  <div class="form-card">
                      <h2>تحديث كلمة المرور</h2>
                      <form id="update-password-form">
                          <div class="form-group">
                              <label for="update-phone">رقم الهاتف</label>
                              <input type="text" id="update-phone" required>
                          </div>
                          <div class="form-group">
                              <label for="update-code">رمز التحقق</label>
                              <input type="text" id="update-code" required>
                          </div>
                          <div class="form-group">
                              <label for="update-password">كلمة المرور الجديدة</label>
                              <input type="password" id="update-password" required>
                          </div>
                          <button type="submit">تحديث كلمة المرور</button>
                          <div class="message" id="update-message"></div>
                      </form>
                  </div>
              </div>
          </div>
          <script>
              async function postData(url, data) {
                  try {
                      const response = await fetch(url, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                      });
                      const result = await response.json();
                      return { success: response.ok, data: result };
                  } catch (error) {
                      return { success: false, data: { error: error.message } };
                  }
              }

              function showMessage(formId, message, isSuccess) {
                  const messageEl = document.getElementById(formId + '-message');
                  messageEl.textContent = message;
                  messageEl.className = 'message ' + (isSuccess ? 'success' : 'error');
                  messageEl.style.display = 'block';
                  setTimeout(() => {
                      messageEl.style.display = 'none';
                  }, 5000);
              }

              document.getElementById('register-form').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const phoneNumber = document.getElementById('register-phone').value;
                  const username = document.getElementById('register-username').value;
                  const password = document.getElementById('register-password').value;
                  const result = await postData('/back/auth/register', { phoneNumber, username, password });
                  showMessage('register', result.data.message || result.data.error, result.success);
              });

              document.getElementById('verify-form').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const phoneNumber = document.getElementById('verify-phone').value;
                  const verificationCode = document.getElementById('verify-code').value;
                  const result = await postData('/back/auth/verify', { phoneNumber, verificationCode });
                  if (result.success && result.data.token) {
                      localStorage.setItem('token', result.data.token);
                      showMessage('verify', 'تم التحقق بنجاح! تم حفظ رمز الدخول.', true);
                  } else {
                      showMessage('verify', result.data.error || result.data.message, false);
                  }
              });

              document.getElementById('login-form').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const phoneNumber = document.getElementById('login-phone').value;
                  const password = document.getElementById('login-password').value;
                  const result = await postData('/back/auth/login', { phoneNumber, password });
                  if (result.success && result.data.token) {
                      localStorage.setItem('token', result.data.token);
                      showMessage('login', 'تم تسجيل الدخول بنجاح!', true);
                  } else {
                      showMessage('login', result.data.error || result.data.message, false);
                  }
              });

              document.getElementById('reset-password-form').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const phoneNumber = document.getElementById('reset-phone').value;
                  const result = await postData('/back/auth/reset-password', { phoneNumber });
                  showMessage('reset', result.data.message || result.data.error, result.success);
              });

              document.getElementById('update-password-form').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const phoneNumber = document.getElementById('update-phone').value;
                  const verificationCode = document.getElementById('update-code').value;
                  const newPassword = document.getElementById('update-password').value;
                  const result = await postData('/back/auth/update-password', { phoneNumber, verificationCode, newPassword });
                  showMessage('update', result.data.message || result.data.error, result.success);
              });
          </script>
      </body>
      </html>
  `);
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);

module.exports = router;

