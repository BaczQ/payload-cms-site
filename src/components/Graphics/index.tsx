import React from 'react'

const Graphics: React.FC = () => {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="/logo.png"
      alt="BF-News"
      width={193}
      height={44}
      className="graphic-logo"
      style={{ width: '193px', height: '44px', maxWidth: '100%', height: 'auto' }}
    />
  )
}

export default Graphics

