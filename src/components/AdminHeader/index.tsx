'use client'

import React from 'react'
import { getClientSideURL } from '@/utilities/getURL'

import './index.scss'

const AdminHeader: React.FC = () => {
  const siteURL = getClientSideURL()

  return (
    <a href={siteURL} target="_blank" rel="noopener noreferrer" className="admin-header-link">
      Go to Site
    </a>
  )
}

export default AdminHeader
