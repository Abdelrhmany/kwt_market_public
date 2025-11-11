# حل مشاكل Baileys

## المشكلة: خطأ 405 (Connection Failure)

### الحل 1: حذف ملفات المصادقة القديمة

إذا كنت تحصل على خطأ 405، قد تكون ملفات المصادقة القديمة تسبب المشكلة:

```bash
# احذف مجلد auth_info_baileys
rm -rf auth_info_baileys
# أو في Windows PowerShell:
Remove-Item -Recurse -Force auth_info_baileys
```

ثم أعد تشغيل السيرفر:
```bash
npm start
```

### الحل 2: التحقق من الإصدار

تأكد من أنك تستخدم أحدث إصدار من Baileys:

```bash
npm install @whiskeysockets/baileys@latest
```

### الحل 3: إعادة تثبيت المكتبات

```bash
rm -rf node_modules package-lock.json
npm install
```

### الحل 4: التحقق من الاتصال بالإنترنت

تأكد من أن السيرفر متصل بالإنترنت وأنه يمكنه الوصول إلى خوادم WhatsApp.

### الحل 5: استخدام VPN (إذا لزم الأمر)

في بعض المناطق، قد تحتاج VPN للاتصال بـ WhatsApp Web API.

## ملاحظات

- بعد حذف `auth_info_baileys`، ستحتاج لمسح QR Code مرة أخرى
- لا تشارك ملفات `auth_info_baileys` مع أحد
- إذا استمرت المشكلة، جرب إعادة تشغيل السيرفر بعد بضع دقائق

