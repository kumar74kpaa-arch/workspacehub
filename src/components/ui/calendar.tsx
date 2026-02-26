"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
// IMPORTANT: This import is required for the grid to work
import "react-datepicker/dist/react-datepicker.css"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Calendar({ 
  className, 
  selected, 
  onSelect 
}: { 
  className?: string, 
  selected?: Date | null, 
  onSelect?: (date: Date | null) => void 
}) {
  return (
    <div className={cn("relative", className)}>
      <style>{`
        /* Forced Grid styles to ensure it looks like your reference */
        .react-datepicker {
          font-family: inherit;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .react-datepicker__header {
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .react-datepicker__day--selected {
          background-color: #b0935a !important; /* Match your gold button */
          border-radius: 4px;
        }
      `}</style>
      <DatePicker
        selected={selected}
        onChange={(date) => onSelect?.(date)}
        dateFormat="MMMM d, yyyy"
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        customInput={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal bg-[#b0935a] text-white hover:bg-[#967d4a] border-none rounded-full py-6",
              !selected && "opacity-90"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5" />
            {selected ? selected.toDateString() : <span>Select Date</span>}
          </Button>
        }
      />
    </div>
  )
}
