import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  Stethoscope,
  FlaskConical,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const GeminiLabAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: `سلام و درود بر همکار گرامی آزمایشگاه بالینی.
من دستیار هوشمند و ارشد پاتولوژی بالینی، بیوشیمی و کنترل کیفی آزمایشگاه (LabWise AI) هستم.

می‌توانید در زمینه موارد زیر با من مشورت کنید:
• تحلیل و ریشه‌یابی عدم همخوانی نتایج تست‌ها (مانند CK-MB نسبت به Total CPK، بیلی‌روبین مستقیم و توتال، نسبت AST/ALT و...)
• خطاهای پیش‌تحلیلی و شناسایی تداخلات نمونه (همولیز، لخته، آلودگی با لوله EDTA، لیپمی)
• کنترل کیفی محلول‌ها و قوانین چندگانه وستگارد (Westgard Rules)
• پروتکل‌های صحه‌گذاری، پایداری آنبورد و استانداردهای بین‌المللی CLSI و IFCC

چگونه می‌توانم در بررسی نتایج یا چالش‌های فنی به شما کمک کنم؟`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickPrompts = [
    'چرا ممکن است CK-MB از Total CPK بیشتر شود و در آزمایشگاه چه اقدامی لازم است؟',
    'تفسیر بیلی‌روبین مستقیم به توتال در تفکیک یرقان همولیتیک از کلستاتیک',
    'نحوه تمایز هپاتیت الکلی از آسیب عضلانی با نسبت De Ritis (AST/ALT)',
    'علل شایع MCHC بالای ۳۶.۵ در سل‌کانتر و نحوه برطرف کردن تداخل آگلوتینین سرد',
    'چگونه آلودگی سرم با لوله EDTA (پتاسیم بالا و کلسیم افتاده) را قطعی تشخیص دهیم؟',
    'راهکارهای فرمولاسیون جهت افزایش پایداری آنبورد کیت‌های توربیدیمتری لاتکس',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`خطای سرور: ${res.statusText}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'model',
        text: data.reply || 'پاسخی دریافت نشد.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'model',
        text: `متاسفانه در پردازش پاسخ خطایی رخ داد: ${err.message || 'خطای اتصال به سرور'}. لطفاً مجدداً تلاش فرمایید.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[740px] overflow-hidden">
      {/* Top Chat Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">مشاور هوش مصنوعی پاتولوژی و کنترل کیفیت (Gemini 3.8 Flash)</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">
              پاسخگویی به سوالات همخوانی تست‌ها، خطاهای آنالایزر، کالیبراسیون و استانداردهای رفرنس
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors cursor-pointer"
          title="شروع مجدد گفتگو"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          شروع مجدد
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            پرسش‌های سریع:
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer truncate max-w-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`group relative rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30'
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800 shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold">{isUser ? 'شما (کارشناس آزمایشگاه)' : 'مشاور هوش مصنوعی LabWise'}</span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-slate-200">{m.text}</div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="absolute bottom-2 left-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="کپی متن"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl p-4 bg-slate-950/80 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              هوش مصنوعی در حال تحلیل بیوشیمیایی و استخراج رفرنس‌ها...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="سوال خود در مورد همخوانی تست‌ها، خطاهای آزمایشگاه، فرمولاسیون کیت یا رفرنس‌ها را بنویسید..."
            disabled={isSending}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-md shadow-cyan-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
