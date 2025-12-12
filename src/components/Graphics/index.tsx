import React from 'react'
import { Logo } from '@/components/Logo/Logo'

const Graphics: React.FC = () => {
  return (
    <a href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
      <Logo className="h-[43.5px] w-auto" loading="eager" priority="high" />
    </a>
  )
}

export default Graphics
