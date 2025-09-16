"use client"
import * as React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps {
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  placeholder?: string
  children: React.ReactNode
  className?: string
  label?: string
  searchable?: boolean
  searchPlaceholder?: string
  noResultsText?: string
}

export function Select({ value, onChange, disabled, placeholder = 'Select...', children, className, label, searchable = false, searchPlaceholder = 'Type to filter...', noResultsText = 'No results' }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const selectedLabel = React.useMemo(() => {
    let found: string | null = null
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
        type ChildProps = { value?: string; children?: React.ReactNode }
        const props = child.props as ChildProps
        if (props.value === value) {
          if (typeof props.children === 'string') found = props.children
          else if (Array.isArray(props.children)) {
            const text = props.children.find(c => typeof c === 'string') as string | undefined
            if (text) found = text
          }
      }
    })
    return found
  }, [children, value])

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.parentElement?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  // Collect option elements for filtering
  const allOptions = React.useMemo(() => {
    const opts: Array<React.ReactElement<{ value?: string; children?: React.ReactNode }>> = []
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
      opts.push(child as React.ReactElement<{ value?: string; children?: React.ReactNode }>)
    })
    return opts
  }, [children])

  const filtered = React.useMemo(() => {
    if (!searchable || !query.trim()) return allOptions
    const q = query.toLowerCase()
    return allOptions.filter(opt => {
      const child = opt.props.children
      if (typeof child === 'string') return child.toLowerCase().includes(q)
      if (Array.isArray(child)) {
        const text = child.filter(c => typeof c === 'string').join(' ').toLowerCase()
        return text.includes(q)
      }
      return false
    })
  }, [allOptions, query, searchable])

  // Reset query when closing
  React.useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <div className={cn('space-y-1', className)}>
      {label && <label className="text-xs font-medium">{label}</label>}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          className={cn('w-full flex items-center justify-between rounded border bg-background px-2 py-1 text-sm', disabled && 'opacity-50 cursor-not-allowed')}
        >
          <span className={cn(!value && 'text-muted-foreground')}>{selectedLabel || placeholder}</span>
          <svg className="w-3 h-3 opacity-70" viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full rounded border bg-popover shadow-sm max-h-60 flex flex-col text-sm">
            {searchable && (
              <div className="p-1 border-b">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1"
                />
              </div>
            )}
            <div className="overflow-auto p-1">{
              filtered.length > 0 ? filtered.map(child => {
                if (!React.isValidElement(child)) return child
                type ChildProps = { value?: string; selected?: boolean; onSelect?: (v: string)=>void }
                const props = child.props as ChildProps
                const selected = props.value === value
                return React.cloneElement(child as React.ReactElement<ChildProps>, {
                  key: props.value,
                  selected,
                  onSelect: (val: string) => {
                    onChange(val)
                    setOpen(false)
                  }
                })
              }) : (
                <div className="px-2 py-4 text-xs text-muted-foreground text-center select-none">{noResultsText}</div>
              )
            }</div>
          </div>
        )}
      </div>
    </div>
  )
}

interface SelectOptionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  value: string
  children: React.ReactNode
  onSelect?: (value: string) => void
  selected?: boolean
}

export function SelectOption({ value, children, onSelect, selected, className, ...rest }: SelectOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect?.(value)}
      className={cn('w-full text-left rounded px-2 py-1 hover:bg-accent data-[selected=true]:bg-accent', selected && 'bg-accent', className)}
      data-selected={selected}
      {...rest}
    >
      {children}
    </button>
  )
}
