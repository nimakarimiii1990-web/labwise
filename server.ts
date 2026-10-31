import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Comprehensive Lab Discrepancy & Concordance Analysis
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { patientInfo, testResults, systemFlags } = req.body;

    const systemInstruction = `
شما یک متخصص ارشد پاتولوژی بالینی، بیوشیمی پزشکی و مشاور تضمین کیفیت آزمایشگاه تشخیص طبی هستید.
وظیفه شما بررسی نتایج ورودی آزمایش بیمار، اعتبارسنجی فیزیولوژیک متقاطع (Cross-Validation)، کشف خطاهای تحلیلی (Analytical) و پیش‌تحلیلی (Pre-analytical مانند همولیز، لخته، تداخل لوله EDTA با لوله کلات، سرم لیپمیک یا ایکتریک)، و ارائه راهنمای تصمیم‌گیری گام‌به‌گام برای اپراتور آزمایشگاه است.
همواره تحلیل خود را مستند بر رفرنس‌های بین‌المللی معتبر (مانند Tietz Textbook of Clinical Chemistry, Henry's Clinical Diagnosis, CLSI Guidelines, WHO) ارائه دهید.
پاسخ را ساختاریافته، دقیق، شفاف و به زبان فارسی علمی به همراه اصطلاحات استاندارد انگلیسی ارائه نمایید.
`;

    const promptText = `
اطلاعات نمونه و بیمار:
- سن: ${patientInfo?.age ?? 'نامشخص'} | جنسیت: ${patientInfo?.gender === 'male' ? 'مرد' : patientInfo?.gender === 'female' ? 'زن' : 'نامشخص'}
- بخش آزمایشگاه: ${patientInfo?.department ?? 'کلی'}
- شرایط بالینی / سابقه: ${patientInfo?.clinicalHistory ?? 'ثبت نشده'}

نتایج تست‌های ثبت شده:
${JSON.stringify(testResults, null, 2)}

مغایرت‌ها و عدم‌همخوانی‌های شناسایی شده توسط سیستم خودکار:
${JSON.stringify(systemFlags, null, 2)}

لطفاً موارد زیر را ارائه دهید:
۱. تحلیل فیزیوپاتولوژیک و بیوشیمیایی نتایج و همخوانی آن‌ها با یکدیگر (به خصوص نسبت‌ها و تطابق‌های بیولوژیکی مانند CK-MB نسبت به Total CPK، بیلی‌روبین مستقیم به توتال، AST/ALT، BUN/Cr، الکترولیت‌ها، کلسیم تصحیح‌شده با آلبومین).
۲. برآورد احتمال و منشأ خطای آزمایشگاهی (پیش‌تحلیلی، خطای دستگاه، کالیبراسیون، اثر ماتریس، یا پاتولوژی حاد بیمار).
۳. اقدامات توصیه‌شده فوری برای اپراتور آزمایشگاه (مانند بررسی بصری سرم، تکرار با رقت، بررسی کنترل کیفی QC، درخواست خون‌گیری مجدد در لوله مناسب، یا اعلام نتیجه بحرانی Panic Value به بخش بالینی).
۴. استناد به منابع علمی مرجع (Tietz, Henry, CLSI).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/analyze:', error);
    res.status(500).json({
      error: 'خطا در ارتباط با سرویس هوش مصنوعی',
      details: error?.message || String(error),
    });
  }
});

// Endpoint: Reagent QC & Technical Troubleshooting
app.post('/api/gemini/reagent-troubleshoot', async (req, res) => {
  try {
    const { reagentName, lotNumber, testCode, targetMean, targetSD, currentValues, issueDescription } = req.body;

    const systemInstruction = `
شما متخصص کنترل کیفی (QC) و پشتیبانی فنی کیت‌ها و محلول‌های بیوشیمی و ایمونولوژی (تولید و واردات) هستید.
با توجه به قوانین وستگارد (Westgard Rules: 1:2s, 1:3s, 2:2s, R:4s, 4:1s, 10:x) و رفتارهای منحنی کالیبراسیون و انحرافات تحلیلی (Systematic Shift vs Random Error)، راهنمایی فنی دقیق جهت ریشه‌یابی و حل مشکل محلول، کالیبراتور، آب مقطر، فتومتر، شستشو یا لایف‌تایم آنبورد محلول ارائه کنید.
`;

    const promptText = `
اطلاعات کیت و محلول:
- نام محلول: ${reagentName}
- کد تست: ${testCode}
- شماره لات / سری ساخت: ${lotNumber}
- میانگین هدف کنترل (Target Mean): ${targetMean} | انحراف معیار هدف (SD): ${targetSD}
- آخرین مقادیر اندازه‌گیری شده کنترل: ${JSON.stringify(currentValues)}
- شرح مشکل یا مشاهده اپراتور: ${issueDescription}

لطفاً ریشه‌یابی فنی، نوع خطا (سیستماتیک یا رندوم)، توصیه‌های فنی برای محلول و کالیبراتور و تصمیم‌گیری در خصوص پذیرش یا رد ران کاری (Run) را به زبان فارسی مشخص نمایید.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/reagent-troubleshoot:', error);
    res.status(500).json({
      error: 'خطا در عیب‌یابی فنی محلول',
      details: error?.message || String(error),
    });
  }
});

// Endpoint: General Lab Technologist Chat Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const systemInstruction = `
شما دستیار هوشمند و ارشد آزمایشگاه تشخیص طبی بالینی (LabWise AI) هستید.
تخصص شما در بخش‌های بیوشیمی بالینی، ایمونولوژی، هماتولوژی، هورمون‌شناسی، میکروب‌شناسی، ژنتیک مولکولی و کنترل کیفی محلول‌ها و تجهیزات است.
پاسخ‌های شما علمی، مبتنی بر شواهد پزشکی معتبر (CLSI, Tietz, IFCC) و دقیق بوده و به زبان فارسی سلیس و اصطلاحات پزشکی انگلیسی ارائه می‌شود.
`;

    const lastMessage = messages[messages.length - 1]?.text || 'سلام';
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
        temperature: 0.3,
      },
      history: history.length > 0 ? history : undefined,
    });

    const result = await chat.sendMessage({
      message: lastMessage,
    });

    res.json({ reply: result.text });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    res.status(500).json({
      error: 'خطا در گفتگوی هوشمند',
      details: error?.message || String(error),
    });
  }
});

// Endpoint: One-Click Full Project ZIP Downloader
app.get('/api/download-project', (_req, res) => {
  const zipPath = path.join(__dirname, 'public', 'labwise-project.zip');
  res.download(zipPath, 'labwise-complete-project.zip');
});



// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LabWise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
