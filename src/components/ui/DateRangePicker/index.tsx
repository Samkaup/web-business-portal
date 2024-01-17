import { DPDay, useDatePickerContext } from '@rehookify/datepicker';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon
} from '@heroicons/react/20/solid';
import classNames from '@/utils/style/classNames';
import { DateRangePreset, PresetButtonProps, Props } from './index.types';
import { Popover, Transition } from '@headlessui/react';

export default function DateRangePicker({
  selectedDates,
  setSelectedDates,
  presets,
  className
}: Props) {
  const {
    data: { weekDays, calendars },
    propGetters: { dayButton, subtractOffset, addOffset }
  } = useDatePickerContext();

  // calendars[0] is always present, this is an initial calendar
  const { year, month, days } = calendars[0];

  const getDayStyle = (day: DPDay, idx: number) => {
    let style = 'py-1.5 hover:bg-gray-200';

    if (day.range)
      switch (day.range) {
        case 'will-be-range-start':
        case 'range-start':
          style = classNames(
            style,
            'bg-company-green-700 rounded-l-lg hover:bg-company-green-500 text-white'
          );
          break;
        case 'will-be-range-end':
        case 'range-end':
          style = classNames(
            style,
            'bg-company-green-700 rounded-r-lg hover:bg-company-green-500 text-white'
          );
          break;
        case 'will-be-in-range':
        case 'in-range':
          style = classNames(
            style,
            'bg-company-green-700 hover:bg-company-green-500 text-white'
          );
          break;
      }
    else {
      if (day.disabled)
        style = classNames(style, 'bg-gray-300 hover:bg-gray-300');
      else if (day.inCurrentMonth) style = classNames(style, 'bg-white');
      else style = classNames(style, 'bg-gray-100');
    }

    if (day.now) style = classNames(style, 'text-indigo-600');

    style = classNames(
      style,
      idx === 0 && 'rounded-tl-lg',
      idx === 6 && 'rounded-tr-lg',
      idx === days.length - 7 && 'rounded-bl-lg',
      idx === days.length - 1 && 'rounded-br-lg'
    );

    return style;
  };

  return (
    <Popover className="relative flex flex-col">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              'block w-fit h-full rounded-md border-0 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-company-600 sm:text-sm sm:leading-6 hover:ring-company-600',
              className
            )}
          >
            <div className="flex flex-row gap-1">
              <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
              <div className="flex flex-row gap-2">
                <div>
                  {selectedDates.at(0)
                    ? selectedDates.at(0).toLocaleDateString('en-GB')
                    : '00/00/0000'}
                </div>
                -
                <div>
                  {selectedDates.at(1)
                    ? selectedDates.at(1).toLocaleDateString('en-GB')
                    : '00/00/0000'}
                </div>
              </div>
            </div>
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute top-2 z-10 bg-white flex flex-row gap-4 justify-between w-fit rounded-lg border-2 px-4 py-8">
              {/* Presets */}
              {presets && (
                <div
                  className={classNames(
                    'basis-1/2 flex flex-col',
                    presets && 'basis-1/2'
                  )}
                >
                  <div className="text-md font-semibold border-b-2 pb-4 mb-2 border-gray-300">
                    Veldu Tímabil
                  </div>
                  {presets.map((preset: DateRangePreset, idx: number) => (
                    <PresetButton
                      key={idx}
                      onClick={() => setSelectedDates(preset.dates)}
                    >
                      {preset.label}
                    </PresetButton>
                  ))}
                </div>
              )}

              {/* Calender */}
              <div
                className={classNames(
                  'text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9 w-80',
                  presets && 'basis-1/2'
                )}
              >
                <div className="flex items-center text-gray-900">
                  <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    {...subtractOffset({ months: 1 })}
                  >
                    <span className="sr-only">Previous month</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <div className="flex-auto text-sm font-semibold">
                    {month} {year}
                  </div>
                  <button
                    type="button"
                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    {...addOffset({ months: 1 })}
                  >
                    <span className="sr-only">Next month</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                  {weekDays.map((day) => (
                    <div key={`${month}-${day}`}>{day}</div>
                  ))}
                </div>
                <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                  {days.map((day: DPDay, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      className={getDayStyle(day, idx)}
                      {...dayButton(day)}
                    >
                      {day.day}
                    </button>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

function PresetButton({ onClick, children }: PresetButtonProps) {
  return (
    <button onClick={onClick} className="hover:text-company-600 py-2 text-left">
      {children}
    </button>
  );
}
