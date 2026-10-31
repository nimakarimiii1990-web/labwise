import React, { useState } from 'react';
import { FAQ_LIST } from '../data/capabilitiesData';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqSectionProps {
  lang: 'fa' | 'en';
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const isFa = lang === 'fa';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 border-b border-neutral-900 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isFa ? 'پرسش‌های متداول کاربران' : 'Frequently Asked Questions'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-neutral-400">{isFa ? 'پاسخ‌های شفاف' : 'Clear Answers'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {isFa ? 'پاسخ به سوالات مهم درباره امکانات و هزینه‌ها' : 'Everything You Need To Know'}
          </h2>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start cursor-pointer hover:bg-neutral-900/80 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {isFa ? faq.questionFa : faq.questionEn}
                  </span>
                  <span className="text-neutral-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-850 pt-3">
                    {isFa ? faq.answerFa : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
