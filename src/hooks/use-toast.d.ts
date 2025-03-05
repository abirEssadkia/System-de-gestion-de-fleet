
export interface Toast {
  (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement;
    duration?: number;
  }): { id: string; dismiss: () => void; update: (props: any) => void };
  dismiss: (toastId?: string) => void;
}
