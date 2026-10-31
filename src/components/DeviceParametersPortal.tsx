import React, { useState } from 'react';
import {
  Cpu,
  FileText,
  Download,
  ExternalLink,
  FlaskConical,
  Info,
  Layers,
  Search,
} from 'lucide-react';

interface DeviceInfo {
  id: string;
  name: string;
  nameFa: string;
  manufacturer: string;
  pdfFile: string;
}

const DEVICES: DeviceInfo[] = [
  { id: 'rayto420', name: 'Rayto 420', nameFa: 'ریتو ۴۲۰', manufacturer: 'Rayto', pdfFile: 'Rayto_420_BIOMEDIC.pdf' },
  { id: 'rayto800', name: 'Rayto 800', nameFa: 'ریتو ۸۰۰', manufacturer: 'Rayto', pdfFile: 'Rayto_800_BIOMEDIC.pdf' },
  { id: 'prestige50i', name: 'Prestige 50i', nameFa: 'پرستژ ۵۰آی', manufacturer: 'Prestige', pdfFile: 'Prestige_50i.pdf' },
  { id: 'biolis24i', name: 'Biolis 24i', nameFa: 'بیولیس ۲۴آی', manufacturer: 'Tokyo Boeki', pdfFile: 'Biolis_24i_Biomedic.pdf' },
  { id: 'olympus', name: 'Olympus', nameFa: 'الیمپوس', manufacturer: 'Olympus', pdfFile: 'OLYMPUS_BIOMEDIC.pdf' },
  { id: 'bs800', name: 'Mindray BS-800', nameFa: 'مایندرای BS-۸۰۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS800_BIOMEDIC.pdf' },
  { id: 'bs480', name: 'Mindray BS-480', nameFa: 'مایندرای BS-۴۸۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS480.pdf' },
  { id: 'bs430', name: 'Mindray BS-430', nameFa: 'مایندرای BS-۴۳۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS430.pdf' },
  { id: 'bs380', name: 'Mindray BS-380', nameFa: 'مایندرای BS-۳۸۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS380.pdf' },
  { id: 'bs200', name: 'Mindray BS-200', nameFa: 'مایندرای BS-۲۰۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS200.pdf' },
  { id: 'bs400', name: 'Mindray BS-400 / 420', nameFa: 'مایندرای BS-۴۰۰ / ۴۲۰', manufacturer: 'Mindray', pdfFile: 'Mindray_BS400_420_BIOMEDIC.pdf' },
  { id: 'hitachi902', name: 'Hitachi 902 / 717 / 704', nameFa: 'هیتاچی ۹۰۲ / ۷۱۷ / ۷۰۴', manufacturer: 'Hitachi', pdfFile: 'Hitachi_902_717_704_BIOMEDIC.pdf' },
  { id: 'hitachi912', name: 'Hitachi 912', nameFa: 'هیتاچی ۹۱۲', manufacturer: 'Hitachi', pdfFile: 'Hitachi_912_BIOMEDIC.pdf' },
  { id: 'hitachi911', name: 'Hitachi 911', nameFa: 'هیتاچی ۹۱۱', manufacturer: 'Hitachi', pdfFile: 'Hitachi_911_BIOMEDIC.pdf' },
  { id: 'dirui', name: 'Dirui CS 400 / 800', nameFa: 'دیروی CS ۴۰۰ / ۸۰۰', manufacturer: 'Dirui', pdfFile: 'Dirui_CS400_800_BIOMEDIC.pdf' },
  { id: 'bt3000', name: 'BT 3000 / 3500', nameFa: 'بی‌تی ۳۰۰۰ / ۳۵۰۰', manufacturer: 'Biotecnica', pdfFile: 'BT_3000_3500_BIOMEDIC.pdf' },
];

export const DeviceParametersPortal: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = DEVICES.filter(
    (d) =>
      !search.trim() ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.nameFa.includes(search) ||
      d.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/90 border border-sky-100 rounded-2xl p-5 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">پارامترهای دستگاه‌های بیوشیمی</h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              فایل‌های PDF اصلی دستگاه‌ها (همان‌طور که بارگذاری شده‌اند)
            </p>
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی دستگاه (Mindray، Hitachi، Rayto)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" />
        <p className="leading-relaxed">
          این‌ها همان فایل‌های PDF اصلی شما هستند — بدون تغییر محتوا یا فرمت.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((device) => (
          <div
            key={device.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{device.nameFa}</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">{device.name}</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {device.manufacturer}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <a
                href={`/device-pdfs/${device.pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm shadow-cyan-600/20 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                مشاهده PDF
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`/device-pdfs/${device.pdfFile}`}
                download={device.pdfFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                دانلود
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
          دستگاهی با این عبارت پیدا نشد.
        </div>
      )}
    </div>
  );
};
