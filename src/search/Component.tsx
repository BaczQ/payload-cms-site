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
  const isUpdatingFromUser = useRef(false)

  // Update value when URL query parameter changes externally (browser back/forward)
  useEffect(() => {
    if (!isUpdatingFromUser.current) {
      const queryParam = searchParams.get('q') || ''
      setValue(queryParam)
    }
    isUpdatingFromUser.current = false
  }, [searchParams])

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    const currentQuery = searchParams.get('q') || ''
    const trimmedDebounced = debouncedValue.trim()
    const trimmedCurrent = currentQuery.trim()

    // Only update URL if the debounced value differs from current URL param
    if (trimmedDebounced !== trimmedCurrent) {
      isUpdatingFromUser.current = true
      router.push(`/search${trimmedDebounced ? `?q=${encodeURIComponent(trimmedDebounced)}` : ''}`)
    }
  }, [debouncedValue, router, searchParams])

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
            isUpdatingFromUser.current = true
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
