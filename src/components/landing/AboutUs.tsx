import React from 'react';
import { Lightbulb, TrendingDown, HelpCircle, FileText, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import contact1 from '../../assets/contact1.png';

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  const isId = i18n.language === 'id';

  return (
    <div className="bg-[#050505] text-white pt-32 pb-0 relative overflow-hidden flex flex-col min-h-screen">
      <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex-1">
        
        {/* Header */}
        <div className="text-center mb-32 relative z-10">
          <div className="inline-block px-5 py-1.5 rounded-full border border-red-900/50 text-[#E26A59] text-[10px] font-bold tracking-widest uppercase mb-10 mt-10">
            {t('about.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            {isId ? "Dari Kekacauan" : "From Chaos"} {isId ? "menjadi" : "to"} <span className="text-[#E26A59]">{isId ? "Kejelasan." : "Clarity."}</span>
          </h1>
          <p className="text-[#8C8C8C] text-lg max-w-2xl mx-auto leading-relaxed">
            {isId ? "Evolusi platform kecerdasan trading utama di Indonesia." : "The evolution of Indonesia's premier trading intelligence platform."}<br />
            {isId ? "Dibuat oleh trader, untuk trader yang mengandalkan data, bukan sekadar keberuntungan." : "Built by traders, for traders who demand more than luck."}
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line via absolute positioning */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] md:block hidden" style={{
            background: 'linear-gradient(to bottom, transparent, #E26A59 10%, #E26A59 90%, transparent)'
          }} />

          {/* Block 1: 2026 The Realization */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-40 relative">
            {/* Center Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[11px] h-[11px] bg-[#E26A59] rounded-full shadow-[0_0_15px_rgba(226,106,89,0.8)] hidden md:block mt-8" />

            {/* Left (Text) */}
            <div className="w-full md:w-[45%] md:pr-12 lg:pr-20 text-center md:text-right flex flex-col items-center md:items-end z-10">
              <div className="text-[55px] font-bold text-[#E26A59] mb-0 tracking-tighter leading-none">2026</div>
              <h3 className="text-[32px] font-bold mb-6">{isId ? "Sebuah Kesadaran" : "The Realization"}</h3>
              <p className="text-[#8C8C8C] text-[15px] leading-relaxed mb-10 w-full max-w-md">
                {isId ? "Enrico, Naomi, dan Erica menyaksikan kehancuran pasar ritel yang didorong oleh sinyal Telegram dan FOMO buta. Mereka menyadari, jembatan antara perjudian dan trading adalah data." : "Enrico, Naomi, and Erica witness the carnage of a retail market fueled by Telegram signals and blind FOMO. They realize the bridge between gambling and trading is data."}
              </p>
              
              {/* Quote Card */}
              <div className="bg-white rounded-[20px] p-6 text-left w-full max-w-sm relative flex gap-4 items-start text-[#050505] shadow-2xl">
                <div className="bg-[#FFF0F0] p-2 rounded-full flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-[#E26A59]" />
                </div>
                <p className="text-[13px] font-semibold opacity-70 leading-relaxed italic">
                  {isId ? '"Mayoritas trader kalah bukan karena sinyal yang buruk — mereka kalah karena kurangnya disiplin dan kesadaran diri."' : '"Most traders don\'t lose because of bad signals — they lose because they lack discipline and self-awareness."'}
                </p>
              </div>
            </div>

            {/* Right (Image) */}
            <div className="w-full md:w-[45%] md:pl-12 lg:pl-20 mt-16 md:mt-0 z-10">
              <div className="relative bg-[#1A0505] border-2 border-[#E26A59]/50 rounded-3xl overflow-hidden aspect-[4/3] group shadow-[0_0_30px_rgba(226,106,89,0.4),0_0_60px_rgba(226,106,89,0.2)] hover:shadow-[0_0_40px_rgba(226,106,89,0.6),0_0_80px_rgba(226,106,89,0.3)] transition-all duration-500">
                <img src={contact1} alt="The Founders" className="w-full h-full object-cover" />
                
                {/* Abstract shape overlay reminiscent of design */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E26A59] rounded-full blur-[80px] opacity-20 pointer-events-none" />
                
                <div className="absolute bottom-6 left-6">
                  <div className="text-white font-bold text-lg mb-0.5">{isId ? "Para Pendiri" : "The Founders"}</div>
                  <div className="text-[#8C8C8C] text-xs font-medium tracking-wide">{isId ? "Sesi diskusi larut malam di Jakarta" : "Late-night sessions in Jakarta"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: 90% The Market Reality */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-32 relative">
            {/* Center Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[11px] h-[11px] bg-[#E26A59] rounded-full shadow-[0_0_15px_rgba(226,106,89,0.8)] hidden md:block mt-8" />

            {/* Left (Cards Grid) */}
            <div className="w-full md:w-[45%] md:pr-12 lg:pr-20 mt-16 md:mt-0 order-2 md:order-1 z-10">
              <div className="grid grid-cols-2 gap-4">
                 {/* Signals */}
                 <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-colors">
                   <TrendingDown className="w-5 h-5 text-[#E26A59] mb-4" />
                   <h4 className="text-white font-bold text-[14px] mb-2">{isId ? "Sinyal" : "Signals"}</h4>
                   <p className="text-[#8C8C8C] text-[11px] leading-relaxed">{isId ? "Mengikuti kerumunan membabi buta, tanpa personal edge (keunggulan pribadi)." : "Blindly following the crowd without personal edge."}</p>
                 </div>
                 {/* Emotion */}
                 <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-colors">
                   <HelpCircle className="w-5 h-5 text-[#E26A59] mb-4" />
                   <h4 className="text-white font-bold text-[14px] mb-2">{isId ? "Emosi" : "Emotion"}</h4>
                   <p className="text-[#8C8C8C] text-[11px] leading-relaxed">{isId ? "FOMO di harga pucuk, lanjut panic selling di harga mutlak terendah." : "FOMO at the top, panic selling at the absolute bottom."}</p>
                 </div>
                 {/* Tax */}
                 <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-colors">
                   <FileText className="w-5 h-5 text-[#E26A59] mb-4" />
                   <h4 className="text-white font-bold text-[14px] mb-2">{isId ? "Pajak" : "Tax"}</h4>
                   <p className="text-[#8C8C8C] text-[11px] leading-relaxed">{isId ? "Tenggelam dalam lautan ekspor CSV saat musim pelaporan." : "Drowning in CSV exports during reporting season."}</p>
                 </div>
                 {/* Opaque */}
                 <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 text-left hover:border-white/10 transition-colors">
                   <EyeOff className="w-5 h-5 text-[#E26A59] mb-4" />
                   <h4 className="text-white font-bold text-[14px] mb-2">{isId ? "Tak Jelas" : "Opaque"}</h4>
                   <p className="text-[#8C8C8C] text-[11px] leading-relaxed">{isId ? "Tidak ada kejelasan tentang kinerja portofolio yang sebenarnya." : "No clarity on actual portfolio performance."}</p>
                 </div>
              </div>
            </div>

            {/* Right (Text) */}
            <div className="w-full md:w-[45%] md:pl-12 lg:pl-20 order-1 md:order-2 text-center md:text-left z-10 flex flex-col items-center md:items-start">
              <div className="text-[55px] font-bold text-[#E26A59] mb-0 tracking-tighter leading-none">90%+</div>
              <h3 className="text-[32px] font-bold mb-6">{isId ? "Realita Pasar" : "The Market Reality"}</h3>
              <p className="text-[#8C8C8C] text-[15px] leading-relaxed mb-10 w-full max-w-md">
                {isId ? "Data menunjukkan bahwa 90% trader ritel gagal dalam tahun pertama mereka. Alasannya sederhana: Tidak ada dokumentasi, tidak ada akuntabilitas, dan tidak ada sistem yang dapat diulang (repeatable)." : "Data shows that 90% of retail traders fail within their first year. The reason is simple: No documentation, no accountability, no repeatable system."}
              </p>
              <div className="flex gap-4 w-full max-w-md">
                <div className="bg-[#1A0505] border border-[#2F0B0B] rounded-xl p-5 flex-1 shadow-lg">
                   <div className="text-[#E26A59] font-bold text-2xl mb-1 tracking-tight">3x</div>
                   <div className="text-[#8C8C8C] text-[10px] font-bold tracking-widest uppercase">{isId ? "Pengali Sukses" : "Success Multiplier"}</div>
                </div>
                <div className="bg-[#1A0505] border border-[#2F0B0B] rounded-xl p-5 flex-1 shadow-lg">
                   <div className="text-[#E26A59] font-bold text-2xl mb-1 tracking-tight">67%</div>
                   <div className="text-[#8C8C8C] text-[10px] font-bold tracking-widest uppercase">{isId ? "Hemat Waktu" : "Time Saved"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Text Overlay - breaks the line visual temporarily by adding background */}
      <div className="py-24 text-center relative z-20 w-full mb-24 bg-[#050505]">
        {/* Glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#4a0404] blur-[150px] opacity-20 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-[40px] md:text-[60px] font-bold tracking-tighter text-[#333333] leading-[1.2]">
            <div className="mb-2">{isId ? "Kedisiplinan mengalahkan prediksi." : "Discipline beats prediction."}</div>
            <div className="text-[#ff3b3b] mb-2 drop-shadow-[0_0_40px_rgba(255,59,59,0.4)]">{isId ? "Data mengalahkan emosi." : "Data beats emotion."}</div>
            <div>{isId ? "Sistem mengalahkan sinyal." : "Systems beat signals."}</div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex-1">
        <div className="relative">
          {/* Line continues */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] md:block hidden" style={{
            background: 'linear-gradient(to bottom, #E26A59 0%, #E26A59 90%, transparent)'
          }} />

          {/* Block 3: The Software Layer */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-32 relative">
            {/* Center Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[11px] h-[11px] bg-[#E26A59] rounded-full shadow-[0_0_15px_rgba(226,106,89,0.8)] hidden md:block top-1/2 -translate-y-1/2" />

            {/* Left (Trust Card) */}
            <div className="w-full md:w-[45%] md:pr-12 lg:pr-20 text-left z-10">
               <div className="bg-[#0A0A0C] border border-white/5 rounded-[24px] p-8 md:p-10 relative overflow-hidden group shadow-2xl hover:border-white/10 transition-colors">
                 
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#1A0505] border border-[#2F0B0B] flex items-center justify-center flex-shrink-0">
                       <ShieldCheck className="w-5 h-5 text-[#E26A59]" />
                    </div>
                    <h4 className="text-white font-bold text-[18px]">{isId ? "Jaminan Non-Kustodian" : "Non-Custodial Trust"}</h4>
                 </div>
                 
                 <p className="text-[#8C8C8C] text-[14px] leading-relaxed mb-8 relative z-10">
                   {isId ? 'Kami membangun Catat Crypto di atas landasan "Hanya Baca (Read-Only)". Kami tidak pernah menyentuh dana Anda, tidak pernah mengeksekusi trading, dan tidak akan pernah menjual data Anda. Kami hanyalah lensa yang membantu Anda melihat pencapaian dan mengawal kesuksesan Anda.' : 'We built Catat Crypto on a "Read-Only" foundation. We never touch your funds, never execute trades, and never sell your data. We are simply the lens through which you see your success.'}
                 </p>

                 <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold tracking-[0.1em] text-[#666666] uppercase relative z-10">
                    <span>SOC 2 / ISO 27001 READY</span>
                    <div className="w-[3px] h-[3px] rounded-full bg-[#333333]" />
                    <span>PRIVACY FIRST</span>
                    <div className="w-[3px] h-[3px] rounded-full bg-[#333333]" />
                    <span>NO KEYS STORED</span>
                 </div>
               </div>
            </div>

            {/* Right (Text/Features) */}
            <div className="w-full md:w-[45%] md:pl-12 lg:pl-20 mt-16 md:mt-0 text-left z-10 flex flex-col items-start">
              <h3 className="text-4xl md:text-[50px] font-bold mb-8 leading-[1.1] tracking-tight">
                {isId ? "Kami Menyediakan Alat" : "The Software Layer"}<br/><span className="text-[#E26A59]">{isId ? "Yang Berubah Jadi Pengalaman." : "that changes"}</span><br/>{isId ? "" : "everything."}
              </h3>
              <ul className="space-y-4">
                {(isId 
                  ? ['Pencatatan Jurnal Otomatis', 'Pengenalan Pola Algoritma', 'Pelaporan Pajak Terpadu'] 
                  : ['Automated Journaling', 'Pattern Recognition', 'Unified Tax Reporting']
                 ).map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium text-white/90">
                     <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                       <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                     </div>
                     {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center relative z-10 pt-16 pb-32">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#E26A59] mb-8 tracking-tight">{t('about.mission')}</h2>
          <p className="text-[30px] md:text-[42px] font-bold text-white max-w-[800px] mx-auto leading-[1.2] mb-16 tracking-tight">
            {t('about.missionDesc')}
          </p>

          <div className="w-24 h-[1px] bg-[#331111] mx-auto mb-16" />

          <p className="text-2xl text-[#8C8C8C] italic mb-12">"Stop guessing. Start measuring."</p>

          <button className="px-10 py-5 bg-[#FF2020] hover:bg-[#FF3B3B] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,32,32,0.5)]">
            Join the Revolution
          </button>
        </div>
      </div>
    </div>
  );
}
