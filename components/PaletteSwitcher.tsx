'use client';

import { useEffect } from 'react';

const PALETTE_KEY = 'arf.palette';
const DENSITY_KEY = 'arf.density';

export default function PaletteSwitcher() {
  useEffect(() => {
    const palette = localStorage.getItem(PALETTE_KEY) ?? 'sand';
    const density = localStorage.getItem(DENSITY_KEY) ?? 'regular';
    const root = document.documentElement;

    root.classList.remove('arf-dusk', 'arf-mist');
    if (palette === 'dusk') root.classList.add('arf-dusk');
    if (palette === 'mist') root.classList.add('arf-mist');

    root.classList.remove('comfy');
    if (density === 'comfy') root.classList.add('comfy');
  }, []);

  return null;
}

export function setPalette(palette: 'sand' | 'mist' | 'dusk') {
  localStorage.setItem(PALETTE_KEY, palette);
  const root = document.documentElement;
  root.classList.remove('arf-dusk', 'arf-mist');
  if (palette === 'dusk') root.classList.add('arf-dusk');
  if (palette === 'mist') root.classList.add('arf-mist');
}

export function setDensity(density: 'regular' | 'comfy') {
  localStorage.setItem(DENSITY_KEY, density);
  const root = document.documentElement;
  root.classList.toggle('comfy', density === 'comfy');
}
