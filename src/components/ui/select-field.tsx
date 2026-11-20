"use client"

import Select, { components, type DropdownIndicatorProps } from "react-select"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SelectOption = { value: string; label: string }

function DropdownIndicator(props: DropdownIndicatorProps<SelectOption, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown
        className={cn(
          "size-4 transition-transform duration-200",
          props.selectProps.menuIsOpen && "rotate-180",
        )}
        aria-hidden
      />
    </components.DropdownIndicator>
  )
}

/**
 * react-select, `unstyled` and dressed in the site's tokens so it matches the
 * text inputs beside it (same height, border, focus ring) and follows the
 * theme. Uncontrolled: `name` renders a hidden input, so it submits with the
 * surrounding <form> like a native select.
 */
export function SelectField({
  name,
  inputId,
  options,
  placeholder = "Select",
  invalid,
  errorId,
  isClearable = true,
  onChange,
}: {
  name: string
  /** Pair with a <label htmlFor>; also seeds a stable instanceId for SSR. */
  inputId: string
  options: readonly SelectOption[]
  placeholder?: string
  invalid?: boolean
  errorId?: string
  isClearable?: boolean
  onChange?: (option: SelectOption | null) => void
}) {
  return (
    <Select<SelectOption, false>
      unstyled
      name={name}
      inputId={inputId}
      /* A fixed id keeps the server HTML and the hydrated client in step. */
      instanceId={inputId}
      options={options}
      onChange={(option) => onChange?.(option)}
      placeholder={placeholder}
      isSearchable={false}
      isClearable={isClearable}
      menuPlacement="auto"
      aria-invalid={invalid}
      aria-errormessage={invalid ? errorId : undefined}
      components={{ DropdownIndicator, IndicatorSeparator: null }}
      /* react-select's own inline min-height (38px) outranks a Tailwind
         class, so the 44px that matches the text inputs (h-11) is set here. */
      styles={{ control: (base) => ({ ...base, minHeight: 44 }) }}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            "cursor-pointer rounded-lg border bg-background px-3 text-sm transition-[border-color,box-shadow]",
            invalid
              ? cn("border-destructive", isFocused && "ring-3 ring-destructive/30")
              : isFocused
                ? "border-ring ring-3 ring-ring/50"
                : "border-border hover:border-brand/40",
          ),
        valueContainer: () => "gap-1",
        placeholder: () => "text-muted-foreground",
        singleValue: () => "text-foreground",
        indicatorsContainer: () => "gap-1 text-muted-foreground",
        clearIndicator: () =>
          "rounded-full p-0.5 hover:bg-muted hover:text-foreground",
        dropdownIndicator: ({ isFocused }) =>
          cn("p-0.5", isFocused && "text-foreground"),
        menu: () =>
          "mt-1.5 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg shadow-brand/10",
        option: ({ isFocused, isSelected }) =>
          cn(
            "cursor-pointer rounded-md px-3 py-2 text-sm",
            isSelected
              ? "bg-brand font-medium text-brand-foreground"
              : isFocused && "bg-brand-muted text-accent-foreground",
          ),
        noOptionsMessage: () => "px-3 py-2 text-sm text-muted-foreground",
      }}
    />
  )
}
