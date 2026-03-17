import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'BN';

interface Translations {
  [key: string]: {
    EN: string;
    BN: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.about': { EN: 'About', BN: 'সম্পর্কে' },
  'nav.archive': { EN: 'Archive', BN: 'আর্কাইভ' },
  'nav.artists': { EN: 'Meet the artists', BN: 'শিল্পীদের সাথে আলাপ' },
  'nav.impact': { EN: 'Impact', BN: 'প্রভাব' },
  'nav.join': { EN: 'Join', BN: 'যুক্ত হোন' },
  
  // Hero
  'hero.title': { EN: 'Sundargaan', BN: 'সুন্দরগান' },
  'hero.tagline1': { EN: 'Where the land sings of mangroves and mud.', BN: 'যেখানে ভূমি ম্যানগ্রোভ এবং কাদার গান গায়।' },
  'hero.tagline2': { EN: 'Stories of soil, rhythm of the Ektara.', BN: 'মাটির গল্প, একতারার ছন্দ।' },
  'hero.btn.join': { EN: 'Join', BN: 'যুক্ত হোন' },
  'hero.btn.more': { EN: 'Know more', BN: 'আরও জানুন' },
  'hero.scroll': { EN: 'Explore', BN: 'অন্বেষণ করুন' },
  
  // Archive
  'archive.title': { EN: 'The Living Archive', BN: 'জীবন্ত আর্কাইভ' },
  'archive.desc': { 
    EN: 'Explore a vast collection of traditional songs, folk tales, and oral histories recorded directly from the hearts of the Sundarbans. Each piece is a testament to the resilient spirit of our land.', 
    BN: 'সুন্দরবনের হৃদয় থেকে সরাসরি রেকর্ড করা ঐতিহ্যবাহী গান, লোকগাথা এবং মৌখিক ইতিহাসের এক বিশাল সংগ্রহ অন্বেষণ করুন। প্রতিটি অংশ আমাদের ভূমির সহনশীল চেতনার প্রমাণ।' 
  },
  'archive.btn.explore': { EN: 'Explore All', BN: 'সব দেখুন' },
  'archive.cat1': { EN: 'Boatman Songs', BN: 'ভাটিয়ালি গান' },
  'archive.cat2': { EN: 'Mythological Oral History', BN: 'পৌরাণিক মৌখিক ইতিহাস' },
  'archive.cat3': { EN: 'Celebratory Folk', BN: 'উৎসবের লোকগান' },
  'archive.item1': { EN: 'Bhatiali Jowar', BN: 'ভাটিয়ালি জোয়ার' },
  'archive.item2': { EN: 'Bonbibi Katha', BN: 'বনবিবি কথা' },
  'archive.item3': { EN: 'Ektara Jhumur', BN: 'একতারা ঝুমুর' },

  // Artists
  'artists.title': { EN: 'Voices of the Mud', BN: 'মাটির কণ্ঠস্বর' },
  'artists.desc': {
    EN: 'From the humble fishers to the wandering bauls, these are the artists who breathe life into our culture. Join us in celebrating their craft and ensuring their songs are heard by generations to come.',
    BN: 'সাধারণ জেলে থেকে শুরু করে যাযাবর বাউল পর্যন্ত, এরা সেই শিল্পী যারা আমাদের সংস্কৃতিতে প্রাণ সঞ্চার করেন। আসুন আমরা তাদের শিল্প উদযাপন করি এবং নিশ্চিত করি যে তাদের গান আগামী প্রজন্মের কাছে পৌঁছায়।'
  },
  'artists.btn': { EN: 'Meet the Team', BN: 'দলের সাথে দেখা করুন' },
  'artists.bg': { EN: 'ARTISTS', BN: 'শিল্পী' },

  // Impact
  'impact.title': { EN: 'Documenting Change, Preserving Legacy.', BN: 'পরিবর্তন নথিবদ্ধ করা, ঐতিহ্য সংরক্ষণ।' },
  'impact.stat1.val': { EN: '750+', BN: '৭৫০+' },
  'impact.stat1.label': { EN: 'Songs Preserved', BN: 'সংরক্ষিত গান' },
  'impact.stat2.val': { EN: '120+', BN: '১২০+' },
  'impact.stat2.label': { EN: 'Artists Supported', BN: 'সমর্থিত শিল্পী' },
  'impact.stat3.val': { EN: '24', BN: '২৪' },
  'impact.stat3.label': { EN: 'Villages Documented', BN: 'নথিবদ্ধ গ্রাম' },
  'impact.stat4.val': { EN: '1.2M', BN: '১.২ মিলিয়ন' },
  'impact.stat4.label': { EN: 'Cultural Digital Grains', BN: 'সাংস্কৃতিক ডিজিটাল দানা' },

  // Media Grid
  'media.watch': { EN: 'Watch Story', BN: 'গল্পটি দেখুন' },

  // Footer
  'footer.brand': { 
    EN: 'Preserving and celebrating the living musical heritage of the Sundarbans. Sundargaan is a digital sanctuary for the stories of soil and the rhythm of the Ektara.', 
    BN: 'সুন্দরবনের জীবন্ত সংগীত ঐতিহ্য সংরক্ষণ এবং উদযাপন করা হচ্ছে। সুন্দরগান হলো মাটির গল্প এবং একতারার ছন্দের এক ডিজিটাল অভয়ারণ্য।' 
  },
  'footer.nav': { EN: 'Navigation', BN: 'নেভিগেশন' },
  'footer.community': { EN: 'Community', BN: 'কমিউনিটি' },
  'footer.legal': { EN: 'Legal', BN: 'আইনি' },
  'footer.join': { EN: 'Join Us', BN: 'আমাদের সাথে যোগ দিন' },
  'footer.support': { EN: 'Support', BN: 'সমর্থন' },
  'footer.newsletter': { EN: 'Newsletter', BN: 'নিউজলেটার' },
  'footer.events': { EN: 'Events', BN: 'ইভেন্ট' },
  'footer.privacy': { EN: 'Privacy Policy', BN: 'গোপনীয়তা নীতি' },
  'footer.terms': { EN: 'Terms of Service', BN: 'পরিষেবার শর্তাবলী' },
  'footer.cookies': { EN: 'Cookie Policy', BN: 'কুকি নীতি' },
  'footer.rights': { EN: 'All rights reserved. Built with love in Bengal.', BN: 'সর্বস্বত্ব সংরক্ষিত। বাংলায় ভালোবাসায় নির্মিত।' },
  'footer.top': { EN: 'Back to top', BN: 'উপরে ফিরে যান' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
