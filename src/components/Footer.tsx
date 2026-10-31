import React from 'react';

interface FooterProps {
  lang: 'fa' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isFa = lang === 'fa';

  return (
    <footer className="py-12 bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Wordmark and copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
          <span className="font-bold text-white tracking-tight">
            {isFa ? 'استودیو ساخت نرم‌افزار هوشمند' : 'AI Studio Engineering Studio'}
          </span>
          <span className="hidden sm:inline text-neutral-600">·</span>
          <span className="text-neutral-500">
            {isFa ? 'طراحی و ساخت وب‌اپلیکیشن‌های کامل و مقیاس‌پذیر' : 'Full-stack production web applications'}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-neutral-400">
          <a href="#capabilities" className="hover:text-white transition-colors">
            {isFa ? 'قابلیت‌ها' : 'Capabilities'}
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            {isFa ? 'سهمیه و هزینه' : 'Pricing & Free Tier'}
          </a>
          <a href="#prompt-builder" className="hover:text-white transition-colors">
            {isFa ? 'پرامپت‌ساز' : 'Prompt Studio'}
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            {isFa ? 'سوالات متداول' : 'FAQ'}
          </a>
        </div>
      </div>
    </footer>
  );
};
