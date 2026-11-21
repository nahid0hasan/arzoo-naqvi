import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  images: string[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  title?: string;
}

/** Full-screen photo viewer with zoom, keyboard and swipe navigation. */
export function Lightbox({ images, index, onClose, onIndex, title }: LightboxProps) {
  const open = index !== null;
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const touchX = useRef<number | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);

  const go = (dir: number) => {
    if (index === null) return;
    setZoom(false);
    onIndex((index + dir + images.length) % images.length);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  useEffect(() => {
    if (index === null) return;
    setZoom(false);
    thumbs.current?.querySelector<HTMLElement>(`[data-i="${index}"]`)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [index]);

  const setOriginFrom = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title ? `${title} photos` : 'Photos'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex flex-col bg-night/97 text-white backdrop-blur"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            <div className="min-w-0">
              {title && <p className="truncate text-[15px] font-medium">{title}</p>}
              <p className="num text-sm text-white/50">
                {index + 1} / {images.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((z) => !z)}
                aria-label={zoom ? 'Zoom out' : 'Zoom in'}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                {zoom ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close photos"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink transition-transform hover:scale-105"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Stage */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-20"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null || zoom) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={`relative h-full w-full overflow-hidden ${zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={(e) => {
                  setOriginFrom(e);
                  setZoom((z) => !z);
                }}
                onMouseMove={(e) => zoom && setOriginFrom(e)}
              >
                <img
                  src={images[index]}
                  alt={`${title ?? 'Photo'} ${index + 1}`}
                  draggable={false}
                  style={{ transformOrigin: origin }}
                  className={`h-full w-full select-none object-contain transition-transform duration-300 ease-out ${zoom ? 'scale-[2.2]' : 'scale-100'}`}
                />
              </motion.div>
            </AnimatePresence>

            {images.length > 1 &&
              [
                { dir: -1, Icon: ChevronLeft, cls: 'left-3 sm:left-6', label: 'Previous photo' },
                { dir: 1, Icon: ChevronRight, cls: 'right-3 sm:right-6', label: 'Next photo' },
              ].map(({ dir, Icon, cls, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => go(dir)}
                  aria-label={label}
                  className={`absolute top-1/2 ${cls} flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-ink`}
                >
                  <Icon className="h-6 w-6" />
                </button>
              ))}
          </div>

          {/* Thumbnails */}
          <div ref={thumbs} className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6">
            {images.map((src, i) => (
              <button
                key={src + i}
                data-i={i}
                type="button"
                onClick={() => onIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all ${
                  i === index ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-90'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
