import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Button from '../Button/Button';

type Props = {
  title?: string;
  description?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  icon?: React.ReactElement;
  onActionBtnClick?: () => void;
  actionBtnText?: string;
  onCancelBtnClick?: () => void;
  cancelBtnText?: string;
};
const defaultIcon = () => (
  <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
);

export default function AlertWithDescription({
  title = 'Title',
  description = 'Description',
  type = 'info',
  icon = defaultIcon(),
  actionBtnText = 'Action',
  cancelBtnText = 'Cancel',
  onActionBtnClick,
  onCancelBtnClick
}: Props) {
  let bgTypeClass = '';
  let fgTitleTypeClass = '';
  let fgTypeClass = '';
  switch (type) {
    case 'info':
      bgTypeClass = 'bg-blue-50';
      fgTypeClass = 'text-blue-700';
      fgTitleTypeClass = 'text-blue-800';
      break;
    case 'warning':
      bgTypeClass = 'bg-yellow-50';
      fgTypeClass = 'text-yellow-700';
      fgTitleTypeClass = 'text-yellow-800';
      break;
    case 'error':
      bgTypeClass = 'bg-red-50';
      fgTypeClass = 'text-red-700';
      fgTitleTypeClass = 'text-red-800';
      break;
    case 'success':
      bgTypeClass = 'bg-green-50';
      fgTypeClass = 'text-green-700';
      fgTitleTypeClass = 'text-green-800';
      break;
  }
  return (
    <div className={`rounded-md p-4 ${bgTypeClass}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${fgTitleTypeClass}`}>{title}</h3>
          <div className={`mt-2 text-sm ${fgTypeClass}`}>
            <p>{description}</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              {onActionBtnClick && (
                <Button onClick={onActionBtnClick} size="sm">
                  {actionBtnText}
                </Button>
              )}
              {onCancelBtnClick && (
                <Button onClick={onCancelBtnClick} size="sm">
                  {cancelBtnText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
