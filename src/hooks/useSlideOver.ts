import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

export type useSlideOverType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export type useSideBarProps = {
  slideOver: useSlideOverType;
};

/**
 * Handle navigational sidebar
 */
const useSlideOver = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    setIsOpen
  };
};

export default useSlideOver;
