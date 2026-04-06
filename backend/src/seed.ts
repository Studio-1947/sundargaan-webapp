/**
 * Seed script — run with:
 *   npx ts-node -r tsconfig-paths/register src/seed.ts
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

// ─── Artist seed data (mapped to backend enum values) ────────────────────────

const ARTISTS_SEED = [
  {
    name: 'Sanatan Das',
    nameBn: 'সনাতন দাস',
    category: 'baul' as const,
    block: 'Hingalganj',
    address: 'Hingalganj, North 24 Parganas',
    addressBn: 'হিঙ্গলগঞ্জ, উত্তর ২৪ পরগনা',
    description: 'A legendary Baul singer from the heart of the Sundarbans, Sanatan Das has spent over 35 years wandering the delta regions, carrying the mystical philosophy of the Bauls through his soul-stirring Ektara performances.',
    descriptionBn: 'সুন্দরবনের হৃদয় থেকে উঠে আসা এক কিংবদন্তি বাউল গায়ক, সনাতন দাস ৩৫ বছরেরও বেশি সময় ধরে বদ্বীপ অঞ্চলে ঘুরে বেড়াচ্ছেন, তাঁর প্রাণস্পর্শী একতারা পরিবেশনার মাধ্যমে বাউলদের রহস্যময় দর্শন বহন করে চলেছেন।',
    famousSong: 'Khachar Bhitor Achin Pakhi',
    famousSongBn: 'খাঁচার ভিতর অচিন পাখি',
    instruments: ['Ektara', 'Dotara', 'Khamak'],
    instrumentsBn: ['একতারা', 'দোতারা', 'খমক'],
    tags: ['Legend', 'Ektara', 'Folk', 'Mystical'],
    tagsBn: ['কিংবদন্তি', 'একতারা', 'লোকগান', 'আধ্যাত্মিক'],
    experience: 35,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist1/800/800',
    phone: '+91 98300 11001',
    email: 'sanatan.baul@sundargaan.in',
    sampleWorks: [
      { title: 'Khachar Bhitor Achin Pakhi', titleBn: 'খাঁচার ভিতর অচিন পাখি', type: 'song', mediaUrl: 'https://picsum.photos/seed/work1a/400/300', thumbnail: 'https://picsum.photos/seed/work1a/400/300', duration: '7:42' },
      { title: 'Ami Kothai Pabo Tare', titleBn: 'আমি কোথায় পাবো তারে', type: 'video', mediaUrl: 'https://picsum.photos/seed/work1b/400/300', thumbnail: 'https://picsum.photos/seed/work1b/400/300', duration: '5:18' },
      { title: 'Pagla Hawar Badol Dine', titleBn: 'পাগলা হাওয়ার বাদল দিনে', type: 'song', mediaUrl: 'https://picsum.photos/seed/work1c/400/300', thumbnail: 'https://picsum.photos/seed/work1c/400/300', duration: '6:55' },
    ],
  },
  {
    name: 'Rina Mondal',
    nameBn: 'রীনা মন্ডল',
    category: 'folk_singer' as const,
    block: 'Gosaba',
    address: 'Gosaba, South 24 Parganas',
    addressBn: 'গোসাবা, দক্ষিণ ২৪ পরগনা',
    description: 'A master of Bhatiali — the soulful songs of the Sundarbans boatmen — Rina Mondal has spent over two decades documenting and performing the melodies that float along the tidal rivers of the delta.',
    descriptionBn: 'ভাটিয়ালি সংগীতের একজন ওস্তাদ শিল্পী — সুন্দরবনের নৌকার মাঝিদের আত্মিক গান — রীনা মন্ডল দুই দশকেরও বেশি সময় ধরে বদ্বীপের জোয়ার-ভাটার নদী বরাবর ভেসে আসা সুরগুলো নথিবদ্ধ করে চলেছেন।',
    famousSong: 'Amay Bhasaili Re',
    famousSongBn: 'আমায় ভাসাইলি রে',
    instruments: ['Voice', 'Harmonium', 'Tabla'],
    instrumentsBn: ['কণ্ঠ', 'হারমোনিয়াম', 'তবলা'],
    tags: ['Bhatiali', 'River Songs', 'Traditional', 'Vocalist'],
    tagsBn: ['ভাটিয়ালি', 'নদীর গান', 'ঐতিহ্যবাহী', 'কণ্ঠশিল্পী'],
    experience: 22,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist2/800/800',
    phone: '+91 94330 22002',
    email: 'rina.mondal@sundargaan.in',
    sampleWorks: [
      { title: 'Amay Bhasaili Re', titleBn: 'আমায় ভাসাইলি রে', type: 'video', mediaUrl: 'https://picsum.photos/seed/work2a/400/300', thumbnail: 'https://picsum.photos/seed/work2a/400/300', duration: '8:10' },
      { title: 'Nodi Bhore Jol', titleBn: 'নদী ভরে জল', type: 'song', mediaUrl: 'https://picsum.photos/seed/work2b/400/300', thumbnail: 'https://picsum.photos/seed/work2b/400/300', duration: '4:45' },
      { title: 'Maajhi Nao Bao Re', titleBn: 'মাঝি নাও বাও রে', type: 'song', mediaUrl: 'https://picsum.photos/seed/work2c/400/300', thumbnail: 'https://picsum.photos/seed/work2c/400/300', duration: '6:20' },
    ],
  },
  {
    name: 'Gopal Pramanik',
    nameBn: 'গোপাল প্রামাণিক',
    category: 'craft_artisan' as const,
    block: 'Basanti',
    address: 'Basanti, South 24 Parganas',
    addressBn: 'বাসন্তী, দক্ষিণ ২৪ পরগনা',
    description: 'A traditional potter from Basanti whose clay works are infused with the rhythms of Sundarbans folk music. Gopal creates ritual vessels and musical instruments from local clay.',
    descriptionBn: 'বাসন্তীর একজন ঐতিহ্যবাহী কুমোর যার মাটির শিল্পকর্মে সুন্দরবনের লোকসংগীতের ছন্দ মিশে আছে।',
    famousSong: 'Mati-r Chanda (Clay Rhythm)',
    famousSongBn: 'মাটির ছন্দ',
    instruments: ['Clay Pot Percussion', 'Dhak', 'Madol'],
    instrumentsBn: ['মাটির পাত্রের তাল', 'ঢাক', 'মাদল'],
    tags: ['Pottery', 'Clay Art', 'Craft', 'Percussion'],
    tagsBn: ['মৃৎশিল্প', 'মাটির শিল্প', 'কারুশিল্প', 'তাল'],
    experience: 28,
    availability: false,
    imageUrl: 'https://picsum.photos/seed/artist3/800/800',
    phone: '+91 90510 33003',
    email: 'gopal.pramanik@sundargaan.in',
    sampleWorks: [
      { title: 'Clay Pot Rhythm Demo', titleBn: 'মাটির পাত্রের তাল প্রদর্শনী', type: 'video', mediaUrl: 'https://picsum.photos/seed/work3a/400/300', thumbnail: 'https://picsum.photos/seed/work3a/400/300', duration: '3:30' },
      { title: 'Ritual Vessel Collection', titleBn: 'আচার-পাত্রের সংগ্রহ', type: 'craft', mediaUrl: 'https://picsum.photos/seed/work3b/400/300', thumbnail: 'https://picsum.photos/seed/work3b/400/300' },
      { title: 'Mangrove Motif Pottery', titleBn: 'ম্যানগ্রোভ নকশার মৃৎপাত্র', type: 'craft', mediaUrl: 'https://picsum.photos/seed/work3c/400/300', thumbnail: 'https://picsum.photos/seed/work3c/400/300' },
    ],
  },
  {
    name: 'Anjali Baul',
    nameBn: 'অঞ্জলি বাউল',
    category: 'dancer' as const,
    block: 'Sandeshkhali I',
    address: 'Sandeshkhali I, North 24 Parganas',
    addressBn: 'সন্দেশখালি ১, উত্তর ২৪ পরগনা',
    description: 'Specializing in Jhumur — the vibrant dance-song form of the Sundarbans adivasi communities — Anjali is a pillar of the Sandeshkhali cultural scene.',
    descriptionBn: 'ঝুমুর — সুন্দরবনের আদিবাসী সম্প্রদায়ের প্রাণবন্ত নৃত্য-গানের রূপ — বিশেষজ্ঞ হিসেবে অঞ্জলি সন্দেশখালির সাংস্কৃতিক জীবনের একটি স্তম্ভ।',
    famousSong: 'Jhumur Nach — Bonbibi Vandana',
    famousSongBn: 'ঝুমুর নাচ — বনবিবি বন্দনা',
    instruments: ['Voice', 'Madol', 'Nagara'],
    instrumentsBn: ['কণ্ঠ', 'মাদল', 'নাগারা'],
    tags: ['Jhumur', 'Dance', 'Adivasi Culture', 'Teacher'],
    tagsBn: ['ঝুমুর', 'নৃত্য', 'আদিবাসী সংস্কৃতি', 'শিক্ষক'],
    experience: 18,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist4/800/800',
    phone: '+91 97320 44004',
    email: 'anjali.jhumur@sundargaan.in',
    sampleWorks: [
      { title: 'Bonbibi Vandana — Live', titleBn: 'বনবিবি বন্দনা — সরাসরি', type: 'video', mediaUrl: 'https://picsum.photos/seed/work4a/400/300', thumbnail: 'https://picsum.photos/seed/work4a/400/300', duration: '9:22' },
      { title: 'Jhumur Teaching Session', titleBn: 'ঝুমুর শিক্ষা অধিবেশন', type: 'video', mediaUrl: 'https://picsum.photos/seed/work4b/400/300', thumbnail: 'https://picsum.photos/seed/work4b/400/300', duration: '12:05' },
      { title: 'Rangilo Re Jhumur', titleBn: 'রঙিলো রে ঝুমুর', type: 'song', mediaUrl: 'https://picsum.photos/seed/work4c/400/300', thumbnail: 'https://picsum.photos/seed/work4c/400/300', duration: '5:48' },
    ],
  },
  {
    name: 'Kartik Sardar',
    nameBn: 'কার্তিক সর্দার',
    category: 'storyteller' as const,
    block: 'Sagar',
    address: 'Sagar Island, South 24 Parganas',
    addressBn: 'সাগর দ্বীপ, দক্ষিণ ২৪ পরগনা',
    description: 'One of the last great oral storytellers of the Sundarbans, Kartik Sardar weaves together the myths of Bon Bibi, Dakshin Rai, and the tiger spirits into epic narrative performances lasting hours.',
    descriptionBn: 'সুন্দরবনের শেষ মহান মৌখিক গল্পকারদের একজন, কার্তিক সর্দার বনবিবি, দক্ষিণ রায় এবং বাঘের আত্মার পৌরাণিক কাহিনী একসাথে বুনে ঘণ্টার পর ঘণ্টা মহাকাব্যিক আখ্যান পরিবেশন করেন।',
    famousSong: 'Bonbibi Johuranama (Epic Ballad)',
    famousSongBn: 'বনবিবি জহুরানামা (মহাকাব্যিক সংগীত)',
    instruments: ['Voice', 'Kashi', 'Khol'],
    instrumentsBn: ['কণ্ঠ', 'কাশি', 'খোল'],
    tags: ['Oral History', 'Epic', 'Mythology', 'Panchali'],
    tagsBn: ['মৌখিক ইতিহাস', 'মহাকাব্য', 'পৌরাণিক কাহিনী', 'পাঁচালি'],
    experience: 40,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist5/800/800',
    phone: '+91 96740 55005',
    email: 'kartik.sardar@sundargaan.in',
    sampleWorks: [
      { title: 'Bonbibi Johuranama Part I', titleBn: 'বনবিবি জহুরানামা — প্রথম পর্ব', type: 'video', mediaUrl: 'https://picsum.photos/seed/work5a/400/300', thumbnail: 'https://picsum.photos/seed/work5a/400/300', duration: '18:40' },
      { title: 'Dakshin Rai Katha', titleBn: 'দক্ষিণ রায় কথা', type: 'song', mediaUrl: 'https://picsum.photos/seed/work5b/400/300', thumbnail: 'https://picsum.photos/seed/work5b/400/300', duration: '11:15' },
      { title: 'Tiger Spirit Narratives', titleBn: 'বাঘের আত্মার কথা', type: 'video', mediaUrl: 'https://picsum.photos/seed/work5c/400/300', thumbnail: 'https://picsum.photos/seed/work5c/400/300', duration: '22:30' },
    ],
  },
  {
    name: 'Maya Debnath',
    nameBn: 'মায়া দেবনাথ',
    category: 'craft_artisan' as const,
    block: 'Kultali',
    address: 'Kultali, South 24 Parganas',
    addressBn: 'কুলতলি, দক্ষিণ ২৪ পরগনা',
    description: 'A master weaver from Kultali who creates traditional Tant sarees with motifs inspired by the Sundarbans ecosystem — tigers, mangroves, kingfishers, and tidal waves.',
    descriptionBn: 'কুলতলির একজন ওস্তাদ তাঁতি যিনি সুন্দরবনের বাস্তুতন্ত্র থেকে অনুপ্রাণিত নকশায় ঐতিহ্যবাহী তাঁত শাড়ি ও কাপড় তৈরি করেন।',
    famousSong: 'Loom Song of the Delta',
    famousSongBn: 'বদ্বীপের তাঁতের গান',
    instruments: ['Loom', 'Handloom', 'Charkha'],
    instrumentsBn: ['তাঁত', 'হ্যান্ডলুম', 'চরকা'],
    tags: ['Tant Weaving', 'Textile', 'Craft Revival', 'Sundarbans Motifs'],
    tagsBn: ['তাঁত বয়ন', 'বস্ত্র', 'শিল্প পুনরুজ্জীবন', 'সুন্দরবনের নকশা'],
    experience: 25,
    availability: false,
    imageUrl: 'https://picsum.photos/seed/artist6/800/800',
    phone: '+91 98010 66006',
    email: 'maya.weaver@sundargaan.in',
    sampleWorks: [
      { title: 'Tiger Motif Tant Saree', titleBn: 'বাঘের নকশার তাঁত শাড়ি', type: 'craft', mediaUrl: 'https://picsum.photos/seed/work6a/400/300', thumbnail: 'https://picsum.photos/seed/work6a/400/300' },
      { title: 'Mangrove Pattern Weave', titleBn: 'ম্যানগ্রোভ নকশার বয়ন', type: 'craft', mediaUrl: 'https://picsum.photos/seed/work6b/400/300', thumbnail: 'https://picsum.photos/seed/work6b/400/300' },
      { title: 'Weaving Process Documentary', titleBn: 'বয়ন প্রক্রিয়ার তথ্যচিত্র', type: 'video', mediaUrl: 'https://picsum.photos/seed/work6c/400/300', thumbnail: 'https://picsum.photos/seed/work6c/400/300', duration: '8:55' },
    ],
  },
  {
    name: 'Suresh Halder',
    nameBn: 'সুরেশ হালদার',
    category: 'baul' as const,
    block: 'Canning',
    address: 'Canning, South 24 Parganas',
    addressBn: 'ক্যানিং, দক্ষিণ ২৪ পরগনা',
    description: 'A wandering Baul saint whose music journeys from introspective spiritual questions to joyful celebrations of nature. Suresh is known for his mastery of the Dotara.',
    descriptionBn: 'একজন পথচলা বাউল সাধু যার সংগীত আত্মিক প্রশ্নের অন্তর্মুখী চিন্তা থেকে প্রকৃতির আনন্দময় উদযাপনে পরিভ্রমণ করে।',
    famousSong: 'Moner Manush — Fakiri Dhun',
    famousSongBn: 'মনের মানুষ — ফকিরি ধুন',
    instruments: ['Dotara', 'Ektara', 'Ananda Lahari'],
    instrumentsBn: ['দোতারা', 'একতারা', 'আনন্দলহরী'],
    tags: ['Baul', 'Fakiri', 'Dotara', 'Sufi Influence'],
    tagsBn: ['বাউল', 'ফকিরি', 'দোতারা', 'সুফি প্রভাব'],
    experience: 30,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist7/800/800',
    phone: '+91 99030 77007',
    email: 'suresh.baul@sundargaan.in',
    sampleWorks: [
      { title: 'Moner Manush — Live at Sagar', titleBn: 'মনের মানুষ — সাগরে সরাসরি', type: 'video', mediaUrl: 'https://picsum.photos/seed/work7a/400/300', thumbnail: 'https://picsum.photos/seed/work7a/400/300', duration: '14:22' },
      { title: 'Dotara Improvisation', titleBn: 'দোতারার তাৎক্ষণিক সুর', type: 'song', mediaUrl: 'https://picsum.photos/seed/work7b/400/300', thumbnail: 'https://picsum.photos/seed/work7b/400/300', duration: '9:08' },
      { title: 'Eki Labonye Purno Praan', titleBn: 'একী লাবণ্যে পূর্ণ প্রাণ', type: 'song', mediaUrl: 'https://picsum.photos/seed/work7c/400/300', thumbnail: 'https://picsum.photos/seed/work7c/400/300', duration: '7:35' },
    ],
  },
  {
    name: 'Purnima Das',
    nameBn: 'পূর্ণিমা দাস',
    category: 'folk_singer' as const,
    block: 'Namkhana',
    address: 'Namkhana, South 24 Parganas',
    addressBn: 'নামখানা, দক্ষিণ ২৪ পরগনা',
    description: 'An acclaimed Bhatiali vocalist from Namkhana who grew up listening to the fishermen\'s songs on the Bay of Bengal shore. Purnima has recorded over 200 traditional Bhatiali compositions for the Sundargaan archive.',
    descriptionBn: 'নামখানার একজন প্রশংসিত ভাটিয়ালি কণ্ঠশিল্পী যিনি বঙ্গোপসাগরের তীরে জেলেদের গান শুনে বড় হয়েছেন।',
    famousSong: 'Dariya Paar Hobo Re',
    famousSongBn: 'দরিয়া পার হবো রে',
    instruments: ['Voice', 'Bansuri', 'Harmonium'],
    instrumentsBn: ['কণ্ঠ', 'বাঁশুরি', 'হারমোনিয়াম'],
    tags: ['Bhatiali', 'Archive', 'Bay of Bengal', 'Vocalist'],
    tagsBn: ['ভাটিয়ালি', 'আর্কাইভ', 'বঙ্গোপসাগর', 'কণ্ঠশিল্পী'],
    experience: 15,
    availability: true,
    imageUrl: 'https://picsum.photos/seed/artist8/800/800',
    phone: '+91 93390 88008',
    email: 'purnima.das@sundargaan.in',
    sampleWorks: [
      { title: 'Dariya Paar Hobo Re', titleBn: 'দরিয়া পার হবো রে', type: 'video', mediaUrl: 'https://picsum.photos/seed/work8a/400/300', thumbnail: 'https://picsum.photos/seed/work8a/400/300', duration: '6:48' },
      { title: 'Sei Kobe Jabo', titleBn: 'সেই কবে যাবো', type: 'song', mediaUrl: 'https://picsum.photos/seed/work8b/400/300', thumbnail: 'https://picsum.photos/seed/work8b/400/300', duration: '5:25' },
      { title: 'Bhatiali Archive Session', titleBn: 'ভাটিয়ালি আর্কাইভ সেশন', type: 'video', mediaUrl: 'https://picsum.photos/seed/work8c/400/300', thumbnail: 'https://picsum.photos/seed/work8c/400/300', duration: '10:12' },
    ],
  },
];

// ─── Archive seed data ────────────────────────────────────────────────────────

const ARCHIVE_SEED = [
  { title: 'Traditional Bamboo Basi', titleBn: 'ঐতিহ্যবাহী বাঁশের বাঁশি', description: 'A hand-crafted flute used in Bhatiali songs, made from local bamboo of the Sundarbans region.', descriptionBn: 'ভাটিয়ালি গানে ব্যবহৃত হাতে তৈরি বাঁশি।', category: 'artefacts' as const, subcategory: 'Basi', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch1/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch1/400/400', tags: ['Instrument', 'Music', 'Bamboo'], isPublished: true },
  { title: 'Ceremonial Master Basi', titleBn: 'আনুষ্ঠানিক বাঁশি', description: 'A long, heavy-tone flute used only for ceremonial arrivals and spiritual performances.', descriptionBn: 'একটি দীর্ঘ, ভারী সুরের বাঁশি যা কেবলমাত্র আনুষ্ঠানিক পরিবেশনায় ব্যবহৃত হয়।', category: 'artefacts' as const, subcategory: 'Basi', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch2/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch2/400/400', tags: ['Ceremonial', 'Wood', 'Spiritual'], isPublished: true },
  { title: 'Wooden Dotara', titleBn: 'কাঠের দোতারা', description: 'A four-stringed instrument essential for Baul and folk music, carved with intricate details.', descriptionBn: 'বাউল ও লোকসংগীতের জন্য অপরিহার্য চার-তারের যন্ত্র।', category: 'artefacts' as const, subcategory: 'Dotara', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch3/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch3/400/400', tags: ['Instrument', 'Folk', 'String'], isPublished: true },
  { title: 'Master Carver Dotara', titleBn: 'মাস্টার কারভার দোতারা', description: 'A professional-grade Dotara featuring rosewood construction and ivory-style inlay.', descriptionBn: 'পেশাদার মানের দোতারা, গোলাপকাঠের তৈরি।', category: 'artefacts' as const, subcategory: 'Dotara', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch4/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch4/400/400', tags: ['Professional', 'Rosewood', 'Folk'], isPublished: true },
  { title: 'Hingalganj Clay Pottery', titleBn: 'হিঙ্গলগঞ্জের মাটির পাত্র', description: 'Unique pottery styles from the Hingalganj block, known for their durable and earthy finish.', descriptionBn: 'হিঙ্গলগঞ্জ ব্লকের অনন্য মৃৎশিল্প।', category: 'artists' as const, subcategory: 'Hingalganj', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch5/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch5/400/400', tags: ['Craft', 'Pottery', 'Local'], isPublished: true },
  { title: 'Gosaba Boat Song Heritage', titleBn: 'গোসাবার নৌকার গানের ঐতিহ্য', description: 'Documenting the boat song tradition of Gosaba fishermen communities.', descriptionBn: 'গোসাবার মৎস্যজীবী সম্প্রদায়ের নৌকার গানের ঐতিহ্য।', category: 'artists' as const, subcategory: 'Gosaba', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch6/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch6/400/400', tags: ['Heritage', 'Boat Songs', 'Community'], isPublished: true },
  { title: 'Bhatiali Boat Songs', titleBn: 'ভাটিয়ালি নৌকার গান', description: 'The soul of the river — songs sung by boatmen while navigating the complex waters of the delta.', descriptionBn: 'নদীর আত্মা — বদ্বীপের জটিল জলপথে নৌকা চালাতে চালাতে মাঝিদের গাওয়া গান।', category: 'art_forms' as const, subcategory: 'Bhatiali', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch7/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch7/400/400', tags: ['Song', 'River', 'Oral Tradition'], isPublished: true },
  { title: 'Baul Philosophy in Song', titleBn: 'গানে বাউল দর্শন', description: 'The mystical Baul tradition of Bengal — songs that bridge the earthly and the divine.', descriptionBn: 'বাংলার রহস্যময় বাউল ঐতিহ্য — যে গান পার্থিব ও দিব্যের মধ্যে সেতুবন্ধন করে।', category: 'art_forms' as const, subcategory: 'Baul', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch8/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch8/400/400', tags: ['Baul', 'Philosophy', 'Mystic'], isPublished: true },
  { title: 'Bonbibi Palagaan Performance', titleBn: 'বনবিবি পালাগান পরিবেশনা', description: 'The epic narrative song form telling the legend of Bonbibi, protector of the Sundarbans.', descriptionBn: 'সুন্দরবনের রক্ষক বনবিবির কিংবদন্তি বর্ণনাকারী মহাকাব্যিক আখ্যান-গানের রূপ।', category: 'art_forms' as const, subcategory: 'Bonbibi Palagaon', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch9/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch9/400/400', tags: ['Epic', 'Narrative', 'Bonbibi', 'Sundarbans'], isPublished: true },
  { title: 'Jhumur Dance Form', titleBn: 'ঝুমুর নৃত্যের ধরন', description: 'The vibrant dance-song tradition of adivasi communities in the Sundarbans.', descriptionBn: 'সুন্দরবনের আদিবাসী সম্প্রদায়ের প্রাণবন্ত নৃত্য-গানের ঐতিহ্য।', category: 'art_forms' as const, subcategory: 'Jhumur', mediaType: 'image' as const, mediaUrl: 'https://picsum.photos/seed/arch10/600/600', thumbnailUrl: 'https://picsum.photos/seed/arch10/400/400', tags: ['Dance', 'Adivasi', 'Jhumur', 'Tradition'], isPublished: true },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Check if already seeded
  const existing = await db.query.artists.findMany({ limit: 1 });
  if (existing.length > 0) {
    console.log('⚠️  Artists table already has data. Skipping seed to avoid duplicates.');
    console.log('   To re-seed, clear the tables first.');
    await pool.end();
    return;
  }

  // Seed artists + sample works
  for (const { sampleWorks, ...artistData } of ARTISTS_SEED) {
    const [artist] = await db.insert(schema.artists).values(artistData).returning();
    console.log(`✓ Created artist: ${artist.name}`);

    if (sampleWorks.length > 0) {
      await db.insert(schema.artistSampleWorks).values(
        sampleWorks.map(w => ({ ...w, artistId: artist.id })),
      );
      console.log(`  └─ ${sampleWorks.length} sample works added`);
    }
  }

  // Seed archive items
  console.log('\n');
  for (const item of ARCHIVE_SEED) {
    await db.insert(schema.archiveItems).values(item);
    console.log(`✓ Created archive item: ${item.title}`);
  }

  console.log('\n✅ Seed complete!');
  await pool.end();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  pool.end();
  process.exit(1);
});
