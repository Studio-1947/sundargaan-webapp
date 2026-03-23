export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category: string; // 'artefacts' | 'artists' | 'art-forms'
  subcategory: string; // e.g., 'dotara', 'basi', 'Block A', etc.
  tags: string[];
}

export const ARCHIVE_CATEGORIES = [
  {
    id: 'artefacts',
    label: 'Artefacts like basi, dotara, etc',
    subcategories: ['Basi', 'Dotara', 'Traditional Tools', 'Handicrafts']
  },
  {
    id: 'artists',
    label: "Artist's 19 Blocks and prospects with maps",
    subcategories: ['Hingalganj', 'Gosaba', 'Basanti', 'Canning', 'Sagar']
  },
  {
    id: 'art-forms',
    label: 'Art forms of Sundarbans',
    subcategories: ['Bonbibi Palagaon', 'Baul', 'Bhatiali', 'Jhumur']
  }
];

export const MOCK_ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: '1',
    title: 'Traditional Bamboo Basi',
    description: 'A hand-crafted flute used in Bhatiali songs, made from local bamboo of the Sundarbans region.',
    mediaUrl: 'https://images.unsplash.com/photo-1543039625-14bcd2ec556e?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Basi',
    tags: ['Instrument', 'Music', 'Bamboo']
  },
  {
    id: '2',
    title: 'Wooden Dotara',
    description: 'A four-stringed instrument essential for Baul and folk music, carved with intricate details.',
    mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    category: 'artefacts',
    subcategory: 'Dotara',
    tags: ['Instrument', 'Folk', 'String']
  },
  {
    id: '3',
    title: 'Hingalganj Clay Pottery',
    description: 'Unique pottery styles from the Hingalganj block, known for their durable and earthy finish.',
    mediaUrl: 'https://images.unsplash.com/photo-1565193298357-19fd78198f58?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    category: 'artists',
    subcategory: 'Hingalganj',
    tags: ['Craft', 'Pottery', 'Local']
  },
  {
    id: '4',
    title: 'Bonbibi Palagaon Mask',
    description: 'Decorative masks used in the local theater performance of Bonbibi Palagaon, protecting honey collectors.',
    mediaUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    category: 'art-forms',
    subcategory: 'Bonbibi Palagaon',
    tags: ['Drama', 'Culture', 'Mask']
  },
  {
    id: '5',
    title: 'Bhatiali Boat Songs',
    description: 'The soul of the river—songs sung by boatmen while navigating the complex waters of the delta.',
    mediaUrl: 'https://images.unsplash.com/photo-1533154181967-cc7a67232231?auto=format&fit=crop&q=80&w=800',
    mediaType: 'image',
    category: 'art-forms',
    subcategory: 'Bhatiali',
    tags: ['Song', 'River', 'Oral Tradition']
  }
];
