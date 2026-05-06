import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';

  return (
    <div className="bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden flex flex-col min-h-screen">
      <div className="max-w-[1000px] w-full mx-auto px-6 relative z-10 flex-1">
        {/* Header */}
        <div className="text-center mb-24 relative z-10">
          <div className="inline-block px-5 py-1.5 rounded-full border border-red-900/50 text-[#E26A59] text-[10px] font-bold tracking-widest uppercase mb-10 mt-10">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            {isId ? 'Kebijakan Privasi' : 'Privacy Policy'}
          </h1>
          <p className="text-[#8C8C8C] text-sm max-w-2xl mx-auto">
            {isId ? 'Pembaruan terakhir: 1 Januari 2025' : 'Last updated: January 1, 2025'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-16 relative">
          
          {/* Vertical Separator Line */}
          <div className="absolute left-[30%] top-0 bottom-0 w-[1px] bg-[#E26A59] hidden md:block" />

          {/* Table of Contents */}
          <div className="w-full md:w-[30%] md:pr-12">
            <h3 className="text-xl font-bold text-white mb-8">{isId ? 'Daftar Isi' : 'Table of Contents'}</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start group cursor-pointer">
                <span className="text-[#333333] font-bold text-sm tracking-widest mt-1 group-hover:text-[#E26A59] transition-colors">01</span>
                <span className="text-[#8C8C8C] text-[14.5px] group-hover:text-white transition-colors">{isId ? 'Pendahuluan' : 'Introduction'}</span>
              </li>
              <li className="flex gap-4 items-start group cursor-pointer">
                <span className="text-[#333333] font-bold text-sm tracking-widest mt-1 group-hover:text-[#E26A59] transition-colors">02</span>
                <div className="flex items-center">
                   {/* Active line indicator connected to the separator */}
                   <div className="absolute left-[30%] w-3 h-[2px] bg-[#E26A59] -translate-x-[2px] hidden md:block" />
                   <span className="text-[#E26A59] font-bold text-[14.5px]">{isId ? <>Pengumpulan Data,<br/>Penggunaan, dan Berbagi</> : <>Information Collection,<br/>Use, and Sharing</>}</span>
                </div>
              </li>
              <li className="flex gap-4 items-start group cursor-pointer">
                <span className="text-[#333333] font-bold text-sm tracking-widest mt-1 group-hover:text-[#E26A59] transition-colors">03</span>
                <span className="text-[#8C8C8C] text-[14.5px] group-hover:text-white transition-colors">{isId ? 'Kontrol dan Akses Anda' : 'Your Access and Control'}</span>
              </li>
              <li className="flex gap-4 items-start group cursor-pointer">
                <span className="text-[#333333] font-bold text-sm tracking-widest mt-1 group-hover:text-[#E26A59] transition-colors">04</span>
                <span className="text-[#8C8C8C] text-[14.5px] group-hover:text-white transition-colors">{isId ? 'Keamanan' : 'Security'}</span>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="w-full md:w-[70%] md:pl-12">
            <div className="bg-[#120505] border border-[#2F0B0B] rounded-[24px] p-8 md:p-10 mb-12 shadow-lg">
              <div className="flex gap-4 items-start mb-6">
                 <div className="text-[#E26A59] font-bold mt-1">⚠</div>
                 <p className="text-[#8C8C8C] text-[14.5px] leading-relaxed">
                   {isId ? (
                     <>
                        Kebijakan Privasi ini menguraikan bagaimana <span className="text-[#E26A59] font-bold">Catat Crypto</span> mengumpulkan, menggunakan, dan melindungi informasi Anda.<br/>
                        Catat Crypto (<span className="text-[#E26A59] font-bold">"kami"</span>) mengoperasikan platform Catat Crypto.
                     </>
                   ) : (
                     <>
                        This Privacy Policy outlines how <span className="text-[#E26A59] font-bold">Catat Crypto</span> collects, uses, and protects your information.<br/>
                        Catat Crypto (<span className="text-[#E26A59] font-bold">"we", "us", or "our"</span>) operates the Catat Crypto platform.
                     </>
                   )}
                 </p>
              </div>
              <p className="text-[#8C8C8C] text-[14.5px] leading-relaxed mb-6 ml-8">
                {isId ? 'Halaman ini menjelaskan data apa yang kami kumpulkan saat Anda menggunakan Layanan kami, bagaimana kami menggunakannya, dan pilihan apa yang Anda miliki terkait informasi Anda.' : 'This page explains what data we collect when you use our Service, how we use it, and what choices you have regarding your information.'}
              </p>
              <p className="text-[#8C8C8C] text-[14.5px] leading-relaxed mb-6 ml-8">
                {isId ? (
                   <>Dengan menggunakan Layanan kami, Anda menyetujui persyaratan yang diuraikan dalam kebijakan ini.<br/>Kebijakan ini hanya berlaku untuk informasi yang dikumpulkan melalui situs web kami. Ini mencakup:</>
                ) : (
                   <>By using our Service, you agree to the terms outlined in this policy.<br/>This policy applies only to information collected through our website. It covers:</>
                )}
              </p>
              <ul className="list-disc pl-14 space-y-2 text-[#8C8C8C] text-[14.5px] marker:text-[#E26A59]">
                 {isId ? (
                    <>
                       <li>Informasi pribadi apa yang kami kumpulkan, bagaimana kami menggunakannya, dan dengan siapa informasi tersebut mungkin dibagikan</li>
                       <li>Pilihan Anda mengenai data Anda</li>
                       <li>Bagaimana kami menjaga informasi Anda</li>
                       <li>Bagaimana Anda dapat memperbarui atau memperbaiki data Anda</li>
                    </>
                 ) : (
                    <>
                       <li>What personal information we collect, how we use it, and who it may be shared with</li>
                       <li>Your options regarding your data</li>
                       <li>How we safeguard your information</li>
                       <li>How you can update or correct your data</li>
                    </>
                 )}
              </ul>
            </div>

            <div className="mb-16">
              <h2 className="text-[28px] font-bold text-white mb-6 flex items-baseline gap-3 tracking-tight">
                 <span className="text-[#E26A59]">1.</span> {isId ? 'Pengumpulan Data, Penggunaan, dan Berbagi' : 'Information Collection, Use, and Sharing'}
              </h2>
              <div className="space-y-6 text-[#8C8C8C] text-[14.5px] leading-relaxed">
                 {isId ? (
                   <>
                     <p>
                       Kami memiliki dan mengelola semua data yang dikumpulkan melalui platform ini. Informasi yang kami kumpulkan terbatas pada apa yang secara sukarela Anda berikan saat menggunakan Catat Crypto. Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Anda.
                     </p>
                     <p>
                       Data Anda digunakan <strong className="text-[#E26A59] font-medium">secara ketat untuk mengoperasikan dan meningkatkan layanan kami</strong>. Kami tidak membagikan informasi Anda ke pihak luar kecuali diperlukan untuk memberikan layanan yang Anda minta.
                     </p>
                     <p className="italic text-white font-medium bg-[#120505] p-5 rounded-xl border-l-4 border-[#E26A59]">
                       Jika Anda memutuskan untuk mempublikasikan jurnal trading atau aktivitas Anda, beberapa info terkait akan dapat dilihat oleh pengguna lain. Bila Anda memilih untuk merahasiakannya, Anda cukup tidak membagikannya.
                     </p>
                     <p>
                       Kecuali jika Anda memilih keluar, kami terkadang dapat mengirim email untuk memberi tahu Anda tentang pembaruan produk atau perubahan penting.
                     </p>
                     <p>
                       Kami juga menggunakan pihak ketiga untuk metrik guna memahami perilaku pengguna secara umum. Kami tidak pernah membagikan detail personal dan sensitif.
                     </p>
                   </>
                 ) : (
                   <>
                     <p>
                       We own and manage all data collected through this platform. The information we collect is limited to what you voluntarily provide while using Catat Crypto. We do not sell, rent, or trade your personal information.
                     </p>
                     <p>
                       Your data is used <strong className="text-[#E26A59] font-medium">strictly to operate and improve our services</strong>. We do not share your information with external parties unless it is necessary to deliver the service you've requested. For example:
                     </p>
                     <p className="italic text-white font-medium bg-[#120505] p-5 rounded-xl border-l-4 border-[#E26A59]">
                       If you decide to make your trade journal or activity public, some related information will be visible to others on the platform. If you prefer to keep it private, you can simply choose not to share it.
                     </p>
                     <p>
                       Unless you opt out, we may occasionally reach out via email to inform you about product updates, new features, or important changes to this policy.
                     </p>
                     <p>
                       We also use third-party analytics tools to understand general user behavior and improve our platform. These tools may use cookies, but they only collect standard data such as browser type, device info, and IP address, never sensitive personal details.
                     </p>
                     <p>
                       Your individual data will never be publicly exposed or linked to analytics data without your permission.
                     </p>
                   </>
                 )}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-[28px] font-bold text-white mb-6 flex items-baseline gap-3 tracking-tight">
                 <span className="text-[#E26A59]">2.</span> {isId ? 'Kontrol dan Akses Anda' : 'Your Access and Control'}
              </h2>
              <div className="space-y-6 text-[#8C8C8C] text-[14.5px] leading-relaxed">
                 <p>
                   {isId ? 'Anda mengontrol data Anda. Kapan saja, Anda bisa menghubungi kami melalui email untuk:' : 'You are in control of your data. At any time, you can contact us via (email) to:'}
                 </p>
                 <ol className="list-decimal pl-5 space-y-3 marker:text-[#E26A59] marker:font-bold">
                    {isId ? (
                       <>
                         <li>Meminta akses ke data Anda</li>
                         <li>Memperbaiki informasi Anda</li>
                         <li>Meminta kami untuk menghapus data Anda</li>
                         <li>Mengajukan kekhawatiran tentang penggunaan data Anda</li>
                         <li>Anda juga bisa berhenti menerima email komunikasi.</li>
                       </>
                    ) : (
                       <>
                         <li>Request access to your data</li>
                         <li>Correct or update your information</li>
                         <li>Ask us to delete your data</li>
                         <li>Raise any concerns about how your data is being used</li>
                         <li>You can also opt out of future communications whenever you like.</li>
                       </>
                    )}
                 </ol>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-[28px] font-bold text-white mb-6 flex items-baseline gap-3 tracking-tight">
                 <span className="text-[#E26A59]">3.</span> {isId ? 'Keamanan' : 'Security'}
              </h2>
              <div className="space-y-6 text-[#8C8C8C] text-[14.5px] leading-relaxed">
                 <p>
                   {isId ? 'Kami menjaga perlindungan data dengan serius dan mengamankan info Anda. Semua data yang disubmit langsung di-enkripsi, dan akses ke data dibatasi ketat.' : 'We take data protection seriously and implement appropriate measures to keep your information safe. Any sensitive data you submit (such as trading records) is encrypted and securely transmitted. We also restrict internal access to your data to authorized personnel only.'}
                 </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1A0505] to-[#120505] border border-[#2F0B0B] rounded-[24px] p-10 flex items-center justify-between overflow-hidden relative shadow-2xl">
               <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{isId ? 'Keamanan adalah prioritas kami.' : 'Security is our priority.'}</h3>
                  <p className="text-[#8C8C8C] text-[14.5px]">{isId ? 'Kami menggunakan enkripsi tingkat institusi untuk semua data.' : 'We use enterprise-grade encryption for all journal data.'}</p>
               </div>
               
               {/* Abstract Lock / Shield Icon bg */}
               <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 flex items-center justify-end pr-10 pointer-events-none mix-blend-screen">
                  <img src="https://images.unsplash.com/photo-1510511459019-5d0197411833?q=80&w=800&auto=format&fit=crop" className="w-[300px] h-full object-cover mix-blend-luminosity opacity-40 shadow-inner" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }} alt="Security" />
               </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
