import { CapabilityItem, PromptTemplate, FaqItem } from '../types';

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'frontend-modern',
    titleFa: 'مهندسی فرانت‌اند و رابط‌های کاربری مدرن',
    titleEn: 'Modern Frontend & UI/UX Engineering',
    category: 'frontend',
    descriptionFa: 'طراحی و پیاده‌سازی رابط‌های کاربری پیشرفته، پاسخ‌گرا (Responsive) و مطابق بالاترین استانداردهای بصری و تعاملی بدون کلیشه‌های تکراری هوش مصنوعی.',
    descriptionEn: 'Building refined, responsive user interfaces following human design principles and zero generic AI clichés.',
    featuresFa: [
      'توسعه با React 19، تایپ‌اسکریپت و Tailwind CSS نسخه ۴',
      'انیمیشن‌های سیال با Motion و میکرواینتراکشن‌های روان زیر ۲۰۰ میلی‌ثانیه',
      'پشتیبانی کامل از زبان‌های راست‌به‌چپ (RTL) مانند فارسی و چیدمان‌های چندزبانه',
      'سیستم رنگی استاندارد ۶۰-۳۰-۱۰، تایپوگرافی سلسله‌مراتبی و کنتراست دسترسی‌پذیری WCAG AA',
      'ساخت پروتوتایپ‌های تعاملی، داشبوردهای آماری، لندینگ‌پیج‌ها و وب‌اپ‌های موبایل (PWA)'
    ],
    featuresEn: [
      'Development with React 19, TypeScript and modern Tailwind CSS',
      'Fluid micro-interactions and transitions with Motion',
      'Full RTL/LTR bilingual support and localized interfaces',
      'Rigorous 60-30-10 color allocation and WCAG AA accessibility',
      'Interactive prototypes, analytical dashboards, marketing landing pages and PWAs'
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Lucide Icons'],
    examplePromptFa: 'یک داشبورد مدیریت مالی شخصی به زبان فارسی با نمودارهای تعاملی، بودجه‌بندی ماهانه و طراحی تمیز مدرن بساز.',
    examplePromptEn: 'Build a personal finance management dashboard with interactive charts, monthly budgeting, and clean modern aesthetic.',
    isPopular: true
  },
  {
    id: 'backend-express',
    titleFa: 'توسعه بک‌اند و طراحی وب‌سرویس‌های RESTful',
    titleEn: 'Full-Stack Backend & RESTful APIs',
    category: 'backend',
    descriptionFa: 'راه‌اندازی سرورهای مستقل Express بر بستر Node.js و TypeScript، مدیریت روت‌های امن API، پروکسی درخواست‌ها و پردازش سمت سرور.',
    descriptionEn: 'Spinning up standalone Express servers with Node.js and TypeScript, handling secure API routes, proxies, and business logic.',
    featuresFa: [
      'ساخت سرور Express روی پورت ۳۰۰۰ و هماهنگی کامل با سرور توسعه Vite',
      'روت‌های اختصاصی برای مخفی‌سازی کلیدهای حساس و ارتباط با سرویس‌های هوش مصنوعی',
      'اعتبارسنجی ورودی‌ها، کنترل خطا و پردازش فایل‌ها و داده‌های ورودی',
      'پشتیبانی از رویدادهای زنده، وب‌سوکت و پردازش چندمرحله‌ای وظایف'
    ],
    featuresEn: [
      'Express server on port 3000 seamlessly mounted with Vite dev server',
      'Secure server-side API proxy routes preventing API key exposure',
      'Input validation, structured error handling, and file processing pipelines',
      'Real-time communication and multi-step background processing'
    ],
    techStack: ['Node.js', 'Express', 'TypeScript', 'TSX', 'REST API', 'WebSockets'],
    examplePromptFa: 'یک وب‌سرویس مدیریت پروژه‌ها و وظایف تیمی با قابلیت دسته‌بندی و فیلترهای پیشرفته بنویس.',
    examplePromptEn: 'Build a team project and task management service with advanced filtering and status pipelines.',
    isPopular: true
  },
  {
    id: 'database-cloudsql-firebase',
    titleFa: 'پایگاه‌های داده ابری (PostgreSQL و Firestore)',
    titleEn: 'Cloud Databases & Realtime Storage',
    category: 'database',
    descriptionFa: 'اتصال خودکار به پایگاه‌های داده رابطه‌ای پیشرفته (Cloud SQL PostgreSQL) یا پایگاه داده سندی هم‌زمان (Firebase Firestore) با سیستم احراز هویت.',
    descriptionEn: 'Automated provisioning of Cloud SQL PostgreSQL relational databases or Firebase Firestore realtime databases with built-in Auth.',
    featuresFa: [
      'راه‌اندازی پایگاه داده رابطه‌ای PostgreSQL در محیط Cloud SQL با Drizzle ORM',
      'پایگاه داده سندی Firebase Firestore با قابلیت هم‌گام‌سازی لحظه‌ای (Real-time)',
      'سیستم ثبت‌نام و ورود کاربران (Firebase Authentication)',
      'طراحی قوانین امنیتی سطح بالا (Firestore Security Rules) و کنترل دسترسی نقش‌محور (RBAC)',
      'اجرای سریع مایگریشن‌ها و کوئری‌های SQL به صورت خودکار'
    ],
    featuresEn: [
      'Cloud SQL PostgreSQL relational provisioning with Drizzle ORM schemas',
      'Firebase Firestore NoSQL database with realtime event synchronization',
      'User signup, login and session handling via Firebase Auth',
      'Granular security rules (firestore.rules) and role-based access control (RBAC)',
      'Automatic migration execution and verified schema updates'
    ],
    techStack: ['PostgreSQL', 'Cloud SQL', 'Firebase Firestore', 'Firebase Auth', 'Drizzle ORM'],
    examplePromptFa: 'یک پایگاه داده برای فروشگاه اینترنتی شامل جدول کاربران، سفارشات و محصولات با PostgreSQL طراحی کن.',
    examplePromptEn: 'Provision a relational PostgreSQL schema for an e-commerce shop with users, orders, and inventory tables.'
  },
  {
    id: 'multimodal-ai-gemini',
    titleFa: 'ادغام هوش مصنوعی چندوجهی Gemini',
    titleEn: 'Multimodal AI & Gemini API Integration',
    category: 'ai',
    descriptionFa: 'استفاده از آخرین مدل‌های هوش مصنوعی گوگل (سری Gemini 2.5 Flash و Pro) برای متن، پردازش اسناد، بینایی ماشین، استدلال و ابزارها.',
    descriptionEn: 'Direct integration of Google Gemini 2.5 Flash and Pro models for reasoning, vision, document understanding, and smart tooling.',
    featuresFa: [
      'استفاده از کتابخانه رسمی جدید @google/genai TypeScript SDK',
      'پشتیبانی از ورودی متن، تحلیل تصاویر، نمودارها و اسناد پی‌دی‌اف',
      'سیستم پاسخ‌گویی جریانی (Streaming) و چت محاوره‌ای چندمرحله‌ای',
      'قابلیت اتصال به وب و جستجوی گوگل (Google Search Grounding) برای اطلاعات لحظه‌ای',
      'فراخوانی توابع و ابزارها (Function Calling / Structured Tool Use)'
    ],
    featuresEn: [
      'Built with the modern official @google/genai TypeScript SDK',
      'Multimodal input: text prompts, image inspection, chart parsing, and documents',
      'Token streaming responses and multi-turn conversational agents',
      'Real-time web grounding via Google Search Integration',
      'Structured JSON output generation and programmatic function calling'
    ],
    techStack: ['@google/genai', 'Gemini 2.5 Flash', 'Gemini 2.5 Pro', 'Multimodal Vision', 'Search Grounding'],
    examplePromptFa: 'یک ابزار هوشمند تحلیل اسناد مالی و فاکتور بساز که با آپلود عکس فاکتور، اقلام و جمع مبلغ را استخراج کند.',
    examplePromptEn: 'Create an invoice analyzer that parses uploaded receipt images and automatically extracts itemized tables and totals.',
    isPopular: true
  },
  {
    id: 'integrations-workspace-maps',
    titleFa: 'اتصال به سرویس‌های گوگل (Google Maps & Workspace)',
    titleEn: 'Google Maps & Workspace Ecosystem',
    category: 'integrations',
    descriptionFa: 'ادغام مستقیم با ابزارهای روزمره ابری گوگل نظیر Google Maps Platform و Google Workspace (Drive, Sheets, Calendar, Gmail).',
    descriptionEn: 'Seamless native integration with Google Maps Platform and Google Workspace tools (Sheets, Drive, Calendar, Gmail).',
    featuresFa: [
      'نقشه‌های تعاملی، مسیریابی، مکان‌یابی و نمایش نقاط روی Google Maps',
      'اتصال مستقیم به Google Sheets برای ذخیره یا خواندن اطلاعات به صورت زنده',
      'همگام‌سازی رویدادها با Google Calendar و خواندن اسناد از Google Drive',
      'سیستم احراز هویت اختصاصی OAuth کلاینت‌ساید برای حفظ محرمانگی کاربران'
    ],
    featuresEn: [
      'Interactive maps, geolocation, route calculation, and place details via Google Maps',
      'Read/write synchronization with Google Sheets as lightweight databases',
      'Automated Google Calendar event creation and Google Drive file picker flows',
      'Client-side OAuth consent flows maintaining user security'
    ],
    techStack: ['Google Maps API', 'Google Sheets API', 'Google Calendar', 'OAuth 2.0', 'Drive Picker'],
    examplePromptFa: 'یک سامانه رزرو نوبت بساز که نوبت‌ها را در گوگل کلندر ثبت کرده و گزارش خلاصه را به گوگل شیت بفرستد.',
    examplePromptEn: 'Build an appointment booking system that logs events into Google Calendar and saves attendees to Google Sheets.'
  },
  {
    id: 'transformation-figma-code',
    titleFa: 'تبدیل طرح فیگما و بازنویسی کد (Figma & GitHub)',
    titleEn: 'Figma-to-Code & Code Migration',
    category: 'transformation',
    descriptionFa: 'تبدیل مستقیم طرح‌های رابط کاربری در نرم‌افزار Figma به کدهای تمیز React و Tailwind، و ارتقا یا بازنویسی پروژه‌های قدیمی گیت‌هاب.',
    descriptionEn: 'Translating visual Figma layouts into clean, production React code, or modernizing and migrating legacy GitHub codebases.',
    featuresFa: [
      'خواندن طرح‌های پیوست‌شده از Figma و تبدیل به ساختار کامپوننتی استاندارد',
      'حفظ دقیق فاصله‌ها، گرادینت‌ها، تایپوگرافی و ساختار انعطاف‌پذیر',
      'مایگریشن و تبدیل پروژه‌ها از فریم‌ورک‌های متفرقه به React 19 و Vite',
      'دیباگ لحظه‌ای و بازبینی ساختار فایل‌ها با رعایت بهترین الگوهای Clean Code'
    ],
    featuresEn: [
      'Interpreting Figma design screenshots and transforming them into React components',
      'Pixel-conscious spacing, typography, and theme token preservation',
      'Refactoring and migrating legacy codebases into modern React 19 + Tailwind',
      'Automated TypeScript type checking and instant compilation verification'
    ],
    techStack: ['Figma Importer', 'Code Migration', 'TypeScript Compiler', 'Clean Architecture'],
    examplePromptFa: 'طرح فیگمای پیوست‌شده را به کامپوننت‌های ماژولار و ریسپانسیو ری‌اکت تبدیل کن.',
    examplePromptEn: 'Port the attached Figma screen into modular, accessible React components with Tailwind CSS.'
  }
];

