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

  // Impact Page Detailed
  'impact.page.hero.title': { EN: 'The Ripple of Your Contribution', BN: 'আপনার অবদানের তরঙ্গ' },
  'impact.page.hero.desc': { EN: 'How every rupee and every listen transforms the lives of artists in the Sunderbans.', BN: 'কীভাবে প্রতিটি টাকা এবং প্রতিটি শোনা সুন্দরবনের শিল্পীদের জীবন বদলে দেয়।' },
  'impact.page.flow.title': { EN: 'Cycle of Sustainability', BN: 'স্থায়িত্বের চক্র' },
  'impact.page.flow.desc': { EN: 'We believe in radical transparency. Here is how we distribute the funds generated through Sundargaan.', BN: 'আমরা আমূল স্বচ্ছতায় বিশ্বাস করি। সুন্দরগানের মাধ্যমে উৎপন্ন অর্থ আমরা কীভাবে বণ্টন করি তা এখানে দেওয়া হলো।' },
  'impact.page.artist.share': { EN: '60% Artist Support', BN: '৬০% শিল্পীর সহায়তা' },
  'impact.page.artist.desc': { EN: 'Direct financial support, project fees, and fair wages for recordings and performances.', BN: 'রেকর্ডিং এবং পারফরম্যান্সের জন্য সরাসরি আর্থিক সহায়তা, প্রকল্পের ফি এবং ন্যায্য মজুরি।' },
  'impact.page.community.share': { EN: '20% Community & Culture', BN: '২০% সম্প্রদায় ও সংস্কৃতি' },
  'impact.page.community.desc': { EN: 'Funding for Chorcha Kendra (Practice Centers) and our annual Music Festival.', BN: 'চর্চা কেন্দ্র এবং আমাদের বার্ষিক সংগীত উৎসবের জন্য অর্থায়ন।' },
  'impact.page.ops.share': { EN: '15% Operational Roots', BN: '১৫% অপারেশনাল মূল' },
  'impact.page.ops.desc': { EN: 'Supporting ELF and Studio 1947, the infrastructure that records and preserves our heritage.', BN: 'ইএলএফ (ELF) এবং স্টুডিও ১৯৪৭-কে সমর্থন করা, যা আমাদের ঐতিহ্য রেকর্ড এবং সংরক্ষণ করার পরিকাঠামো।' },
  'impact.page.security.share': { EN: '5% Artist Security', BN: '৫% শিল্পী নিরাপত্তা' },
  'impact.page.security.desc': { EN: 'Insurance, health support, and emergency funds for our artist community.', BN: 'আমাদের শিল্পী সম্প্রদায়ের জন্য বীমা, স্বাস্থ্য সহায়তা এবং জরুরি তহবিল।' },
  'impact.page.story.title': { EN: 'Transforming Lives', BN: 'জীবন পরিবর্তন' },
  'impact.page.story.desc': { EN: 'Sustainable income means more than just money—it means dignity, pride, and the ability to keep the Ektara singing.', BN: 'স্থায়ী আয় মানে শুধু টাকা নয়—এর মানে সম্মান, গর্ব এবং একতারা বাজিয়ে রাখার সক্ষমতা।' },

  // Unified Flow Nodes
  'impact.flow.source.contribution': { EN: 'Your Contribution', BN: 'আপনার অবদান' },
  'impact.flow.source.youtube': { EN: 'YouTube Revenue', BN: 'ইউটিউব রাজস্ব' },
  'impact.flow.source.spotify': { EN: 'Streaming (Spotify+)', BN: 'স্ট্রিমিং (স্পটিফাই+)' },
  'impact.flow.source.festival': { EN: 'Music Festival', BN: 'সংগীত উৎসব' },
  
  'impact.flow.hub.overall': { EN: 'Overall Money', BN: 'মোট অর্থ' },
  
  'impact.flow.output.artist': { EN: 'Artist (60%)', BN: 'শিল্পী (৬০%)' },
  'impact.flow.output.community': { EN: 'Community (20%)', BN: 'সম্প্রদায় (২০%)' },
  'impact.flow.output.ops': { EN: 'Operations (15%)', BN: 'অপারেশনস (১৫%)' },
  'impact.flow.output.security': { EN: 'Security/Health (5%)', BN: 'নিরাপত্তা/স্বাস্থ্য (৫%)' },
  
  'impact.flow.detail.booking': { EN: 'Artist Booking', BN: 'শিল্পী বুকিং' },
  'impact.flow.detail.account': { EN: 'Artist Account', BN: 'শিল্পীর অ্যাকাউন্ট' },
  
  // Existing Detailed Storytelling Funnels (Retained and repurposed as tooltips/modals)
  'impact.page.artist.detail.title': { EN: 'How Music Artists Benefit', BN: 'সংগীত শিল্পীরা যেভাবে উপকৃত হন' },
  'impact.page.artist.detail.desc': { EN: 'Direct financial support and professional growth for our artist community.', BN: 'আমাদের শিল্পী সম্প্রদায়ের জন্য সরাসরি আর্থিক সহায়তা এবং পেশাদার বিকাশ।' },
  'impact.page.gurukul.detail.title': { EN: 'Gurukul Academy', BN: 'গুরুকুল একাডেমি' },
  'impact.page.gurukul.detail.desc': { EN: 'Nurturing the next generation through traditional mentorship at Chorcha Kendra.', BN: 'চর্চা কেন্দ্রে ঐতিহ্যবাহী মেন্টরশিপের মাধ্যমে পরবর্তী প্রজন্মকে লালন করা।' },
  'impact.page.legacy.detail.title': { EN: 'Preserving for the Future', BN: 'ভবিষ্যতের জন্য সংরক্ষণ' },
  'impact.page.legacy.detail.desc': { EN: 'Documenting endangered melodies through Studio 1947 and ELF.', BN: 'স্টুডিও ১৯৪৭ এবং ইএলএফ (ELF)-এর মাধ্যমে বিলুপ্তপ্রায় সুরগুলোকে নথিবদ্ধ করা।' },
  
  'impact.page.detail.explore': { EN: 'Explore the Funnel', BN: 'ফানেলটি অন্বেষণ করুন' },
  'impact.page.detail.artist.point1': { EN: 'Fair royalties from digital streams', BN: 'ডিজিটাল স্ট্রিম থেকে ন্যায্য রয়্যালটি' },
  'impact.page.detail.artist.point2': { EN: 'Direct performance fees', BN: 'সরাসরি পারফরম্যান্স ফি' },
  'impact.page.detail.gurukul.point1': { EN: 'Collective practice spaces', BN: 'সম্মিলিত অনুশীলনের জায়গা' },
  'impact.page.detail.gurukul.point2': { EN: 'Oral heritage transmission', BN: 'মৌখিক ঐতিহ্যের সঞ্চালন' },
  'impact.page.detail.legacy.point1': { EN: 'Saving lost preservation work', BN: 'হারিয়ে যাওয়া সংরক্ষণ কাজ বাঁচানো' },
  'impact.page.detail.legacy.point2': { EN: 'Digital archive for future ears', BN: 'আগামী দিনের জন্য ডিজিটাল আর্কাইভ' },
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
