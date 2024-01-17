import { ReactNode } from 'react';

export type PresetButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export type DateRangePreset = {
  label: string;
  dates: Date[];
};

export type Props = {
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  presets?: DateRangePreset[];
  className?: string;
};
