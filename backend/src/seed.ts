/**
 * Seed script — run with:
 *   npx ts-node -r tsconfig-paths/register src/seed.ts
 *
 * This script:
 *   1. Clears existing data
 *   2. Inserts 38 real artists with Bengali translations (from ARTISTS_SEED)
 *   3. Inserts archive items from backend/flok_data.json
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

// ─── Helper: derive category from occupation / name ───────────────────────────

function deriveCategory(
  name: string,
  occupation: string,
): 'baul' | 'folk_singer' | 'instrumentalist' | 'dancer' | 'storyteller' | 'craft_artisan' {
  const n = name.toLowerCase();
  const o = occupation.toLowerCase();

  if (n.includes('bauliya') || n.includes('baul')) return 'baul';
  if (n.includes('gazi') || n.includes('gazi')) {
    // Muslim Gazi surnames in Sundarbans often belong to the Baul / Fakiri tradition
    return 'baul';
  }
  if (o.includes('sculptor') || o.includes('craft')) return 'craft_artisan';
  if (o.includes('dancer') || o.includes('dance')) return 'dancer';
  if (o.includes('storytell')) return 'storyteller';
  return 'folk_singer';
}

// ─── Helper: build description from available fields ─────────────────────────

function buildDescription(
  name: string,
  occupation: string,
  village: string,
  post: string,
  careOf: string,
  gurukul: string,
): string {
  const location = [village, post].filter(Boolean).join(', ');
  const locationStr = location ? `from ${location}` : 'from the Sundarbans region';
  const occupationStr = occupation && occupation !== 'Self' ? occupation : 'Artist';
  let desc = `${name} is a ${occupationStr.toLowerCase()} ${locationStr} who is an active folk-music practitioner of the Sundarbans tradition.`;
  if (gurukul && gurukul !== 'Self' && gurukul !== '') {
    desc += ` Trained under ${gurukul}.`;
  }
  if (careOf && careOf !== '') {
    desc += ` Care of: ${careOf}.`;
  }
  return desc;
}

// ─── Helper: build address ────────────────────────────────────────────────────

function buildAddress(village: string, post: string): string {
  if (!village && !post) return 'Sundarbans, West Bengal';
  if (village === post) return village;
  return [village, post].filter(Boolean).join(', ') || 'Sundarbans, West Bengal';
}

// ─── Real artist data from data.json ─────────────────────────────────────────

const ARTISTS_SEED = [
  {
    name: 'Sneha Howli',
    nameBn: 'স্নেহা হাউলি',
    category: deriveCategory('Sneha Howli', 'Student'),
    block: 'Sandeshkhali I',
    address: buildAddress('East Khejur Beria', 'East Khejur Beria'),
    addressBn: 'পূর্ব খেজুর বেড়িয়া',
    description: buildDescription('Sneha Howli', 'Student', 'East Khejur Beria', 'East Khejur Beria', 'Showmen', 'Rafikul Islam Gazi'),
    descriptionBn: 'স্নেহা হাউলি পূর্ব খেজুর বেড়িয়ার একজন শিক্ষার্থী লোকশিল্পী। গুরু রফিকুল ইসলাম গাজির কাছে প্রশিক্ষণ নিচ্ছেন।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Student', 'Sundarbans'],
    tagsBn: ['লোকগান', 'শিক্ষার্থী', 'সুন্দরবন'],
    experience: 0,
    availability: true,
    imageUrl: null,
    village: 'East Khejur Beria',
    villageBn: 'পূর্ব খেজুর বেড়িয়া',
    post: 'East Khejur Beria',
    postBn: 'পূর্ব খেজুর বেড়িয়া',
    phone: '+91 7044554897',
    email: null,
  },
  {
    name: 'Anushka Sarkar',
    nameBn: 'অনুষ্কা সরকার',
    category: deriveCategory('Anushka Sarkar', 'Student'),
    block: 'Sandeshkhali I',
    address: buildAddress('Shandeler Bil', 'Kanchanpur'),
    addressBn: 'শান্দেলের বিল, কাঞ্চনপুর',
    description: buildDescription('Anushka Sarkar', 'Student', 'Shandeler Bil', 'Kanchanpur', 'Anup', 'Rafikul Islam Gazi'),
    descriptionBn: 'অনুষ্কা সরকার শান্দেলের বিলের একজন শিক্ষার্থী লোকশিল্পী। গুরু রফিকুল ইসলাম গাজির কাছে প্রশিক্ষণ নিচ্ছেন।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Student', 'Sundarbans'],
    tagsBn: ['লোকগান', 'শিক্ষার্থী', 'সুন্দরবন'],
    experience: 0,
    availability: true,
    imageUrl: null,
    village: 'Shandeler Bil',
    villageBn: 'শান্দেলের বিল',
    post: 'Kanchanpur',
    postBn: 'কাঞ্চনপুর',
    phone: '+91 9088186542',
    email: null,
  },
  {
    name: 'Indrakshi Nayak',
    nameBn: 'ইন্দ্রাক্ষী নায়েক',
    category: deriveCategory('Indrakshi Nayak', 'Student'),
    block: 'Hasnabad',
    address: buildAddress('North Mamudpur', 'Taki Mamudpur'),
    addressBn: 'উত্তর মামুদপুর, তাকি মামুদপুর',
    description: buildDescription('Indrakshi Nayak', 'Student', 'North Mamudpur', 'Taki Mamudpur', 'Dhananjay', 'Rafikul Islam Gazi'),
    descriptionBn: 'ইন্দ্রাক্ষী নায়েক উত্তর মামুদপুরের একজন শিক্ষার্থী লোকশিল্পী। গুরু রফিকুল ইসলাম গাজির কাছে প্রশিক্ষণ নিচ্ছেন।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Student', 'Sundarbans'],
    tagsBn: ['লোকগান', 'শিক্ষার্থী', 'সুন্দরবন'],
    experience: 0,
    availability: true,
    imageUrl: null,
    village: 'North Mamudpur',
    villageBn: 'উত্তর মামুদপুর',
    post: 'Taki Mamudpur',
    postBn: 'তাকি মামুদপুর',
    phone: '+91 9775586140',
    email: null,
  },
  {
    name: 'Mallika Mondal',
    nameBn: 'মল্লিকা মণ্ডল',
    category: deriveCategory('Mallika Mondal', 'House Wife'),
    block: 'Sandeshkhali I',
    address: buildAddress('Puber Gheri', 'East Khejur Beria'),
    addressBn: 'পুবের ঘেরি, পূর্ব খেজুর বেড়িয়া',
    description: buildDescription('Mallika Mondal', 'Folk Singer', 'Puber Gheri', 'East Khejur Beria', 'Pijush', 'Rafikul Islam Gazi'),
    descriptionBn: 'মল্লিকা মণ্ডল পুবের ঘেরির একজন লোকশিল্পী। গুরু রফিকুল ইসলাম গাজির কাছে প্রশিক্ষণ নিচ্ছেন।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 5,
    availability: true,
    imageUrl: null,
    village: 'Puber Gheri',
    villageBn: 'পুবের ঘেরি',
    post: 'East Khejur Beria',
    postBn: 'পূর্ব খেজুর বেড়িয়া',
    phone: '+91 9564542515',
    email: null,
  },
  {
    name: 'Rafikul Islam Gazi',
    nameBn: 'রফিকুল ইসলাম গাজি',
    category: 'baul' as const,
    block: 'Sandeshkhali I',
    address: buildAddress('Kanchanpur', 'Sandelerbil'),
    addressBn: 'কাঞ্চনপুর, শান্দেলেরবিল',
    description: buildDescription('Rafikul Islam Gazi', 'Farmer and Baul Singer', 'Kanchanpur', 'Sandelerbil', 'Nur Ali Gazi', 'Girendranath Mistry'),
    descriptionBn: 'রফিকুল ইসলাম গাজি কাঞ্চনপুরের একজন প্রবীণ বাউল শিল্পী। গিরেন্দ্রনাথ মিস্ত্রির শিষ্য এবং নিজেও একজন গুরু।',
    instruments: ['Ektara', 'Dotara'],
    instrumentsBn: ['একতারা', 'দোতারা'],
    tags: ['Baul', 'Guru', 'Folk', 'Sundarbans'],
    tagsBn: ['বাউল', 'গুরু', 'লোকগান', 'সুন্দরবন'],
    experience: 30,
    availability: true,
    imageUrl: null,
    village: 'Kanchanpur',
    villageBn: 'কাঞ্চনপুর',
    post: 'Sandelerbil',
    postBn: 'শান্দেলেরবিল',
    phone: '+91 9002859299',
    email: null,
  },
  {
    name: 'Atiyar Gazi',
    nameBn: 'আতিয়ার গাজি',
    category: 'baul' as const,
    block: 'Sandeshkhali I',
    address: buildAddress('Kanchanpur', 'Sandelerbil'),
    addressBn: 'কাঞ্চনপুর, শান্দেলেরবিল',
    description: buildDescription('Atiyar Gazi', 'Farmer and Baul Singer', 'Kanchanpur', 'Sandelerbil', 'Khanda Gazi', 'Girendranath Mistry'),
    descriptionBn: 'আতিয়ার গাজি কাঞ্চনপুরের ৮২ বছর বয়সী প্রবীণতম বাউল শিল্পীদের একজন। গিরেন্দ্রনাথ মিস্ত্রির শিষ্য।',
    instruments: ['Ektara'],
    instrumentsBn: ['একতারা'],
    tags: ['Baul', 'Elder', 'Tradition', 'Sundarbans'],
    tagsBn: ['বাউল', 'প্রবীণ', 'ঐতিহ্য', 'সুন্দরবন'],
    experience: 55,
    availability: false,
    imageUrl: null,
    village: 'Kanchanpur',
    villageBn: 'কাঞ্চনপুর',
    post: 'Sandelerbil',
    postBn: 'শান্দেলেরবিল',
    phone: '+91 9002859299',
    email: null,
  },
  {
    name: 'Suprabhat Mondal',
    nameBn: 'সুপ্রভাত মণ্ডল',
    category: deriveCategory('Suprabhat Mondal', 'Singer'),
    block: 'Sandeshkhali I',
    address: buildAddress('Kanchanpur', 'Shandelerbil'),
    addressBn: 'কাঞ্চনপুর, শান্দেলেরবিল',
    description: buildDescription('Suprabhat Mondal', 'Singer', 'Kanchanpur', 'Shandelerbil', 'Debnarayan', 'Self'),
    descriptionBn: 'সুপ্রভাত মণ্ডল কাঞ্চনপুরের একজন স্বশিক্ষিত লোকসংগীত শিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়ক', 'সুন্দরবন'],
    experience: 15,
    availability: true,
    imageUrl: null,
    village: 'Kanchanpur',
    villageBn: 'কাঞ্চনপুর',
    post: 'Shandelerbil',
    postBn: 'শান্দেলেরবিল',
    phone: '+91 9093779331',
    email: null,
  },
  {
    name: 'Debabrata Mondal',
    nameBn: 'দেবব্রত মণ্ডল',
    category: deriveCategory('Debabrata Mondal', 'Farmer'),
    block: 'Gosaba',
    address: buildAddress('Madhabkati', 'Madhabkati'),
    addressBn: 'মাধবকাটি',
    description: buildDescription('Debabrata Mondal', 'Farmer and Folk Artist', 'Madhabkati', 'Madhabkati', 'Bimal Mondal', ''),
    descriptionBn: 'দেবব্রত মণ্ডল মাধবকাটির একজন কৃষক ও লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Madhabkati',
    villageBn: 'মাধবকাটি',
    post: 'Madhabkati',
    postBn: 'মাধবকাটি',
    phone: '+91 9007554294',
    email: null,
  },
  {
    name: 'Suprava Mondal',
    nameBn: 'সুপ্রভা মণ্ডল',
    category: deriveCategory('Suprava Mondal', 'Student'),
    block: 'Gosaba',
    address: buildAddress('Ramapur', 'Ramapur'),
    addressBn: 'রামপুর',
    description: buildDescription('Suprava Mondal', 'Student', 'Ramapur', 'Ramapur', 'Prashanta Mondal', ''),
    descriptionBn: 'সুপ্রভা মণ্ডল রামপুরের একজন শিক্ষার্থী লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Student', 'Sundarbans'],
    tagsBn: ['লোকগান', 'শিক্ষার্থী', 'সুন্দরবন'],
    experience: 0,
    availability: true,
    imageUrl: null,
    village: 'Ramapur',
    villageBn: 'রামপুর',
    post: 'Ramapur',
    postBn: 'রামপুর',
    phone: '+91 9339655388',
    email: null,
  },
  {
    name: 'Ramkrishna Mondal',
    nameBn: 'রামকৃষ্ণ মণ্ডল',
    category: deriveCategory('Ramkrishna Mondal', 'Business'),
    block: 'Sundarbans',
    address: 'Sundarbans, West Bengal',
    addressBn: 'সুন্দরবন, পশ্চিমবঙ্গ',
    description: buildDescription('Ramkrishna Mondal', 'Folk Artist', '', '', 'Shibpada', ''),
    descriptionBn: 'রামকৃষ্ণ মণ্ডল সুন্দরবন অঞ্চলের একজন লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Sundarbans',
    villageBn: 'সুন্দরবন',
    post: 'Sundarbans',
    postBn: 'সুন্দরবন',
    phone: '+91 9679405501',
    email: null,
  },
  {
    name: 'Dhiraj Mondal',
    nameBn: 'ধীরাজ মণ্ডল',
    category: deriveCategory('Dhiraj Mondal', 'Farmer'),
    block: 'Sundarbans',
    address: 'Sundarbans, West Bengal',
    addressBn: 'সুন্দরবন, পশ্চিমবঙ্গ',
    description: buildDescription('Dhiraj Mondal', 'Farmer and Folk Artist', '', '', 'Bishnupada Mondal', ''),
    descriptionBn: 'ধীরাজ মণ্ডল সুন্দরবন অঞ্চলের একজন কৃষক ও লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 15,
    availability: true,
    imageUrl: null,
    village: 'Hingalganj',
    villageBn: 'হিঙ্গলগঞ্জ',
    post: 'Hingalganj',
    postBn: 'হিঙ্গলগঞ্জ',
    phone: '+91 9932932554',
    email: null,
  },
  {
    name: 'Moushumi Mondal',
    nameBn: 'মৌসুমী মণ্ডল',
    category: deriveCategory('Moushumi Mondal', 'House Wife'),
    block: 'Basanti',
    address: buildAddress('Uttor Gobindokati', 'Uttor Gobindokati'),
    addressBn: 'উত্তর গোবিন্দকাটি',
    description: buildDescription('Moushumi Mondal', 'Folk Artist', 'Uttor Gobindokati', 'Uttor Gobindokati', '', ''),
    descriptionBn: 'মৌসুমী মণ্ডল উত্তর গোবিন্দকাটির একজন লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Uttor Gobindokati',
    villageBn: 'উত্তর গোবিন্দকাটি',
    post: 'Uttor Gobindokati',
    postBn: 'উত্তর গোবিন্দকাটি',
    phone: '+91 8509276856',
    email: null,
  },
  {
    name: 'Manoranjan Mondal',
    nameBn: 'মনোরঞ্জন মণ্ডল',
    category: deriveCategory('Manoranjan Mondal', 'Farmer'),
    block: 'Hingalganj',
    address: buildAddress('Hemnagar', 'Hemnagar'),
    addressBn: 'হেমনগর',
    description: buildDescription('Manoranjan Mondal', 'Farmer and Folk Artist', 'Hemnagar', 'Hemnagar', 'Deben Mondal', ''),
    descriptionBn: 'মনোরঞ্জন মণ্ডল হেমনগরের একজন কৃষক ও লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Hemnagar',
    villageBn: 'হেমনগর',
    post: 'Hemnagar',
    postBn: 'হেমনগর',
    phone: '+91 9748415889',
    email: null,
  },
  {
    name: 'Paritosh Mondal',
    nameBn: 'পরিতোষ মণ্ডল',
    category: deriveCategory('Paritosh Mondal', 'Gig Worker'),
    block: 'Hingalganj',
    address: buildAddress('Kanaikati', 'East Deuli'),
    addressBn: 'কানাইকাটি, পূর্ব দেউলি',
    description: buildDescription('Paritosh Mondal', 'Folk Artist', 'Kanaikati', 'East Deuli', 'Satish Mondal', ''),
    descriptionBn: 'পরিতোষ মণ্ডল কানাইকাটির একজন লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Kanaikati',
    villageBn: 'কানাইকাটি',
    post: 'East Deuli',
    postBn: 'পূর্ব দেউলি',
    phone: '+91 9093073973',
    email: null,
  },
  {
    name: 'Jitendra Mondal',
    nameBn: 'জিতেন্দ্র মণ্ডল',
    category: deriveCategory('Jitendra Mondal', 'Gig Worker'),
    block: 'Hingalganj',
    address: buildAddress('Kanaikati', 'East Deuli'),
    addressBn: 'কানাইকাটি, পূর্ব দেউলি',
    description: buildDescription('Jitendra Mondal', 'Folk Artist', 'Kanaikati', 'East Deuli', 'Satish Mondal', ''),
    descriptionBn: 'জিতেন্দ্র মণ্ডল কানাইকাটির একজন লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Kanaikati',
    villageBn: 'কানাইকাটি',
    post: 'East Deuli',
    postBn: 'পূর্ব দেউলি',
    phone: '+91 7365980510',
    email: null,
  },
  {
    name: 'Kartik Munda',
    nameBn: 'কার্তিক মুন্ডা',
    category: 'dancer' as const,
    block: 'Basanti',
    address: buildAddress('Gobindokati', 'Sridharkati'),
    addressBn: 'গোবিন্দকাটি, শ্রীধরকাটি',
    description: buildDescription('Kartik Munda', 'Folk and Adivasi Artist', 'Gobindokati', 'Sridharkati', 'Kailash Munda', ''),
    descriptionBn: 'কার্তিক মুন্ডা গোবিন্দকাটির একজন আদিবাসী লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Adivasi', 'Dance', 'Folk', 'Sundarbans'],
    tagsBn: ['আদিবাসী', 'নৃত্য', 'লোকগান', 'সুন্দরবন'],
    experience: 25,
    availability: true,
    imageUrl: null,
    village: 'Gobindokati',
    villageBn: 'গোবিন্দকাটি',
    post: 'Sridharkati',
    postBn: 'শ্রীধরকাটি',
    phone: '+91 7364937687',
    email: null,
  },
  {
    name: 'Kanika Bauliya',
    nameBn: 'কানিকা বাউলিয়া',
    category: 'baul' as const,
    block: 'Gosaba',
    address: buildAddress('Parghumti', 'Parghumti'),
    addressBn: 'পারঘুমটি',
    description: buildDescription('Kanika Bauliya', 'Baul Singer', 'Parghumti', 'Parghumti', 'Rabindranath Bauliya', 'Self'),
    descriptionBn: 'কানিকা বাউলিয়া পারঘুমটির একজন বাউল গায়িকা। পারিবারিক বাউল ঐতিহ্যের বাহক।',
    instruments: ['Ektara', 'Dotara'],
    instrumentsBn: ['একতারা', 'দোতারা'],
    tags: ['Baul', 'Singer', 'Folk', 'Sundarbans'],
    tagsBn: ['বাউল', 'গায়িকা', 'লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Parghumti',
    villageBn: 'পারঘুমটি',
    post: 'Parghumti',
    postBn: 'পারঘুমটি',
    phone: '+91 7602112802',
    email: null,
  },
  {
    name: 'Shyamapada Mistri',
    nameBn: 'শ্যামাপদ মিস্ত্রি',
    category: 'craft_artisan' as const,
    block: 'Basanti',
    address: buildAddress('Shamsher Nagar', 'Shamsher Nagar'),
    addressBn: 'শামসের নগর',
    description: buildDescription('Shyamapada Mistri', 'Singer and Sculptor', 'Shamsher Nagar', 'Shamsher Nagar', 'Gokul Mistri', 'Self'),
    descriptionBn: 'শ্যামাপদ মিস্ত্রি শামসের নগরের একজন গায়ক ও ভাস্কর। লোকসংগীত ও কারুশিল্পের বিরল সমন্বয়।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Craft', 'Sculptor', 'Singer', 'Sundarbans'],
    tagsBn: ['কারুশিল্প', 'ভাস্কর', 'গায়ক', 'সুন্দরবন'],
    experience: 25,
    availability: true,
    imageUrl: null,
    village: 'Shamsher Nagar',
    villageBn: 'শামসের নগর',
    post: 'Shamsher Nagar',
    postBn: 'শামসের নগর',
    phone: '+91 7586925514',
    email: null,
  },
  {
    name: 'Nabamita Mondal',
    nameBn: 'নবমিতা মণ্ডল',
    category: deriveCategory('Nabamita Mondal', 'Singer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Nabamita Mondal', 'Folk Singer', 'Kalitala', 'Kalitala', 'Sujit Mondal', 'Self'),
    descriptionBn: 'নবমিতা মণ্ডল কালীতলার একজন লোকসংগীত শিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়িকা', 'সুন্দরবন'],
    experience: 5,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 7047608430',
    email: null,
  },
  {
    name: 'Putul Mondal',
    nameBn: 'পুতুল মণ্ডল',
    category: deriveCategory('Putul Mondal', 'Singer'),
    block: 'Basanti',
    address: buildAddress('Shamsher Nagar', 'Shamsher Nagar'),
    addressBn: 'শামসের নগর',
    description: buildDescription('Putul Mondal', 'Singer', 'Shamsher Nagar', 'Shamsher Nagar', 'Bidyut Raptan', 'Bishnupada Sarkar'),
    descriptionBn: 'পুতুল মণ্ডল শামসের নগরের একজন লোকসংগীত শিল্পী। বিষ্ণুপদ সরকারের শিষ্যা।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়িকা', 'সুন্দরবন'],
    experience: 8,
    availability: true,
    imageUrl: null,
    village: 'Shamsher Nagar',
    villageBn: 'শামসের নগর',
    post: 'Shamsher Nagar',
    postBn: 'শামসের নগর',
    phone: '+91 9635592664',
    email: null,
  },
  {
    name: 'Sujoy Parmanya',
    nameBn: 'সুজয় পারমান্য',
    category: deriveCategory('Sujoy Parmanya', 'Singer'),
    block: 'Gosaba',
    address: buildAddress('Madhabkati', 'Madhabkati'),
    addressBn: 'মাধবকাটি',
    description: buildDescription('Sujoy Parmanya', 'Folk Artist', 'Madhabkati', 'Madhabkati', 'Prakash Parmanya', 'Ramkrishna Mondal'),
    descriptionBn: 'সুজয় পারমান্য মাধবকাটির একজন লোকশিল্পী। রামকৃষ্ণ মণ্ডলের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Madhabkati',
    villageBn: 'মাধবকাটি',
    post: 'Madhabkati',
    postBn: 'মাধবকাটি',
    phone: '+91 7478132522',
    email: null,
  },
  {
    name: 'Pranab Sarkar',
    nameBn: 'প্রণব সরকার',
    category: 'storyteller' as const,
    block: 'Hingalganj',
    address: buildAddress('Kalitala, Haridashkathi', 'Kalitala, Haridashkathi'),
    addressBn: 'কালীতলা, হরিদাশকাটি',
    description: 'Pranab Sarkar is a seasoned folk singer and storyteller from Kalitala, Haridashkathi. With over four decades of experience, he is a self-made guru and keeper of the Sundarbans oral tradition.',
    descriptionBn: 'প্রণব সরকার কালীতলার একজন প্রবীণ লোকসংগীত শিল্পী ও গল্পকার। চার দশকেরও বেশি অভিজ্ঞতা সম্পন্ন একজন স্বশিক্ষিত গুরু।',
    instruments: ['Voice', 'Khol'],
    instrumentsBn: ['কণ্ঠ', 'খোল'],
    tags: ['Storyteller', 'Folk', 'Oral Tradition', 'Sundarbans'],
    tagsBn: ['গল্পকার', 'লোকগান', 'মৌখিক ঐতিহ্য', 'সুন্দরবন'],
    experience: 45,
    availability: true,
    imageUrl: null,
    village: 'Kalitala, Haridashkathi',
    villageBn: 'কালীতলা, হরিদাশকাটি',
    post: 'Kalitala, Haridashkathi',
    postBn: 'কালীতলা, হরিদাশকাটি',
    phone: '+91 8944034692',
    email: null,
  },
  {
    name: 'Santosh Tarafdar',
    nameBn: 'সন্তোষ তরফদার',
    category: deriveCategory('Santosh Tarafdar', 'Farmer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Santosh Tarafdar', 'Farmer and Folk Artist', 'Kalitala', 'Kalitala', 'Late Bashanta Tarafdar', 'Self'),
    descriptionBn: 'সন্তোষ তরফদার কালীতলার একজন কৃষক ও স্বশিক্ষিত লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 7063466358',
    email: null,
  },
  {
    name: 'Santosh Joddar',
    nameBn: 'সন্তোষ জোদ্দার',
    category: deriveCategory('Santosh Joddar', 'Singer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Santosh Joddar', 'Singer', 'Kalitala', 'Kalitala', 'Late Satish Joddar', 'Late Putin Behari Burman'),
    descriptionBn: 'সন্তোষ জোদ্দার কালীতলার একজন প্রবীণ লোকসংগীত শিল্পী। প্রয়াত পুতিন বিহারী বর্মনের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়ক', 'সুন্দরবন'],
    experience: 35,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 7602823748',
    email: null,
  },
  {
    name: 'Dhananjay Mondal',
    nameBn: 'ধনঞ্জয় মণ্ডল',
    category: deriveCategory('Dhananjay Mondal', 'Labour'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Dhananjay Mondal', 'Folk Artist', 'Kalitala', 'Kalitala', 'Brojun Mandal', 'Bishnupada Sarkar'),
    descriptionBn: 'ধনঞ্জয় মণ্ডল কালীতলার একজন লোকশিল্পী। বিষ্ণুপদ সরকারের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 15,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 7602823748',
    email: null,
  },
  {
    name: 'Subrata Mondal',
    nameBn: 'সুব্রত মণ্ডল',
    category: deriveCategory('Subrata Mondal', 'Singer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Subrata Mondal', 'Folk Artist', 'Kalitala', 'Kalitala', 'Late Niranjan Mandal', 'Self'),
    descriptionBn: 'সুব্রত মণ্ডল কালীতলার একজন স্বশিক্ষিত লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 8972761478',
    email: null,
  },
  {
    name: 'Dipankar Gayen',
    nameBn: 'দীপঙ্কর গায়েন',
    category: deriveCategory('Dipankar Gayen', 'Labour'),
    block: 'Gosaba',
    address: buildAddress('Malekan Ghumti', 'Malekan Ghumti'),
    addressBn: 'মালেকান ঘুমটি',
    description: buildDescription('Dipankar Gayen', 'Folk Artist', 'Malekan Ghumti', 'Malekan Ghumti', 'Late Harendranath Gayen', 'Self'),
    descriptionBn: 'দীপঙ্কর গায়েন মালেকান ঘুমটির একজন স্বশিক্ষিত লোকশিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 12,
    availability: true,
    imageUrl: null,
    village: 'Malekan Ghumti',
    villageBn: 'মালেকান ঘুমটি',
    post: 'Malekan Ghumti',
    postBn: 'মালেকান ঘুমটি',
    phone: '+91 9547272081',
    email: null,
  },
  {
    name: 'Biswajit Mondal',
    nameBn: 'বিশ্বজিৎ মণ্ডল',
    category: deriveCategory('Biswajit Mondal', 'Singer'),
    block: 'Gosaba',
    address: buildAddress('Malekan Ghumti', 'Malekan Ghumti'),
    addressBn: 'মালেকান ঘুমটি',
    description: buildDescription('Biswajit Mondal', 'Singer', 'Malekan Ghumti', 'Malekan Ghumti', 'Sudhir Krishna Mondal', 'Self'),
    descriptionBn: 'বিশ্বজিৎ মণ্ডল মালেকান ঘুমটির একজন লোকসংগীত শিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়ক', 'সুন্দরবন'],
    experience: 15,
    availability: true,
    imageUrl: null,
    village: 'Malekan Ghumti',
    villageBn: 'মালেকান ঘুমটি',
    post: 'Malekan Ghumti',
    postBn: 'মালেকান ঘুমটি',
    phone: '+91 8967318986',
    email: null,
  },
  {
    name: 'Sadananda Ray',
    nameBn: 'সদানন্দ রায়',
    category: deriveCategory('Sadananda Ray', 'Singer'),
    block: 'Gosaba',
    address: buildAddress('Malekan Ghumti', 'Malekan Ghumti'),
    addressBn: 'মালেকান ঘুমটি',
    description: buildDescription('Sadananda Ray', 'Singer', 'Malekan Ghumti', 'Malekan Ghumti', 'Bashak Ray', 'Self'),
    descriptionBn: 'সদানন্দ রায় মালেকান ঘুমটির একজন স্বশিক্ষিত লোকসংগীত শিল্পী।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়ক', 'সুন্দরবন'],
    experience: 12,
    availability: true,
    imageUrl: null,
    village: 'Malekan Ghumti',
    villageBn: 'মালেকান ঘুমটি',
    post: 'Malekan Ghumti',
    postBn: 'মালেকান ঘুমটি',
    phone: '+91 7584924400',
    email: null,
  },
  {
    name: 'Tapan Gayen',
    nameBn: 'তপন গায়েন',
    category: deriveCategory('Tapan Gayen', 'Singer'),
    block: 'Gosaba',
    address: buildAddress('Madhabkati', 'Madhabkati'),
    addressBn: 'মাধবকাটি',
    description: buildDescription('Tapan Gayen', 'Singer', 'Madhabkati', 'Madhabkati', 'Suhash Chandra Gayen', 'Late Bhupathi Mondal'),
    descriptionBn: 'তপন গায়েন মাধবকাটির একজন লোকসংগীত শিল্পী। প্রয়াত ভূপতি মণ্ডলের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়ক', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Madhabkati',
    villageBn: 'মাধবকাটি',
    post: 'Madhabkati',
    postBn: 'মাধবকাটি',
    phone: '+91 9635466948',
    email: null,
  },
  {
    name: 'Sabita Baidya',
    nameBn: 'সবিতা বৈদ্য',
    category: deriveCategory('Sabita Baidya', 'Singer'),
    block: 'Gosaba',
    address: buildAddress('Malekan Ghumti', 'Malekan Ghumti'),
    addressBn: 'মালেকান ঘুমটি',
    description: buildDescription('Sabita Baidya', 'Singer', 'Malekan Ghumti', 'Malekan Ghumti', 'Shwapan Baidya', 'Haripada Mondal'),
    descriptionBn: 'সবিতা বৈদ্য মালেকান ঘুমটির একজন লোকসংগীত শিল্পী। হরিপদ মণ্ডলের শিষ্যা।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়িকা', 'সুন্দরবন'],
    experience: 18,
    availability: true,
    imageUrl: null,
    village: 'Malekan Ghumti',
    villageBn: 'মালেকান ঘুমটি',
    post: 'Malekan Ghumti',
    postBn: 'মালেকান ঘুমটি',
    phone: '+91 8967047587',
    email: null,
  },
  {
    name: 'Ankana Mondal',
    nameBn: 'অঙ্কনা মণ্ডল',
    category: deriveCategory('Ankana Mondal', 'Student'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Ankana Mondal', 'Student', 'Kalitala', 'Kalitala', 'Palash Mondal', 'Palash Mondal'),
    descriptionBn: 'অঙ্কনা মণ্ডল কালীতলার একজন শিক্ষার্থী লোকশিল্পী। পলাশ মণ্ডলের শিষ্যা।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Student', 'Sundarbans'],
    tagsBn: ['লোকগান', 'শিক্ষার্থী', 'সুন্দরবন'],
    experience: 3,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 7439666455',
    email: null,
  },
  {
    name: 'Niva Mondal',
    nameBn: 'নিভা মণ্ডল',
    category: deriveCategory('Niva Mondal', 'Singer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Niva Mondal', 'Folk Artist', 'Kalitala', 'Kalitala', '', 'Palash Mondal'),
    descriptionBn: 'নিভা মণ্ডল কালীতলার একজন লোকশিল্পী। পলাশ মণ্ডলের শিষ্যা।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 10,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 8016933175',
    email: null,
  },
  {
    name: 'Aparna Sarkar Baidya',
    nameBn: 'অপর্ণা সরকার বৈদ্য',
    category: deriveCategory('Aparna Sarkar Baidya', 'Singer'),
    block: 'Namkhana',
    address: buildAddress('South Pathgada', 'South Pathgada'),
    addressBn: 'দক্ষিণ পাথগাড়া',
    description: buildDescription('Aparna Sarkar Baidya', 'Singer', 'South Pathgada', 'South Pathgada', 'Debdulal Baidya', 'Debdulal Baidya'),
    descriptionBn: 'অপর্ণা সরকার বৈদ্য দক্ষিণ পাথগাড়ার একজন লোকসংগীত শিল্পী। দেবদুলাল বৈদ্যের শিষ্যা।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গায়িকা', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'South Pathgada',
    villageBn: 'দক্ষিণ পাথগাড়া',
    post: 'South Pathgada',
    postBn: 'দক্ষিণ পাথগাড়া',
    phone: '+91 9800949434',
    email: null,
  },
  {
    name: 'Prabir Mondal',
    nameBn: 'প্রবীর মণ্ডল',
    category: deriveCategory('Prabir Mondal', 'Farmer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Prabir Mondal', 'Farmer and Folk Artist', 'Kalitala', 'Kalitala', 'Late Sasadhar Mondal', 'Palash Mondal'),
    descriptionBn: 'প্রবীর মণ্ডল কালীতলার একজন কৃষক ও লোকশিল্পী। পলাশ মণ্ডলের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 15,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 9733807362',
    email: null,
  },
  {
    name: 'Nur Hussain Gazi',
    nameBn: 'নুর হোসেন গাজি',
    category: 'baul' as const,
    block: 'Gosaba',
    address: buildAddress('Parghumti', 'Parghumti'),
    addressBn: 'পারঘুমটি',
    description: buildDescription('Nur Hussain Gazi', 'Baul Artist', 'Parghumti', 'Parghumti', 'Fazer Ali', 'Self'),
    descriptionBn: 'নুর হোসেন গাজি পারঘুমটির একজন বাউল শিল্পী।',
    instruments: ['Ektara'],
    instrumentsBn: ['একতারা'],
    tags: ['Baul', 'Folk', 'Sundarbans'],
    tagsBn: ['বাউল', 'লোকগান', 'সুন্দরবন'],
    experience: 20,
    availability: true,
    imageUrl: null,
    village: 'Parghumti',
    villageBn: 'পারঘুমটি',
    post: 'Parghumti',
    postBn: 'পারঘুমটি',
    phone: '+91 9679703035',
    email: null,
  },
  {
    name: 'Shibapada Mondal',
    nameBn: 'শিবপদ মণ্ডল',
    category: deriveCategory('Shibapada Mondal', 'Farmer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: buildDescription('Shibapada Mondal', 'Farmer and Folk Artist', 'Kalitala', 'Kalitala', 'Late Birendra Mondal', 'Rabin Chatterjee'),
    descriptionBn: 'শিবপদ মণ্ডল কালীতলার একজন কৃষক ও লোকশিল্পী। রবীন চট্টোপাধ্যায়ের শিষ্য।',
    instruments: [],
    instrumentsBn: [],
    tags: ['Folk', 'Sundarbans'],
    tagsBn: ['লোকগান', 'সুন্দরবন'],
    experience: 25,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 9800441227',
    email: null,
  },
  {
    name: 'Bishnupada Sarkar',
    nameBn: 'বিষ্ণুপদ সরকার',
    category: deriveCategory('Bishnupada Sarkar', 'Singer'),
    block: 'Hingalganj',
    address: buildAddress('Kalitala', 'Kalitala'),
    addressBn: 'কালীতলা',
    description: 'Bishnupada Sarkar is a veteran folk singer from Kalitala and a respected guru of the Sundarbans tradition. He is a self-made artist who has taught many of the region\'s active practitioners.',
    descriptionBn: 'বিষ্ণুপদ সরকার কালীতলার একজন প্রবীণ লোকসংগীত শিল্পী ও সম্মানিত গুরু। একজন স্বশিক্ষিত শিল্পী যিনি এই অঞ্চলের অনেক সক্রিয় শিল্পীকে প্রশিক্ষণ দিয়েছেন।',
    instruments: ['Voice', 'Harmonium'],
    instrumentsBn: ['কণ্ঠ', 'হারমোনিয়াম'],
    tags: ['Folk', 'Guru', 'Singer', 'Sundarbans'],
    tagsBn: ['লোকগান', 'গুরু', 'গায়ক', 'সুন্দরবন'],
    experience: 40,
    availability: true,
    imageUrl: null,
    village: 'Kalitala',
    villageBn: 'কালীতলা',
    post: 'Kalitala',
    postBn: 'কালীতলা',
    phone: '+91 8159845715',
    email: null,
  },
];


// ─── Flok Data Seeding ────────────────────────────────────────────────────────

interface FlokArtist {
  id: number;
  name: string;
  gram_panchayat: string;
  age: number;
  category: string;
}

async function seedArchiveFromFlok() {
  const flokPath = path.join(__dirname, '..', 'flok_data.json');
  if (!fs.existsSync(flokPath)) {
    console.warn(`⚠️  flok_data.json not found at ${flokPath}, skipping archive seeding.`);
    return;
  }
  const flokData = JSON.parse(fs.readFileSync(flokPath, 'utf-8')) as {
    total: number;
    artists: FlokArtist[];
  };

  console.log(`🎵 Seeding ${flokData.total} items to archive from flok_data.json...`);
  let inserted = 0;

  for (const a of flokData.artists) {
    await db.insert(schema.archiveItems).values({
      title: a.name,
      description: `${a.name} is a ${a.category} artist from ${a.gram_panchayat}.`,
      category: 'artists',
      subcategory: a.category,
      mediaType: 'image',
      mediaUrl: '', // Required
      location: a.gram_panchayat,
      tags: [a.category, a.gram_panchayat, 'Sundarbans'],
    });
    inserted++;
  }

  console.log(`  ✓ ${inserted} items added to archive.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ArtistMediaMapping {
  imageUrl: string | null;
  sampleWorks: {
    title: string;
    type: string;
    mediaUrl: string;
    thumbnail?: string;
    duration?: string;
  }[];
}

interface MediaMappings {
  artists: Record<string, ArtistMediaMapping>;
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  // Load Media Mappings
  const mappingPath = path.join(__dirname, '..', 'media_mappings.json');
  let mappings: MediaMappings = { artists: {} };
  if (fs.existsSync(mappingPath)) {
    console.log('📖 Loading media mappings...');
    mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  }

  // ── Step 1: Clear all tables in dependency order ──────────────────────────
  console.log('🗑️  Clearing existing data...');
  await db.delete(schema.bookings);
  await db.delete(schema.archiveItems);
  await db.delete(schema.artistSampleWorks);
  await db.delete(schema.artists);
  console.log('✓ All tables cleared.\n');

  // ── Step 2: Insert real artists ───────────────────────────────────────────
  console.log('👤 Inserting artists...');
  const artistMap = new Map<string, string>(); // name -> id

  for (const artistData of ARTISTS_SEED) {
    // Apply mapping if available
    const mapping = mappings.artists[artistData.name];
    if (mapping && mapping.imageUrl) {
      (artistData as any).imageUrl = mapping.imageUrl;
    }

    const [artist] = await db.insert(schema.artists).values(artistData).returning();
    artistMap.set(artist.name, artist.id);
    console.log(`  ✓ ${artist.name} (${artist.category})`);
  }

  console.log(`\n👤 Artists insertion complete. ${ARTISTS_SEED.length} artists inserted.`);

  // ── Step 2.5: Seed sample works ───────────────────────────────────────────
  console.log('\n🎵 Seeding sample works...');
  let sampleWorksCount = 0;
  for (const [artistName, mapping] of Object.entries(mappings.artists)) {
    const artistId = artistMap.get(artistName);
    if (artistId && mapping.sampleWorks && mapping.sampleWorks.length > 0) {
      for (const sw of mapping.sampleWorks) {
        await db.insert(schema.artistSampleWorks).values({
          artistId,
          title: sw.title,
          type: sw.type,
          mediaUrl: sw.mediaUrl,
          thumbnail: sw.thumbnail,
          duration: sw.duration,
        });
        sampleWorksCount++;
      }
    }
  }
  console.log(`  ✓ ${sampleWorksCount} sample works added.`);

  // ── Step 3: Seed archive items ───────────────────────────────────────────
  await seedArchiveFromFlok();

  console.log('\n✅ Seed complete!');
  console.log('📸 Persistent mapping applied from media_mappings.json\n');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  pool.end();
  process.exit(1);
});
