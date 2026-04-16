import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      className="flex items-center bg-[#F7EAE5]/80 backdrop-blur-md border border-[#e5d5cd] rounded-full p-1 relative w-[100px] h-10 cursor-pointer select-none shadow-sm group"
      onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
    >
      {/* Moving background slider */}
      <motion.div
        className="absolute top-1 bottom-1 left-1 bg-[#CB460C] rounded-full shadow-sm"
        initial={false}
        animate={{
          x: language === 'EN' ? 0 : 46,
        }}
        style={{ width: '46px' }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      
      {/* Option labels */}
      <div className="flex w-full h-full z-10 relative pointer-events-none translate-y-[2px]">
        <div className="flex-1 flex items-center justify-center">
          <span className={`font-body text-[11px] font-bold tracking-tight leading-none transition-colors duration-200 ${language === 'EN' ? 'text-white' : 'text-[#6b5b4f]'}`}>
            EN
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className={`font-body text-[11px] font-bold tracking-tight leading-none transition-colors duration-200 ${language === 'BN' ? 'text-white' : 'text-[#6b5b4f]'}`}>
            বাংলা
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;
