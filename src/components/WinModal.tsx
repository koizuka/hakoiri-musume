import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface WinModalProps {
  isOpen: boolean;
  moves: number;
  onReset: () => void;
  onClose: () => void;
}

export function WinModal({ isOpen, moves, onReset, onClose }: WinModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return;

    if (isOpen) {
      setShouldRender(true);
      // 次のフレームでアニメーションを開始
      const visibilityTimeout = setTimeout(() => setIsVisible(true), 10);
      
      // モーダル内の「閉じる」ボタンにフォーカス
      const focusTimeout = setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 150);

      return () => {
        clearTimeout(visibilityTimeout);
        clearTimeout(focusTimeout);
      };
    } else {
      setIsVisible(false);
      // アニメーション完了後にアンマウント
      const unmountTimeout = setTimeout(() => setShouldRender(false), 200);
      
      return () => {
        clearTimeout(unmountTimeout);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const isBrowser = typeof document !== 'undefined';
    if (!isBrowser || !shouldRender) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }
      
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          // Shift+Tab: 最初の要素にいる場合は最後の要素へ
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: 最後の要素にいる場合は最初の要素へ
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
    >
      <div 
        ref={modalRef} 
        className={cn(
          "bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl transition-all duration-200",
          isVisible 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            おめでとうございます！
          </h2>
          <p className="text-gray-700 mb-6">
            箱入り娘を{moves}手でクリアしました！
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={onReset}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors',
                'bg-blue-500 text-white hover:bg-blue-600',
                'border-2 border-blue-600'
              )}
            >
              もう一度プレイ
            </button>
            
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors',
                'bg-gray-500 text-white hover:bg-gray-600',
                'border-2 border-gray-600'
              )}
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}