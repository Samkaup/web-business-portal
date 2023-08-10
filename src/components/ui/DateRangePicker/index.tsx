import { useDatePickerContext } from '@rehookify/datepicker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import classNames from '@/utils/style/classNames';

export default function DateRangePicker() {
  const {
    data: { weekDays, calendars },
    propGetters: { dayButton, subtractOffset, addOffset },
  } = useDatePickerContext();

  // calendars[0] is always present, this is an initial calendar
  const { year, month, days } = calendars[0];

  return (
    <div>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Upcoming meetings
      </h2>
      <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9 w-72">
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
          {days.map((day, idx) => (
            <button
              key={idx}
              type="button"
              className={classNames(
                'py-1.5 hover:bg-gray-100 focus:z-10',
                day.range
              )}
              {...dayButton(day)}
            >
              <time
                dateTime={day.$date.toString()}
                className={classNames(
                  'mx-auto flex h-7 w-7 items-center justify-center rounded-full'
                )}
              >
                {day.day}
              </time>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add event
        </button>
      </div>
    </div>
  );
}
