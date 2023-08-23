export type Props = {
  children?: React.ReactNode;
  open: boolean;
  title?: string;
  description?: string;
  cancelButtonText?: string;
  actionButtonText?: string;
  isLoading?: boolean;
  errorText?: string;
  onAction: () => void;
  onCancel: (val: boolean) => void;
};
