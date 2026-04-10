import React from 'react'
import logoCol from '../../assets/sundargaan_logo_col.svg'
import logoWhite from '../../assets/sundargaan_logo_white.svg'

interface LogoProps {
  variant?: 'color' | 'white'
  className?: string
  height?: number
}

const Logo: React.FC<LogoProps> = ({ variant = 'color', className = '', height }) => {
  const src = variant === 'white' ? logoWhite : logoCol
  return (
    <img
      src={src}
      alt="Sundargaan"
      className={className}
      style={{ height: height ? `${height}px` : undefined, width: 'auto' }}
    />
  )
}

export default Logo
