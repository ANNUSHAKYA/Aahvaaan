// Signature Wedding Invitation Catalog for Aahvaaan by Vow & Vision
// Single Premier Template: Mor Pankh · № 01

const templates = [
  {
    id: 'mor-pankh',
    alias: 'mor-pankh',
    aliases: [
      'mor-pankh',
      'rose-watercolor',
      'rose-invitation',
      'champagne-and-rose',
      'lotus-lagoon',
      'lotus-royale',
      'royal-maroon-and-gold',
      'shahi-patra',
      'blush-and-lavender',
      'shehnai-royal',
      'flute-raag',
      'sitar-symphony',
      'sufi-romance',
    ],
    name: 'Mor Pankh',
    subtitle: 'A royal invitation',
    collection: 'The Royal Collection',
    number: '№ 01',
    category: 'Royal Heritage',
    startingPrice: 3499,
    priceDisplay: '₹3,499',
    shortDescription: 'Deep peacock teal, metallic gold accents, and authentic Mor Pankh feathers woven into an unforgettable royal invitation.',
    description: 'Mor Pankh · № 01 is Aahvaaan’s signature royal digital wedding invitation. Inspired by the grace of peacocks and royal Rajasthani courtyards, it features 3D perspective opening arch gates, authentic multi-stop vector feather crests, interactive petal date reveal, a six-chapter wedding diary, keepsake notes, hanging love-story polaroids, and seamless guest RSVP tracking.',
    designDirection: 'Deep peacock teal, antique gold trim, ivory parchment grain, 3D arch gate opening, traditional royal typography with authentic Hindi blessings.',
    image: '/templates/mor-pankh.svg',
    featured: true,
    palette: {
      peacockTeal: '#0E4D4F',
      deepTeal: '#082D2E',
      emeraldTeal: '#235B54',
      antiqueGold: '#B69A70',
      paleGold: '#E3D3AE',
      parchmentIvory: '#FAF7F2',
    },
    colors: [
      { name: 'Peacock Teal', hex: '#0E4D4F' },
      { name: 'Deep Emerald', hex: '#082D2E' },
      { name: 'Antique Gold', hex: '#B69A70' },
      { name: 'Pale Gold', hex: '#E3D3AE' },
      { name: 'Warm Ivory', hex: '#FAF7F2' },
    ],
    themeStyles: {
      bgPrimary: '#FAF7F2',
      bgSecondary: '#082D2E',
      textPrimary: '#082D2E',
      textSecondary: '#65575A',
      accentPrimary: '#B69A70',
      accentSecondary: '#0E4D4F',
      cardBg: '#FFFFFF',
    },
    features: [
      '3D Perspective Arch Gate Opening',
      'Real Looping Wedding Instrumental Music',
      'Interactive "Move the Petals" Date Reveal',
      'Live Days, Hours, Minutes, Seconds Countdown',
      'The Wedding Diary: 6 Swipeable Ceremonies with Map Pins & Calendar (.ics)',
      'The Mor Pankh Keepsake: 4 Flip Notes',
      'Glimpses of Us: Hanging Polaroid Love Story Frames',
      'Complete Guest RSVP with Yes/Maybe/No and Phone Deduplication',
      'Personalized Guest Name Greetings',
    ],
    get sampleData() {
      return this.defaultData;
    },
    defaultData: {
      groom: 'Aarav Sharma',
      groomParents: 'Sunita & Rajesh Sharma',
      bride: 'Meera Kapoor',
      brideParents: 'Kavita & Vikram Kapoor',
      weddingDate: '2027-02-27',
      location: 'Jaipur, Rajasthan',
      venue: 'The Leela Palace, Jaipur – Delhi Highway, NH 11, Kukas, Jaipur, Rajasthan 302028',
      mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
      musicTrack: '/templates/mor-pankh/media/music.mp3',
      coupleStory: 'Friendship grew into something more, and we realized life’s best moments were the ones we shared together.',
      events: [
        {
          name: 'Ring Ceremony',
          chapter: '01',
          tagline: 'A promise, a sparkle, a beginning',
          date: 'Thursday, 25 February 2027',
          time: '6:00 PM IST',
          venue: 'Sharma Residence, Jaipur',
          mapUrl: 'https://maps.google.com/?q=Sharma+Residence+Jaipur',
          dressCode: 'Indo-Western Glamour',
          icon: '💍',
          description: 'An intimate evening where rings are exchanged and two hearts make an eternal promise under golden chandeliers.',
        },
        {
          name: 'Haldi',
          chapter: '02',
          tagline: 'A little sunshine, a lot of love',
          date: 'Friday, 26 February 2027',
          time: '10:00 AM IST',
          venue: 'The Marigold Lawns, The Leela Palace',
          mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
          dressCode: 'Sunlight Yellows & Marigolds',
          icon: '✨',
          description: 'Sun-drenched laughter, fragrant turmeric, traditional folk songs, and flower showers with our dearest ones.',
        },
        {
          name: 'Mehendi',
          chapter: '03',
          tagline: 'Love, written in henna',
          date: 'Friday, 26 February 2027',
          time: '4:00 PM IST',
          venue: 'The Garden Pavilion, The Leela Palace',
          mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
          dressCode: 'Emerald & Mint Festive',
          icon: '🌿',
          description: 'Intricate Rajasthani henna designs celebrating love stories, accompanied by live shehnai and street food delicacies.',
        },
        {
          name: 'Sangeet',
          chapter: '04',
          tagline: 'An evening of song & celebration',
          date: 'Friday, 26 February 2027',
          time: '7:00 PM IST',
          venue: 'The Peacock Courtyard, The Leela Palace',
          mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
          dressCode: 'Royal Sparkle & Cocktail',
          icon: '🪕',
          description: 'High-energy choreography, family dance battles, DJ beats, and laughter that echoes into the starry Rajasthan night.',
        },
        {
          name: 'Vivaah',
          chapter: '05',
          tagline: 'Seven promises. One forever.',
          date: 'Saturday, 27 February 2027',
          time: '4:30 PM IST',
          venue: 'The Royal Courtyard, The Leela Palace',
          mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
          dressCode: 'Traditional Heritage Regal',
          icon: '🔥',
          description: 'Under the grand mandap with Vedic chants, the holy fire witnesses the sacred seven pheras uniting Aarav and Meera.',
        },
        {
          name: 'Reception',
          chapter: '06',
          tagline: 'To new beginnings, together',
          date: 'Saturday, 27 February 2027',
          time: '7:30 PM IST',
          venue: 'The Palace Ballroom, The Leela Palace',
          mapUrl: 'https://maps.google.com/?q=The+Leela+Palace+Jaipur',
          dressCode: 'Formal Tuxedo & Silks',
          icon: '🥂',
          description: 'A regal banquet dinner, heartfelt family toasts, and celebration of the newlyweds as they embark on life together.',
        },
      ],
      gallery: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&fit=crop&q=80',
      ],
    },
  },
];

export const collections = [
  'All Collections',
  'The Royal Collection',
];

export function getTemplateById(id) {
  if (!id) return templates[0];
  return (
    templates.find(
      (t) => t.id === id || t.alias === id || t.aliases?.includes(id)
    ) || templates[0]
  );
}

export default templates;
