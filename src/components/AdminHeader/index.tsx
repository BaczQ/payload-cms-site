'use client'

import React from 'react'
import { getClientSideURL } from '@/utilities/getURL'

import './index.scss'

const AdminHeader: React.FC = () => {
  const siteURL = getClientSideURL()

  return (
    <a
      href={siteURL}
      target="_blank"
      rel="noopener noreferrer"
      className="admin-header-link browse-by-folder-button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="admin-header-icon"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <span>Go to Site</span>
    </a>
  )
}

export default AdminHeader
