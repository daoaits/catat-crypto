import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
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
            {isId ? 'Syarat dan Ketentuan' : 'Terms and Conditions'}
          </h1>
          <p className="text-[#8C8C8C] text-sm max-w-2xl mx-auto">
            {isId ? 'Pembaruan terakhir: 1 Januari 2025' : 'Last updated: January 1, 2025'}
          </p>
        </div>

        <div className="w-full bg-[#120505]/50 border border-[#2F0B0B] rounded-[32px] p-8 md:p-14 shadow-2xl">
          <div className="prose prose-invert prose-p:text-[#8C8C8C] prose-p:text-[14.5px] prose-p:leading-relaxed prose-h3:text-white prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 max-w-none">
            {isId ? (
              <>
                <p>
                  PERSYARATAN LAYANAN<br/><br/>
                  Catatan: kami secara aktif meminta umpan balik pada ketentuan layanan kami; silakan kirim komentar atau pertanyaan ke support@catcrypto.id
                </p>
                
                <h3>1. Pengakuan dan Penerimaan Persyaratan Pengguna</h3>
                <p>
                  Catat Crypto ("kami") menyediakan situs Catat Crypto dan berbagai layanan terkait (secara kolektif disebut "situs") kepada Anda, pengguna, dengan tunduk pada kepatuhan Anda terhadap semua syarat, ketentuan, dan pemberitahuan yang tercantum di sini ("Ketentuan Layanan"). Dengan menggunakan situs ini, Anda setuju untuk terikat oleh Ketentuan Layanan ini.
                </p>
                <p className="uppercase text-[13px] font-bold tracking-wider text-[#E26A59] my-6">
                  DENGAN MENGGUNAKAN SITUS INI, ANDA SETUJU UNTUK TERIKAT OLEH PERSYARATAN LAYANAN INI. JIKA ANDA TIDAK INGIN TERIKAT, SILAKAN KELUAR DARI SITUS SEKARANG.
                </p>
                <p>
                  Ketentuan Layanan ini berlaku efektif mulai 1 Januari 2025. Kami dengan tegas berhak mengubah Ketentuan Layanan ini dari waktu ke waktu tanpa pemberitahuan kepada Anda. Penggunaan situs ini secara berkelanjutan setelah modifikasi tersebut akan merupakan pengakuan atas Ketentuan Layanan yang dimodifikasi.
                </p>

                <h3>2. Deskripsi Layanan</h3>
                <p>
                  Kami menyediakan berbagai layanan di situs ini termasuk, namun tidak terbatas pada, jurnal trading, analisis trading, berbagi atau menerbitkan trading. Anda bertanggung jawab untuk menyediakan di biaya Anda sendiri semua peralatan yang diperlukan untuk menggunakan layanan.
                </p>

                <h3>3. Pendaftaran dan Privasi</h3>
                <p>
                  Untuk mengakses beberapa layanan di situs ini, Anda diharuskan menggunakan akun dan kata sandi yang dapat diperoleh dengan melengkapi formulir pendaftaran kami. Dengan mendaftar, Anda setuju bahwa semua informasi yang diberikan adalah benar dan akurat.
                </p>

                <h3>4. Layanan di Situs</h3>
                <p>
                  Penggunaan situs tunduk pada semua hukum dan peraturan yang berlaku. Anda tidak boleh mengunggah, membagikan, atau memposting konten yang melanggar hukum.
                </p>

                <h3>5. Langganan</h3>
                <p>
                  Langganan dijual di situs ini, dan umumnya dibayar di muka untuk menerima layanan sesuai dengan paket harga yang dipilih.
                </p>

                <h3>6. Kekayaan Intelektual</h3>
                <p>
                  Hak Cipta © 2026 Catat Crypto, Hak Cipta Dilindungi.<br/><br/>
                  Untuk tujuan Ketentuan Layanan ini, "konten" didefinisikan sebagai informasi, data, komunikasi, perangkat lunak, foto, video, grafik, dan materi yang disediakan di situs kami.
                </p>
                
                <div className="mt-12 text-center text-[#8C8C8C] text-sm italic border-t border-[#2F0B0B] pt-8">
                   Untuk teks lengkap mengenai ketentuan legal kami, silakan hubungi legal@catcrypto.id
                </div>
              </>
            ) : (
              <>
                <p>
                  TERMS OF SERVICE<br/><br/>
                  Note: we actively solicit feedback on our terms of service; please send any comments or questions to support@catcrypto.id
                </p>
                
                <h3>1. User's Acknowledgment and Acceptance of Terms</h3>
                <p>
                  Catat Crypto ("we", "us", or "our") provides the Catat Crypto site and various related services (collectively, the "site") to you, the user, subject to your compliance with all the terms, conditions, and notices contained or referenced herein (the "Terms of Service"), as well as any other written agreement between us and you. In addition, when using particular services or materials on this site, users shall be subject to any posted rules applicable to such services or materials that may contain terms and conditions in addition to those in these Terms of Service. All such guidelines or rules are hereby incorporated by reference into these Terms of Service.
                </p>
                <p className="uppercase text-[13px] font-bold tracking-wider text-[#E26A59] my-6">
                  BY USING THIS SITE, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE. IF YOU DO NOT WISH TO BE BOUND BY THESE TERMS OF SERVICE, PLEASE EXIT THE SITE NOW. YOUR REMEDY FOR DISSATISFACTION WITH THIS SITE, OR ANY PRODUCTS, SERVICES, CONTENT, OR OTHER INFORMATION AVAILABLE ON OR THROUGH THIS SITE, IS TO STOP USING THE SITE AND / OR THOSE PARTICULAR PRODUCTS OR SERVICES. YOUR AGREEMENT WITH US REGARDING COMPLIANCE WITH THESE TERMS OF SERVICE BECOMES EFFECTIVE IMMEDIATELY UPON COMMENCEMENT OF YOUR USE OF THIS SITE.
                </p>
                <p>
                  These Terms of Service are effective as of January 1, 2025. We expressly reserve the right to change these Terms of Service from time to time without notice to you. You acknowledge and agree that it is your responsibility to review this site and these Terms of Service from time to time and to familiarize yourself with any modifications. Your continued use of this site after such modifications will constitute acknowledgement of the modified Terms of Service and agreement to abide and be bound by the modified Terms of Service.
                </p>

                <h3>2. Description of Services</h3>
                <p>
                  We make various services available on this site including, but not limited to, trade journaling, trade analysis, sharing or publishing of trades, and other like services. You are responsible for providing, at your own expense, all equipment necessary to use the services, including a computer and Internet access (including payment of all fees associated with such access).
                </p>
                <p>
                  We reserve the sole right to either modify or discontinue the site, including any of the site's features, at any time with or without notice to you. We will not be liable to you or any third party should we exercise such right. Any new features that augment or enhance the then-current services on this site shall also be subject to these Terms of Service.
                </p>

                <h3>3. Registration Data and Privacy</h3>
                <p>
                  In order to access some of the services on this site, you will be required to use an account and password that can be obtained by completing our online registration form, which requests certain information and data, and maintaining and updating your Registration Data as required. By registering, you agree that all information provided in the Registration Data is true and accurate and that you will maintain and update this information as required in order to keep it current, complete, and accurate.
                </p>
                <p>
                  You also grant us the right to disclose to third parties certain Registration Data about you, but only as specifically listed in our Privacy Policy.
                </p>

                <h3>4. Conduct on Site</h3>
                <p>
                  Your use of the site is subject to all applicable laws and regulations, and you are solely responsible for the substance of your communications through the site. By posting information in or otherwise using any communications service, chat room, message board, newsgroup, software library, or other interactive service that may be available to you on or through this site, you agree that you will not upload, share, post, or otherwise distribute or facilitate distribution of any content.
                </p>

                <h3>5. Subscriptions</h3>
                <p>
                  Subscriptions are sold on this site, and are generally paid in advance to receive the service.
                </p>

                <h3>6. Intellectual Property Information</h3>
                <p>
                  Copyright © 2026 Catat Crypto, All Rights Reserved.<br/><br/>
                  For purposes of these Terms of Service, "content" is defined as any information, data, communications, software, photos, video, graphics, music, sounds, and other material and services that can be viewed by users on our site.
                </p>

                {/* Abridged version for presentation */}
                <div className="mt-12 text-center text-[#8C8C8C] text-sm italic border-t border-[#2F0B0B] pt-8">
                   For the full text of our legal agreements, please contact legal@catcrypto.id
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
