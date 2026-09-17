import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AlertCircle, CheckCircle2, HelpCircle, Info, X } from 'lucide-react';
import { hideModalActionCreator } from '../../states/modal/action';

function Modal() {
  const modal = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal.isOpen) {
        dispatch(hideModalActionCreator());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal.isOpen, dispatch]);

  if (!modal.isOpen) return null;

  const handleClose = () => {
    dispatch(hideModalActionCreator());
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    dispatch(hideModalActionCreator());
  };

  const getIcon = () => {
    switch (modal.type) {
    case 'error':
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center clay-card-flat shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
      );
    case 'success':
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center clay-card-flat shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      );
    case 'confirm':
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center clay-card-flat shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
      );
    default:
      return (
        <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#D95338] flex items-center justify-center clay-card-flat shrink-0">
          <Info className="w-6 h-6" />
        </div>
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleClose}
    >
      <div
        className="clay-card w-full max-w-md p-6 sm:p-7 relative transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup jendela dialog"
          className="absolute right-4 top-4 p-1.5 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#E6E0D6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          {getIcon()}
          <div className="flex-1 min-w-0 pr-4">
            <h2 id="modal-title" className="text-base sm:text-lg font-black text-[#1C1917] mb-1">
              {modal.title}
            </h2>
            <p id="modal-description" className="text-xs sm:text-sm text-[#57534E] leading-relaxed break-words">
              {modal.message}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#D6CEC2] flex items-center justify-end gap-2.5">
          {modal.cancelText && (
            <button
              type="button"
              onClick={handleClose}
              className="clay-btn px-4 py-2 text-xs font-bold"
            >
              {modal.cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className="clay-btn-primary px-5 py-2 text-xs font-bold"
          >
            {modal.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
