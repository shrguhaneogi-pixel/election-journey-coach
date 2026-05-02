'use client';

import React, { useEffect, useState } from 'react';
import { useAppState } from '@/app/journey/context';
import { Language } from '@/types/journey';
import { LOCALES } from '@/lib/i18n/locale';

export function LanguageSwitcher() {
  const { state, dispatch } = useAppState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentLang = state.context.language;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language;
    dispatch({ type: 'SELECT_LANGUAGE', payload: lang });
  };

  return (
    <div className="absolute top-4 left-4 z-50">
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="bg-white/80 backdrop-blur-md text-gray-800 font-bold py-2 px-3 pr-8 rounded-full shadow border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1em 1em',
        }}
      >
        {Object.entries(LOCALES).map(([key, { name, flag }]) => (
          <option key={key} value={key}>
            {flag} {name}
          </option>
        ))}
      </select>
    </div>
  );
}
