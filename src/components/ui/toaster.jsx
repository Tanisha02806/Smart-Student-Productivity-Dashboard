import { useToast } from "./use-toast";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";

export function Toaster() {
  const toastState = useToast();
  const toasts = toastState?.toasts || [];

  return (
    <ToastProvider>
      {toasts.map((toast) => {
        const {
          id,
          title,
          description,
          action,
          ...props
        } = toast;

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title ? (
                <ToastTitle>{title}</ToastTitle>
              ) : null}

              {description ? (
                <ToastDescription>
                  {description}
                </ToastDescription>
              ) : null}
            </div>

            {action || null}

            <ToastClose />
          </Toast>
        );
      })}

      <ToastViewport />
    </ToastProvider>
  );
}

export default Toaster;