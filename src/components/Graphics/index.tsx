import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'

const Graphics: React.FC = () => {
  return (
    <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
      <Logo className="h-[43.5px] w-auto" loading="eager" priority="high" />
    </Link>
  )
}

export default Graphics
