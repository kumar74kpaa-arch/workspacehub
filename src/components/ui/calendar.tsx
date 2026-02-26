"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
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
      <DatePicker
        selected={selected}
        onChange={(date) => onSelect?.(date)}
        // Ensuring it uses a standard grid layout
        dateFormat="MMMM d, yyyy"
        className="hidden" // Hides the default input since we use a custom button
        customInput={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal bg-white border-input hover:bg-accent",
              !selected && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? selected.toDateString() : <span>Pick a date</span>}
          </Button>
        }
      />
    </div>
  )
}
