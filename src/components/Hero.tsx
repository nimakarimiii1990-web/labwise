import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeroProps {
  lang: 'fa' | 'en';
  onExploreCapabilities: () => void;
  onExplorePricing: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onExploreCapabilities }) => {
  const isFa = lang === 'fa';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(/images.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          LabWise
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-3 font-light">
          {isFa ? 'سامانه هوشمند مدیریت آزمایشگاه' : 'Smart Laboratory Management'}
        </p>
        <p className="text-sm sm:text-base text-white/70 mb-10 leading-relaxed max-w-lg mx-auto">
          {isFa
            ? 'مدیریت آزمایش‌ها، کنترل کیفی، معرف‌ها، دستگاه‌ها و موجودی انبار در یک پلتفرم یکپارچه'
            : 'Manage tests, QC, reagents, devices and inventory in one integrated platform'}
        </p>
        <button
          onClick={onExploreCapabilities}
          className="inline-flex items-center gap-2 px-8 py-3 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white rounded-full transition-all duration-300 text-sm font-medium cursor-pointer shadow-lg"
        >
          <span>{isFa ? 'ورود به سامانه' : 'Enter Platform'}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
