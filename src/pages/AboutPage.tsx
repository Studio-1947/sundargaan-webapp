import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import PremiumSundargaanText from '../components/ui/PremiumSundargaanText'
import Button from '../components/ui/Button'

// ─── Avatar with initials ────────────────────────────────────────────────────

const Avatar: React.FC<{ initials: string; color?: string }> = ({ initials, color = '#CB460C' }) => (
  <div
    className="w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white text-lg md:text-2xl font-semibold select-none flex-shrink-0 shadow-lg"
    style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}
  >
    {initials}
  </div>
)

// ─── Section label ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block font-body text-[#CB460C] uppercase tracking-widest text-xs font-semibold mb-4">
    {children}
  </span>
)

// ─── Partner Card ─────────────────────────────────────────────────────────────

interface PartnerCardProps {
  initials: string
  name: string
  role: string
  org: string
  bio: string
  index: number
  accentColor?: string
}

const PartnerCard: React.FC<PartnerCardProps> = ({ initials, name, role, org, bio, index, accentColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    className="group bg-white rounded-[2rem] border border-[#e5d5cd] p-8 md:p-10 flex flex-col gap-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-400"
  >
    <div className="flex items-start gap-5">
      <Avatar initials={initials} color={accentColor} />
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg md:text-2xl text-[#1a1005] leading-snug">{name}</h3>
        <p className="font-body text-[#CB460C] text-sm font-semibold mt-1">{role}</p>
        <p className="font-body text-[#a89080] text-xs uppercase tracking-wider mt-1 leading-snug">{org}</p>
      </div>
    </div>
    <p className="font-body text-[#6b5b4f] leading-relaxed text-base">{bio}</p>
  </motion.div>
)

// ─── Team Member Card ─────────────────────────────────────────────────────────

interface TeamMemberProps {
  initials: string
  name: string
  title: string
  bio: string
  index: number
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ initials, name, title, bio, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    className="group bg-white/10 rounded-[2rem] border border-white/10 p-8 flex flex-col gap-5 hover:bg-white/15 hover:-translate-y-1 transition-all duration-400"
  >
    <div className="flex items-center gap-5">
      <Avatar initials={initials} color="#CB460C" />
      <div>
        <h4 className="font-display text-xl text-white leading-snug">{name}</h4>
        <p className="font-body text-[#CB460C] text-sm font-semibold mt-1">{title}</p>
        <p className="font-body text-[#a89080] text-xs uppercase tracking-wider mt-1">Studio 1947</p>
      </div>
    </div>
    <p className="font-body text-[#a89080] leading-relaxed text-sm">{bio}</p>
  </motion.div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

const AboutPage: React.FC = () => {
  const { language } = useLanguage()

  const isEN = language === 'EN'

  // ── Strings ────────────────────────────────────────────────────────────────
  const hero = {
    label:    isEN ? 'About Us'                      : 'আমাদের সম্পর্কে',
    title:    isEN ? 'Who We Are'                    : 'আমরা কারা',
    subtitle: isEN
      ? 'Sundargaan is a living archive and cultural platform rooted in the Sundarbans. We document, preserve, and celebrate the oral traditions, folk music, and artisanal heritage of one of the world\'s most extraordinary ecosystems — giving the voices of the Delta a stage they deserve.'
      : 'সুন্দরগান একটি জীবন্ত আর্কাইভ ও সাংস্কৃতিক প্ল্যাটফর্ম, যার শিকড় সুন্দরবনে। আমরা বিশ্বের অন্যতম অসাধারণ বাস্তুতন্ত্রের মৌখিক ঐতিহ্য, লোকসংগীত এবং কারিগরি ঐতিহ্যকে নথিবদ্ধ, সংরক্ষণ ও উদযাপন করি — ব-দ্বীপের কণ্ঠস্বরগুলিকে একটি যোগ্য মঞ্চ দিয়ে।',
  }

  const missionLabel =  isEN ? 'Our Mission'            : 'আমাদের লক্ষ্য'
  const missionTitle =  isEN ? 'What We Do'             : 'আমরা কী করি'
  const missionPoints = isEN
    ? [
        'Field documentation of endangered folk traditions across 24+ Sundarban villages',
        'Digital archiving of songs, stories, and artefacts for future generations',
        'Fair economic empowerment of over 120 local artists and artisans',
        'Education programs that keep traditional knowledge alive through practice',
      ]
    : [
        '২৪+ সুন্দরবন গ্রামে বিলুপ্তপ্রায় লোক ঐতিহ্যের ফিল্ড ডকুমেন্টেশন',
        'ভবিষ্যৎ প্রজন্মের জন্য গান, গল্প ও নিদর্শনের ডিজিটাল আর্কাইভিং',
        '১২০+ স্থানীয় শিল্পী ও কারিগরের ন্যায্য অর্থনৈতিক ক্ষমতায়ন',
        'চর্চার মাধ্যমে ঐতিহ্যগত জ্ঞান জীবিত রাখে এমন শিক্ষা কর্মসূচি',
      ]

  const partnersLabel = isEN ? 'Partners & Collaborators'       : 'অংশীদার ও সহযোগী'
  const partnersTitle = isEN ? 'The Minds Behind the Mission'   : 'মিশনের পেছনের মানুষেরা'
  const partnersBio   = isEN
    ? 'Sundargaan is made possible through meaningful collaboration with organisations and individuals who share our conviction that culture is a living inheritance — not a relic.'
    : 'সুন্দরগান তাদের সাথে অর্থবহ সহযোগিতার মাধ্যমে সম্ভব হয়েছে যারা আমাদের এই বিশ্বাস ভাগ করে নেন যে সংস্কৃতি একটি জীবন্ত উত্তরাধিকার — কোনো ধ্বংসাবশেষ নয়।'

  const partners = [
    {
      initials: 'PR',
      name:     isEN ? 'Pinaki Roy'                       : 'পিনাকী রায়',
      role:     isEN ? 'Founder & Ecologist'              : 'প্রতিষ্ঠাতা ও পরিবেশবিদ',
      org:      isEN ? 'Eco Logical Foundation (ELF)'    : 'ইকো লজিক্যাল ফাউন্ডেশন (ELF)',
      bio:      isEN
        ? 'Pinaki Roy is the founding force behind the Eco Logical Foundation — the grassroots organisation that laid the groundwork for field documentation in the Sundarbans. His decades of ecological and cultural fieldwork in the delta form the living backbone of everything Sundargaan stands for.'
        : 'পিনাকী রায় ইকো লজিক্যাল ফাউন্ডেশনের প্রতিষ্ঠাতা শক্তি — যে তৃণমূল সংগঠন সুন্দরবনে ফিল্ড ডকুমেন্টেশনের ভিত্তি স্থাপন করেছে। ব-দ্বীপে তাঁর কয়েক দশকের পরিবেশগত ও সাংস্কৃতিক ক্ষেত্র-কাজ সুন্দরগানের প্রতিটি বিষয়ের জীবন্ত মেরুদণ্ড।',
      accentColor: '#CB460C',
    },
    {
      initials: 'IC',
      name:     isEN ? 'Iman Chakraborty'                         : 'ইমান চক্রবর্তী',
      role:     isEN ? 'National Award-Winning Artist'             : 'জাতীয় পুরস্কারজয়ী শিল্পী',
      org:      isEN ? 'Satyajit Ray Film & Television Institute' : 'সত্যজিৎ রায় ফিল্ম অ্যান্ড টেলিভিশন ইনস্টিটিউট',
      bio:      isEN
        ? 'A National Award-winning artist and alumna of the Satyajit Ray Film & Television Institute, Iman Chakraborty brings artistic credibility and a deeply felt understanding of Bengal\'s sonic heritage. Her involvement ensures that Sundargaan\'s archival and curatorial work meets the highest standards of artistic authenticity.'
        : 'জাতীয় পুরস্কারপ্রাপ্ত শিল্পী এবং সত্যজিৎ রায় ফিল্ম অ্যান্ড টেলিভিশন ইনস্টিটিউটের প্রাক্তনী ইমান চক্রবর্তী শিল্পগত বিশ্বাসযোগ্যতা এবং বাংলার ধ্বনি ঐতিহ্যের গভীর উপলব্ধি নিয়ে আসেন। তাঁর সম্পৃক্ততা নিশ্চিত করে যে সুন্দরগানের আর্কাইভাল ও কিউরেটরিয়াল কাজ শৈল্পিক সত্যতার সর্বোচ্চ মান পূরণ করে।',
      accentColor: '#E15012',
    },
    {
      initials: 'PM',
      name:     isEN ? 'Palash Mondal'                      : 'পলাশ মণ্ডল',
      role:     isEN ? 'Community Partner'                  : 'কমিউনিটি অংশীদার',
      org:      isEN ? 'Sundarbaan Unayan Bhavan'           : 'সুন্দরবান উন্নয়ন ভবন',
      bio:      isEN
        ? 'Palash Mondal and Sundarbaan Unayan Bhavan form the critical bridge between Sundargaan\'s digital mission and the communities it serves on the ground. Their deep-rooted local presence and trust built over years make it possible to reach artists and villages that remain beyond conventional reach.'
        : 'পলাশ মণ্ডল এবং সুন্দরবান উন্নয়ন ভবন সুন্দরগানের ডিজিটাল লক্ষ্য এবং যে সম্প্রদায়গুলিকে এটি সেবা দেয় তাদের মধ্যে গুরুত্বপূর্ণ সেতু তৈরি করে। বছরের পর বছর ধরে গড়ে ওঠা তাঁদের গভীর স্থানীয় উপস্থিতি এবং আস্থা এমন শিল্পী ও গ্রামে পৌঁছানো সম্ভব করে যারা প্রচলিত নাগালের বাইরে থেকে যায়।',
      accentColor: '#4B3621',
    },
  ]

  const teamLabel    = isEN ? 'The Team'                    : 'আমাদের দল'
  const teamTitle    = isEN ? 'Studio 1947'                 : 'স্টুডিও ১৯৪৭'
  const teamSubtitle = isEN
    ? 'The production and research engine powering Sundargaan\'s documentation — bringing craft, data, and lens together in service of the Sundarbans.'
    : 'সুন্দরগানের ডকুমেন্টেশনকে শক্তি দেওয়া প্রযোজনা ও গবেষণা ইঞ্জিন — সুন্দরবনের সেবায় কারুকাজ, তথ্য এবং লেন্সকে একত্রিত করছে।'

  const teamMembers = [
    {
      initials: 'RI',
      name:     isEN ? 'Rabiul Islam'      : 'রবিউল ইসলাম',
      title:    isEN ? 'CEO'               : 'সিইও',
      bio:      isEN
        ? 'Rabiul leads Studio 1947 with a vision rooted in both cultural responsibility and operational clarity. He drives the overall direction of Sundargaan\'s production partnerships, ensuring every project stays true to its purpose of preserving the Sundarbans\' living heritage.'
        : 'রবিউল সাংস্কৃতিক দায়িত্ব ও পরিচালনাগত স্পষ্টতার উপর ভিত্তি করে স্টুডিও ১৯৪৭-কে নেতৃত্ব দেন। তিনি সুন্দরগানের প্রযোজনা অংশীদারিত্বের সামগ্রিক দিকনির্দেশনা পরিচালনা করেন।',
    },
    {
      initials: 'SB',
      name:     isEN ? 'Sankhadipta Bose' : 'শঙ্খদীপ্ত বোস',
      title:    isEN ? 'Data Analyst'      : 'ডেটা অ্যানালিস্ট',
      bio:      isEN
        ? 'Sankhadipta brings rigour to the archive — mapping, categorising, and structuring the thousands of cultural data points that make up Sundargaan\'s living record. His analytical work transforms raw field documentation into a searchable, lasting resource.'
        : 'শঙ্খদীপ্ত আর্কাইভে কঠোরতা নিয়ে আসেন — সুন্দরগানের জীবন্ত নথি তৈরি করা হাজারো সাংস্কৃতিক তথ্যবিন্দু ম্যাপিং, শ্রেণীবিভাগ ও কাঠামোবদ্ধ করেন।',
    },
    {
      initials: 'RC',
      name:     isEN ? 'Rahul Chettri'    : 'রাহুল ছেত্রী',
      title:    isEN ? 'Video & Photography' : 'ভিডিও ও ফটোগ্রাফি',
      bio:      isEN
        ? 'Rahul is the eye behind the field — capturing the faces, landscapes, and performances that give Sundargaan its visual soul. His work in video and photography ensures the archive is not just heard but truly seen and felt.'
        : 'রাহুল মাঠের পেছনের চোখ — মুখ, প্রাকৃতিক দৃশ্য এবং পরিবেশনা ধারণ করেন যা সুন্দরগানকে তার দৃশ্যগত প্রাণ দেয়। তাঁর ভিডিও ও ফটোগ্রাফির কাজ নিশ্চিত করে যে আর্কাইভ শুধু শোনাই নয়, সত্যিকার অর্থে দেখা ও অনুভব করা যায়।',
    },
  ]

  const ctaTitle = isEN ? 'Want to be part of this?' : 'এর অংশ হতে চান?'
  const ctaDesc  = isEN
    ? 'Every contribution — of time, skill, or support — helps preserve a heritage that belongs to all of us.'
    : 'সময়, দক্ষতা বা সহায়তার প্রতিটি অবদান এমন একটি ঐতিহ্য সংরক্ষণে সাহায্য করে যা আমাদের সকলের।'

  return (
    <div className="bg-[#FEFCFB] min-h-screen">

      {/* ——— Hero ——— */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] opacity-[0.07] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 0%, #CB460C 0%, transparent 70%)' }} />

        <div className="max-w-screen-xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <SectionLabel>{hero.label}</SectionLabel>
            <PremiumSundargaanText
              text={hero.title}
              className="justify-center mb-8"
              style={{
                fontSize: 'clamp(2.5rem, 9vw, 6rem)',
                fontWeight: 400,
                color: '#1a1005',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="font-body text-lg md:text-xl text-[#6b5b4f] leading-relaxed max-w-3xl mx-auto"
            >
              {hero.subtitle}
            </motion.p>
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#CB460C]/60 to-transparent origin-center"
          />
        </div>
      </section>

      {/* ——— Mission / What We Do ——— */}
      <section className="py-24 px-6 bg-[#F7EAE5]/30">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div>
                <SectionLabel>{missionLabel}</SectionLabel>
                <h2 className="font-display text-4xl md:text-5xl text-[#1a1005] leading-tight">{missionTitle}</h2>
              </div>
              <ul className="space-y-5">
                {missionPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[#CB460C]" />
                    <span className="font-body text-[#6b5b4f] leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right: stat cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { val: '750+', label: isEN ? 'Songs Preserved'     : 'সংরক্ষিত গান' },
                { val: '120+', label: isEN ? 'Artists Supported'   : 'সমর্থিত শিল্পী' },
                { val: '24',   label: isEN ? 'Villages Documented' : 'নথিবদ্ধ গ্রাম' },
                { val: '1.2M', label: isEN ? 'Digital Grains'      : 'ডিজিটাল দানা' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="bg-white rounded-[1.5rem] border border-[#e5d5cd] p-6 md:p-8 flex flex-col gap-2 hover:shadow-lg transition-shadow"
                >
                  <span className="font-display text-3xl md:text-4xl text-[#1a1005]">{stat.val}</span>
                  <span className="font-body text-xs uppercase tracking-widest text-[#a89080]">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Partners & Collaborators ——— */}
      <section className="py-24 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <SectionLabel>{partnersLabel}</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl text-[#1a1005] leading-tight mb-6">{partnersTitle}</h2>
            <p className="font-body text-lg text-[#6b5b4f] max-w-2xl mx-auto leading-relaxed">{partnersBio}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p, i) => (
              <PartnerCard key={p.name} {...p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ——— Studio 1947 Team ——— */}
      <section className="py-24 px-6 bg-[#1a1005] relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#CB460C] opacity-[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E86228] opacity-[0.07] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-screen-xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block font-body text-[#CB460C] uppercase tracking-widest text-xs font-semibold mb-4">
              {teamLabel}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-6">{teamTitle}</h2>
            <p className="font-body text-lg text-[#a89080] max-w-2xl mx-auto leading-relaxed">{teamSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((m, i) => (
              <TeamMemberCard key={m.name} {...m} index={i} />
            ))}
          </div>

          {/* Studio 1947 wordmark strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 text-center"
          >
            <span
              className="font-display text-[#FEFCFB]/5 select-none pointer-events-none"
              style={{ fontSize: 'clamp(3rem, 12vw, 10rem)', letterSpacing: '-0.04em' }}
            >
              {isEN ? 'Studio 1947' : 'স্টুডিও ১৯৪৭'}
            </span>
          </motion.div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-screen-xl mx-auto bg-gradient-to-br from-[#F7EAE5] to-[#fdf6f3] rounded-[48px] border border-[#e5d5cd] p-12 md:p-20 text-center space-y-8 relative overflow-hidden"
        >
          {/* Subtle brand accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CB460C] opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <h2 className="relative z-10 font-display text-4xl md:text-6xl text-[#1a1005] leading-tight">
            {ctaTitle}
          </h2>
          <p className="relative z-10 font-body text-lg text-[#6b5b4f] max-w-xl mx-auto leading-relaxed">
            {ctaDesc}
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Button variant="primary" size="lg" className="h-14 px-10 text-lg">
              {isEN ? 'Join Sundargaan' : 'সুন্দরগানে যোগ দিন'}
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-lg text-[#1a1005] border-[#e5d5cd]">
              {isEN ? 'Explore the Archive' : 'আর্কাইভ দেখুন'}
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default AboutPage
