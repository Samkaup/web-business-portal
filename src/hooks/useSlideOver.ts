import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

export type useSlideOverType = {
  isOpen: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
};

export type useSideBarProps = {
  slideOver: useSlideOverType;
};

/**
 * Handle navigational sidebar
 */
const useSlideOver = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return {
    isOpen,
    toggle,
  };
};

export default useSlideOver;
