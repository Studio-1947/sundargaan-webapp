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
  'hero.tagline1': { EN: 'Where mangroves meet the restless tide, and the land quietly holds its stories.', BN: 'যেখানে উত্তাল জোয়ারে ম্যানগ্রোভ মেলে হাত, আর ভূমি নিভৃতে আগলে রাখে তার কথামালা।' },
  'hero.tagline2': { EN: 'Voices rise from soil and everyday life, carrying memories across generations.', BN: 'মাটি আর আটপৌরে জীবন থেকে জেগে ওঠা সুর, যা প্রজন্ম থেকে প্রজন্মান্তরে বয়ে বেড়ায় স্মৃতি।' },
  'hero.btn.join': { EN: 'Join', BN: 'যুক্ত হোন' },
  'hero.btn.more': { EN: 'Know more', BN: 'আরও জানুন' },
  'hero.scroll': { EN: 'Explore', BN: 'অন্বেষণ করুন' },
  
  // Archive
  'archive.title': { EN: 'Stories & Livelihood', BN: 'গল্প ও জীবিকা' },
  'archive.desc': { 
    EN: 'Explore the personal narratives and traditional occupations of the Sundarbans. These are the stories of resilience, craft, and the rhythmic bond between the people and their land.', 
    BN: 'সুন্দরবনের ব্যক্তিগত আখ্যান এবং ঐতিহ্যবাহী পেশাগুলো অন্বেষণ করুন। এগুলো সহনশীলতা, শিল্প এবং মানুষ ও তাদের ভূমির মধ্যে ছন্দময় বন্ধনের গল্প।' 
  },
  'archive.btn.explore': { EN: 'Explore All', BN: 'সব দেখুন' },
  'archive.cat1': { EN: 'Coming Soon', BN: 'শীঘ্রই আসছে' },
  'archive.cat2': { EN: 'Coming Soon', BN: 'শীঘ্রই আসছে' },
  'archive.cat3': { EN: 'Coming Soon', BN: 'শীঘ্রই আসছে' },
  'archive.item1': { EN: 'Bishnupada Sarkar', BN: 'বিষ্ণুপদ সরকার' },
  'archive.item2': { EN: 'Sabita Baidya', BN: 'সবিতা বৈদ্য' },
  'archive.item3': { EN: 'Atiyar Gazi', BN: 'আতিয়ার গাজী' },

  // Artists
  'artists.title': { EN: 'Voices of the Roots', BN: 'শিকড়ের কণ্ঠস্বর' },
  'artists.desc': {
    EN: 'From the quiet lives of fishers to the paths of wandering bauls, they are the keepers of our living culture. Stand with us in honoring their craft, and passing their songs into the future.',
    BN: 'জেলেদের শান্ত জীবন থেকে শুরু করে যাযাবর বাউলদের পথ পর্যন্ত, তারা আমাদের জীবন্ত সংস্কৃতির রক্ষক। তাদের শিল্পকে সম্মান জানাতে এবং তাদের গানকে ভবিষ্যতের দিকে এগিয়ে নিয়ে যেতে আমাদের পাশে দাঁড়ান।'
  },
  'artists.btn': { EN: 'Meet the Artist', BN: 'শিল্পীদের সাথে আলাপ' },
  'artists.bg': { EN: 'ARTISTS', BN: 'শিল্পী' },
  
  // Artist Page
  'artist.page.title': { EN: 'Meet the Artists', BN: 'শিল্পীদের সাথে আলাপ' },
  'artist.page.search.placeholder': { EN: 'Search by name, song, or instrument...', BN: 'নাম, গান বা বাদ্যযন্ত্র দিয়ে খুঁজুন...' },
  'artist.search.btn': { EN: 'Search', BN: 'অনুসন্ধান' },
  'artist.filter.all': { EN: 'All Blocks', BN: 'সব ব্লক' },
  'artist.filter.category': { EN: 'Category', BN: 'বিভাগ' },
  'artist.card.famousSong': { EN: 'Famous Song', BN: 'বিখ্যাত গান' },
  'artist.card.address': { EN: 'Location', BN: 'স্থান' },
  'artist.card.book': { EN: 'Book Artist', BN: 'শিল্পী বুক করুন' },
  'artist.card.more': { EN: 'Know More', BN: 'আরও জানুন' },
  'artist.modal.booking': { EN: 'Booking Request', BN: 'বুকিং অনুরোধ' },
  'artist.modal.contact': { EN: 'Contact Info', BN: 'যোগাযোগের তথ্য' },
  'artist.modal.send': { EN: 'Send Request', BN: 'অনুরোধ পাঠান' },
  'artist.modal.close': { EN: 'Close', BN: 'বন্ধ করুন' },
  'artist.modal.name': { EN: 'Your Name', BN: 'আপনার নাম' },
  'artist.modal.message': { EN: 'Message', BN: 'বার্তা' },
  'artist.modal.success': { EN: 'Request sent successfully!', BN: 'অনুরোধ সফলভাবে পাঠানো হয়েছে!' },
  'artist.modal.tab.about': { EN: 'About', BN: 'সম্পর্কে' },
  'artist.modal.tab.works': { EN: 'Sample Works', BN: 'নমুনা কাজ' },
  'artist.modal.tab.book': { EN: 'Book & Contact', BN: 'বুকিং ও যোগাযোগ' },

  // Impact
  'impact.title': { EN: 'Documenting Change, Preserving Legacy.', BN: 'পরিবর্তন নথিবদ্ধ করা, ঐতিহ্য সংরক্ষণ।' },
  'impact.stat1.val': { EN: '100+', BN: '১০০+' },
  'impact.stat1.label': { EN: 'Songs Recorded', BN: 'রেকর্ড করা গান' },
  'impact.stat2.val': { EN: '500+', BN: '৫০০+' },
  'impact.stat2.label': { EN: 'Artists Surveyed', BN: 'জরিপ করা শিল্পী' },
  'impact.stat3.val': { EN: '9+', BN: '৯+' },
  'impact.stat3.label': { EN: 'Blocks Covered', BN: 'ব্লক অন্তর্ভুক্ত' },
  'impact.stat4.val': { EN: '5+', BN: '৫+' },
  'impact.stat4.label': { EN: 'Genres', BN: 'ঘরানা' },

  // Media Grid
  'media.watch': { EN: 'Watch Story', BN: 'গল্পটি দেখুন' },

  // Footer
  'footer.brand': { 
    EN: 'Preserving and celebrating the living musical heritage of the Sundarbans. A digital sanctuary where memories of soil and tide rise through song.', 
    BN: 'সুন্দরবনের সংগীত ঐতিহ্য সংরক্ষণ ও উদযাপনে নিবেদিত। এক ডিজিটাল অভয়ারণ্য, যেখানে মাটি আর জোয়ারের স্মৃতি জেগে ওঠে গানের সুরে।' 
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
  'footer.rights': { EN: 'All rights reserved.', BN: 'সর্বস্বত্ব সংরক্ষিত।' },
  'footer.dev': { EN: 'Designed and Developed by', BN: 'পরিকল্পিত ও তৈরি করেছে' },
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
