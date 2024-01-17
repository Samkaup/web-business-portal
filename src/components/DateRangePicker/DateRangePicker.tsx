'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../Shadcn/ui/popover';
import { Calendar } from '../Shadcn/ui/calendar';
import { is } from 'date-fns/locale';
import { useDateRange, useUpdateDateRange } from '@/hooks/useDateRange';
import { DateRange } from 'react-day-picker';
import { Button } from '../Shadcn/ui/button';
import { DateRangePreset } from '../ui/DateRangePicker/index.types';
import Link from 'next/link';

type CalendarDateRangePickerProps = React.HTMLAttributes<HTMLDivElement> & {
  queryKey: string;
  presets?: DateRangePreset[];
  defaultPreset?: string;
};

export function CalendarDateRangePicker({
  presets,
  defaultPreset = 'Síðustu 30 dagar',
  queryKey
}: CalendarDateRangePickerProps) {
  const { data: dateRange } = useDateRange({ queryKey });
  const { mutate: updateDateRange } = useUpdateDateRange(queryKey);
  const [selectedPresetLabel, setSelectedPreset] =
    React.useState<string>(defaultPreset);

  const selectPreset = (presetLabel: string) => {
    setSelectedPreset(presetLabel);
    const preset = presets.find((p) => p.label == presetLabel);
    updateDateRange({
      from: preset.dates[0],
      to: preset.dates[1]
    });
  };
  const setDate = (newDateRange: DateRange) => {
    if (newDateRange) {
      updateDateRange(newDateRange);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={`daterange-picker-${queryKey}`}
          variant={'outline'}
          className={cn(
            'w-[260px] justify-start text-left font-normal border-company/20 border rounded-md',
            !dateRange && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'dd. LLL y', { locale: is })} -{' '}
                {format(dateRange.to, 'dd. LLL y', { locale: is })}
              </>
            ) : (
              format(dateRange.from, 'dd. LLL y', { locale: is })
            )
          ) : (
            <span>Veldu dagsetningu</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          {presets && presets.length >= 0 && (
            <div className="px-16 py-4">
              {presets.map((item) => (
                <Link
                  href="#"
                  key={item.label}
                  onClick={() => selectPreset(item.label)}
                >
                  <p
                    className={cn(
                      'py-2',
                      selectedPresetLabel == item.label
                        ? 'text-company-900 font-bold'
                        : ''
                    )}
                  >
                    {item.label}
                  </p>
                </Link>
              ))}
            </div>
          )}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
