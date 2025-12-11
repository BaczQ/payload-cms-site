'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(initialQuery)
  const router = useRouter()
  const lastDebouncedValue = useRef(initialQuery)

  const debouncedValue = useDebounce(value)

  // Update URL when debounced value changes
  useEffect(() => {
    if (debouncedValue !== lastDebouncedValue.current) {
      lastDebouncedValue.current = debouncedValue
      const urlQuery = debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''
      router.push(`/search${urlQuery}`)
    }
  }, [debouncedValue, router])

  // Sync value from URL when it changes externally (e.g., navigation from header)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== lastDebouncedValue.current) {
      lastDebouncedValue.current = urlQuery
      setValue(urlQuery)
    }
  }, [searchParams])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Search"
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  )
}
