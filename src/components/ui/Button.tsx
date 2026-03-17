import React from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#CB460C',
    color: '#FEFCFB',
    border: '1.5px solid #CB460C',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#CB460C',
    border: '1.5px solid #CB460C',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#CB460C',
    border: '1.5px solid transparent',
  },
}

const hoverStyles: Record<ButtonVariant, string> = {
  primary: 'hover:brightness-90 active:brightness-75',
  outline: 'hover:bg-[#F7EAE5] active:bg-[#F1D8CD]',
  ghost: 'hover:bg-[#F7EAE5]',
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      style={variantStyles[variant]}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-medium font-body
        transition-all duration-200 ease-out
        cursor-pointer tracking-wide
        focus:outline-none focus:ring-2 focus:ring-[#CB460C]/40 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${hoverStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
