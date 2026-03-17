import React from 'react'
import { motion, Variants } from 'framer-motion'

interface PremiumSundargaanTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

const PremiumSundargaanText: React.FC<PremiumSundargaanTextProps> = ({ text, className, style }) => {
  const letters = Array.from(text)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 * i },
    }),
  }

  const childVariants: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.h1
      key={text}
      className={`relative flex flex-nowrap ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          whileHover={{
            y: -8,
            color: '#CB460C',
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          style={{ 
            display: 'inline-block',
            cursor: 'default',
            marginRight: letter === ' ' ? '0.25em' : '0'
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  )
}

export default PremiumSundargaanText
