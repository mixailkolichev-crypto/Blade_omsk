import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: number;
  src: string;
  title: string;
  tag: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    src: '/src/assets/images/blade_gallery_1_1784112922822.jpg',
    title: 'Дымная Эстетика',
    tag: 'Кальяны',
    description: 'Индивидуальные вкусовые профили на дизайнерских аппаратах.'
  },
  {
    id: 2,
    src: '/src/assets/images/blade_gallery_2_1784112936790.jpg',
    title: 'Премиум Лаунж',
    tag: 'Интерьер',
    description: 'Зоны уединения с мягкими диванами и приглушенным неоном.'
  },
  {
    id: 3,
    src: '/src/assets/images/blade_gallery_3_1784112950434.jpg',
    title: 'Blade Glow',
    tag: 'Бар',
    description: 'Фирменный неоновый коктейль на лавандовом джине.'
  },
  {
    id: 4,
    src: '/src/assets/images/blade_gallery_4_1784112960930.jpg',
    title: 'Gourmet Рибай',
    tag: 'Кухня',
    description: 'Премиальный стейк сухой выдержки с перечным соусом.'
  },
  {
    id: 5,
    src: '/src/assets/images/blade_gallery_5_1784112974787.jpg',
    title: 'Чайная Церемония',
    tag: 'Чай',
    description: 'Элитные китайские чаи, заваренные проливом.'
  },
  {
    id: 6,
    src: '/src/assets/images/blade_gallery_6_1784112985965.jpg',
    title: 'Жар и Уголь',
    tag: 'Кальяны',
    description: 'Ювелирный температурный контроль для идеального дыма.'
  },
  {
    id: 7,
    src: '/src/assets/images/blade_gallery_7_1784112997756.jpg',
    title: 'Double Burger',
    tag: 'Кухня',
    description: 'Сочная мраморная говядина и тающий чеддер.'
  },
  {
    id: 8,
    src: '/src/assets/images/blade_gallery_8_1784113010464.jpg',
    title: 'Эксклюзивные Кальяны',
    tag: 'Кальяны',
    description: 'Авторский модельный ряд от бренда BLADE.'
  },
  {
    id: 9,
    src: '/src/assets/images/blade_gallery_9_1784113024651.jpg',
    title: 'Элитный Бар',
    tag: 'Бар',
    description: 'Коллекционный алкоголь с кристальными сферами льда.'
  }
];

export default function GallerySection() {
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Animation variants for each item (appear on scroll)
  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15
      }
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImgIndex !== null) {
      setSelectedImgIndex((prev) => (prev === 0 ? GALLERY_ITEMS.length - 1 : prev! - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImgIndex !== null) {
      setSelectedImgIndex((prev) => (prev === GALLERY_ITEMS.length - 1 ? 0 : prev! + 1));
    }
  };

  return (
    <section id="gallery" className="relative py-24 z-10 scroll-mt-20 overflow-hidden bg-gradient-to-b from-bg-dark to-black/80">
      
      {/* Visual background ambient accent glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 max-w-max mb-4">
            <Camera className="w-4 h-4 text-brand-purple" />
            <span className="text-xs font-semibold tracking-widest text-brand-purple uppercase">Атмосфера BLADE</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider mb-4">
            Галерея Лаунжа
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-purple to-brand-gold mx-auto mb-6" />
          <p className="text-gray-400 text-lg leading-relaxed">
            Почувствуйте премиальную атмосферу нашего пространства еще до визита. 9 фоторакурсов, передающих истинный характер лаунжа BLADE.
          </p>
        </div>

        {/* Dynamic Photo Grid (Appears on Scroll) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              onClick={() => setSelectedImgIndex(idx)}
              className="group relative h-[300px] rounded-2xl overflow-hidden glass-panel border border-white/5 cursor-pointer shadow-lg hover:shadow-brand-purple/15 hover:border-brand-purple/30 transition-all duration-300"
            >
              {/* Image with saturate/brightness filter matching lounge theme */}
              <img 
                src={item.src} 
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter saturate-[1.1] brightness-[0.85] group-hover:brightness-[1]"
              />

              {/* Edge vignetting mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

              {/* Top tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md text-brand-purple border border-brand-purple/20">
                  {item.tag}
                </span>
              </div>

              {/* Central Quick View Icon (Appears on hover) */}
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-brand-purple/80 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-brand-purple/30 scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom text description */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-left transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-display font-bold text-white text-lg tracking-wide uppercase flex items-center gap-2">
                  {item.title}
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                </h3>
                <p className="text-gray-400 text-xs mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300 max-w-sm">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Lightbox / Fullscreen Image Viewer Modal */}
      <AnimatePresence>
        {selectedImgIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImgIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImgIndex(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-purple hover:border-brand-purple/30 hover:scale-105 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 sm:left-8 z-40 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-purple hover:scale-105 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 sm:right-8 z-40 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-brand-purple hover:scale-105 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image & Caption Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center gap-4"
            >
              {/* Image Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/40 shadow-2xl max-h-[70vh] flex items-center justify-center">
                <img 
                  src={GALLERY_ITEMS[selectedImgIndex].src} 
                  alt={GALLERY_ITEMS[selectedImgIndex].title}
                  className="max-h-[70vh] object-contain w-auto rounded-xl select-none"
                />
              </div>

              {/* Photo Caption Details */}
              <div className="w-full text-center max-w-xl bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 mt-2">
                <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-brand-purple/20 text-brand-purple border border-brand-purple/30 inline-block mb-3">
                  {GALLERY_ITEMS[selectedImgIndex].tag}
                </span>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide">
                  {GALLERY_ITEMS[selectedImgIndex].title}
                </h3>
                <p className="text-gray-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                  {GALLERY_ITEMS[selectedImgIndex].description}
                </p>
                <div className="text-xs text-gray-500 mt-4 font-mono">
                  {selectedImgIndex + 1} / {GALLERY_ITEMS.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