export const PRICING_DETAILS = {
  isFreeFa: 'بله، به طور کامل می‌توانید رایگان شروع کنید و پروژه‌ها را بسازید!',
  isFreeEn: 'Yes, you can build, explore, and prototype completely for free!',
  summaryFa: 'محیط ساخت AI Studio و موتور کدنویسی آن رایگان است. همچنین مدل‌های اصلی جمنای (مانند Gemini 2.5 Flash) دارای یک سهمیه رایگان روزانه بسیار سخاوتمندانه (Free Tier) هستند که برای ساخت، آزمایش، اجرا و یادگیری هیچ هزینه‌ای در بر ندارد.',
  summaryEn: 'The AI Studio Build coding engine is free to use. Furthermore, core models such as Gemini 2.5 Flash come with generous Free Tier quotas allowing developers to build, test, and iterate without upfront costs.',
  tiers: [
    {
      nameFa: 'پلن رایگان برای ساخت و آزمایش (Free Tier)',
      nameEn: 'Build Sandbox & Free Tier',
      priceFa: '۰ تومان / کاملاً رایگان',
      priceEn: '$0 / Free forever',
      badgeFa: 'پیش‌فرض برای همه',
      badgeEn: 'Default for all users',
      descriptionFa: 'ایده‌آل برای ساخت وب‌اپلیکیشن‌ها، تست ایده‌ها، طراحی رابط کاربری و استفاده دانشجویی و استارتاپی در مرحله اولیه.',
      descriptionEn: 'Ideal for building complete web apps, validating product ideas, and early prototyping.',
      highlightsFa: [
        'دسترسی رایگان به موتور برنامه‌نویسی و ساخت کامل کدهای فول‌استک',
        'محیط توسعه زنده (Live Dev Sandbox) با پیش‌نمایش در مرورگر',
        'سهمیه رایگان روزانه برای مدل‌های هوش مصنوعی Gemini (تا ۱۵ درخواست در دقیقه و ۱۵۰۰ درخواست روزانه در مدل‌های Flash)',
        'امکان ایجاد پایگاه‌های داده رایگان (Firebase Spark Plan و Developer Database)',
        'امکان دانلود سورس کد و استقرار در هر هاست دلخواه',
        'عدم نیاز به وارد کردن کارت اعتباری بین‌المللی برای شروع'
      ],
      highlightsEn: [
        'Free access to senior engineering coding engine and full-stack generation',
        'Live in-browser preview development environment',
        'Generous daily quotas for Gemini Flash models (up to 15 RPM / 1500 RPD)',
        'Free tier storage available (Firebase Spark & Developer Cloud SQL)',
        'Full source code ownership — export and run anywhere',
        'No credit card required to start building'
      ]
    },
    {
      nameFa: 'پلن تجاری و مقیاس‌پذیر (Pay-as-you-go)',
      nameEn: 'Production & Scaled Tier',
      priceFa: 'پرداخت به میزان مصرف (Pay-per-use)',
      priceEn: 'Pay per token consumed',
      badgeFa: 'اختیاری برای ترافیک میلیونی',
      badgeEn: 'Optional for high scale',
      descriptionFa: 'زمانی فعال می‌شود که پروژه خود را برای هزاران کاربر عمومی در ماه راه‌اندازی کنید و سهمیه رایگان روزانه پر شود.',
      descriptionEn: 'Only required when deploying to tens of thousands of active public users exceeding free rate limits.',
      highlightsFa: [
        'حذف کامل محدودیت‌های درخواست در دقیقه (Rate Limits)',
        'پشتیبانی از ترافیک سازمانی و ترافیک لحظه‌ای سنگین',
        'هزینه فوق‌العاده ارزان به ازای هر ۱ میلیون توکن ورودی و خروجی در مدل‌های مدرن Flash',
        'اتصال مستقیم به گوگل کلود (Google Cloud Billing)'
      ],
      highlightsEn: [
        'Removal of rate limits for large-scale enterprise deployments',
        'High-concurrency support for thousands of simultaneous sessions',
        'Fraction-of-a-cent pricing per million tokens with modern Flash models',
        'Direct billing integration with Google Cloud Platform'
      ]
    }
  ]
};

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'ai-doc-analyzer',
    titleFa: 'سیستم هوشمند تحلیل و پرسش‌وپاسخ اسناد',
    titleEn: 'Smart AI Document & Contract Analyzer',
    category: 'هوش مصنوعی و ابزار تحلیلی',
    complexity: 'متوسط',
    estimatedTimeFa: '۲ الی ۳ دقیقه ساخت',
    promptFa: 'یک وب‌اپلیکیشن به زبان فارسی برای آپلود و تحلیل اسناد متنی و PDF بساز. کاربران بتوانند سند را آپلود کرده و از محتوای آن سوال بپرسند. برنامه باید خلاصه اجرایی، نکات کلیدی و امکان چت با سند را با هوش مصنوعی فراهم کند.',
    promptEn: 'Build a document analysis web application where users upload text or PDF contracts and ask questions. It should generate executive summaries, key risk points, and provide an interactive chat with the document using Gemini.',
    recommendedStack: ['React 19', 'Express', '@google/genai', 'Tailwind CSS']
  },
  {
    id: 'saas-dashboard',
    titleFa: 'داشبورد مدیریتی و مانیتورینگ فروش',
    titleEn: 'Sales & Inventory SaaS Dashboard',
    category: 'داشبورد و فرانت‌اند',
    complexity: 'پیشرفته',
    estimatedTimeFa: '۲ دقیقه ساخت',
    promptFa: 'یک پنل ادمین و داشبورد حرفه‌ای برای فروشگاه با نمودارهای درآمدی، لیست سفارش‌ها با امکان جستجو و فیلتر، مدیریت وضعیت محصولات، تقویم شمسی و حالت تاریک و روشن مدرن بساز.',
    promptEn: 'Build a professional administrative analytics dashboard with interactive revenue charts, filterable customer orders table, inventory status toggles, and polished dark/light themes.',
    recommendedStack: ['React 19', 'TypeScript', 'Motion', 'Tailwind CSS']
  },
  {
    id: 'kanban-workspace',
    titleFa: 'سامانه مدیریت وظایف تیمی و تسک‌های کانبان',
    titleEn: 'Collaborative Kanban Task Board',
    category: 'ابزار کار تیمی و دیتابیس',
    complexity: 'متوسط',
    estimatedTimeFa: '۳ دقیقه ساخت',
    promptFa: 'یک بورد مدیریت وظایف مانند Trello با ستون‌های انجام‌نشده، در دست اقدام و انجام‌شده با قابلیت Drag & Drop، ثبت برچسب، تعیین سررسید و ذخیره پایدار در دیتابیس طراحی کن.',
    promptEn: 'Create a Kanban task management board like Trello with draggable cards, priority badges, due dates, activity history, and persistent database storage.',
    recommendedStack: ['React 19', 'Firebase Firestore', 'Tailwind CSS']
  },
  {
    id: 'travel-planner-maps',
    titleFa: 'برنامه‌ریز هوشمند سفر و مسیرهای گردشگری',
    titleEn: 'Interactive Travel Route & City Guide',
    category: 'نقشه و سرویس‌های گوگل',
    complexity: 'متوسط',
    estimatedTimeFa: '۲ الی ۴ دقیقه ساخت',
    promptFa: 'یک اپلیکیشن راهنمای سفر شهری بساز که جاذبه‌های برتر را روی نقشه نمایش دهد، مسیر بهینه سفر بین چند نقطه را محاسبه کند و برنامه روزانه سفر تولید نماید.',
    promptEn: 'Develop an interactive city travel itinerary application displaying top attractions on a map, calculating optimal driving/walking routes, and generating day-by-day itineraries.',
    recommendedStack: ['React 19', 'Google Maps API', 'TypeScript']
  }
];

