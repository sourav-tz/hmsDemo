import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker, useNavigation } from "react-day-picker"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Custom component for the caption with labels
function CustomCaption(props) {
  const { goToMonth, nextMonth, previousMonth, currentMonth } = useNavigation();

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="flex w-full justify-between px-1">
        <select
          aria-label="Month"
          className="p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer h-9 w-32"
          value={currentMonth.getMonth()}
          onChange={(e) => {
            const newMonth = new Date(currentMonth);
            newMonth.setMonth(parseInt(e.target.value, 10));
            goToMonth(newMonth);
          }}
        >
          <option value={0}>January</option>
          <option value={1}>February</option>
          <option value={2}>March</option>
          <option value={3}>April</option>
          <option value={4}>May</option>
          <option value={5}>June</option>
          <option value={6}>July</option>
          <option value={7}>August</option>
          <option value={8}>September</option>
          <option value={9}>October</option>
          <option value={10}>November</option>
          <option value={11}>December</option>
        </select>
        <select
          aria-label="Year"
          className="p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer h-9 w-24"
          value={currentMonth.getFullYear()}
          onChange={(e) => {
            const newMonth = new Date(currentMonth);
            newMonth.setFullYear(parseInt(e.target.value, 10));
            goToMonth(newMonth);
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <option key={i} value={1950 + i}>
              {1950 + i}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "buttons", ...props}) {
  const [selected, setSelected] = useState();
  const handleSelectedDate = (event)=>{
    console.log(event);
    console.log("SAVED -> ", selected);
  }

  return (
    (<DayPicker
      captionLayout={captionLayout === "dropdown" ? "custom" : captionLayout}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: captionLayout === "dropdown" ? CustomCaption : undefined
      }}
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex flex-col justify-center pt-3 pb-2 relative items-center gap-2",
        caption_label: "text-base font-medium hidden", // Hide the default label
        caption_dropdowns: "flex justify-center items-center gap-2 w-full px-2",
        dropdown_month_label: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block",
        dropdown_year_label: "text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block",
        dropdown_icon: "ml-2 h-4 w-4 opacity-50",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        dropdown: "p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer",
        dropdown_month: "mr-1 w-32 h-9",
        dropdown_year: "w-24 h-9",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-slate-800/50 dark:[&:has([aria-selected])]:bg-slate-800",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900",
        day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
        day_outside:
          "day-outside text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400",
        day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      // Components are defined above
      {...props} />)
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
