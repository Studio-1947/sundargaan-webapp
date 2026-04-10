// Import statement for category heroes
import artefactsHero from '../assets/archive/artefacts_hero.png';
import artistsHero from '../assets/archive/artists_hero.png';
import artFormsHero from '../assets/archive/art_forms_hero.png';

// Import statement for thumbnails
import artefactThumb from '../assets/archive/artefact_thumb.png';
import performingThumb from '../assets/archive/performing_art_thumb.png';
import potteryThumb from '../assets/archive/pottery_thumb.png';
import landscapeThumb from '../assets/archive/landscape_thumb.png';

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image';
  category: string; // 'artefacts' | 'artists' | 'art-forms'
  subcategory: string; // e.g., 'dotara', 'basi', 'Block A', etc.
  tags: string[];
}

export const ARCHIVE_CATEGORIES = [
  {
    id: 'artefacts',
    label: 'Cultural Artefacts',
    subcategories: ['Basi', 'Dotara', 'Traditional Tools', 'Handicrafts'],
    image: artefactsHero
  },
  {
    id: 'artists',
    label: "Local Artists",
    subcategories: ['Kalitala', 'Jogeshganj', 'Gobindakati', 'Sandelerbil', 'Sahebkhali', 'Durgamandap'],
    image: artistsHero
  },
  {
    id: FRONTEND_ARCHIVE_CATEGORY_BY_API.art_forms,
    label: 'Sacred Art Forms',
    subcategories: ['Bhatiyali', 'Baul', 'Palagan', 'Jhumur', 'Tusu', 'Folk Song'],
    image: artFormsHero
  }
];

const thumbs = [artefactThumb, performingThumb, potteryThumb, landscapeThumb];

// Define core items first to avoid circular reference
const CORE_ITEMS: ArchiveItem[] = [
  // Artefacts - Basi
  {
    id: 'basi-1',
    title: 'Traditional Bamboo Basi',
    description: 'A hand-crafted flute used in Bhatiali songs, made from local bamboo of the Sundarbans region.',
    mediaUrl: thumbs[0],
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Basi',
    tags: ['Instrument', 'Music', 'Bamboo']
  },
  {
    id: 'basi-2',
    title: 'Ceremonial Master Basi',
    description: 'A long, heavy-tone flute used only for ceremonial arrivals and spiritual performances.',
    mediaUrl: thumbs[1],
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Basi',
    tags: ['Ceremonial', 'Wood', 'Spiritual']
  },

  // Artefacts - Dotara
  {
    id: 'dotara-1',
    title: 'Wooden Dotara',
    description: 'A four-stringed instrument essential for Baul and folk music, carved with intricate details.',
    mediaUrl: thumbs[2],
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Dotara',
    tags: ['Instrument', 'Folk', 'String']
  },
  {
    id: 'dotara-2',
    title: 'Master Carver Dotara',
    description: 'A professional-grade Dotara featuring rosewood construction and ivory-style inlay.',
    mediaUrl: thumbs[3],
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Dotara',
    tags: ['Professional', 'Rosewood', 'Folk']
  },

  // Artists - Hingalganj
  {
    id: 'hingalganj-1',
    title: 'Hingalganj Clay Pottery',
    description: 'Unique pottery styles from the Hingalganj block, known for their durable and earthy finish.',
    mediaUrl: thumbs[2],
    mediaType: 'image',
    category: 'artists',
    subcategory: 'Hingalganj',
    tags: ['Craft', 'Pottery', 'Local']
  },

  // Art Forms - Bhatiali
  {
    id: 'bhatiali-1',
    title: 'Bhatiali Boat Songs',
    description: 'The soul of the river—songs sung by boatmen while navigating the complex waters of the delta.',
    mediaUrl: thumbs[0],
    mediaType: 'image',
    category: 'art-forms',
    subcategory: 'Bhatiali',
    tags: ['Song', 'River', 'Oral Tradition']
  }
];

// Combine with generated items
export const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  ...CORE_ITEMS,
  ...ARCHIVE_CATEGORIES.flatMap(cat => 
    cat.subcategories.flatMap((sub, subIdx) => 
      [1, 2, 3, 4, 5].map(i => ({
        id: `${cat.id}-${sub}-${i}`,
        title: `${sub} - Piece ${i}`,
        description: `Detailed archival documentation for an authentic ${sub} artefact or performance from the Sundarbans region.`,
        mediaUrl: thumbs[(subIdx + i) % thumbs.length],
        mediaType: 'image' as const,
        category: cat.id,
        subcategory: sub,
        tags: [cat.id, sub, 'Archival']
      }))
    )
  ).filter(item => !CORE_ITEMS.some(core => core.id === item.id))
];
import { FRONTEND_ARCHIVE_CATEGORY_BY_API } from '../../shared/domain';
