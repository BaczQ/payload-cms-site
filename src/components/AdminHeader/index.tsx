'use client'

import React from 'react'
import { getClientSideURL } from '@/utilities/getURL'

const AdminHeader: React.FC = () => {
  const siteURL = getClientSideURL()

  return (
    <a
      href={siteURL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        padding: '0.5rem 1rem',
        color: 'white',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
    >
      Go to Site
    </a>
  )
}

export default AdminHeader
