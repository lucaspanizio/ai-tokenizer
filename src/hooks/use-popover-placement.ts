import { useEffect, useRef, useState } from "react";

type Placement = "top" | "bottom";

/** Controla abertura/fechamento de um popover, seu posicionamento (vira pra
 * cima quando não cabe embaixo) e fechamento ao clicar fora. */
export function usePopoverPlacement(panelHeight: number) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("bottom");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function toggle() {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPlacement(spaceBelow < panelHeight && spaceAbove > spaceBelow ? "top" : "bottom");
    }
    setIsOpen((v) => !v);
  }

  return { isOpen, placement, triggerRef, containerRef, toggle };
}
