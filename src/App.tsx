/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Wallet, 
  Smartphone, 
  QrCode, 
  X, 
  Monitor, 
  Laptop, 
  AlertTriangle, 
  Check, 
  CheckCircle2,
  Clock,
  CreditCard,
  Hash,
  User,
  Mail,
  Phone,
  Link,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { 
  TELEGRAM_BOT_TOKEN, 
  TELEGRAM_CHAT_ID, 
  EXCHANGE_RATE, 
  CASH_FEE_EGP, 
  VODAFONE_NUMBER, 
  VODAFONE_QR_URL, 
  BINANCE_ID, 
  BINANCE_QR_URL, 
  WHATSAPP_LINK, 
  productsData, 
  translations 
} from './constants';
import { 
  Product, 
  Language, 
  Currency, 
  OrderStatus, 
  RemoteTool, 
  PaymentType 
} from './types';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState<Product['category']>('rent');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [timer, setTimer] = useState(300);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [remoteTool, setRemoteTool] = useState<RemoteTool>("ultra");
  const [ultraId, setUltraId] = useState("");
  const [ultraPass, setUltraPass] = useState("");
  const [anyDeskId, setAnyDeskId] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("vodafone");
  const [senderPhone, setSenderPhone] = useState("");
  const [binanceTx, setBinanceTx] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [sn, setSn] = useState("");

  const t = translations[lang];

  // Dark mode effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0B0F1A';
      document.body.style.color = '#f1f5f9';
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    }
  }, [isDarkMode]);

  // Visitor notification
  useEffect(() => {
    const sendVisitorNotification = async () => {
      try {
        let ip = "Unknown";
        let country = "Unknown";
        let city = "Unknown";
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          ip = data.ip || "Unknown";
          country = data.country_name || "Unknown";
          city = data.city || "Unknown";
        } catch (e) {}

        const message = `👀 New Visitor!\n🌐 IP: ${ip}\n📍 Location: ${city}, ${country}\n📅 Date: ${new Date().toLocaleString('en-US')}`;
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
        });
      } catch (e) {}
    };
    sendVisitorNotification();
  }, []);

  // Poll for order status
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    if (orderSuccess && orderStatus === "pending" && orderId) {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`);
          const data = await response.json();
          if (data.ok && data.result.length > 0) {
            const updates = data.result;
            for (const update of updates) {
              setLastUpdateId(update.update_id);
              if (update.callback_query && update.callback_query.data) {
                const [action, id] = update.callback_query.data.split('_');
                if (id === orderId.toString()) {
                  if (action === 'accept') setOrderStatus("accepted");
                  if (action === 'reject') setOrderStatus("rejected");
                  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery?callback_query_id=${update.callback_query.id}`);
                }
              }
            }
          }
        } catch (e) {}
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [orderSuccess, orderStatus, orderId, lastUpdateId]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (orderSuccess && timer > 0 && orderStatus === "pending") {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && orderStatus === "pending") {
      setTimeout(() => {
        setSelectedProduct(null);
        setOrderSuccess(false);
        setTimer(300);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [orderSuccess, timer, orderStatus]);

  const formatPrice = (usdAmount: number, useQuantity = false, isCredit = false) => {
    let finalUsd = usdAmount;
    if (useQuantity) finalUsd = usdAmount * quantity;
    if (currency === 'USD') return `$${finalUsd.toFixed(2)}`;
    let finalEgp = finalUsd * EXCHANGE_RATE;
    if (useQuantity && paymentType === 'vodafone' && !isCredit) finalEgp += CASH_FEE_EGP;
    return `${Math.round(finalEgp)} EGP`;
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus(""), 2000);
  };

  const handleFinalOrder = async () => {
    if (!selectedProduct) return;
    const newOrderId = Date.now();
    setOrderId(newOrderId);
    setOrderStatus("pending");
    const currentPrice = (selectedProduct.sizeOptions && selectedSize && selectedProduct.sizePrices?.[selectedSize]) 
      ? selectedProduct.sizePrices[selectedSize] 
      : selectedProduct.priceUsd;

    let message = `🚀 New Order\n🔢 Order ID: ${newOrderId}\n\n📦 Product: ${lang === 'en' && selectedProduct.nameEn ? selectedProduct.nameEn : selectedProduct.name}\n`;
    if (selectedProduct.category === 'credit' || selectedProduct.category === 'server') {
      if (selectedProduct.requiresSN) {
        message += `🆔 SN: ${sn}\n`;
        if (selectedProduct.id === 203) {
          message += `⏳ Wait: (1-30Min Available Slot) Max 1-6 Hrs | Few Time Fast Manually\n`;
        }
      }
      if (selectedProduct.sizeOptions) {
        message += `📏 Size: ${selectedSize}\n`;
        if (selectedProduct.id === 202) {
          if (["5GB to 9GB", "9GB to 13GB", "13GB to 30GB"].includes(selectedSize || "")) message += `⏳ Wait: 3-6 Hours\n`;
          if (["2GB to 3GB", "3GB to 4GB"].includes(selectedSize || "")) message += `⏳ Wait: 1-3 Hour\n`;
          if (selectedSize === "1MB to 1GB") message += `⏳ Wait: 1-30 Minute\n`;
        }
        message += `🔗 Link: ${downloadLink}\n`;
      } else {
        message += `🔢 Qty: ${quantity}\n`;
      }
      if (selectedProduct.category === 'credit') message += `📧 Email: ${email}\n`;
      else message += `📱 WhatsApp: ${whatsappNumber}\n`;
    }
    message += `💰 Total: ${formatPrice(currentPrice, true, selectedProduct.category !== 'rent')}\n`;
    if (selectedProduct.category === 'rent') {
      if (remoteTool === 'ultra') message += `🖥️ Tool: UltraViewer\n🆔 ID: ${ultraId}\n🔑 Pass: ${ultraPass}\n`;
      else message += `🖥️ Tool: AnyDesk\n🆔 ID: ${anyDeskId}\n`;
    }
    if (paymentType === 'vodafone') message += `📱 Method: Vodafone Cash\n📞 From: ${senderPhone}\n`;
    else message += `🔶 Method: Binance\n🧾 ID: ${binanceTx}\n`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          reply_markup: {
            inline_keyboard: [[
              { text: "Accept ✅", callback_data: `accept_${newOrderId}` },
              { text: "Reject ❌", callback_data: `reject_${newOrderId}` }
            ]]
          }
        })
      });
    } catch (e) {}
    setTimer(300);
    setOrderSuccess(true);
  };

  const isFormValid = () => {
    if (!selectedProduct) return false;
    if (selectedProduct.requiresSN && !sn.trim()) return false;
    const isRemoteValid = selectedProduct.category !== 'rent' || (remoteTool === 'ultra' ? (ultraId.trim() && ultraPass.trim()) : anyDeskId.trim());
    const isPaymentValid = paymentType === 'vodafone' ? senderPhone.trim().length >= 11 : binanceTx.trim().length > 0;
    if (selectedProduct.category === 'credit' || selectedProduct.category === 'server') {
      const isContactValid = selectedProduct.category === 'credit' ? email.trim().includes('@') : whatsappNumber.trim().length >= 11;
      if (selectedProduct.sizeOptions) {
        return isRemoteValid && isPaymentValid && isContactValid && selectedSize !== "" && downloadLink.trim().length > 5;
      }
      const min = selectedProduct.minQty || 1;
      const max = selectedProduct.maxQty || 10000;
      const isQuantityValid = quantity >= min && quantity <= max;
      return isRemoteValid && isPaymentValid && isContactValid && isQuantityValid;
    }
    return isRemoteValid && isPaymentValid;
  };

  return (
    <div className={`min-h-screen pb-20 font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-[#0B0F1A] text-slate-100' : 'bg-white text-slate-900'}`} dir={t.dir}>
      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
        <WhatsAppIcon className="w-8 h-8" />
      </a>
      
      <nav className="bg-white/90 dark:bg-[#161B26]/90 backdrop-blur-md border-b dark:border-slate-800 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xl md:text-2xl font-black text-blue-600 tracking-tighter uppercase shrink-0">WALID SALA7</span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center bg-slate-100 dark:bg-[#1F2937] p-1 rounded-xl shrink-0">
              <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currency === 'USD' ? 'bg-white dark:bg-[#161B26] text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.usd}</button>
              <button onClick={() => setCurrency('EGP')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${currency === 'EGP' ? 'bg-white dark:bg-[#161B26] text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.egp}</button>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-[#1F2937] p-1 rounded-xl shrink-0">
              <button onClick={() => setLang('ar')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'ar' ? 'bg-white dark:bg-[#161B26] text-blue-600 shadow-sm' : 'text-slate-500'}`}>العربية</button>
              <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-[#161B26] text-blue-600 shadow-sm' : 'text-slate-500'}`}>English</button>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-[#1F2937] rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
              title={isDarkMode ? t.lightMode : t.darkMode}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4">{t.title}</h1>
          <p className="text-blue-600 font-extrabold text-xl md:text-2xl mb-8">{t.subtitle}</p>
          
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search size={20} className={`absolute ${t.dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${t.dir === 'rtl' ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 outline-none font-bold shadow-sm transition-all bg-white dark:bg-[#161B26] text-slate-900 dark:text-white`}
            />
          </div>

          <div className="flex justify-center gap-4 mb-8 overflow-x-auto no-scrollbar py-2">
            <button onClick={() => setCurrentCategory('rent')} className={`px-8 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${currentCategory === 'rent' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-[#161B26] text-slate-600 dark:text-slate-400 border dark:border-slate-800'}`}>{t.rentalsTab}</button>
            <button onClick={() => setCurrentCategory('credit')} className={`px-8 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${currentCategory === 'credit' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-[#161B26] text-slate-600 dark:text-slate-400 border dark:border-slate-800'}`}>{t.creditsTab}</button>
            <button onClick={() => setCurrentCategory('server')} className={`px-8 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${currentCategory === 'server' ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-[#161B26] text-slate-600 dark:text-slate-400 border dark:border-slate-800'}`}>{t.serverTab}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {productsData
            .filter(p => p.category === currentCategory)
            .filter(p => (lang === 'en' && p.nameEn ? p.nameEn : p.name).toLowerCase().includes(searchQuery.toLowerCase()))
            .map((product) => (
            <div key={product.id} className="bg-white dark:bg-[#161B26] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <div className="h-36 bg-white dark:bg-[#1F2937] flex items-center justify-center relative overflow-hidden">
                <img src={product.image} alt={lang === 'en' && product.nameEn ? product.nameEn : product.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4 h-14 line-clamp-2">{lang === 'en' && product.nameEn ? product.nameEn : product.name}</h3>
                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.priceLabel}</p>
                    <p className="text-2xl font-black text-blue-600 leading-none" title={product.tooltip}>{formatPrice(product.priceUsd, false, product.category === 'credit')}</p>
                  </div>
                  <button onClick={() => { setSelectedProduct(product); setOrderSuccess(false); setQuantity(product.minQty || 1); setSelectedSize(""); setDownloadLink(product.downloadLink || ""); setSn(""); }} className="bg-slate-900 dark:bg-[#1F2937] text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95">
                    {t.rentNow}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#161B26] rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 flex items-center justify-center gap-4">
            <Wallet className="text-blue-600" /> {t.paymentTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 flex items-center justify-between group hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-1 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm text-rose-500 overflow-hidden">
                  <img src={VODAFONE_QR_URL} alt="Vodafone QR" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="font-black text-rose-900 dark:text-rose-100">{t.vodafone}</span>
              </div>
              <button onClick={() => handleCopy(VODAFONE_NUMBER, 'v1')} className="font-mono font-bold text-sm text-rose-600 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-xl border border-rose-100 dark:border-rose-900 flex items-center gap-2">
                {copyStatus === 'v1' ? <CheckCircle2 size={16} /> : <img src={VODAFONE_QR_URL} alt="QR" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />} {VODAFONE_NUMBER}
              </button>
            </div>
            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 flex items-center justify-between group hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-1 bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm text-amber-500 overflow-hidden">
                  <img src={BINANCE_QR_URL} alt="Binance QR" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
                </div>
                <span className="font-black text-amber-900 dark:text-amber-100">{t.binance}</span>
              </div>
              <button onClick={() => handleCopy(BINANCE_ID, 'b1')} className="font-mono font-bold text-sm text-amber-600 bg-white dark:bg-[#1F2937] px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900 flex items-center gap-2">
                {copyStatus === 'b1' ? <CheckCircle2 size={16} /> : <img src={BINANCE_QR_URL} alt="QR" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />} {BINANCE_ID}
              </button>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-[#161B26] rounded-t-[2.5rem] sm:rounded-[3.5rem] w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 sm:p-8 border-b dark:border-slate-800 flex justify-between items-center bg-white dark:bg-[#161B26] sticky top-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-xl sm:text-2xl tracking-tight">{t.selectPayment}</h3>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90">
                  <X className="text-slate-400" size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-6 sm:p-8 space-y-10">
                  {orderSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      {orderStatus === "pending" ? (
                        <div className="space-y-8 w-full">
                          <div className="relative mx-auto w-40 h-40">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle className="text-blue-50 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                              <motion.circle 
                                className="text-blue-600 stroke-current" 
                                strokeWidth="8" 
                                strokeLinecap="round" 
                                cx="50" cy="50" r="40" 
                                fill="transparent"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: timer / 300 }}
                                transition={{ duration: 1, ease: "linear" }}
                              ></motion.circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-black text-blue-600 leading-none">
                                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                              </span>
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">minutes</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <h3 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight">{t.verifying}</h3>
                            <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full mx-auto w-fit">
                              <ShieldCheck size={16} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Secure Verification</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">{t.waitOwner}</p>
                          </div>
                          <button onClick={() => { setOrderSuccess(false); setSelectedProduct(null); }} className="px-8 py-4 bg-slate-100 dark:bg-[#1F2937] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600 rounded-3xl font-black text-sm transition-all border-2 border-transparent hover:border-rose-100 dark:hover:border-rose-900 w-full">
                            {t.cancelProcess}
                          </button>
                        </div>
                      ) : orderStatus === "accepted" ? (
                        <div className="space-y-8 w-full">
                          <div className="w-28 h-28 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100 animate-bounce">
                            <Check size={64} strokeWidth={3} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight">{t.accepted}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{t.acceptedMsg}</p>
                          </div>
                          <button onClick={() => setSelectedProduct(null)} className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg w-full shadow-2xl shadow-green-200 transition-all active:scale-95">
                            {t.close}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8 w-full">
                          <div className="w-28 h-28 bg-rose-100 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-rose-100">
                            <X size={64} strokeWidth={3} />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight">{t.rejected}</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">{t.rejectedMsg}</p>
                          </div>
                          <button onClick={() => setOrderSuccess(false)} className="px-10 py-5 bg-slate-100 dark:bg-[#1F2937] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[2rem] font-black w-full transition-all">
                            {t.backToStore}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-10">
                      {/* Step 1: Order Summary */}
                      <section className="relative">
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">1</div>
                          <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[11px]">{lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</h3>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1F2937]/50 rounded-[2.5rem] p-6 border-2 border-white dark:border-slate-800 shadow-sm space-y-6">
                          <div className="flex items-center gap-5">
                            <div className="w-24 h-24 bg-white dark:bg-[#1F2937] rounded-3xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm shrink-0 p-1">
                              <img src={selectedProduct.image} alt={lang === 'en' && selectedProduct.nameEn ? selectedProduct.nameEn : selectedProduct.name} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Zap size={10} className="text-blue-500 fill-blue-500" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{t.productLabel}</span>
                              </div>
                              <h4 className="font-black text-slate-900 dark:text-white text-xl leading-tight mb-2">{lang === 'en' && selectedProduct.nameEn ? selectedProduct.nameEn : selectedProduct.name}</h4>
                              {selectedProduct.duration && (
                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1 rounded-full w-fit">
                                  <Clock size={12} />
                                  <span className="text-[10px] font-black uppercase tracking-wider">{selectedProduct.duration}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 pt-6 border-t-2 border-white dark:border-slate-800 border-dashed">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.priceLabel}</span>
                              <p className="text-2xl font-black text-blue-600 tracking-tighter">
                                {formatPrice(
                                  (selectedProduct.sizeOptions && selectedSize && selectedProduct.sizePrices?.[selectedSize]) 
                                    ? selectedProduct.sizePrices[selectedSize] 
                                    : selectedProduct.priceUsd, 
                                  true, 
                                  selectedProduct.category !== 'rent'
                                )}
                              </p>
                            </div>
                            <div className="space-y-1 text-right">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t.totalUsd}</span>
                              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                $ {(
                                  ((selectedProduct.sizeOptions && selectedSize && selectedProduct.sizePrices?.[selectedSize]) 
                                    ? selectedProduct.sizePrices[selectedSize] 
                                    : selectedProduct.priceUsd) * (selectedProduct.sizeOptions ? 1 : quantity)
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Step 2: Configuration */}
                      <section>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">2</div>
                          <h3 className="font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[11px]">{lang === 'ar' ? 'تكوين الخدمة' : 'Service Configuration'}</h3>
                        </div>

                        <div className="bg-white dark:bg-[#1F2937]/50 rounded-[2.5rem] p-6 space-y-6 border-2 border-white dark:border-slate-800 shadow-sm">
                          {(selectedProduct.category === 'credit' || selectedProduct.category === 'server') && (
                            <div className="space-y-6">
                              {selectedProduct.sizeOptions && (
                                <div className="space-y-4">
                                  <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                    <Hash size={16} className="text-blue-500" />
                                    {lang === 'ar' ? 'اختر الحجم:' : 'Select Size:'}
                                  </label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {selectedProduct.sizeOptions.map((option) => (
                                      <button
                                        key={option}
                                        onClick={() => setSelectedSize(option)}
                                        className={`py-4 px-3 rounded-2xl text-xs font-black transition-all border-2 flex flex-col items-center gap-1 ${
                                          selectedSize === option 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                                            : 'bg-white dark:bg-[#1F2937] border-slate-100 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300'
                                        }`}
                                      >
                                        <span>{option}</span>
                                        {selectedProduct.sizePrices?.[option] && (
                                          <span className={`text-[10px] ${selectedSize === option ? 'text-blue-100' : 'text-blue-500'}`}>
                                            {selectedProduct.sizePrices[option].toFixed(2)}$
                                          </span>
                                        )}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Wait Time Notices */}
                                  {selectedProduct.id === 202 && (
                                    <div className="space-y-2">
                                      {["5GB to 9GB", "9GB to 13GB", "13GB to 30GB"].includes(selectedSize || "") && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-100 dark:border-amber-900 rounded-2xl flex items-center gap-3">
                                          <Clock className="text-amber-600 w-5 h-5 shrink-0" />
                                          <p className="text-xs font-black text-amber-800 dark:text-amber-200 leading-tight">
                                            {lang === 'ar' ? 'انتظار لمدة 3-6 ساعات' : 'Wait for 3-6 Hours'}
                                          </p>
                                        </motion.div>
                                      )}
                                      {selectedSize === "1MB to 1GB" && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-100 dark:border-green-900 rounded-2xl flex items-center gap-3">
                                          <Clock className="text-green-600 w-5 h-5 shrink-0" />
                                          <p className="text-xs font-black text-green-800 dark:text-green-200 leading-tight">
                                            {lang === 'ar' ? 'انتظار لمدة 1-30 دقيقة' : 'Wait for 1-30 Minute'}
                                          </p>
                                        </motion.div>
                                      )}
                                      {["2GB to 3GB", "3GB to 4GB"].includes(selectedSize || "") && (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-100 dark:border-blue-900 rounded-2xl flex items-center gap-3">
                                          <Clock className="text-blue-600 w-5 h-5 shrink-0" />
                                          <p className="text-xs font-black text-blue-800 dark:text-blue-200 leading-tight">
                                            {lang === 'ar' ? 'انتظار لمدة 1-3 ساعات' : 'Wait for 1-3 Hour'}
                                          </p>
                                        </motion.div>
                                      )}
                                    </div>
                                  )}

                                  <div className="pt-2">
                                    <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 mb-3 ml-2">
                                      <Link size={16} className="text-blue-500" />
                                      {lang === 'ar' ? 'رابط الملف الخاص بك:' : 'Your file link:'}
                                    </label>
                                    <div className="relative group">
                                      <input 
                                        type="text" 
                                        value={downloadLink} 
                                        onChange={(e) => setDownloadLink(e.target.value)} 
                                        placeholder="https://halabtech.com/..." 
                                        className="w-full pl-6 pr-12 py-5 rounded-3xl border-2 border-white dark:border-slate-800 font-bold focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white shadow-sm"
                                      />
                                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                        <Link size={20} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {!selectedProduct.sizeOptions && selectedProduct.id !== 203 && (
                                <div className="space-y-4">
                                  <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                    <Hash size={16} className="text-blue-500" />
                                    {t.quantityLabel}
                                  </label>
                                  <div className="relative">
                                    <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)} className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 font-black text-center text-2xl focus:border-blue-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none shadow-sm" />
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
                                      <span className="text-[10px] font-black uppercase tracking-widest">Qty</span>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-wider">Min: {selectedProduct.minQty || 1} • Max: {selectedProduct.maxQty || 10000}</p>
                                </div>
                              )}

                              {selectedProduct.requiresSN && (
                                <div className="space-y-4">
                                  <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                    <Hash size={16} className="text-blue-500" />
                                    {t.snLabel}
                                  </label>
                                  <div className="relative group">
                                    <input 
                                      type="text" 
                                      value={sn} 
                                      onChange={(e) => setSn(e.target.value)} 
                                      placeholder="SN..." 
                                      className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 font-bold focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white shadow-sm"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                      <Hash size={20} />
                                    </div>
                                  </div>
                                  {selectedProduct.id === 203 && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-100 dark:border-blue-900 rounded-2xl flex items-center gap-3">
                                      <Clock className="text-blue-600 w-5 h-5 shrink-0" />
                                      <p className="text-xs font-black text-blue-800 dark:text-blue-200 leading-tight">
                                        {lang === 'ar' 
                                          ? '( 1-30Min Available Slot ) Max 1-6 Hrs | Few Time Fast Manually' 
                                          : '( 1-30Min Available Slot ) Max 1-6 Hrs | Few Time Fast Manually'}
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              )}

                              <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                  {selectedProduct.category === 'credit' ? <Mail size={16} className="text-blue-500" /> : <Phone size={16} className="text-blue-500" />}
                                  {selectedProduct.category === 'credit' ? t.emailLabel : (selectedProduct.id === 202 ? (lang === 'ar' ? 'رقم الواتساب (لإرسال الرابط)' : 'WhatsApp Number (to receive link)') : (selectedProduct.id === 203 ? (lang === 'ar' ? 'رقم الواتساب (لارسال الكود الخاص بFRP)' : 'WhatsApp Number (to receive FRP code)') : t.whatsappNumberLabel))}
                                </label>
                                <div className="relative group">
                                  <input 
                                    type={selectedProduct.category === 'credit' ? "email" : "text"} 
                                    value={selectedProduct.category === 'credit' ? email : whatsappNumber} 
                                    onChange={(e) => selectedProduct.category === 'credit' ? setEmail(e.target.value) : setWhatsappNumber(e.target.value)} 
                                    placeholder={selectedProduct.category === 'credit' ? "example@mail.com" : t.whatsappNumberPlaceholder} 
                                    className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 font-bold focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white shadow-sm"
                                  />
                                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                    {selectedProduct.category === 'credit' ? <Mail size={20} /> : <WhatsAppIcon className="w-5 h-5" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedProduct.category === 'rent' && (
                            <div className="space-y-6">
                              <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                <Monitor size={16} className="text-blue-500" />
                                {t.remoteMethod}
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setRemoteTool('ultra')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${remoteTool === 'ultra' ? 'border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' : 'border-white dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-blue-200'}`}>
                                  <Monitor className={remoteTool === 'ultra' ? 'text-white' : 'text-slate-400'} size={32} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">UltraViewer</span>
                                </button>
                                <button onClick={() => setRemoteTool('anydesk')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${remoteTool === 'anydesk' ? 'border-red-500 bg-red-600 text-white shadow-xl shadow-red-100 scale-[1.02]' : 'border-white dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-red-200'}`}>
                                  <Laptop className={remoteTool === 'anydesk' ? 'text-white' : 'text-slate-400'} size={32} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">AnyDesk</span>
                                </button>
                              </div>
                              
                              <div className="space-y-4 pt-2">
                                {remoteTool === 'ultra' ? (
                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="relative group">
                                      <input type="text" placeholder={t.ultraId} value={ultraId} onChange={(e) => setUltraId(e.target.value)} className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 text-center font-mono font-black text-xl focus:border-blue-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none shadow-sm" />
                                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"><Hash size={20} /></div>
                                    </div>
                                    <div className="relative group">
                                      <input type="text" placeholder={t.ultraPass} value={ultraPass} onChange={(e) => setUltraPass(e.target.value)} className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 text-center font-mono font-black text-xl focus:border-blue-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none shadow-sm" />
                                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"><ShieldCheck size={20} /></div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative group">
                                    <input type="text" placeholder={t.anyDeskId} value={anyDeskId} onChange={(e) => setAnyDeskId(e.target.value)} className="w-full px-6 py-5 rounded-3xl border-2 border-white dark:border-slate-800 text-center font-mono font-black text-xl focus:border-red-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none shadow-sm" />
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors"><Hash size={20} /></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </section>

                      {/* Step 3: Payment */}
                      <section>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-blue-100">3</div>
                          <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px]">{t.paymentMethod}</h3>
                        </div>

                        <div className="space-y-8">
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setPaymentType('vodafone')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'vodafone' ? 'border-rose-500 bg-rose-600 text-white shadow-xl shadow-rose-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-rose-200'}`}>
                              {paymentType === 'vodafone' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={VODAFONE_QR_URL} alt="V" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <Smartphone size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.vodafone}</span>
                            </button>
                            <button onClick={() => setPaymentType('binance')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'binance' ? 'border-amber-500 bg-amber-600 text-white shadow-xl shadow-amber-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-amber-200'}`}>
                              {paymentType === 'binance' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={BINANCE_QR_URL} alt="B" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <QrCode size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.binance}</span>
                            </button>
                          </div>

                          <motion.div layout className="relative">
                            {paymentType === 'binance' ? (
                              <div className="space-y-6">
                                <div className="p-8 bg-amber-50 dark:bg-amber-950/20 rounded-[3.5rem] border-2 border-amber-100 dark:border-amber-900 shadow-inner relative overflow-hidden group">
                                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700"></div>
                                  <div className="text-center relative z-10">
                                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-black uppercase tracking-[0.4em] mb-6 block">{t.binanceIdLabel}</span>
                                    <div className="flex flex-col items-center gap-6">
                                      <span className="text-5xl font-black text-amber-950 dark:text-amber-100 font-mono tracking-tighter">{BINANCE_ID}</span>
                                      <button onClick={() => handleCopy(BINANCE_ID, 'm_b')} className="flex items-center gap-3 bg-white dark:bg-[#1F2937] px-8 py-4 rounded-3xl shadow-xl border border-amber-100 dark:border-amber-900 hover:scale-105 transition-all active:scale-95 group/btn">
                                        {copyStatus === 'm_b' ? (
                                          <><CheckCircle2 className="text-green-500" size={24} /><span className="text-sm font-black text-green-600 uppercase tracking-wider">{t.copied}</span></>
                                        ) : (
                                          <><img src={BINANCE_QR_URL} alt="B" className="w-6 h-6 object-contain group-hover/btn:rotate-12 transition-transform" referrerPolicy="no-referrer" /><span className="text-sm font-black text-amber-800 dark:text-amber-200 uppercase tracking-wider">{t.copy} ID</span></>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-10 bg-white/70 dark:bg-[#1F2937]/70 backdrop-blur-md p-5 rounded-3xl border border-amber-100 dark:border-amber-900 flex items-start gap-3">
                                    <Info className="text-amber-600 shrink-0" size={16} />
                                    <p className="text-[11px] text-amber-900 dark:text-amber-100 font-bold leading-relaxed">{t.instructionBinance}</p>
                                  </div>
                                </div>
                                <div className="relative group">
                                  <input type="text" placeholder={t.binanceTxPlaceholder} value={binanceTx} onChange={(e) => setBinanceTx(e.target.value)} className="w-full px-8 py-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 text-center font-black text-xl focus:border-amber-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:scale-110 transition-transform"><Hash size={24} /></div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="p-8 bg-rose-50 dark:bg-rose-950/20 rounded-[3.5rem] border-2 border-rose-100 dark:border-rose-900 shadow-inner relative overflow-hidden group">
                                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700"></div>
                                  <div className="text-center relative z-10">
                                    <span className="text-[10px] text-rose-700 dark:text-rose-400 font-black uppercase tracking-[0.4em] mb-6 block">{t.vodafoneNumberLabel}</span>
                                    <div className="flex flex-col items-center gap-6">
                                      <span className="text-5xl font-black text-rose-950 dark:text-rose-100 font-mono tracking-tighter">{VODAFONE_NUMBER}</span>
                                      <button onClick={() => handleCopy(VODAFONE_NUMBER, 'm_v')} className="flex items-center gap-3 bg-white dark:bg-[#1F2937] px-8 py-4 rounded-3xl shadow-xl border border-rose-100 dark:border-rose-900 hover:scale-105 transition-all active:scale-95 group/btn">
                                        {copyStatus === 'm_v' ? (
                                          <><CheckCircle2 className="text-green-500" size={24} /><span className="text-sm font-black text-green-600 uppercase tracking-wider">{t.copied}</span></>
                                        ) : (
                                          <><img src={VODAFONE_QR_URL} alt="V" className="w-6 h-6 object-contain group-hover/btn:rotate-12 transition-transform" referrerPolicy="no-referrer" /><span className="text-sm font-black text-rose-800 dark:text-rose-200 uppercase tracking-wider">{t.copy} Number</span></>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-10 bg-white/70 dark:bg-[#1F2937]/70 backdrop-blur-md p-5 rounded-3xl border border-rose-100 dark:border-rose-900 flex items-start gap-3">
                                    <Info className="text-rose-600 shrink-0" size={16} />
                                    <p className="text-[11px] text-rose-900 dark:text-rose-100 font-bold leading-relaxed">{t.instructionVodafone}</p>
                                  </div>
                                </div>
                                <div className="relative group">
                                  <input type="text" placeholder={t.senderPhonePlaceholder} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full px-8 py-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 text-center font-black text-xl focus:border-rose-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-rose-500 group-focus-within:scale-110 transition-transform"><Phone size={24} /></div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </section>

                      {/* Footer Alerts & Action */}
                      <div className="space-y-8 pt-4 pb-6">
                        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-100 dark:border-amber-900 p-6 rounded-[2.5rem] flex items-start gap-4 shadow-sm">
                          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                            <AlertTriangle className="text-amber-600" size={24} />
                          </div>
                          <p className="text-amber-900 dark:text-amber-100 font-bold text-xs leading-relaxed">{t.preOrderAlert}</p>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:text-blue-700 dark:hover:text-blue-300 transition-all group py-2">
                            <WhatsAppIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            {t.helpText}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </a>

                          <button 
                            onClick={handleFinalOrder} 
                            disabled={!isFormValid()} 
                            className={`w-full py-7 rounded-[3rem] text-2xl font-black transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${
                              isFormValid() 
                                ? 'bg-blue-600 hover:bg-green-600 text-white shadow-blue-200 scale-[1.02] active:scale-95' 
                                : 'bg-slate-100 dark:bg-[#1F2937] text-slate-400 dark:text-slate-600 cursor-not-allowed border-2 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className="relative z-10">{t.confirmOrder}</span>
                            <ChevronRight size={28} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            {isFormValid() && (
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="text-center py-16 px-4">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">
          Walid Sala7 &copy; {new Date().getFullYear()} - {t.rights}
        </p>
      </footer>
    </div>
  );
}
