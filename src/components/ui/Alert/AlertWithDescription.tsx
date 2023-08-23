import { InformationCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import Button from '../Button/Button';

type Props = {
  title?: string;
  description?: string;
  bgColor?: string;
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
  bgColor = 'bg-company/5',
  icon = defaultIcon(),
  actionBtnText = 'Action',
  cancelBtnText = 'Cancel',
  onActionBtnClick,
  onCancelBtnClick,
}: Props) {
  return (
    <div className={'rounded-md p-4' + bgColor}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-company">{title}</h3>
          <div className="mt-2 text-sm">
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
