# LabWise – برنامه کامل تست‌های آزمایشگاهی (نسخه به‌روز با تست‌های جدید)

## محتویات این بسته

1. **پروژه کامل وب‌اپلیکیشن LabWise** (Vite + React + TypeScript + Firebase)
2. **تست‌های جدید اضافه‌شده**: ADA, ACE, D-Dimer, Microalbumin, Urine Protein, Bile Acids, Lp(a), ApoA-I, ApoB
   - محدوده مرجع، اهمیت بالینی، عوامل تداخل، منابع معتبر، و یادداشت‌های تحلیلی (CV% و Bias)
3. **فایل‌های PDF پارامتر دستگاه‌ها** (پوشه `device-pdfs/`):
   - `00_InterMethod_Comparison_Error_Coefficients.pdf` → جدول مقایسه CV و Bias + توضیحات خطا با رفرنس
   - PDF جداگانه برای هر دستگاه: Rayto 420/800, Mindray BS series, Hitachi 902/704/717/912, Biolis 24i/50i, Dirui CS 400/800, Selectra
4. فایل‌های اصلی Excel و PDF دستگاه‌ها در پوشه attachments اصلی نگه داشته شده‌اند.

## نحوه بارگذاری و اجرا (کاملاً رایگان)

### گزینه ۱: اجرای محلی (ساده‌ترین)
```bash
# نیاز به Node.js 18+ و bun یا npm
cd labwise-final
bun install   # یا npm install
bun run dev   # یا npm run dev
```
سپس در مرورگر: http://localhost:5173

### گزینه ۲: استقرار رایگان روی Firebase Hosting (توصیه)
1. حساب رایگان در https://console.firebase.google.com بسازید.
2. پروژه جدید ایجاد کنید.
3. Firebase CLI را نصب کنید: `npm install -g firebase-tools`
4. در پوشه پروژه:
```bash
firebase login
firebase init hosting   # پوشه dist را انتخاب کنید
bun run build
firebase deploy
```
آدرس رایگان شما: `https://YOUR-PROJECT.web.app`

### گزینه ۳: Vercel / Netlify (رایگان)
- پوشه پروژه را به GitHub پوش کنید.
- در Vercel یا Netlify Import کنید.
- Build command: `bun run build` یا `npm run build`
- Output: `dist`

## مسیر فایل‌های مهم
- کاتالوگ تست‌ها: `src/data/testsCatalog.ts`
- پارامترهای دستگاه (PDF): `device-pdfs/`
- کامپوننت‌های اصلی: `src/components/`
- سرویس توافق‌سنجی: `src/services/concordanceEngine.ts`

## نکات علمی
- ضرایب خطا و Bias از منابع IFCC, CLSI, ISTH, Tietz, KDIGO, EASL استخراج شده‌اند.
- برای تست‌هایی با Bias بالا (D-Dimer, Lp(a), ACE) همیشه با همان دستگاه/کیت پایش کنید.
- محدوده مرجع ممکن است بسته به جمعیت و روش تغییر کند؛ اعتبارسنجی محلی توصیه می‌شود.

ساخته‌شده برای استفاده رایگان در آزمایشگاه‌های بالینی ایران.
تماس پشتیبانی نمونه: www.tksmed.ir
