import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer } from '@/payload-types'

import { FooterClient } from './FooterClient'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []
  const copyrightText = footerData?.copyrightText || ''
  const builtWithText = footerData?.builtWithText || ''

  return (
    <FooterClient
      navItems={navItems}
      socialLinks={socialLinks}
      copyrightText={copyrightText}
      builtWithText={builtWithText}
    />
  )
}
