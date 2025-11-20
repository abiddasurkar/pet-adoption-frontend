// src/components/Toast.js
import React, { useContext } from 'react';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';
import { UIContext } from '../context/UIContext';

export default function Toast() {
  const { toastMessages } = useContext(UIContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'error':
        return <AlertCircle className="text-red-500" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" />;
      default:
        return <InfoIcon className="text-blue-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toastMessages.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} flex items-center gap-3 animate-slideIn`}
        >
          {getIcon(toast.type)}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
