export interface SampleWork {
  id: string;
  title: string;
  titleBN: string;
  type: 'song' | 'video' | 'craft';
  thumbnail: string;
  mediaUrl?: string;
  youtubeId?: string;
  duration?: string;
}

export interface Artist {
  id: string;
  name: string;
  nameBN: string;
  description: string;
  descriptionBN: string;
  famousSong: string;
  famousSongBN: string;
  address: string;
  addressBN: string;
  village?: string;
  villageBN?: string;
  post?: string;
  postBN?: string;
  block: string;
  category: string;
  image: string;
  tags: string[];
  tagsBN: string[];
  instruments: string[];
  instrumentsBN: string[];
  experience: number;
  availability: boolean;
  phone: string;
  email: string;
  sampleWorks: SampleWork[];
}

export const ARTIST_BLOCKS = [
  'Hingalganj'
];

export const ARTIST_CATEGORIES = [
  { id: 'bhatiyali', en: 'Bhatiyali', bn: 'ভাটিয়ালি' },
  { id: 'bhawaiya', en: 'Bhawaiya', bn: 'ভাওয়াইয়া' },
  { id: 'baul', en: 'Baul', bn: 'বাউল' },
  { id: 'lokgeet', en: 'Lok geet', bn: 'লোক গীতি' },
  { id: 'sarigaan', en: 'Sarigaan', bn: 'সারিগান' },
  { id: 'palagaan', en: 'Palagaan', bn: 'পালাগান' },
  { id: 'lalon-geet', en: 'Lalon geet', bn: 'লালন গীতি' },
  { id: 'prakriti-geet', en: 'Prakriti geet', bn: 'প্রকৃতি গীতি' },
  { id: 'manasha', en: 'Manasha', bn: 'মনসা' }
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Sanatan Das',
    nameBN: 'সনাতন দাস',
    description: 'A legendary Baul singer from the heart of the Sundarbans, Sanatan Das has spent over 35 years wandering the delta regions, carrying the mystical philosophy of the Bauls through his soul-stirring Ektara performances. His music bridges the earthly and the divine, drawing thousands to riverside gatherings each season.',
    descriptionBN: 'সুন্দরবনের হৃদয় থেকে উঠে আসা এক কিংবদন্তি বাউল গায়ক, সনাতন দাস ৩৫ বছরেরও বেশি সময় ধরে বদ্বীপ অঞ্চলে ঘুরে বেড়াচ্ছেন, তাঁর প্রাণস্পর্শী একতারা পরিবেশনার মাধ্যমে বাউলদের রহস্যময় দর্শন বহন করে চলেছেন।',
    famousSong: 'Khachar Bhitor Achin Pakhi',
    famousSongBN: 'খাঁচার ভিতর অচিন পাখি',
    address: 'Hingalganj, North 24 Parganas',
    addressBN: 'হিঙ্গলগঞ্জ, উত্তর ২৪ পরগনা',
    village: 'Hingalganj',
    villageBN: 'হিঙ্গলগঞ্জ',
    post: 'Hingalganj',
    postBN: 'হিঙ্গলগঞ্জ',
    block: 'Hingalganj',
    category: 'baul',
    image: 'https://picsum.photos/seed/artist1/800/800',
    tags: ['Legend', 'Ektara', 'Folk', 'Mystical'],
    tagsBN: ['কিংবদন্তি', 'একতারা', 'লোকগান', 'আধ্যাত্মিক'],
    instruments: ['Ektara', 'Dotara', 'Khamak'],
    instrumentsBN: ['একতারা', 'দোতারা', 'খমক'],
    experience: 35,
    availability: true,
    phone: '+91 98300 11001',
    email: 'sanatan.baul@sundargaan.in',
    sampleWorks: [
      { id: 'sw1a', title: 'Khachar Bhitor Achin Pakhi', titleBN: 'খাঁচার ভিতর অচিন পাখি', type: 'song', thumbnail: 'https://picsum.photos/seed/work1a/400/300', duration: '7:42' },
      { id: 'sw1b', title: 'Ami Kothai Pabo Tare', titleBN: 'আমি কোথায় পাবো তারে', type: 'video', thumbnail: 'https://picsum.photos/seed/work1b/400/300', duration: '5:18' },
      { id: 'sw1c', title: 'Pagla Hawar Badol Dine', titleBN: 'পাগলা হাওয়ার বাদল দিনে', type: 'song', thumbnail: 'https://picsum.photos/seed/work1c/400/300', duration: '6:55' }
    ]
  },
  {
    id: '2',
    name: 'Rina Mondal',
    nameBN: 'রীনা মন্ডল',
    description: 'A master of Bhatiali — the soulful songs of the Sundarbans boatmen — Rina Mondal has spent over two decades documenting and performing the melodies that float along the tidal rivers of the delta. Her voice carries the weight of water and wind, deeply rooted in the traditions of Gosaba.',
    descriptionBN: 'ভাটিয়ালি সংগীতের একজন ওস্তাদ শিল্পী — সুন্দরবনের নৌকার মাঝিদের আত্মিক গান — রীনা মন্ডল দুই দশকেরও বেশি সময় ধরে বদ্বীপের জোয়ার-ভাটার নদী বরাবর ভেসে আসা সুরগুলো নথিবদ্ধ করে চলেছেন।',
    famousSong: 'Amay Bhasaili Re',
    famousSongBN: 'আমায় ভাসাইলি রে',
    address: 'Gosaba, South 24 Parganas',
    addressBN: 'গোসাবা, দক্ষিণ ২৪ পরগনা',
    village: 'Gosaba',
    villageBN: 'গোসাবা',
    post: 'Gosaba',
    postBN: 'গোসাবা',
    block: 'Gosaba',
    category: 'bhatiyali',
    image: 'https://picsum.photos/seed/artist2/800/800',
    tags: ['Bhatiali', 'River Songs', 'Traditional', 'Vocalist'],
    tagsBN: ['ভাটিয়ালি', 'নদীর গান', 'ঐতিহ্যবাহী', 'কণ্ঠশিল্পী'],
    instruments: ['Voice', 'Harmonium', 'Tabla'],
    instrumentsBN: ['কণ্ঠ', 'হারমোনিয়াম', 'তবলা'],
    experience: 22,
    availability: true,
    phone: '+91 94330 22002',
    email: 'rina.mondal@sundargaan.in',
    sampleWorks: [
      { id: 'sw2a', title: 'Amay Bhasaili Re', titleBN: 'আমায় ভাসাইলি রে', type: 'video', thumbnail: 'https://picsum.photos/seed/work2a/400/300', duration: '8:10' },
      { id: 'sw2b', title: 'Nodi Bhore Jol', titleBN: 'নদী ভরে জল', type: 'song', thumbnail: 'https://picsum.photos/seed/work2b/400/300', duration: '4:45' },
      { id: 'sw2c', title: 'Maajhi Nao Bao Re', titleBN: 'মাঝি নাও বাও রে', type: 'song', thumbnail: 'https://picsum.photos/seed/work2c/400/300', duration: '6:20' }
    ]
  },
  {
    id: '3',
    name: 'Gopal Pramanik',
    nameBN: 'গোপাল প্রামাণিক',
    description: 'A traditional potter from Basanti whose clay works are infused with the rhythms of Sundarbans folk music. Gopal creates ritual vessels and musical instruments from local clay, each piece telling a story of the mangrove delta. He also performs percussive clay-pot music at community festivals.',
    descriptionBN: 'বাসন্তীর একজন ঐতিহ্যবাহী কুমোর যার মাটির শিল্পকর্মে সুন্দরবনের লোকসংগীতের ছন্দ মিশে আছে। গোপাল স্থানীয় মাটি দিয়ে আচার-অনুষ্ঠানের পাত্র ও বাদ্যযন্ত্র তৈরি করেন।',
    famousSong: 'Mati-r Chanda (Clay Rhythm)',
    famousSongBN: 'মাটির ছন্দ',
    address: 'Basanti, South 24 Parganas',
    addressBN: 'বাসন্তী, দক্ষিণ ২৪ পরগনা',
    village: 'Basanti',
    villageBN: 'বাসন্তী',
    post: 'Basanti',
    postBN: 'বাসন্তী',
    block: 'Basanti',
    category: 'lokgeet',
    image: 'https://picsum.photos/seed/artist3/800/800',
    tags: ['Pottery', 'Clay Art', 'Craft', 'Percussion'],
    tagsBN: ['মৃৎশিল্প', 'মাটির শিল্প', 'কারুশিল্প', 'তাল'],
    instruments: ['Clay Pot Percussion', 'Dhak', 'Madol'],
    instrumentsBN: ['মাটির পাত্রের তাল', 'ঢাক', 'মাদল'],
    experience: 28,
    availability: false,
    phone: '+91 90510 33003',
    email: 'gopal.pramanik@sundargaan.in',
    sampleWorks: [
      { id: 'sw3a', title: 'Clay Pot Rhythm Demo', titleBN: 'মাটির পাত্রের তাল প্রদর্শনী', type: 'video', thumbnail: 'https://picsum.photos/seed/work3a/400/300', duration: '3:30' },
      { id: 'sw3b', title: 'Ritual Vessel Collection', titleBN: 'আচার-পাত্রের সংগ্রহ', type: 'craft', thumbnail: 'https://picsum.photos/seed/work3b/400/300' },
      { id: 'sw3c', title: 'Mangrove Motif Pottery', titleBN: 'ম্যানগ্রোভ নকশার মৃৎপাত্র', type: 'craft', thumbnail: 'https://picsum.photos/seed/work3c/400/300' }
    ]
  },
  {
    id: '4',
    name: 'Anjali Baul',
    nameBN: 'অঞ্জলি বাউল',
    description: 'Specializing in Jhumur — the vibrant dance-song form of the Sundarbans adivasi communities — Anjali is a pillar of the Sandeshkhali cultural scene. She trains young women in the traditional Jhumur movements and has performed at state and national folk festivals.',
    descriptionBN: 'ঝুমুর — সুন্দরবনের আদিবাসী সম্প্রদায়ের প্রাণবন্ত নৃত্য-গানের রূপ — বিশেষজ্ঞ হিসেবে অঞ্জলি সন্দেশখালির সাংস্কৃতিক জীবনের একটি স্তম্ভ।',
    famousSong: 'Jhumur Nach — Bonbibi Vandana',
    famousSongBN: 'ঝুমুর নাচ — বনবিবি বন্দনা',
    address: 'Sandeshkhali I, North 24 Parganas',
    addressBN: 'সন্দেশখালি ১, উত্তর ২৪ পরগনা',
    village: 'Sandeshkhali',
    villageBN: 'সন্দেশখালি',
    post: 'Sandeshkhali',
    postBN: 'সন্দেশখালি',
    block: 'Sandeshkhali I',
    category: 'bhawaiya',
    image: 'https://picsum.photos/seed/artist4/800/800',
    tags: ['Jhumur', 'Dance', 'Adivasi Culture', 'Teacher'],
    tagsBN: ['ঝুমুর', 'নৃত্য', 'আদিবাসী সংস্কৃতি', 'শিক্ষক'],
    instruments: ['Voice', 'Madol', 'Nagara'],
    instrumentsBN: ['কণ্ঠ', 'মাদল', 'নাগারা'],
    experience: 18,
    availability: true,
    phone: '+91 97320 44004',
    email: 'anjali.jhumur@sundargaan.in',
    sampleWorks: [
      { id: 'sw4a', title: 'Bonbibi Vandana — Live', titleBN: 'বনবিবি বন্দনা — সরাসরি', type: 'video', thumbnail: 'https://picsum.photos/seed/work4a/400/300', duration: '9:22' },
      { id: 'sw4b', title: 'Jhumur Teaching Session', titleBN: 'ঝুমুর শিক্ষা অধিবেশন', type: 'video', thumbnail: 'https://picsum.photos/seed/work4b/400/300', duration: '12:05' },
      { id: 'sw4c', title: 'Rangilo Re Jhumur', titleBN: 'রঙিলো রে ঝুমুর', type: 'song', thumbnail: 'https://picsum.photos/seed/work4c/400/300', duration: '5:48' }
    ]
  },
  {
    id: '5',
    name: 'Kartik Sardar',
    nameBN: 'কার্তিক সর্দার',
    description: 'One of the last great oral storytellers of the Sundarbans, Kartik Sardar weaves together the myths of Bon Bibi, Dakshin Rai, and the tiger spirits into epic narrative performances lasting hours. His storytelling tradition — Panchali — is recognized by the West Bengal State Akademi.',
    descriptionBN: 'সুন্দরবনের শেষ মহান মৌখিক গল্পকারদের একজন, কার্তিক সর্দার বনবিবি, দক্ষিণ রায় এবং বাঘের আত্মার পৌরাণিক কাহিনী একসাথে বুনে ঘণ্টার পর ঘণ্টা মহাকাব্যিক আখ্যান পরিবেশন করেন।',
    famousSong: 'Bonbibi Johuranama (Epic Ballad)',
    famousSongBN: 'বনবিবি জহুরানামা (মহাকাব্যিক সংগীত)',
    address: 'Sagar Island, South 24 Parganas',
    addressBN: 'সাগর দ্বীপ, দক্ষিণ ২৪ পরগনা',
    village: 'Mandirtala',
    villageBN: 'মন্দিরতলা',
    post: 'Sagar',
    postBN: 'সাগর',
    block: 'Sagar',
    category: 'palagaan',
    image: 'https://picsum.photos/seed/artist5/800/800',
    tags: ['Oral History', 'Epic', 'Mythology', 'Panchali'],
    tagsBN: ['মৌখিক ইতিহাস', 'মহাকাব্য', 'পৌরাণিক কাহিনী', 'পাঁচালি'],
    instruments: ['Voice', 'Kashi', 'Khol'],
    instrumentsBN: ['কণ্ঠ', 'কাশি', 'খোল'],
    experience: 40,
    availability: true,
    phone: '+91 96740 55005',
    email: 'kartik.sardar@sundargaan.in',
    sampleWorks: [
      { id: 'sw5a', title: 'Bonbibi Johuranama Part I', titleBN: 'বনবিবি জহুরানামা — প্রথম পর্ব', type: 'video', thumbnail: 'https://picsum.photos/seed/work5a/400/300', duration: '18:40' },
      { id: 'sw5b', title: 'Dakshin Rai Katha', titleBN: 'দক্ষিণ রায় কথা', type: 'song', thumbnail: 'https://picsum.photos/seed/work5b/400/300', duration: '11:15' },
      { id: 'sw5c', title: 'Tiger Spirit Narratives', titleBN: 'বাঘের আত্মার কথা', type: 'video', thumbnail: 'https://picsum.photos/seed/work5c/400/300', duration: '22:30' }
    ]
  },
  {
    id: '6',
    name: 'Maya Debnath',
    nameBN: 'মায়া দেবনাথ',
    description: 'A master weaver from Kultali who creates traditional Tant sarees and textiles with motifs inspired by the Sundarbans ecosystem — tigers, mangroves, kingfishers, and tidal waves. Maya has revived nearly extinct weaving patterns that were on the verge of disappearing from the delta.',
    descriptionBN: 'কুলতলির একজন ওস্তাদ তাঁতি যিনি সুন্দরবনের বাস্তুতন্ত্র থেকে অনুপ্রাণিত নকশায় — বাঘ, ম্যানগ্রোভ, মাছরাঙা এবং জোয়ারের ঢেউ — ঐতিহ্যবাহী তাঁত শাড়ি ও কাপড় তৈরি করেন।',
    famousSong: 'Loom Song of the Delta',
    famousSongBN: 'বদ্বীপের তাঁতের গান',
    address: 'Kultali, South 24 Parganas',
    addressBN: 'কুলতলি, দক্ষিণ ২৪ পরগনা',
    village: 'Kultali',
    villageBN: 'কুলতলি',
    post: 'Kultali',
    postBN: 'কুলতলি',
    block: 'Hingalganj',
    category: 'sarigaan',
    image: 'https://picsum.photos/seed/artist6/800/800',
    tags: ['Tant Weaving', 'Textile', 'Craft Revival', 'Sundarbans Motifs'],
    tagsBN: ['তাঁত বয়ন', 'বস্ত্র', 'শিল্প পুনরুজ্জীবন', 'সুন্দরবনের নকশা'],
    instruments: ['Loom', 'Handloom', 'Charkha'],
    instrumentsBN: ['তাঁত', 'হ্যান্ডলুম', 'চরকা'],
    experience: 25,
    availability: false,
    phone: '+91 98010 66006',
    email: 'maya.weaver@sundargaan.in',
    sampleWorks: [
      { id: 'sw6a', title: 'Tiger Motif Tant Saree', titleBN: 'বাঘের নকশার তাঁত শাড়ি', type: 'craft', thumbnail: 'https://picsum.photos/seed/work6a/400/300' },
      { id: 'sw6b', title: 'Mangrove Pattern Weave', titleBN: 'ম্যানগ্রোভ নকশার বয়ন', type: 'craft', thumbnail: 'https://picsum.photos/seed/work6b/400/300' },
      { id: 'sw6c', title: 'Weaving Process Documentary', titleBN: 'বয়ন প্রক্রিয়ার তথ্যচিত্র', type: 'video', thumbnail: 'https://picsum.photos/seed/work6c/400/300', duration: '8:55' }
    ]
  },
  {
    id: '7',
    name: 'Suresh Halder',
    nameBN: 'সুরেশ হালদার',
    description: 'A wandering Baul saint whose music journeys from introspective spiritual questions to joyful celebrations of nature. Suresh is known for his mastery of the Dotara and his ability to hold audiences for hours with improvised performances rooted in the Fakiri tradition of the Canning area.',
    descriptionBN: 'একজন পথচলা বাউল সাধু যার সংগীত আত্মিক প্রশ্নের অন্তর্মুখী চিন্তা থেকে প্রকৃতির আনন্দময় উদযাপনে পরিভ্রমণ করে। সুরেশ তার দোতারার দক্ষতা এবং ক্যানিং এলাকার ফকিরি ঐতিহ্যে শিকড় গেড়ে ঘণ্টার পর ঘণ্টা তাৎক্ষণিক পরিবেশনায় দর্শকদের মুগ্ধ রাখার জন্য পরিচিত।',
    famousSong: 'Moner Manush — Fakiri Dhun',
    famousSongBN: 'মনের মানুষ — ফকিরি ধুন',
    address: 'Canning, South 24 Parganas',
    addressBN: 'ক্যানিং, দক্ষিণ ২৪ পরগনা',
    village: 'Canning',
    villageBN: 'ক্যানিং',
    post: 'Canning',
    postBN: 'ক্যানিং',
    block: 'Canning',
    category: 'baul',
    image: 'https://picsum.photos/seed/artist7/800/800',
    tags: ['Baul', 'Fakiri', 'Dotara', 'Sufi Influence'],
    tagsBN: ['বাউল', 'ফকিরি', 'দোতারা', 'সুফি প্রভাব'],
    instruments: ['Dotara', 'Ektara', 'Ananda Lahari'],
    instrumentsBN: ['দোতারা', 'একতারা', 'আনন্দলহরী'],
    experience: 30,
    availability: true,
    phone: '+91 99030 77007',
    email: 'suresh.baul@sundargaan.in',
    sampleWorks: [
      { id: 'sw7a', title: 'Moner Manush — Live at Sagar', titleBN: 'মনের মানুষ — সাগরে সরাসরি', type: 'video', thumbnail: 'https://picsum.photos/seed/work7a/400/300', duration: '14:22' },
      { id: 'sw7b', title: 'Dotara Improvisation', titleBN: 'দোতারার তাৎক্ষণিক সুর', type: 'song', thumbnail: 'https://picsum.photos/seed/work7b/400/300', duration: '9:08' },
      { id: 'sw7c', title: 'Eki Labonye Purno Praan', titleBN: 'একী লাবণ্যে পূর্ণ প্রাণ', type: 'song', thumbnail: 'https://picsum.photos/seed/work7c/400/300', duration: '7:35' }
    ]
  },
  {
    id: '8',
    name: 'Purnima Das',
    nameBN: 'পূর্ণিমা দাস',
    description: 'An acclaimed Bhatiali vocalist from Namkhana who grew up listening to the fishermen\'s songs on the Bay of Bengal shore. Purnima has recorded over 200 traditional Bhatiali compositions for the Sundargaan archive and collaborates with young musicians to keep the tradition alive in the digital age.',
    descriptionBN: 'নামখানার একজন প্রশংসিত ভাটিয়ালি কণ্ঠশিল্পী যিনি বঙ্গোপসাগরের তীরে জেলেদের গান শুনে বড় হয়েছেন। পূর্ণিমা সুন্দরগান আর্কাইভের জন্য ২০০টিরও বেশি ঐতিহ্যবাহী ভাটিয়ালি রচনা রেকর্ড করেছেন।',
    famousSong: 'Dariya Paar Hobo Re',
    famousSongBN: 'দরিয়া পার হবো রে',
    address: 'Namkhana, South 24 Parganas',
    addressBN: 'নামখানা, দক্ষিণ ২৪ পরগনা',
    village: 'Namkhana',
    villageBN: 'নামখানা',
    post: 'Namkhana',
    postBN: 'নামখানা',
    block: 'Namkhana',
    category: 'bhatiyali',
    image: 'https://picsum.photos/seed/artist8/800/800',
    tags: ['Bhatiali', 'Archive', 'Bay of Bengal', 'Vocalist'],
    tagsBN: ['ভাটিয়ালি', 'আর্কাইভ', 'বঙ্গোপসাগর', 'কণ্ঠশিল্পী'],
    instruments: ['Voice', 'Bansuri', 'Harmonium'],
    instrumentsBN: ['কণ্ঠ', 'বাঁশুরি', 'হারমোনিয়াম'],
    experience: 15,
    availability: true,
    phone: '+91 93390 88008',
    email: 'purnima.das@sundargaan.in',
    sampleWorks: [
      { id: 'sw8a', title: 'Dariya Paar Hobo Re', titleBN: 'দরিয়া পার হবো রে', type: 'video', thumbnail: 'https://picsum.photos/seed/work8a/400/300', duration: '6:48' },
      { id: 'sw8b', title: 'Sei Kobe Jabo', titleBN: 'সেই কবে যাবো', type: 'song', thumbnail: 'https://picsum.photos/seed/work8b/400/300', duration: '5:25' },
      { id: 'sw8c', title: 'Bhatiali Archive Session', titleBN: 'ভাটিয়ালি আর্কাইভ সেশন', type: 'video', thumbnail: 'https://picsum.photos/seed/work8c/400/300', duration: '10:12' }
    ]
  }
];