export const FAQ_LIST: FaqItem[] = [
  {
    category: 'free',
    questionFa: 'آیا برای ساخت و تست اپلیکیشن باید پولی پرداخت کنم؟',
    questionEn: 'Do I need to pay to build and test applications?',
    answerFa: 'خیر! دسترسی به هوش مصنوعی سازنده، محیط توسعه، پیش‌نمایش زنده در مرورگر و سهمیه‌های رایگان روزانه مدل‌های هوش مصنوعی جمنای کاملاً بدون هزینه است و برای شروع نیاز به هیچ اطلاعات پرداختی یا کارتی ندارید.',
    answerEn: 'No! Access to the coding engine, live in-browser sandbox, and daily Gemini API Free Tier quotas is completely free without requiring credit card registration.'
  },
  {
    category: 'capabilities',
    questionFa: 'چه نوع اپلیکیشن‌هایی می‌توانید بسازید؟',
    questionEn: 'What types of applications can you build?',
    answerFa: 'تقریباً هر نوع وب‌اپلیکیشن مدرن: از لندینگ‌پیج‌ها و وب‌سایت‌های شرکتی گرفته تا داشبوردهای پیچیده، فروشگاه‌های اینترنتی، ابزارهای تحلیلی، بازی‌های تحت وب، سامانه‌های چت با اسناد، ابزارهای نقشه‌محور، و وب‌اپلیکیشن‌های موبایل (PWA) با فرانت‌اند و بک‌اند کامل.',
    answerEn: 'Almost any modern web application: corporate landing pages, complex SaaS dashboards, e-commerce stores, AI-powered document tools, spatial/interactive maps, web games, and full-stack mobile-first PWAs.'
  },
  {
    category: 'export',
    questionFa: 'آیا کدها مال من است و می‌توانم پروژه را دانلود یا جابه‌جا کنم؟',
    questionEn: 'Do I own the code, and can I export or self-host it?',
    answerFa: 'بله، ۱۰۰٪ کدها استاندارد بوده و به شما تعلق دارد. پروژه با معماری تمیز Vite، React و تایپ‌اسکریپت نوشته می‌شود و می‌توانید فایل‌ها را دانلود کرده و روی هر هاست، سرور یا ارائه‌دهنده ابری (مانند Vercel، Cloudflare، سرور شخصی لینوکس یا داکر) مستقر کنید.',
    answerEn: 'Yes, 100% of the code is standard and belongs to you. It uses standard Vite, React, and TypeScript architecture that can be exported and hosted on any server, Vercel, Docker container, or cloud host.'
  },
  {
    category: 'database',
    questionFa: 'داده‌ها چگونه ذخیره می‌شوند؟',
    questionEn: 'How is data persisted and stored?',
    answerFa: 'بر اساس نیاز پروژه، من می‌توانم پایگاه داده سندی Firebase Firestore (مناسب رویدادهای هم‌زمان و چت) یا پایگاه داده رابطه‌ای قدرتمند PostgreSQL در Cloud SQL با جداول ساخت‌یافته و امن را متصل کنم.',
    answerEn: 'Depending on project requirements, we can integrate Firebase Firestore for realtime document synchronization or Cloud SQL PostgreSQL for relational, structured business data.'
  },
  {
    category: 'capabilities',
    questionFa: 'چطور به شما بگویم چه برنامه‌ای می‌خواهم؟',
    questionEn: 'How should I explain what I want built?',
    answerFa: 'خیلی ساده! نیازی به اصطلاحات پیچیده برنامه‌نویسی نیست. کافیست به زبان فارسی یا انگلیسی بگویید قصد دارید چه سیستمی بسازید، مخاطبان آن چه کسانی هستند و چه بخش‌هایی باید داشته باشد. من از مرحله طراحی ظاهر تا منطق سرور را به صورت خودکار می‌سازم.',
    answerEn: 'Simply describe your vision in natural Persian or English. Mention the purpose, intended audience, and key features. The coding engine handles architecture, visual design, and backend logic automatically.'
  }
];
