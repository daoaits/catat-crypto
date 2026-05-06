import React, { useState } from 'react';
import { MessageSquare, BookOpen, MessageCircle, ChevronDown, CheckCircle2, MoveRight, Mail, X, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isId = i18n.language === 'id';

  const faqs = [
    {
      q: isId ? "Apakah data API saya aman?" : "Is my API data secure?",
      a: isId ? "Kami menggunakan enkripsi tingkat militer (AES-256) dan tidak pernah memiliki izin penarikan di API key." : "We use military-grade encryption (AES-256) and never have withdrawal permissions on your API key."
    },
    {
      q: isId ? "Bagaimana import dari Indodax?" : "How to import from Indodax?",
      a: isId ? "Anda bisa pakai API Sync Otomatis atau unggah CSV di menu 'Aset'." : "You can use the Automatic API Sync feature or upload transaction history via CSV in the 'Assets' tab."
    },
    {
      q: isId ? "Biaya berlangganan?" : "Subscription fees?",
      a: isId ? "Ada paket gratis selamanya dan paket Pro untuk fitur analisis mendalam." : "A free forever plan is available for basic portfolios, and a Pro plan for in-depth analysis features."
    },
    {
      q: isId ? "Dukungan NFT & DeFi?" : "NFT & DeFi support?",
      a: isId ? "Ya, Catat Crypto mendukung pelacakan dompet on-chain seperti Ethereum, BSC, Polygon." : "Yes, Catat Crypto supports on-chain wallet tracking for various networks including Ethereum, BSC, and Polygon."
    },
    {
      q: isId ? "Hitungan P&L?" : "P&L calculation?",
      a: isId ? "Kami pakai metode akuntansi standar FIFO untuk hitung kerugian dan keuntungan." : "We use the FIFO (First-In, First-Out) standard accounting method to calculate your gains and losses."
    },
    {
      q: isId ? "Aplikasi Mobile?" : "Mobile App?",
      a: isId ? "Aplikasi Android dan iOS kami masih beta dan akan rilis sebentar lagi." : "Our Android and iOS apps are currently in closed beta and will be released to the public soon."
    }
  ];

  return (
    <div className="bg-[#050505] text-white pt-24 pb-0 relative overflow-hidden flex flex-col min-h-screen">
       <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex-1">
          {/* Header */}
          <div className="text-center mb-16 relative z-10">
            <div className="inline-block px-5 py-1.5 rounded-full border border-red-900/50 text-[#E26A59] text-[10px] font-bold tracking-widest uppercase mb-6 mt-12">
              {t('contact.badge')}
            </div>
            <h1 className="text-5xl md:text-[64px] font-bold mb-6 tracking-tight">
              {t('contact.title')}
            </h1>
            <p className="text-[#8C8C8C] text-lg max-w-2xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8 pt-4">
             {/* Left Card */}
             <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#2A0D0A] to-[#120505] border border-[#3A1410] rounded-[32px] p-10 md:p-12 relative flex flex-col items-start min-h-[440px] overflow-hidden shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-[#1A0505] border border-[#3A1410] flex items-center justify-center mb-8 shadow-inner">
                   <MessageSquare className="w-6 h-6 text-[#E26A59]" />
                </div>
                <h3 className="text-[32px] md:text-[40px] font-bold text-[#FF4747] mb-6 tracking-tight relative z-20">{t('contact.realTime')}</h3>
                <p className="text-white/80 text-[16px] leading-relaxed mb-8 max-w-[320px] relative z-20">
                  {t('contact.realTimeDesc')}
                </p>
                <div className="space-y-4 mb-10 relative z-20">
                  <div className="flex items-center gap-3 text-white/90 text-[15px]">
                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center bg-white/5">
                       <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    {t('contact.avgResponse')}
                  </div>
                  <div className="flex items-center gap-3 text-white/90 text-[15px]">
                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center bg-white/5">
                       <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    {t('contact.multilingual')}
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-[#FF1A1A] hover:bg-[#E60000] text-white font-bold py-3.5 px-8 rounded-xl transition-colors mt-auto z-20 shadow-lg shadow-red-900/20"
                >
                   {t('contact.startChatBtn')}
                </button>

                {/* Mockup Chat UI inside Card */}
                <div className="absolute right-[-20%] md:right-[-25%] lg:right-[-15%] top-[10%] w-[380px] bg-[#121214] border border-white/10 rounded-[28px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-4 transform rotate-[-6deg] opacity-100 z-10 pointer-events-none hidden md:flex">
                   <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <div className="flex items-center gap-3">
                         <div className="flex -space-x-3">
                           <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-[3px] border-[#121214]" alt="Avatar 1" />
                           <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-[3px] border-[#121214]" alt="Avatar 2" />
                           <div className="w-10 h-10 rounded-full border-[3px] border-[#121214] bg-[#2E3136] flex items-center justify-center text-[10px] font-bold text-white">+4</div>
                         </div>
                         <div className="ml-2">
                            <div className="text-white font-bold text-[16px]">Catat Crypto</div>
                            <div className="text-[#34D399] text-[11px] flex items-center gap-1.5 mt-0.5"><div className="w-2 h-2 rounded-full bg-[#34D399]" />{t('contact.chat.assistant')}</div>
                         </div>
                      </div>
                   </div>
                   <div className="text-center text-[10px] font-bold text-neutral-500 bg-[#1A1A1E] rounded-full w-max mx-auto px-5 py-1.5 tracking-widest uppercase mt-2 mb-2">{t('contact.chat.today')}</div>
                   
                   <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-[#FF1A1A] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                           <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h9v2.585a1.5 1.5 0 0 0 2.56 1.06l3.415-3.414c.148-.148.608-.415 1.025-.415A1.5 1.5 0 0 0 22 12V9c0-.285-.015-.555-.072-.807zM15 12H9v-2h6v2zm3-3H6V7h12v2z"/>
                        </svg>
                     </div>
                     <div className="bg-[#1A1A1E] rounded-[20px] rounded-tl-sm p-5 text-[14px] text-neutral-300 leading-relaxed shadow-inner">
                        {isId ? "Halo! Saya" : "Hello! I'm your"} <span className="text-[#FF4747] font-semibold">CryptoJournal AI</span>. {isId ? "Ada masalah apa tentang portofolio?" : "How can I help you manage your digital portfolio or support tickets today?"}
                     </div>
                   </div>

                   <div className="flex gap-2 text-[12px] mt-2 font-medium">
                     <div className="border border-white/10 rounded-full px-5 py-2.5 bg-transparent text-white cursor-pointer hover:bg-white/5 transition-colors">{isId ? "Setup Portofolio" : "Setup Portfolio"}</div>
                     <div className="border border-white/10 rounded-full px-5 py-2.5 bg-transparent text-white cursor-pointer hover:bg-white/5 transition-colors">{isId ? "Bantuan" : "Support Ticket"}</div>
                   </div>
                   
                   <div className="mt-4 bg-[#1A1A1E] rounded-2xl p-4 flex flex-col gap-3">
                      <div className="text-neutral-500 text-[12px] px-2 mb-1">Email Address</div>
                      <div className="h-4 w-1/3 bg-white/5 rounded mx-2" />
                   </div>
                   <div className="bg-[#1A1A1E] rounded-2xl p-4 flex items-center justify-between">
                      <div className="text-neutral-500 text-[13px] px-2">{isId ? "Apa ada yang bisa dibantu?" : "How can we help?"}</div>
                      <div className="w-8 h-8 rounded-full bg-[#FF1A1A] flex items-center justify-center cursor-pointer">
                         <Send className="w-4 h-4 text-white" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column */}
             <div className="w-full lg:w-[40%] flex flex-col gap-6">
                {/* Help Center */}
                <div className="flex-1 bg-gradient-to-b from-[#120505] to-[#0A0202] hover:from-[#1A0A0A] hover:to-[#0F0404] border border-[#2F0B0B] rounded-[32px] p-10 flex flex-col items-start transition-all cursor-pointer group shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A0505] border border-[#3A1410] flex items-center justify-center mb-6 shadow-inner">
                     <BookOpen className="w-6 h-6 text-[#E26A59]" />
                  </div>
                  <h4 className="text-[26px] font-bold text-[#FF4747] mb-3 group-hover:text-[#ff6b6b] transition-colors">{isId ? "Pusat Bantuan" : "Help Center"}</h4>
                  <p className="text-[#8C8C8C] text-[15px] leading-relaxed mb-6">{isId ? "Dokumentasi komprehensif dan tutorial interaktif untuk memandu Anda." : "Comprehensive documentation and video tutorials to assist you."}</p>
                  <div className="mt-auto text-white font-bold text-[15px] flex items-center gap-2 group-hover:text-[#E26A59] transition-colors">
                     {isId ? "Pelajari Info Lanjut" : "Learn More"} <MoveRight className="w-5 h-5 ml-1" />
                  </div>
                </div>

                {/* Discord */}
                <div className="flex-1 bg-gradient-to-b from-[#120505] to-[#0A0202] hover:from-[#1A0A0A] hover:to-[#0F0404] border border-[#2F0B0B] rounded-[32px] p-10 flex flex-col items-start transition-all cursor-pointer group shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-[#1A0505] border border-[#3A1410] flex items-center justify-center mb-6 shadow-inner">
                     <MessageCircle className="w-6 h-6 text-[#E26A59]" />
                  </div>
                  <h4 className="text-[26px] font-bold text-[#FF4747] mb-3 group-hover:text-[#ff6b6b] transition-colors">Discord Community</h4>
                  <p className="text-[#8C8C8C] text-[15px] leading-relaxed mb-6">{isId ? "Bergabung dengan ribuan orang lainnya di server kami." : "Join thousands of traders and our development team."}</p>
                  <div className="mt-auto text-white font-bold text-[15px] flex items-center gap-2 group-hover:text-[#E26A59] transition-colors">
                     {isId ? "Gabung Sekarang" : "Join Now"} <MoveRight className="w-5 h-5 ml-1" />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-[#121214] border border-white/5 hover:border-white/10 transition-colors rounded-3xl md:rounded-full px-8 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between mb-32 cursor-pointer shadow-lg gap-4">
             <div className="flex items-center gap-3 text-[#8C8C8C] text-[16px]">
                <Mail className="w-5 h-5 text-[#E26A59]" /> {isId ? "Butuh tanya lanjut melalui email resmi?" : "Need official help via email?"}
             </div>
             <div className="text-[#E26A59] font-bold text-[16px] tracking-wide">support@catcrypto.id</div>
          </div>

          {/* FAQs */}
          <div className="text-center mb-16">
             <h2 className="text-[36px] md:text-5xl font-bold text-[#FF4747] mb-4 tracking-tight">{isId ? "Sering Ditanyakan" : "Frequently Asked Questions"}</h2>
             <p className="text-[#8C8C8C] text-[16px]">{isId ? "Jawaban paling lazim." : "Quick answers to commonly asked questions."}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-[1000px] mx-auto">
             {faqs.map((faq, i) => (
               <div 
                 key={i}
                 className="bg-[#0A0A0C] border border-white/5 hover:border-[#E26A59]/30 rounded-[20px] p-7 cursor-pointer transition-all min-h-[140px] flex flex-col justify-center shadow-md hover:shadow-lg"
                 onClick={() => setOpenFaq(openFaq === i ? null : i)}
               >
                 <div className="flex justify-between items-start gap-4 mb-3">
                    <h5 className="text-[#E26A59] font-bold text-[15px] tracking-wide">{faq.q}</h5>
                 </div>
                 <p className="text-[#8C8C8C] text-[14px] leading-relaxed">{faq.a}</p>
               </div>
             ))}
          </div>
          <div className="text-center mb-32 max-w-[1000px] mx-auto">
             <button className="text-[#E26A59] text-[15px] font-bold flex items-center justify-center gap-2 mx-auto hover:text-[#ff7a66] transition-colors">
                {isId ? "Lihat Semua FAQ" : "View All FAQs"} <ChevronDown className="w-4 h-4 ml-1" />
             </button>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#2A0D0A] to-[#120505] border border-[#3A1410] rounded-[32px] p-12 md:p-16 flex items-center justify-between overflow-hidden relative mb-24 min-h-[400px] shadow-2xl max-w-[1000px] mx-auto">
             <div className="relative z-10 w-full md:w-[60%]">
                <h3 className="text-[36px] md:text-[46px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
                  {isId ? "Siap menjadi trader\nyang lebih baik?" : "Are You Ready to Become\na Better Trader?"}
                </h3>
                <p className="text-[#8C8C8C] text-[16px] mb-10 leading-relaxed max-w-[400px]">
                  {isId ? "Ribuan pengguna sudah merasakan akurasi pencatatan melalui Catat Crypto. Rasakan kemudahannya hari ini." : "Thousands of users have improved their investment accuracy with Catat Crypto. Join now and experience the ease."}
                </p>
                <button className="bg-white hover:bg-neutral-200 text-[#050505] font-bold py-4 px-8 rounded-xl transition-colors shadow-lg">
                   {isId ? "Mulai Gratis Sekarang" : "Start Free Now"}
                </button>
             </div>
             
             {/* Abstract art / Image Placeholder */}
             <div className="absolute right-[-10%] md:right-0 top-0 bottom-0 w-[60%] md:w-1/2 flex items-center justify-end pr-0 md:pr-12 pointer-events-none">
                <div className="w-[450px] h-[450px] bg-[#E26A59]/10 blur-[120px] rounded-full absolute right-0" />
                <img src="https://images.unsplash.com/photo-1642398555940-02ba2e31505d?q=80&w=800&auto=format&fit=crop" alt="Trading UI mockup" className="w-[500px] h-[350px] object-cover rounded-3xl transform rotate-[-8deg] border border-[#4A1410] shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative z-10 opacity-70 mix-blend-luminosity" />
             </div>
          </div>
       </div>

       {/* Live Chat Modal */}
       {isChatOpen && (
         <div className="fixed bottom-[100px] right-6 md:right-8 w-[calc(100vw-3rem)] max-w-[420px] bg-[#121214] border border-[#2A2A35] rounded-[32px] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex flex-col gap-5 z-[60] animate-in slide-in-from-bottom-5 fade-in duration-200">
               <button 
                 onClick={() => setIsChatOpen(false)}
                 className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
               <div className="flex items-center justify-between border-b border-white/5 pb-5">
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                       <img src="https://i.pravatar.cc/100?img=1" className="w-12 h-12 rounded-full border-[3px] border-[#121214]" alt="Avatar 1" />
                       <img src="https://i.pravatar.cc/100?img=2" className="w-12 h-12 rounded-full border-[3px] border-[#121214]" alt="Avatar 2" />
                       <div className="w-12 h-12 rounded-full border-[3px] border-[#121214] bg-[#2E3136] flex items-center justify-center text-[11px] font-bold text-white">+4</div>
                     </div>
                     <div className="ml-2">
                        <div className="text-white font-bold text-[18px]">Catat Crypto</div>
                        <div className="text-[#34D399] text-[12px] flex items-center gap-1.5 mt-1 font-medium"><div className="w-2 h-2 rounded-full bg-[#34D399]" />Assistant Active</div>
                     </div>
                  </div>
               </div>
               <div className="text-center text-[10px] font-bold text-neutral-500 bg-[#1A1A1E] rounded-full w-max mx-auto px-6 py-1.5 tracking-widest uppercase my-2">TODAY</div>
               
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-xl bg-[#FF1A1A] flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                       <path d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2H5c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2h9v2.585a1.5 1.5 0 0 0 2.56 1.06l3.415-3.414c.148-.148.608-.415 1.025-.415A1.5 1.5 0 0 0 22 12V9c0-.285-.015-.555-.072-.807zM15 12H9v-2h6v2zm3-3H6V7h12v2z"/>
                    </svg>
                 </div>
                 <div className="bg-[#1A1A1E] rounded-[24px] rounded-tl-sm p-6 text-[15px] text-neutral-300 leading-relaxed shadow-inner">
                    Hello! I'm your <span className="text-[#FF4747] font-semibold">CryptoJournal AI</span>. How can I help you manage your digital portfolio or support tickets today?
                 </div>
               </div>

               <div className="flex gap-3 text-[13px] mt-2 font-medium">
                 <div className="border border-white/10 rounded-full px-6 py-3 bg-transparent text-white cursor-pointer hover:bg-white/5 transition-colors">Setup Portfolio</div>
                 <div className="border border-white/10 rounded-full px-6 py-3 bg-transparent text-white cursor-pointer hover:bg-white/5 transition-colors">Support Ticket</div>
               </div>
               
               <div className="mt-6 flex flex-col gap-3 relative">
                  <input type="email" placeholder="Email Address" className="w-full bg-[#1A1A1E] rounded-xl px-5 py-4 text-[15px] text-white outline-none border border-transparent focus:border-[#4A1410] transition-colors placeholder:text-neutral-600" />
                  <div className="flex gap-3">
                     <input type="text" placeholder="How can we help?" className="flex-1 bg-[#1A1A1E] rounded-xl px-5 py-4 text-[15px] text-white outline-none border border-transparent focus:border-[#4A1410] transition-colors placeholder:text-neutral-600" />
                     <button className="w-[56px] rounded-xl bg-[#FF1A1A] hover:bg-[#E60000] flex items-center justify-center transition-colors flex-shrink-0">
                        <Send className="w-5 h-5 text-white" />
                     </button>
                  </div>
               </div>
               
               <div className="text-center text-[11px] text-neutral-600 mt-2">
                 Powered by Catat Crypto Support Engine
               </div>
         </div>
       )}

       {/* Floating action button */}
       <button 
         onClick={() => setIsChatOpen(!isChatOpen)}
         className="fixed bottom-8 right-8 w-14 h-14 bg-[#FF1A1A] hover:bg-[#E60000] text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all z-50 group shadow-red-900/30"
       >
         {isChatOpen ? (
           <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
         ) : (
           <MessageSquare className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
         )}
       </button>
    </div>
  );
}
