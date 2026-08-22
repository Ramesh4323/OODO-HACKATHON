import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast, setToast } = useAuth();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-white font-bold text-xs animate-spring"
      style={{
        backgroundColor: isError ? '#ef4444' : isSuccess ? '#0284c7' : '#0ea5e9',
        borderColor: isError ? '#fca5a5' : isSuccess ? '#7dd3fc' : '#38bdf8'
      }}
    >
      {isError && <AlertCircle className="w-5 h-5 flex-shrink-0 animate-bounce" />}
      {isSuccess && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
      {!isError && !isSuccess && <Info className="w-5 h-5 flex-shrink-0" />}

      <span className="pr-2">{toast.message}</span>

      <button
        onClick={() => setToast(null)}
        className="ml-auto hover:bg-white/20 p-1.5 rounded-xl transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
