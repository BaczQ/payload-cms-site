'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter, useSearchParams } from 'next/navigation'

export const Search: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryFromUrl = searchParams.get('q') || ''
  const [value, setValue] = useState(queryFromUrl)
  const isInternalUpdate = useRef(false)

  const debouncedValue = useDebounce(value)

  // Синхронизируем значение с URL параметром при изменении URL (например, при переходе с другой страницы)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    // Обновляем только если это внешнее изменение (не наше обновление URL)
    if (!isInternalUpdate.current) {
      setValue(urlQuery)
    }
    // Сбрасываем флаг после обработки
    isInternalUpdate.current = false
  }, [searchParams])

  // Обновляем URL при изменении debounced значения (когда пользователь вводит текст)
  useEffect(() => {
    const currentQuery = searchParams.get('q') || ''
    if (debouncedValue !== currentQuery) {
      isInternalUpdate.current = true
      const newUrl = `/search${debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''}`
      router.push(newUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

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
