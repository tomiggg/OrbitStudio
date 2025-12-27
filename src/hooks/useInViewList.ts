"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewList(count: number, threshold = 0.15) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          for (const e of entries) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (e.isIntersecting) next[idx] = true;
          }
          return next;
        });
      },
      { threshold }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { refs, visible };
}