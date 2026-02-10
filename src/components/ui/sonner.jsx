import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as actualToast } from "sonner"

let toastQueue = [];
let isProcessing = false;

const processQueue = () => {
  if (toastQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const { type, args } = toastQueue.shift();

  // Extract message and options from args
  const message = args[0];
  const options = args[1] || {};

  const enhancedOptions = {
    ...options,
    onAutoClose: () => {
      options.onAutoClose?.();
      // Small delay to ensure the exit animation completes
      setTimeout(processQueue, 100);
    },
    onDismiss: () => {
      options.onDismiss?.();
      setTimeout(processQueue, 100);
    }
  };

  if (type === 'default') {
    actualToast(message, enhancedOptions);
  } else {
    actualToast[type](message, enhancedOptions);
  }
};

const toast = (message, options) => {
  toastQueue.push({ type: 'default', args: [message, options] });
  if (!isProcessing) processQueue();
};

toast.success = (message, options) => {
  toastQueue.push({ type: 'success', args: [message, options] });
  if (!isProcessing) processQueue();
};

toast.error = (message, options) => {
  toastQueue.push({ type: 'error', args: [message, options] });
  if (!isProcessing) processQueue();
};

toast.info = (message, options) => {
  toastQueue.push({ type: 'info', args: [message, options] });
  if (!isProcessing) processQueue();
};

toast.warning = (message, options) => {
  toastQueue.push({ type: 'warning', args: [message, options] });
  if (!isProcessing) processQueue();
};

function Toaster({
  ...props
}) {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      richColors
      visibleToasts={1}
      closeButton={false}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#1A1A1A] group-[.toaster]:border-[#E5E5E5] group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:border-l-4",
          description: "group-[.toast]:text-[#666666]",
          actionButton: "group-[.toast]:bg-[#006A52] group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-[#F5F5F5] group-[.toast]:text-[#1A1A1A]",
          success: "group-[.toaster]:border-l-[#006A52] group-[.toaster]:bg-[#E8F5F1]",
          error: "group-[.toaster]:border-l-[#EF4444] group-[.toaster]:bg-[#FFF5F5]",
          info: "group-[.toaster]:border-l-[#3B82F6] group-[.toaster]:bg-[#EFF6FF]",
          warning: "group-[.toaster]:border-l-[#F59E0B] group-[.toaster]:bg-[#FFFBEB]",
        },
      }}
      {...props} />
  );
}

export { Toaster, toast }
