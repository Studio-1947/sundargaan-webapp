import React from 'react'
import { motion, Variants } from 'framer-motion'

interface PremiumSundargaanTextProps {
  text: string
  className?: string
  style?: React.CSSProperties
}

const PremiumSundargaanText: React.FC<PremiumSundargaanTextProps> = ({ text, className, style }) => {

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
      className={`relative flex flex-wrap ${className}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span
              key={letterIndex}
              variants={childVariants}
              whileHover={{
                y: -8,
                color: '#CB460C',
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
              style={{ 
                display: 'inline-block',
                cursor: 'default',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}

export default PremiumSundargaanText
