type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  secondary?: boolean;
  size?: ButtonSize;
};

export default function Button({
  primary = true,
  secondary = false,
  size,
  className,
  children,
  ...props
}: Props) {
  let baseClassName =
    'inline-flex items-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

  if (primary && !secondary)
    baseClassName =
      baseClassName + ' bg-company text-white hover:bg-company-800';
  else
    baseClassName =
      baseClassName +
      ' bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50';

  switch (size) {
    case 'xs':
      baseClassName = baseClassName + ' rounded px-2 py-1 text-xs';
      break;
    case 'sm':
      baseClassName = baseClassName + ' rounded px-2 py-1 text-sm';
      break;
    case 'md':
      baseClassName = baseClassName + ' rounded-md px-2.5 py-1.5 text-sm';
      break;
    case 'lg':
      baseClassName = baseClassName + ' rounded-md px-3 py-2 text-sm';
      break;
    case 'xl':
      baseClassName = baseClassName + ' rounded-md px-3.5 py-2.5 text-sm';
      break;
    default:
      baseClassName = baseClassName + ' rounded-md px-3.5 py-2.5 text-sm';
  }
  if (className) baseClassName = baseClassName + ' ' + className;

  return (
    <button className={baseClassName} {...props}>
      {children}
    </button>
  );
}
