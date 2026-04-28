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
  Facebook,
  Instagram,
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
  INSTAPAY_NUMBER,
  INSTAPAY_LOGO_URL,
  PAYPAL_LINK,
  PAYPAL_LOGO_URL,
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
  PaymentType,
  Order
} from './types';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [currentCategory, setCurrentCategory] = useState<Product['category'] | 'orders'>('rent');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [timer, setTimer] = useState(300);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("pending");
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

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

  const t = translations[lang as keyof typeof translations];

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem('ws_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
  }, []);

  // Save orders to localStorage
  useEffect(() => {
    localStorage.setItem('ws_orders', JSON.stringify(orders));
  }, [orders]);

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
    const hasPendingOrders = orders.some(o => o.status === "pending");
    
    if (hasPendingOrders || (orderSuccess && orderStatus === "pending" && orderId)) {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`);
          const data = await response.json();
          if (data.ok && data.result.length > 0) {
            const updates = data.result;
            let updatedOrders = [...orders];
            let changed = false;
            let maxUpdateId = lastUpdateId;

            for (const update of updates) {
              maxUpdateId = Math.max(maxUpdateId, update.update_id);
              if (update.callback_query && update.callback_query.data) {
                const [action, id] = update.callback_query.data.split('_');
                
                // Update current active order in modal if it matches
                if (orderId && id === orderId.toString()) {
                  if (action === 'accept') setOrderStatus("accepted");
                  if (action === 'reject') setOrderStatus("rejected");
                }

                // Update orders in history
                const orderIdx = updatedOrders.findIndex(o => o.id.toString() === id);
                if (orderIdx !== -1 && updatedOrders[orderIdx].status === "pending") {
                  updatedOrders[orderIdx].status = action === 'accept' ? 'accepted' : 'rejected';
                  changed = true;
                }
                
                fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery?callback_query_id=${update.callback_query.id}`);
              }
            }

            setLastUpdateId(maxUpdateId);
            if (changed) {
              setOrders(updatedOrders);
            }
          }
        } catch (e) {}
      }, 3000);
    }
    return () => clearInterval(pollInterval);
  }, [orderSuccess, orderStatus, orderId, lastUpdateId, orders]);

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

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

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
    else if (paymentType === 'binance') message += `🔶 Method: Binance\n🧾 ID: ${binanceTx}\n`;
    else if (paymentType === 'instapay') message += `💸 Method: InstaPay\n📞 From: ${senderPhone}\n`;
    else if (paymentType === 'paypal') message += `🅿️ Method: PayPal\n👤 From: ${senderPhone}\n`;
    
    const newOrder: Order = {
      id: newOrderId,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      category: selectedProduct.category,
      priceUsd: currentPrice,
      quantity: selectedProduct.sizeOptions ? 1 : quantity,
      totalPrice: formatPrice(currentPrice, true, selectedProduct.category !== 'rent'),
      status: "pending",
      timestamp: Date.now(),
      paymentType: paymentType,
      details: {
        sn: selectedProduct.requiresSN ? sn : undefined,
        email: selectedProduct.category === 'credit' ? email : undefined,
        whatsappNumber: selectedProduct.category === 'server' ? whatsappNumber : undefined,
        remoteTool: selectedProduct.category === 'rent' ? remoteTool : undefined,
        ultraId: remoteTool === 'ultra' ? ultraId : undefined,
        anyDeskId: remoteTool === 'anydesk' ? anyDeskId : undefined,
        size: selectedSize || undefined,
      }
    };
    setOrders(prev => [newOrder, ...prev]);

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
    const isPaymentValid = paymentType === 'vodafone' 
      ? senderPhone.trim().length >= 11 
      : paymentType === 'instapay' 
        ? senderPhone.trim().length >= 11 
        : binanceTx.trim().length > 0;
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
    <div className={`min-h-screen pb-20 font-sans transition-colors duration-300 relative ${isDarkMode ? 'dark bg-[#0B0F1A] text-slate-100' : 'bg-slate-50/50 text-slate-900'}`} dir={t.dir}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02] z-0">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-[90] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
        <WhatsAppIcon className="w-8 h-8" />
      </a>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-[90] bg-white dark:bg-[#161B26] text-blue-600 p-4 rounded-full shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-110 transition-transform"
          >
            <ArrowRight className="-rotate-90" size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      
      <nav className="bg-white/90 dark:bg-[#161B26]/90 backdrop-blur-md border-b dark:border-slate-800 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
              <span className="text-white font-black text-lg tracking-tighter">WS</span>
            </div>
            <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase shrink-0">
              WALID <span className="text-blue-600">SALA7</span>
            </span>
          </div>
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
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t.title}</h1>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-1 w-12 bg-gradient-to-r from-transparent to-blue-600 rounded-full"></div>
            <p className="text-blue-600 font-black text-lg md:text-xl uppercase tracking-[0.2em]">{t.subtitle}</p>
            <div className="h-1 w-12 bg-gradient-to-l from-transparent to-blue-600 rounded-full"></div>
          </div>
          
          <div className="max-w-2xl mx-auto mb-10 relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full group-focus-within:bg-blue-600/10 transition-all"></div>
            <Search size={22} className={`absolute ${t.dir === 'rtl' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10`} />
            <input 
              type="text" 
              placeholder={currentCategory === 'orders' ? (t as any).searchOrdersPlaceholder : t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${t.dir === 'rtl' ? 'pr-16 pl-32' : 'pl-16 pr-32'} py-5 rounded-[2rem] border-2 border-white dark:border-slate-800 focus:border-blue-500 outline-none font-bold shadow-xl shadow-slate-200/50 dark:shadow-none transition-all bg-white dark:bg-[#161B26] text-slate-900 dark:text-white relative z-0`}
            />
            <div className={`absolute ${t.dir === 'rtl' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 flex items-center gap-2 z-10`}>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm active:scale-95 transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/20"
              >
                {(t as any).searchButton}
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8 overflow-x-auto no-scrollbar py-2 px-4">
            {[
              { id: 'rent', label: t.rentalsTab, icon: <Laptop size={18} /> },
              { id: 'credit', label: t.creditsTab, icon: <Zap size={18} /> },
              { id: 'server', label: t.serverTab, icon: <Monitor size={18} /> },
              { id: 'orders', label: t.ordersTab, icon: <Clock size={18} /> }
            ].map((cat) => (
              <button 
                key={cat.id}
                onClick={() => {
                  setCurrentCategory(cat.id as any);
                  setSearchQuery("");
                }} 
                className={`px-8 py-4 rounded-[2rem] font-black transition-all whitespace-nowrap flex items-center gap-3 border-2 ${
                  currentCategory === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 scale-105' 
                    : 'bg-white dark:bg-[#161B26] text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {currentCategory === 'orders' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-20 space-y-6"
          >
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#161B26] rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-slate-50 dark:bg-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {lang === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold">
                  {lang === 'ar' ? 'ابدأ في استئجار الأدوات وستظهر هنا' : 'Start renting tools and they will appear here'}
                </p>
              </div>
            ) : (
              (() => {
                if (!searchQuery) {
                  return (
                    <div className="text-center py-20 bg-white dark:bg-[#161B26] rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Hash size={32} className="text-blue-500" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        {lang === 'ar' ? 'أدخل كود الطلب' : 'Enter Order Code'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold max-w-[280px] mx-auto">
                        {lang === 'ar' 
                          ? 'يرجى إدخال كود الطلب الخاص بك لمتابعة الحالة' 
                          : 'Please enter your order code to track your status'}
                      </p>
                    </div>
                  );
                }

                const filteredOrders = orders.filter((order) => {
                  const query = searchQuery.toLowerCase();
                  return (
                    order.id.toString() === query || 
                    order.productName.toLowerCase().includes(query)
                  );
                });

                if (filteredOrders.length === 0) {
                  return (
                    <div className="text-center py-20 bg-white dark:bg-[#161B26] rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-[#1F2937] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        {lang === 'ar' ? 'لم يتم العثور على الطلب' : 'Order Not Found'}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 font-bold">
                        {lang === 'ar' ? 'تأكد من إدخال كود الطلب الصحيح' : 'Please check if you entered the correct code'}
                      </p>
                    </div>
                  );
                }

                return filteredOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-[#161B26] p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                      <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-center sm:text-left space-y-1">
                      <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                        <h4 className="font-black text-slate-900 dark:text-white text-lg">{order.productName}</h4>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                          order.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' :
                          order.status === 'rejected' ? 'bg-rose-100 text-rose-600' :
                          'bg-blue-100 text-blue-600 animate-pulse'
                        }`}>
                          {order.status === 'accepted' ? (t as any).statusAccepted : 
                           order.status === 'rejected' ? (t as any).statusRejected : 
                           (t as any).statusPending}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400">
                        {new Date(order.timestamp).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                          <Wallet size={12} className="text-slate-400" />
                          <span className="text-xs font-black text-slate-600 dark:text-slate-300">{order.totalPrice}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={12} className="text-slate-400" />
                          <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase">{order.paymentType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(order.id.toString());
                          setCopyStatus(order.id.toString());
                          setTimeout(() => setCopyStatus(""), 2000);
                        }}
                        className="px-6 py-3 bg-slate-50 dark:bg-[#1F2937] text-slate-600 dark:text-slate-300 rounded-xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2 group/btn"
                      >
                        <span className="text-slate-400 group-hover/btn:text-blue-600 transition-colors">
                          {copyStatus === order.id.toString() ? <CheckCircle2 size={14} /> : <Hash size={14} />}
                        </span>
                        ID: {order.id.toString()}
                      </button>
                    </div>
                  </div>
                </div>
                ));
              })()
            )}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          >
          {productsData
            .filter(p => p.category === currentCategory)
            .filter(p => (lang === 'en' && p.nameEn ? p.nameEn : p.name).toLowerCase().includes(searchQuery.toLowerCase()))
            .map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-[#161B26] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500 flex flex-col group relative"
            >
              <div className="h-48 bg-slate-50 dark:bg-[#1F2937] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                <img 
                  src={product.image} 
                  alt={lang === 'en' && product.nameEn ? product.nameEn : product.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                    {product.category === 'rent' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${product.category === 'rent' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {product.category === 'rent' ? 'Online' : product.category === 'credit' ? 'Credit' : 'Server'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-4 h-14 line-clamp-2 mt-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lang === 'en' && product.nameEn ? product.nameEn : product.name}
                </h3>
                
                <div className="flex justify-between items-end mt-auto">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.priceLabel}</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-black text-slate-900 dark:text-white leading-none" title={product.tooltip}>
                        {formatPrice(product.priceUsd, false, product.category === 'credit')}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { setSelectedProduct(product); setOrderSuccess(false); setQuantity(product.minQty || 1); setSelectedSize(""); setDownloadLink(product.downloadLink || ""); setSn(""); }} 
                    className="bg-blue-600 text-white p-4 rounded-2xl font-black text-sm hover:bg-blue-700 hover:scale-110 transition-all active:scale-90 shadow-lg shadow-blue-500/20 flex items-center justify-center group/btn"
                  >
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

        {currentCategory !== 'orders' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Zap className="text-blue-600" />, title: lang === 'ar' ? 'تسليم فوري' : 'Instant Delivery', desc: lang === 'ar' ? 'يتم تفعيل طلبك في دقائق معدودة' : 'Your order is activated in minutes' },
            { icon: <ShieldCheck className="text-green-500" />, title: lang === 'ar' ? 'دفع آمن' : 'Secure Payment', desc: lang === 'ar' ? 'وسائل دفع موثوقة ومشفرة' : 'Trusted and encrypted payment methods' },
            { icon: <Phone className="text-rose-500" />, title: lang === 'ar' ? 'دعم 24/7' : '24/7 Support', desc: lang === 'ar' ? 'فريقنا متاح دائماً لمساعدتك' : 'Our team is always here to help' }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#161B26] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-start gap-6 group hover:shadow-xl transition-all"
            >
              <div className="p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-900 dark:text-white mb-1">{benefit.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

        {currentCategory !== 'orders' && (
          <div className="bg-white dark:bg-[#161B26] rounded-[3rem] p-8 md:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none max-w-5xl mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-blue-600 to-amber-500"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-4">
              <Wallet className="text-blue-600" size={32} /> {t.paymentTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-12 max-w-md mx-auto">{t.helpText}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { id: 'v1', name: t.vodafone, value: VODAFONE_NUMBER, icon: VODAFONE_QR_URL, color: 'rose' },
                { id: 'i1', name: t.instapay, value: INSTAPAY_NUMBER, icon: INSTAPAY_LOGO_URL, color: 'blue' },
                { id: 'b1', name: t.binance, value: BINANCE_ID, icon: BINANCE_QR_URL, color: 'amber' },
                { id: 'p1', name: t.paypal, value: 'PayPal.me', icon: PAYPAL_LOGO_URL, color: 'indigo', isLink: true, link: PAYPAL_LINK }
              ].map((method) => (
                <div key={method.id} className="group relative">
                  <div className={`absolute inset-0 bg-${method.color}-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl`}></div>
                  <div className="relative p-8 rounded-[2.5rem] bg-slate-50 dark:bg-[#1F2937] border border-slate-100 dark:border-slate-800 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                    <div className="flex flex-col items-center gap-6">
                      <div className="p-4 bg-white dark:bg-[#161B26] rounded-3xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <img src={method.icon} alt={method.name} className="w-16 h-16 object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="text-center">
                        <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">{method.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Account</p>
                        {method.isLink ? (
                          <a 
                            href={method.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-mono font-bold text-sm transition-all bg-white dark:bg-[#161B26] text-${method.color}-600 border border-${method.color}-100 dark:border-${method.color}-900/30 hover:bg-${method.color}-50 dark:hover:bg-${method.color}-950/30`}
                          >
                            <Link size={18} />
                            {method.value}
                          </a>
                        ) : (
                          <button 
                            onClick={() => handleCopy(method.value, method.id as any)} 
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-mono font-bold text-sm transition-all ${
                              copyStatus === method.id 
                                ? 'bg-green-500 text-white' 
                                : `bg-white dark:bg-[#161B26] text-${method.color}-600 border border-${method.color}-100 dark:border-${method.color}-900/30 hover:bg-${method.color}-50 dark:hover:bg-${method.color}-950/30`
                            }`}
                          >
                            {copyStatus === method.id ? <CheckCircle2 size={18} /> : <Hash size={18} />}
                            {method.value}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>

      <footer className="max-w-7xl mx-auto px-4 py-20 border-t dark:border-slate-800 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-lg tracking-tighter">WS</span>
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                WALID <span className="text-blue-600">SALA7</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
              {t.subtitle}
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {['rent', 'credit', 'server'].map((cat) => (
                <li key={cat}>
                  <button 
                    onClick={() => setCurrentCategory(cat as any)}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} />
                    {cat === 'rent' ? t.rentalsTab : cat === 'credit' ? t.creditsTab : t.serverTab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-widest">Contact Us</h4>
            <div className="space-y-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                <div className="p-3 bg-green-500 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</p>
                  <p className="text-slate-900 dark:text-white font-black">{VODAFONE_NUMBER}</p>
                </div>
              </a>

              <a href="https://www.facebook.com/walid.salah.359716/about" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                <div className="p-3 bg-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facebook</p>
                  <p className="text-slate-900 dark:text-white font-black">Walid Salah</p>
                </div>
              </a>

              <a href="https://www.instagram.com/waleed_salah_00/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-[#1F2937] rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all group">
                <div className="p-3 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <Instagram size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instagram</p>
                  <p className="text-slate-900 dark:text-white font-black">@waleed_salah_00</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t dark:border-slate-800 text-center">
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
            © 2026 WALID SALA7 SERVICES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

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
                            <h3 className="font-black text-slate-900 dark:text-white text-3xl tracking-tight">{t.statusPending}</h3>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border-2 border-blue-100 dark:border-blue-900/50 space-y-4">
                              <p className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest">
                                {(t as any).orderCodeLabel}
                              </p>
                              <div className="flex flex-col gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
                                  {orderId}
                                </span>
                                <button 
                                  onClick={() => handleCopy(orderId?.toString() || "", 'order_code')}
                                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all ${
                                    copyStatus === 'order_code' 
                                      ? 'bg-emerald-500 text-white' 
                                      : 'bg-white dark:bg-[#161B26] text-blue-600 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-50 shadow-sm'
                                  }`}
                                >
                                  {copyStatus === 'order_code' ? <CheckCircle2 size={16} /> : <Hash size={16} />}
                                  {copyStatus === 'order_code' ? t.copied : (t as any).copyCode}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full mx-auto w-fit">
                              <ShieldCheck size={16} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Secure Verification</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed max-w-[280px] mx-auto">{t.waitOwner}</p>
                            <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mt-2 animate-pulse">
                              {lang === 'ar' 
                                ? 'يمكنك متابعة حالة طلبك في سجل الطلبات باستخدام هذا الكود' 
                                : 'You can track your order status in Orders History using this code'}
                            </p>
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => setPaymentType('vodafone')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'vodafone' ? 'border-rose-500 bg-rose-600 text-white shadow-xl shadow-rose-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-rose-200'}`}>
                              {paymentType === 'vodafone' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={VODAFONE_QR_URL} alt="V" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <Smartphone size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.vodafone}</span>
                            </button>
                            <button onClick={() => setPaymentType('instapay')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'instapay' ? 'border-blue-500 bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-blue-200'}`}>
                              {paymentType === 'instapay' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={INSTAPAY_LOGO_URL} alt="I" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <CreditCard size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.instapay}</span>
                            </button>
                            <button onClick={() => setPaymentType('binance')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'binance' ? 'border-amber-500 bg-amber-600 text-white shadow-xl shadow-amber-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-amber-200'}`}>
                              {paymentType === 'binance' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={BINANCE_QR_URL} alt="B" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <QrCode size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.binance}</span>
                            </button>
                            <button onClick={() => setPaymentType('paypal')} className={`p-6 rounded-[2.5rem] border-2 flex flex-col items-center gap-3 transition-all ${paymentType === 'paypal' ? 'border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2937] text-slate-400 hover:border-indigo-200'}`}>
                              {paymentType === 'paypal' ? (
                                <div className="bg-white dark:bg-[#1F2937] p-2 rounded-2xl shadow-sm"><img src={PAYPAL_LOGO_URL} alt="P" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" /></div>
                              ) : (
                                <Link size={32} />
                              )}
                              <span className="text-[10px] font-black uppercase tracking-widest">{t.paypal}</span>
                            </button>
                          </div>

                          <motion.div layout className="relative">
                            {paymentType === 'paypal' && (
                              <div className="space-y-6">
                                <div className="p-8 bg-indigo-50 dark:bg-indigo-950/20 rounded-[3.5rem] border-2 border-indigo-100 dark:border-indigo-900 shadow-inner relative overflow-hidden group">
                                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700"></div>
                                  <div className="text-center relative z-10">
                                    <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-black uppercase tracking-[0.4em] mb-6 block">PayPal Payment</span>
                                    <div className="flex flex-col items-center gap-6">
                                      <a 
                                        href={PAYPAL_LINK} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className="flex items-center gap-4 bg-white dark:bg-[#1F2937] px-10 py-5 rounded-[2rem] shadow-2xl border-2 border-indigo-100 dark:border-indigo-900 hover:scale-105 transition-all active:scale-95 group/btn"
                                      >
                                        <img src={PAYPAL_LOGO_URL} alt="PayPal" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                                        <span className="text-lg font-black text-indigo-600 uppercase tracking-wider">Pay via PayPal</span>
                                        <ArrowRight size={20} className="text-indigo-400 group-hover/btn:translate-x-1 transition-transform" />
                                      </a>
                                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.instructionPaypal}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <label className="flex items-center gap-2 text-sm font-black text-slate-700 dark:text-slate-300 ml-2">
                                    <User size={16} className="text-blue-500" />
                                    {lang === 'ar' ? 'اسم حسابك في PayPal:' : 'Your PayPal Name/Email:'}
                                  </label>
                                  <div className="relative group">
                                    <input 
                                      type="text" 
                                      value={senderPhone} 
                                      onChange={(e) => setSenderPhone(e.target.value)} 
                                      placeholder={lang === 'ar' ? 'اكتب اسمك أو بريدك في PayPal' : 'Enter your PayPal name or email'} 
                                      className="w-full pl-6 pr-12 py-5 rounded-3xl border-2 border-white dark:border-slate-800 font-bold focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white shadow-sm"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
                                      <Mail size={20} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
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
                            ) : paymentType === 'instapay' ? (
                              <div className="space-y-6">
                                <div className="p-8 bg-blue-50 dark:bg-blue-950/20 rounded-[3.5rem] border-2 border-blue-100 dark:border-blue-900 shadow-inner relative overflow-hidden group">
                                  <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl group-hover:scale-110 transition-all duration-700"></div>
                                  <div className="text-center relative z-10">
                                    <span className="text-[10px] text-blue-700 dark:text-blue-400 font-black uppercase tracking-[0.4em] mb-6 block">{t.vodafoneNumberLabel}</span>
                                    <div className="flex flex-col items-center gap-6">
                                      <span className="text-5xl font-black text-blue-950 dark:text-blue-100 font-mono tracking-tighter">{INSTAPAY_NUMBER}</span>
                                      <button onClick={() => handleCopy(INSTAPAY_NUMBER, 'm_i')} className="flex items-center gap-3 bg-white dark:bg-[#1F2937] px-8 py-4 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-900 hover:scale-105 transition-all active:scale-95 group/btn">
                                        {copyStatus === 'm_i' ? (
                                          <><CheckCircle2 className="text-green-500" size={24} /><span className="text-sm font-black text-green-600 uppercase tracking-wider">{t.copied}</span></>
                                        ) : (
                                          <><img src={INSTAPAY_LOGO_URL} alt="I" className="w-6 h-6 object-contain group-hover/btn:rotate-12 transition-transform" referrerPolicy="no-referrer" /><span className="text-sm font-black text-blue-800 dark:text-blue-200 uppercase tracking-wider">{t.copy} Number</span></>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-10 bg-white/70 dark:bg-[#1F2937]/70 backdrop-blur-md p-5 rounded-3xl border border-blue-100 dark:border-blue-900 flex items-start gap-3">
                                    <Info className="text-blue-600 shrink-0" size={16} />
                                    <p className="text-[11px] text-blue-900 dark:text-blue-100 font-bold leading-relaxed">{t.instructionInstapay}</p>
                                  </div>
                                </div>
                                <div className="relative group">
                                  <input type="text" placeholder={t.senderPhonePlaceholder} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full px-8 py-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 text-center font-black text-xl focus:border-blue-500 bg-white dark:bg-[#1F2937] text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-300 shadow-sm" />
                                  <div className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500 group-focus-within:scale-110 transition-transform"><Smartphone size={24} /></div>
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
                            className={`w-full py-8 rounded-[3.5rem] text-2xl font-black transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${
                              isFormValid() 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-green-600 hover:to-emerald-600 text-white shadow-blue-500/25 scale-[1.02] active:scale-95' 
                                : 'bg-slate-100 dark:bg-[#1F2937] text-slate-400 dark:text-slate-600 cursor-not-allowed border-2 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className="relative z-10">{t.confirmOrder}</span>
                            <div className="relative z-10 p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                            {isFormValid() && (
                              <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
    </div>
  );
}
