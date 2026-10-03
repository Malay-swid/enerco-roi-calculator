import React from 'react';
import { Leaf, Linkedin, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#d7e2ee] bg-[#edf2f7] px-4 py-4 text-[11px] text-[#526273]">
      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f61ab] text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="text-[22px] font-black tracking-[-0.08em] text-[#0a3f70]">SWID</div>
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[#526273]">
            Energia visualizes a sustainable, connected and automated world for a better tomorrow.
          </p>
        </div>

        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a3f70]">Our Location</div>
          <div className="h-24 rounded-[6px] border border-[#d3deea] bg-[radial-gradient(circle_at_center,_#eef2f7_0%,_#d5e0eb_60%,_#cbd5e1_100%)]" />
        </div>

        <div>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0a3f70]">Contact Us</div>
          <div className="space-y-1 text-[12px] text-[#526273]">
            <div>123 Demo Street, Sample District, Mumbai 400 000</div>
            <div>hello@example.com</div>
            <div>Phone: +91 00000 00000</div>
            <div>Business Whatsapp: +91 00000 00000</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-[#d4e0ec] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[#0a3f70]">
          <Linkedin className="h-4 w-4" />
          <Twitter className="h-4 w-4" />
          <Facebook className="h-4 w-4" />
          <Instagram className="h-4 w-4" />
          <Youtube className="h-4 w-4" />
        </div>
        <div className="text-[10px] text-[#64748b]">© 2026 SWID Energy Solutions LLP | Privacy policy</div>
      </div>
    </footer>
  );
}
