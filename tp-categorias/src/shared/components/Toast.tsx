import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";

export function Toast() {
  const message = useNotificationStore((state) => state.message);
  const show = useNotificationStore((state) => state.show);
  const hideNotification = useNotificationStore((state) => state.hideNotification);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(hideNotification, 3000);
    return () => clearTimeout(timer);
  }, [show, message, hideNotification]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 px-4 py-3 shadow-lg border border-gray-700 dark:border-gray-300 text-sm flex items-center gap-2 animate-fade-in">
      <span>{message}</span>
    </div>
  );
}

export default Toast;
