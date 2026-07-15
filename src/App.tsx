import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Compass, 
  Utensils, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  Star, 
  BellRing, 
  MapPin,
  X,
  Plus,
  Minus,
  Check,
  GlassWater,
  Flame,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GallerySection from './components/GallerySection';

// Custom Type declarations
interface Review {
  name: string;
  text: string;
  role: string;
  rating: number;
}

interface MenuItem {
  name: string;
  description: string;
  price: string;
  badge?: string;
}

interface Booking {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  id: string;
  bookedAt: string;
}

export default function App() {
  // ---- STATE ----
  const [activeSection, setActiveSection] = useState('hero');
  const [currentReview, setCurrentReview] = useState(0);
  const [activeMenuTab, setActiveMenuTab] = useState<'hookah' | 'kitchen' | 'bar'>('hookah');
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 2
  });
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCallNotification, setShowCallNotification] = useState(false);

  // ---- REFS ----
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const videoOverlayRef = useRef<HTMLDivElement | null>(null);

  // ---- REVIEWS DATA ----
  const reviews: Review[] = [
    {
      name: "Алексей Новосельцев",
      role: "Постоянный гость",
      text: "Blade Hookah Bar — это место, где каждая деталь создаёт идеальный вечер! Потрясающая кухня, которая удивляет своим разнообразием, и обслуживание на высшем уровне. Всё продумано до мелочей.",
      rating: 5
    },
    {
      name: "Керя Норрис",
      role: "Ценитель комфорта",
      text: "Отличное место, особенно в будни, когда негромко играет музыка и можно спокойно общаться. Прекрасные кальяны, просторные и очень удобные диваны. Отдельный плюс за деликатное внимание персонала.",
      rating: 5
    },
    {
      name: "Стас Чиянов",
      role: "Кальянный энтузиаст",
      text: "Самое кайфовое — ты выбираешь не бренд табака, а ощущение, которое хочешь получить. Кальянные мастера угадывают 10 из 10! Невероятный индивидуальный подход к каждому гостю.",
      rating: 5
    }
  ];

  // ---- MENU DATA ----
  const hookahMenu: MenuItem[] = [
    { name: "Sensation Profile (Ощущение)", description: "Индивидуальный подбор вкуса по вашей ассоциации: 'Свежесть гор', 'Пряный закат' или 'Ягодный туман'", price: "от 1200 ₽", badge: "Рекомендуем" },
    { name: "BLADE Signature Premium", description: "Эксклюзивные вкусы с использованием редких блендов на дизайнерских аппаратах BLADE", price: "1500 ₽" },
    { name: "Elite Classic Hookah", description: "Традиционная классика в совершенном исполнении мастеров с контролем жара", price: "1100 ₽" },
    { name: "Fruit Craft (На фруктовой чаше)", description: "Освежающий кальян на свежем грейпфруте, ананасе или гранате с добавлением сока в колбу", price: "1800 ₽" }
  ];

  const kitchenMenu: MenuItem[] = [
    { name: "Азиатский Вок с Уткой", description: "Тонкая лапша удон в фирменном соусе терияки с сочными слайсами утки, кунжутом и хрустящими овощами", price: "590 ₽", badge: "Азия" },
    { name: "Сочный Бургер Blade Double", description: "Две сочные котлеты из мраморной говядины, плавленый чеддер, маринованные огурчики и домашний соус на гриле", price: "620 ₽", badge: "Америка" },
    { name: "Классический Рибай Стейк", description: "Премиальный стейк сухой выдержки из фермерской говядины с запечённым чесноком и перечным соусом", price: "1250 ₽", badge: "Европа" },
    { name: "Фетучини с Лососем и Шпинатом", description: "Паста ручной работы в нежном сливочном соусе с кусочками лосося, шпинатом и тёртым пармезаном", price: "680 ₽" }
  ];

  const barMenu: MenuItem[] = [
    { name: "Коктейль 'Blade Glow'", description: "Авторский микс на основе фиолетового джина, лавандового сиропа и тоника с неоновым свечением", price: "480 ₽", badge: "Фирменный" },
    { name: "Коктейль 'Amber Fog'", description: "Дымный коктейль со спелым абрикосом, бурбоном, пряным биттером и сухим льдом", price: "520 ₽" },
    { name: "Элитный Шу Пуэр 'Голова Дикого Кабана'", description: "Интенсивный бодрящий чай, заваренный проливом в глиняном чайнике по китайским традициям", price: "450 ₽" },
    { name: "Тайский Чай Анчан с Лемонграссом", description: "Насыщенный синий чай с добавлением сока лимона, меняющий цвет на нежно-фиолетовый прямо у стола", price: "380 ₽" }
  ];

  // ---- EFFECTS ----

  // 1. Persist and read booking from localStorage
  useEffect(() => {
    const savedBooking = localStorage.getItem('blade_booking');
    if (savedBooking) {
      try {
        setActiveBooking(JSON.parse(savedBooking));
      } catch (e) {
        console.error('Failed to parse saved booking', e);
      }
    }
  }, []);

  // 2. Custom Cursor Tracking (Lerp / Inertia)
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Lerp loop for ring
    let animationFrameId: number;
    const updateRing = () => {
      const ease = 0.15; // smoothness factor
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      animationFrameId = requestAnimationFrame(updateRing);
    };
    updateRing();

    // Hover effect styles
    const addHoverClass = () => {
      ring.style.width = '55px';
      ring.style.height = '55px';
      ring.style.borderColor = '#bc26f5';
      ring.style.backgroundColor = 'rgba(188, 38, 245, 0.1)';
    };

    const removeHoverClass = () => {
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(188, 38, 245, 0.4)';
      ring.style.backgroundColor = 'transparent';
    };

    const hoverables = document.querySelectorAll('a, button, [role="button"], select, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', addHoverClass);
      el.addEventListener('mouseleave', removeHoverClass);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', addHoverClass);
        el.removeEventListener('mouseleave', removeHoverClass);
      });
    };
  }, []);

  // 3. Interactive Smoke Background Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class SmokeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      hue: number;

      constructor(isInitial = false) {
        this.x = Math.random() * width;
        this.y = isInitial ? Math.random() * height : height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -Math.random() * 0.6 - 0.2;
        this.size = Math.random() * 80 + 40;
        this.maxLife = Math.random() * 300 + 200;
        this.life = isInitial ? Math.random() * this.maxLife : this.maxLife;
        this.alpha = 0;
        this.hue = Math.random() > 0.5 ? 280 : 260; // Purples
      }

      update(mx: number, my: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Fade in initially, fade out at the end of life
        if (this.life > this.maxLife - 50) {
          this.alpha = ((this.maxLife - this.life) / 50) * 0.12;
        } else {
          this.alpha = (this.life / (this.maxLife - 50)) * 0.12;
        }

        // Mouse repulsion
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }

        // Reset if dead or off-screen
        if (this.life <= 0 || this.y < -100 || this.x < -100 || this.x > width + 100) {
          this.respawn();
        }
      }

      respawn() {
        this.x = Math.random() * width;
        this.y = height + 50;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -Math.random() * 0.6 - 0.2;
        this.size = Math.random() * 80 + 40;
        this.maxLife = Math.random() * 300 + 200;
        this.life = this.maxLife;
        this.alpha = 0;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        c.save();
        const grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(140, 22, 179, ${this.alpha})`);
        grad.addColorStop(0.5, `rgba(66, 18, 122, ${this.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(13, 7, 20, 0)');
        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Initialize particles
    const particlesCount = Math.min(45, Math.floor((width * height) / 35000));
    const particles: SmokeParticle[] = [];
    for (let i = 0; i < particlesCount; i++) {
      particles.push(new SmokeParticle(true));
    }

    // Mouse coordinates inside canvas closure
    let mouseX = -1000;
    let mouseY = -1000;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Render loop
    let animId: number;
    const render = () => {
      ctx.fillStyle = '#0d0714';
      ctx.fillRect(0, 0, width, height);

      // Draw active particles
      particles.forEach(p => {
        p.update(mouseX, mouseY);
        p.draw(ctx);
      });

      // Subtle warm embers drifting upwards (representing glowing charcoal ashes)
      ctx.fillStyle = 'rgba(217, 167, 82, 0.3)'; // Golden amber
      for (let i = 0; i < 5; i++) {
        const ex = Math.random() * width;
        const ey = Math.random() * height;
        const r = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(ex, ey, r, 0, Math.PI * 2);
        ctx.shadowColor = '#d9a752';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0; // reset shadow

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 4. Auto Rotate Review Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  // ---- HANDLERS ----

  const handleReviewNext = () => {
    setCurrentReview(prev => (prev + 1) % reviews.length);
  };

  const handleReviewPrev = () => {
    setCurrentReview(prev => (prev - 1 + reviews.length) % reviews.length);
  };

  // 3D Card Tilt Effect implementation
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Set rot angles (max 8 degrees tilt)
    const angleX = (yc - y) / 12;
    const angleY = (x - xc) / 12;
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = `0 15px 35px -5px rgba(188, 38, 245, 0.25), 0 0 15px rgba(188, 38, 245, 0.1)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = '';
  };

  // Booking Form submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    // Simulate server side request for premium feels
    setTimeout(() => {
      const generatedId = `BLD-${Math.floor(1000 + Math.random() * 9000)}-${new Date(bookingForm.date).getFullYear()}`;
      const newBooking: Booking = {
        ...bookingForm,
        id: generatedId,
        bookedAt: new Date().toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setActiveBooking(newBooking);
      localStorage.setItem('blade_booking', JSON.stringify(newBooking));
      setIsSubmitting(false);
      setIsBookingModalOpen(true);
    }, 1200);
  };

  // Cancel Booking
  const handleCancelBooking = () => {
    if (window.confirm('Вы действительно хотите отменить вашу бронь стола?')) {
      setActiveBooking(null);
      localStorage.removeItem('blade_booking');
      setIsBookingModalOpen(false);
    }
  };

  // Staff Call Simulation
  const handleStaffCallSimulation = () => {
    setShowCallNotification(true);
    setTimeout(() => {
      setShowCallNotification(false);
    }, 5000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-purple/40 selection:text-white bg-bg-dark text-gray-200">
      
      {/* 1. Custom Interactive Canvas Smoke Background */}
      <canvas 
        ref={canvasRef} 
        id="smoke-canvas"
        className="fixed inset-0 pointer-events-none z-0" 
      />

      {/* 2. Custom Inertia Cursor */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div ref={cursorRingRef} className="custom-cursor-ring" />

      {/* Floating Waiter Call Simulation (Addressing review feedback in UI) */}
      <AnimatePresence>
        {showCallNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel border border-brand-purple/50 px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl shadow-brand-purple/20 max-w-sm w-[90%]"
          >
            <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-white text-sm">Вызов отправлен</h4>
              <p className="text-xs text-gray-400 mt-0.5">Официант подойдёт к вашему столу в течение 1 минуты.</p>
            </div>
            <button 
              onClick={() => setShowCallNotification(false)}
              className="text-gray-400 hover:text-white ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Booking floating ticket notice */}
      {activeBooking && !isBookingModalOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center gap-3 bg-brand-purple/95 hover:bg-brand-purple text-white px-5 py-3 rounded-full shadow-lg shadow-brand-purple/30 font-display font-semibold text-xs tracking-wider uppercase border border-brand-purple-dark"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
            Ваша Бронь Стола
          </motion.button>
        </div>
      )}

      {/* 3. Header Section */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <span className="font-display font-black text-2xl tracking-[0.25em] text-white transition-all duration-300 group-hover:text-brand-purple">
              BLADE
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-purple group-hover:shadow-[0_0_8px_#bc26f5] transition-all duration-300" />
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand-purple transition-all duration-200">
              Обзор
            </a>
            <a href="#menu" className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand-purple transition-all duration-200">
              Меню
            </a>
            <a href="#gallery" className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand-purple transition-all duration-200">
              Галерея
            </a>
            <a href="#reviews" className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand-purple transition-all duration-200">
              Отзывы
            </a>
            <a href="#contacts" className="text-sm font-medium tracking-wide text-gray-300 hover:text-brand-purple transition-all duration-200">
              Контакты
            </a>
          </nav>

          {/* CTA Header Button */}
          <div className="flex items-center gap-4">
            <a 
              href="#booking" 
              className="px-5 py-2.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 hover:bg-brand-purple hover:text-white transition-all duration-300 font-display text-xs uppercase tracking-widest font-semibold text-brand-purple"
            >
              Забронировать
            </a>
          </div>
        </div>
      </header>

      {/* 4. Fullscreen Video Background Hero Section */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center justify-center z-10 overflow-hidden">
        
        {/* Background Video Container */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover filter saturate-[1.3] brightness-[1.05]"
          >
            {/* Primary: Local uploaded video file if available in assets */}
            <source src="/assets/blade_hero.mp4" type="video/mp4" />
            <source src="/assets/video.mp4" type="video/mp4" />
            <source src="/assets/hookah.mp4" type="video/mp4" />
            
            {/* Fallback to online loop of fine dark smoke */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-smoke-in-dark-room-41974-large.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-smoke-swirling-in-dark-background-41975-large.mp4" type="video/mp4" />
          </video>

          {/* Premium Radial Vignette Overlay for smooth depth and blending */}
          <div 
            ref={videoOverlayRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'radial-gradient(circle at center, rgba(13, 7, 20, 0.1) 20%, rgba(13, 7, 20, 0.4) 60%, #0d0714 95%)'
            }}
          />

          {/* Color cast overlay & edge gradients */}
          <div className="absolute inset-0 bg-brand-purple/5 mix-blend-color z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-dark to-transparent z-15 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark to-transparent z-15 pointer-events-none" />
        </div>

        {/* Content Container Overlaid on top */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-20 flex items-center min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-xl md:max-w-2xl bg-black/15 backdrop-blur-lg border border-white/5 p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/90 mr-auto transition-all duration-300">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 max-w-max mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
              <span className="text-xs font-semibold tracking-widest text-brand-purple uppercase">Омск • Ул. Ленина, 7</span>
            </div>

            <h1 className="font-display font-black text-6xl sm:text-7xl xl:text-8xl text-white tracking-wider leading-none select-none mb-4">
              <span className="transition-all duration-500 hover:text-brand-purple hover:[text-shadow:0_0_20px_#bc26f5,0_0_40px_#bc26f5] cursor-default">BLADE</span>
            </h1>

            <h2 className="text-lg sm:text-xl font-display font-medium tracking-widest text-brand-gold uppercase mb-6">
              Hookah Bar & Lounge
            </h2>

            <p className="text-gray-300 text-base sm:text-lg max-w-md leading-relaxed mb-8">
              Место, где каждая деталь создаёт идеальный вечер. Премиальный сервис, авторские миксы и расслабряющая атмосфера в самом сердце Омска.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                href="#booking" 
                className="px-8 py-4 rounded-xl text-center bg-brand-purple text-white font-display font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:bg-brand-purple-dark hover:shadow-[0_0_25px_rgba(188,38,245,0.4)] border border-brand-purple"
              >
                Забронировать стол
              </a>
              <a 
                href="#menu" 
                className="px-8 py-4 rounded-xl text-center border border-white/10 hover:border-brand-purple/50 bg-white/5 hover:bg-brand-purple/10 text-white font-display font-bold uppercase tracking-widest text-xs transition-all duration-300"
              >
                Исследовать меню
              </a>
            </div>

            {/* Micro details */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10 max-w-md">
              <div>
                <span className="block font-display text-white font-black text-xl">18+</span>
                <span className="text-xxs text-gray-500 uppercase tracking-wider">Паспорт обязателен</span>
              </div>
              <div>
                <span className="block font-display text-white font-black text-xl">12:00</span>
                <span className="text-xxs text-gray-500 uppercase tracking-wider">До последнего гостя</span>
              </div>
              <div>
                <span className="block font-display text-white font-black text-xl">10/10</span>
                <span className="text-xxs text-gray-500 uppercase tracking-wider">Попадание во вкус</span>
              </div>
            </div>

          </div>
        </div>

        {/* Audio Indicator Overlay just for premium realism vibes - floating bottom right */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-white text-xs font-display">
          <span className="flex gap-0.5 items-center">
            <span className="w-1 h-3 bg-brand-purple animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-1 h-4 bg-brand-purple animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span className="w-1 h-2.5 bg-brand-purple animate-bounce" style={{ animationDelay: '0.5s' }} />
            <span className="w-1 h-1 bg-brand-purple animate-bounce" style={{ animationDelay: '0.2s' }} />
          </span>
          <span>Lounge Radio Live</span>
        </div>

      </section>

      {/* 5. Section 1: About (Обзор) */}
      <section id="about" className="relative py-24 z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider mb-4">
              Искусство отдыхать
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-purple to-brand-gold mx-auto mb-6" />
            <p className="text-gray-400 text-lg leading-relaxed">
              BLADE — это концептуальный лаунж в историческом центре Омска. Мы создали пространство с акцентом на исключительное качество, непревзойдённый сервис и чувственное удовольствие.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Strength 1: Custom Flavor Profiling */}
            <div 
              className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col text-left transition-transform duration-300 ease-out select-none"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="w-14 h-14 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide mb-4">
                Философия ощущений
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Вы выбираете не табачные бренды, а <span className="text-brand-gold font-semibold">желаемое ощущение</span>. Наши мастера угадывают ваше настроение на 10 из 10, собирая индивидуальный вкусовой профиль под ваш запрос.
              </p>
              <div className="mt-auto text-xs text-brand-purple uppercase tracking-widest font-bold flex items-center gap-2">
                Индивидуальный микс <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Strength 2: Premium Hookahs */}
            <div 
              className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col text-left transition-transform duration-300 ease-out select-none"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="w-14 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold mb-6">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide mb-4">
                Премиальное Железо
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Мы используем только высококлассные дизайнерские кальяны с идеальной тягой и инновационным контролем жара. Никакой гари и горечи — только чистый, прохладный и густой дым.
              </p>
              <div className="mt-auto text-xs text-brand-gold uppercase tracking-widest font-bold flex items-center gap-2">
                Кальянные инновации <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* Strength 3: Spacious comfortable sofas */}
            <div 
              className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col text-left transition-transform duration-300 ease-out select-none"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="w-14 h-14 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wide mb-4">
                Уют без границ
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Просторные диваны с мягкой велюровой обивкой и продуманное зонирование столов позволяют уединиться своей компанией. Наслаждайтесь расслабляющей беседой без лишнего шума.
              </p>
              <div className="mt-auto text-xs text-brand-purple uppercase tracking-widest font-bold flex items-center gap-2">
                Просторные диваны <ArrowRight className="w-3 h-3" />
              </div>
            </div>

          </div>

          {/* Quick atmosphere stat banner */}
          <div className="mt-16 glass-panel rounded-2xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-display font-bold text-white text-base uppercase">Пятизвёздочный сервис</h4>
                <p className="text-sm text-gray-400">Постоянные проверки и высокие стандарты гостеприимства.</p>
              </div>
            </div>
            <div className="h-px w-full md:h-12 md:w-px bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
                <BellRing className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-display font-bold text-white text-base uppercase">Забота о вашем времени</h4>
                <p className="text-sm text-gray-400">Столы оборудованы кнопками мгновенного вызова персонала.</p>
              </div>
            </div>
            <button 
              onClick={handleStaffCallSimulation}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-indigo to-brand-purple hover:from-brand-purple hover:to-brand-purple-dark text-white font-display font-semibold text-xs uppercase tracking-wider shrink-0 transition-all duration-300 shadow-lg shadow-brand-purple/20"
            >
              Проверить кнопку вызова
            </button>
          </div>

        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection />

      {/* 6. Section 2: Menu & Philosophy */}
      <section id="menu" className="relative py-24 z-10 bg-bg-lounge/40 border-y border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider mb-4">
              Меню и Кухня
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-purple to-brand-gold mx-auto mb-6" />
            <p className="text-gray-400 text-lg">
              Мы объединили кулинарные традиции разных континентов и собрали премиальную барную карту, чтобы дополнить дымную палитру идеальным вкусом.
            </p>
          </div>

          {/* Navigation Tab */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
              <button
                onClick={() => setActiveMenuTab('hookah')}
                className={`px-6 py-3 rounded-lg font-display text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMenuTab === 'hookah' 
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" />
                Дымная Карта
              </button>
              <button
                onClick={() => setActiveMenuTab('kitchen')}
                className={`px-6 py-3 rounded-lg font-display text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMenuTab === 'kitchen' 
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4" />
                Континентальная Кухня
              </button>
              <button
                onClick={() => setActiveMenuTab('bar')}
                className={`px-6 py-3 rounded-lg font-display text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeMenuTab === 'bar' 
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <GlassWater className="w-4 h-4" />
                Премиум Бар
              </button>
            </div>
          </div>

          {/* Tab content wrapper with AnimatePresence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Menu item listings */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenuTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {(activeMenuTab === 'hookah' ? hookahMenu : activeMenuTab === 'kitchen' ? kitchenMenu : barMenu).map((item, idx) => (
                    <div 
                      key={idx}
                      className="glass-panel p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 hover:border-brand-purple/20 transition-all duration-300"
                    >
                      <div className="text-left space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-display font-bold text-white text-base tracking-wide uppercase">{item.name}</h4>
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/20">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{item.description}</p>
                      </div>
                      <div className="font-display font-black text-brand-gold text-lg sm:text-right shrink-0 whitespace-nowrap self-start sm:self-center">
                        {item.price}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Philosophy details & Rules badge */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="glass-panel p-8 rounded-2xl border border-white/5 text-left bg-gradient-to-br from-brand-indigo/10 to-brand-purple/5">
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-wider mb-4">Наш подход</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Мы считаем лаунж-вечер целостным ритуалом, в котором вкусы еды, напитков и дыма гармонируют между собой. Наши шеф-повара заказывают свежие специи и ингредиенты со всего мира, а бармены миксуют коктейли на основе натуральных эссенций.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Свежее мясо, паста ручной работы и вок</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Элитная чайная полка с выдержанными пуэрами</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>Профессиональный парринг напитков и кальяна</span>
                  </div>
                </div>
              </div>

              {/* Strict Rule Notice Box */}
              <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest text-red-400">Правило посещения</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Кальянная зона доступна для гостей, заказывающих кальян (<span className="text-white font-semibold">18+</span>, оригинал паспорта обязателен). Мы ответственно соблюдаем правила и заботимся о премиальном комфорте каждого гостя.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. Section 3: Reviews (Отзывы) */}
      <section id="reviews" className="relative py-24 z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider mb-4">
              Гости о нас
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-purple to-brand-gold mx-auto mb-6" />
            <p className="text-gray-400 text-lg">
              Мы ценим обратную связь и гордимся тем, что создаём незабываемые моменты. Ниже представлены реальные отзывы наших посетителей.
            </p>
          </div>

          {/* Interactive Carousel */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* Review Card */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden text-center border border-white/5 shadow-2xl">
              
              {/* Massive decorative quote icon */}
              <div className="absolute top-6 left-6 font-serif text-8xl text-brand-purple/10 pointer-events-none select-none">“</div>
              <div className="absolute bottom-6 right-6 font-serif text-8xl text-brand-purple/10 pointer-events-none select-none rotate-180">“</div>

              <div className="flex justify-center gap-1 text-brand-gold mb-6">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-white text-lg md:text-xl md:leading-relaxed font-sans font-light italic mb-8 max-w-2xl mx-auto relative z-10">
                "{reviews[currentReview].text}"
              </blockquote>

              {/* Reviewer Details */}
              <div className="relative z-10">
                <cite className="not-italic block font-display font-bold text-white text-base uppercase tracking-wider">
                  {reviews[currentReview].name}
                </cite>
                <span className="text-xs text-brand-purple uppercase tracking-widest font-semibold mt-1 block">
                  {reviews[currentReview].role}
                </span>
              </div>

            </div>

            {/* Slider Controls */}
            <div className="flex justify-between items-center mt-8 px-4">
              
              {/* Pagination Dots */}
              <div className="flex gap-2.5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentReview === i ? 'w-8 bg-brand-purple' : 'w-2 bg-white/20 hover:bg-white/45'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow navigation buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReviewPrev}
                  className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 hover:border-brand-purple/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple/10 transition-all duration-300"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleReviewNext}
                  className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 hover:border-brand-purple/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-purple/10 transition-all duration-300"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

          {/* Real Yandex/2GIS badge elements */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-white">Yandex</span>
              <span className="text-brand-gold text-lg font-bold">★ 4.9/5</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-white">2GIS</span>
              <span className="text-brand-gold text-lg font-bold">★ 4.8/5</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-white/20 hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-white">Google</span>
              <span className="text-brand-gold text-lg font-bold">★ 5.0/5</span>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Section 4: Contacts & Booking Form */}
      <section id="contacts" className="relative py-24 z-10 bg-bg-lounge/40 border-t border-white/5 scroll-mt-20">
        <div id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left side: Information, address, call button message */}
            <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8">
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/20 max-w-max">
                  <span className="text-xs font-semibold tracking-widest text-brand-gold uppercase">Премиум Бронь</span>
                </div>
                
                <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-wider leading-tight">
                  Резерв Стола
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  Забронируйте лучшее место прямо сейчас. Мы свяжемся с вами в течение 5 минут для подтверждения бронирования и уточнения всех деталей вкусового профиля.
                </p>
              </div>

              <div className="space-y-6">
                
                {/* Address block */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest text-gray-400">Наш Адрес</h4>
                    <p className="text-white text-sm font-semibold">Омск, ул. Ленина, 7</p>
                    <p className="text-gray-500 text-xs">Исторический центр, отдельный вход</p>
                  </div>
                </div>

                {/* Contacts phone block */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest text-gray-400">Контакты</h4>
                    <p className="text-white text-sm font-semibold hover:text-brand-purple transition-colors">
                      <a href="tel:+73812777777">+7 (3812) 77-77-77</a>
                    </p>
                    <p className="text-gray-500 text-xs">Ежедневно: 12:00 — До последнего гостя</p>
                  </div>
                </div>

                {/* waiter call button addressing feedback */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                    <BellRing className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-white text-xs uppercase tracking-widest text-brand-gold">Сервис Комфорта</h4>
                    <p className="text-white text-sm font-semibold">Кнопки вызова официантов</p>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Все столы оснащены кнопками мгновенного вызова персонала для вашего максимального комфорта и приватности. Официант подойдёт незамедлительно.
                    </p>
                  </div>
                </div>

              </div>

              {/* Booking success summary notice */}
              {activeBooking && (
                <div className="glass-panel p-5 rounded-2xl border border-green-500/20 bg-green-500/5 text-left flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-white text-xs uppercase tracking-wider text-green-400">Активный резерв стола</h5>
                    <p className="text-gray-400 text-xs">
                      Вы успешно забронировали стол на <span className="text-white font-medium">{activeBooking.guests} перс.</span>, дата: <span className="text-white font-medium">{activeBooking.date}</span>, время: <span className="text-white font-medium">{activeBooking.time}</span>.
                    </p>
                    <button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="text-brand-purple hover:text-brand-purple-dark text-xs font-bold underline transition-all mt-1 block"
                    >
                      Посмотреть электронный билет
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Right side: Interactive Form with animation */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/5 text-left shadow-2xl relative">
                
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="booking-name" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Ваше Имя *</label>
                      <input
                        type="text"
                        id="booking-name"
                        required
                        placeholder="Например, Александр"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label htmlFor="booking-phone" className="block text-xs font-bold uppercase tracking-widest text-gray-400 font-sans">Телефон *</label>
                      <input
                        type="tel"
                        id="booking-phone"
                        required
                        placeholder="+7 (___) ___-__-__"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none transition-all duration-300"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    
                    {/* Date */}
                    <div className="space-y-2">
                      <label htmlFor="booking-date" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Дата резерва *</label>
                      <input
                        type="date"
                        id="booking-date"
                        required
                        value={bookingForm.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <label htmlFor="booking-time" className="block text-xs font-bold uppercase tracking-widest text-gray-400">Время *</label>
                      <select
                        id="booking-time"
                        required
                        value={bookingForm.time}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 focus:border-brand-purple focus:ring-1 focus:ring-brand-purple rounded-xl px-4 py-3.5 text-white text-sm outline-none transition-all duration-300"
                      >
                        <option value="12:00">12:00</option>
                        <option value="13:30">13:30</option>
                        <option value="15:00">15:00</option>
                        <option value="16:30">16:30</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                        <option value="21:30">21:30</option>
                        <option value="23:00">23:00</option>
                        <option value="00:30">00:30</option>
                        <option value="02:00">02:00</option>
                      </select>
                    </div>

                    {/* Guests Count */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Количество гостей</label>
                      <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-2 h-[48px]">
                        <button
                          type="button"
                          onClick={() => setBookingForm(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-display font-bold text-white">{bookingForm.guests}</span>
                        <button
                          type="button"
                          onClick={() => setBookingForm(prev => ({ ...prev, guests: Math.min(15, prev.guests + 1) }))}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Submission Info and Submit button */}
                  <div className="pt-4 space-y-4">
                    <p className="text-[11px] text-gray-500 leading-relaxed text-center sm:text-left">
                      Нажимая кнопку, вы соглашаетесь с правилами посещения заведения (18+, оригинал паспорта обязателен для кальянной зоны).
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-display font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-[0_0_20px_rgba(188,38,245,0.4)] relative overflow-hidden flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Оформление резерва...
                        </>
                      ) : (
                        <>
                          Зарезервировать Стол
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="relative bg-black py-12 z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-[0.2em] text-white">BLADE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
            </div>
            <p className="text-gray-500 text-xs mt-1">© 2026 BLADE Hookah Bar & Lounge. Все права защищены.</p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#about" className="text-xs text-gray-400 hover:text-brand-purple transition-colors">Обзор</a>
            <a href="#menu" className="text-xs text-gray-400 hover:text-brand-purple transition-colors">Меню</a>
            <a href="#reviews" className="text-xs text-gray-400 hover:text-brand-purple transition-colors">Отзывы</a>
            <a href="#booking" className="text-xs text-gray-400 hover:text-brand-purple transition-colors">Бронирование</a>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Сделано для Вашего комфорта</p>
            <p className="text-xxs text-gray-600 mt-0.5">Вход строго 18+ при предъявлении паспорта</p>
          </div>

        </div>
      </footer>

      {/* 10. Interactive Booking Receipt/Ticket Modal */}
      <AnimatePresence>
        {isBookingModalOpen && activeBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Ticket Card Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#160e1f] rounded-3xl overflow-hidden border border-brand-purple/30 shadow-2xl shadow-brand-purple/10 z-10 flex flex-col"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing header banner */}
              <div className="bg-gradient-to-r from-brand-indigo to-brand-purple-dark px-6 py-6 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-bold">Электронный резерв стола</span>
                <h3 className="font-display font-black text-2xl text-white tracking-wider uppercase mt-1">BLADE LOUNGE</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-white/70 font-mono">ID: {activeBooking.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/30">
                    Подтверждено
                  </span>
                </div>
              </div>

              {/* Ticket Details Body */}
              <div className="p-6 space-y-6 text-left relative bg-[#130b1b]">
                
                {/* Guest & Phone details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xxs text-gray-500 uppercase tracking-widest block">Гость</span>
                    <span className="text-sm font-semibold text-white mt-1 block">{activeBooking.name}</span>
                  </div>
                  <div>
                    <span className="text-xxs text-gray-500 uppercase tracking-widest block">Телефон</span>
                    <span className="text-sm font-semibold text-white mt-1 block font-mono">{activeBooking.phone}</span>
                  </div>
                </div>

                {/* Date / Time / Guests quantity */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                  <div>
                    <span className="text-xxs text-gray-500 uppercase tracking-widest block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-brand-purple" />
                      Дата
                    </span>
                    <span className="text-sm font-semibold text-white mt-1 block">
                      {new Date(activeBooking.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-xxs text-gray-500 uppercase tracking-widest block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-purple" />
                      Время
                    </span>
                    <span className="text-sm font-semibold text-white mt-1 block font-mono">{activeBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-xxs text-gray-500 uppercase tracking-widest block flex items-center gap-1">
                      <Users className="w-3 h-3 text-brand-purple" />
                      Места
                    </span>
                    <span className="text-sm font-semibold text-white mt-1 block">{activeBooking.guests} чел.</span>
                  </div>
                </div>

                {/* Features highlighted on the booking */}
                <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5 text-xs text-gray-400">
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Для вас забронирована комфортная мягкая диванная зона.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Стол оснащён кнопкой вызова waiters для максимального сервиса.</span>
                  </div>
                  <div className="flex gap-2 items-start">
                    <ShieldAlert className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                    <span>Пожалуйста, не забудьте <span className="text-white font-bold">оригинал паспорта (18+)</span> для входа.</span>
                  </div>
                </div>

                {/* CSS Barcode graphics */}
                <div className="flex flex-col items-center pt-2 space-y-2 select-none pointer-events-none">
                  <div className="flex h-12 w-full gap-0.5 justify-center items-stretch opacity-60">
                    {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 3, 1, 2, 1, 3, 4, 1].map((width, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white" 
                        style={{ width: `${width * 2}px` }} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono tracking-[0.3em]">{activeBooking.id}</span>
                </div>

                {/* Cancel Booking Action */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-display text-xs uppercase tracking-widest font-bold transition-all duration-300"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="py-3 px-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 font-display text-xs uppercase tracking-widest font-bold transition-all duration-300"
                  >
                    Отменить бронь
                  </button>
                </div>

                <p className="text-[10px] text-gray-600 text-center mt-4">
                  Оформлено {activeBooking.bookedAt}
                </p>

              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
