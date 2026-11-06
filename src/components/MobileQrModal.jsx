import React, { useState } from 'react';
import {
  Smartphone,
  X,
  QrCode,
  Wifi,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Sparkles,
} from 'lucide-react';

export default function MobileQrModal({ isOpen, onClose }) {
  const [tab, setTab] = useState('camera'); // 'camera' | 'expo'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Automatically use tunnel URL if opened via tunnel, or Wi-Fi IP if on localhost
  const currentOrigin =
    typeof window !== 'undefined' &&
    window.location?.origin &&
    !window.location.origin.includes('localhost') &&
    !window.location.origin.includes('127.0.0.1')
      ? window.location.origin
      : 'http://192.168.0.9:5173';
  const mobileUrl = currentOrigin;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    mobileUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-indigo-100 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Ilovani Telefonda Ochish (QR Kod)
              </h3>
              <p className="text-xs text-slate-500">
                Telefoningiz orqali skaner qiling va foydalaning
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Kamera vs Expo Go */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('camera')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'camera'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Kamera / Brauzer (Tezkor)</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('expo')}
            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              tab === 'expo'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Expo Go (React Native)</span>
          </button>
        </div>

        {tab === 'camera' ? (
          /* TAB 1: Instant QR Code for Phone Camera / Browser */
          <div className="space-y-4 text-center">
            {/* Real Scannable QR Code */}
            <div className="inline-block p-3 rounded-2xl bg-white border-2 border-indigo-100 shadow-sm">
              <img
                src={qrImageUrl}
                alt="Mobile QR Code"
                className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl object-contain"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-indigo-700">
                <Wifi className="w-4 h-4 shrink-0" />
                <span>Wi-Fi orqali bir zumda ochish:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Telefoningiz kamerasi (yoki QR kod skaner)ni ochib, yuqoridagi kodga qarating. Telefoningiz va kompyuteringiz bir xil Wi-Fi tarmog‘iga ulangan bo‘lishi lozim.
              </p>
            </div>

            {/* Direct URL with Copy button */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <code className="font-mono text-indigo-600 font-bold px-1 truncate">
                {mobileUrl}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Nusxalandi!' : 'Nusxalash'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2: Expo Go (React Native) Terminal Setup */
          <div className="space-y-3.5 text-xs text-slate-700">
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 space-y-1">
              <span className="font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Expo Go mobil ilovasi orqali ochish:
              </span>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Expo Go ilovasi maxsus <code className="bg-white/80 px-1 py-0.5 rounded font-mono">exp://</code> manzillarini skanerlaydi.
              </p>
            </div>

            <ol className="space-y-2.5 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200 text-[11px] leading-relaxed">
              <li>
                Telefonda <strong>Expo Go</strong> ilovasini oching (App Store yoki Google Play).
              </li>
              <li>
                Kompyuteringiz terminalida (PowerShell yoki CMD) loyiha papkasida ushbu buyruqni bering (Radmin VPN va Firewallni aylanib o‘tish uchun):
                <div className="mt-1.5 p-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex items-center justify-between">
                  <span>npx.cmd expo start --tunnel</span>
                </div>
              </li>
              <li>
                Terminalda chiqadigan <strong>Expo QR kod</strong>ini Expo Go ilovasi orqali skanerlang!
              </li>
            </ol>
          </div>
        )}

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

