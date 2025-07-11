
import { toast as sonnerToast } from "sonner";
import * as React from "react";

// Define toast function types to maintain backward compatibility
type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  [key: string]: any;
};

// Export toast methods that map shadcn API to sonner
export const toast = {
  // Default call method needs a name
  toast: function(props: ToastProps) {
    if (props.variant === 'destructive') {
      return sonnerToast.error(props.title, { description: props.description });
    }
    return sonnerToast(props.title, { description: props.description });
  },
  
  // Default toast
  default(message: string) {
    return sonnerToast(message);
  },
  
  // Success toast
  success(options: { title?: string; description?: string }) {
    return sonnerToast.success(options.title, { description: options.description });
  },
  
  // Error toast
  error(options: { title?: string; description?: string }) {
    return sonnerToast.error(options.title, { description: options.description });
  },
  
  // Info toast
  info(options: { title?: string; description?: string }) {
    return sonnerToast.info(options.title, { description: options.description });
  },
  
  // Warning toast
  warning(options: { title?: string; description?: string }) {
    return sonnerToast.warning(options.title, { description: options.description });
  },
  
  // Custom toast that maps our common interface to sonner
  custom(options: { 
    title?: string; 
    description?: string; 
    variant?: 'default' | 'destructive';
  }) {
    if (options.variant === 'destructive') {
      return sonnerToast.error(options.title, { description: options.description });
    }
    return sonnerToast(options.title, { description: options.description });
  }
};

// Make the default function callable directly
const toastFunction = function(props: ToastProps) {
  return toast.toast(props);
};

// Copy all properties from toast to toastFunction
Object.assign(toastFunction, toast);

// Export the enhanced function as toast
export const enhancedToast = toastFunction as typeof toastFunction & typeof toast;

// Define the useToast hook that uses sonner's toast but exposes a compatible API
export type ToastActionElement = React.ReactElement;

export const useToast = () => {
  return {
    toast: enhancedToast,
    // This structure mimics the original shadcn toast API structure
    // for backwards compatibility
    toasts: [] as any[], // Changed from Toast[] to any[] since Toast isn't exported
    dismiss: sonnerToast.dismiss,
    // Remove the update property since it doesn't exist on sonnerToast
  };
};
