"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import type { HeroMode, ImageSet } from "./media";

export type Settings = {
  hero: HeroMode;
  set: ImageSet;
  accent: boolean;
  grain: boolean;
};

const DEFAULTS: Settings = { hero: "tinta", set: "estudio", accent: true, grain: true };
const STORAGE_KEY = "ss_v2_settings";

type Ctx = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  /** Loader terminado: dispara las animaciones de entrada del hero. */
  ready: boolean;
  setReady: (v: boolean) => void;
  openContact: (service?: string) => void;
  lenis: Lenis | null;
  setLenis: (l: Lenis | null) => void;
};

const V2Context = createContext<Ctx | null>(null);

export function useV2() {
  const c = useContext(V2Context);
  if (!c) throw new Error("useV2 fuera de V2Provider");
  return c;
}

export function V2Provider({
  children,
  openContact,
}: {
  children: ReactNode;
  openContact: (service?: string) => void;
}) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Preferencias guardadas (solo conveniencia por visitante).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  function update(patch: Partial<Settings>) {
    setSettings((s) => {
      const next = { ...s, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <V2Context.Provider
      value={{ settings, update, ready, setReady, openContact, lenis, setLenis }}
    >
      {children}
    </V2Context.Provider>
  );
}
