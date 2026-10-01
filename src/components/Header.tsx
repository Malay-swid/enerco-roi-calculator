import React, { useEffect, useState } from 'react';
import { Leaf, Palette } from 'lucide-react';

const colorThemes = [
  { id: 'forest', label: 'Forest', primary: '#0f7a57', surface: '#dfe9e2' },
  { id: 'ocean', label: 'Ocean', primary: '#087e9a', surface: '#e4f0f3' },
  { id: 'ember', label: 'Ember', primary: '#b95c38', surface: '#f3eae3' },
  { id: 'slate', label: 'Slate', primary: '#4b6385', surface: '#e8edf3' },
] as const;

type ThemeId = (typeof colorThemes)[number]['id'] | 'custom';

interface HeaderProps {
  title?: string;
  accent?: string;
}

export function Header({ title = 'SWID', accent = 'Working towards a better tomorrow' }: HeaderProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>('forest');
  const [customPrimary, setCustomPrimary] = useState('#0f7a57');
  const [customSurface, setCustomSurface] = useState('#dfe9e2');

  useEffect(() => {
    const root = document.documentElement;
    const preset = colorThemes.find((theme) => theme.id === selectedTheme);

    if (preset?.id === 'forest') {
      delete root.dataset.siteTheme;
      root.style.removeProperty('--site-primary');
      root.style.removeProperty('--site-surface');
      return;
    }

    root.dataset.siteTheme = 'active';
    root.style.setProperty('--site-primary', preset?.primary ?? customPrimary);
    root.style.setProperty('--site-surface', preset?.surface ?? customSurface);
  }, [selectedTheme, customPrimary, customSurface]);

  return (
    <header className="bg-[#ebf4ed]">
      <div className="flex flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b6d4f] text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="text-[30px] font-black tracking-[-0.08em] text-[#1a2f2a]">{title}</div>
        </div>

        <div className="relative flex max-w-full items-center gap-2">
          <div className="max-w-full rounded-[4px] border border-[#b7d7c4] bg-[#ecf8f1] px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5e47]">
            FREE MH BESS RoI Payback Calculator
          </div>
          <button
            aria-expanded={themeOpen}
            aria-label="Open website color options"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#b7d7c4] bg-white text-[#0f5e47] transition hover:bg-[#ecf8f1]"
            onClick={() => setThemeOpen((open) => !open)}
            type="button"
          >
            <Palette className="h-4 w-4" />
          </button>

          {themeOpen ? (
            <div className="absolute right-0 top-full z-[60] mt-2 w-[min(18rem,calc(100vw-1rem))] rounded-[8px] border border-[#cbd9ce] bg-white p-3 text-[#253226] shadow-[0_8px_28px_rgba(17,43,37,0.18)]">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#596b60]">Website colors</div>
              <div className="grid grid-cols-2 gap-2">
                {colorThemes.map((theme) => (
                  <button
                    aria-pressed={selectedTheme === theme.id}
                    className={`flex min-w-0 items-center gap-2 rounded-[5px] border px-2 py-2 text-left text-[12px] font-semibold ${selectedTheme === theme.id ? 'border-[#0f7a57] bg-[#ecf8f1]' : 'border-[#dce5dd] bg-white'}`}
                    key={theme.id}
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      setThemeOpen(false);
                    }}
                    type="button"
                  >
                    <span className="flex shrink-0 gap-0.5">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                      <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: theme.surface }} />
                    </span>
                    {theme.label}
                  </button>
                ))}
                <button
                  aria-pressed={selectedTheme === 'custom'}
                  className={`col-span-2 rounded-[5px] border px-2 py-2 text-left text-[12px] font-semibold ${selectedTheme === 'custom' ? 'border-[#0f7a57] bg-[#ecf8f1]' : 'border-[#dce5dd] bg-white'}`}
                  onClick={() => setSelectedTheme('custom')}
                  type="button"
                >
                  Customize colors
                </button>
              </div>

              {selectedTheme === 'custom' ? (
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#e3ebe4] pt-3">
                  <label className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#596b60]">
                    Primary
                    <input
                      aria-label="Custom primary color"
                      className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                      onChange={(event) => setCustomPrimary(event.target.value)}
                      type="color"
                      value={customPrimary}
                    />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-[11px] font-medium text-[#596b60]">
                    Background
                    <input
                      aria-label="Custom background color"
                      className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                      onChange={(event) => setCustomSurface(event.target.value)}
                      type="color"
                      value={customSurface}
                    />
                  </label>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[#d4dfd5] bg-[#f5faf6] px-4 py-2 text-[11px] text-[#4a645f] sm:text-[12px]">
        {accent}
      </div>
    </header>
  );
}
