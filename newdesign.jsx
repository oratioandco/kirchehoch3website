import React, { useState, useEffect, useRef } from 'react';

// --- SVG LOGO COMPONENT ---
const LogoSVG = ({ className }) => (
  <svg className={className} viewBox="0 0 305 243" xmlns="http://www.w3.org/2000/svg" style={{ fillRule: 'evenodd', clipRule: 'evenodd', strokeLinejoin: 'round', strokeMiterlimit: 2 }}>
    <g>
      <path 
        d="M199.122,78.944l99.276,-78.158c0.925,-0.607 1.993,-0.885 3.161,-0.754c2.751,0.807 2.921,1.301 3.108,3.848l0.043,234.315c-0.311,3.112 -1.026,3.579 -3.879,3.822l-60.364,-0.098c-0.258,0.05 -0.509,0.08 -0.742,0.097l-51.886,-0.11c-0.233,0.057 -0.477,0.094 -0.73,0.11l-183.314,-0.5c-2.736,-0.184 -4.66,-2.964 -3.398,-5.712l91.478,-169.549c1.264,-2.006 1.419,-2.168 3.927,-1.999c1.154,0.236 1.869,0.379 2.889,1.998l18.77,34.756l61.714,-70.984c0.852,-0.839 1.288,-1.599 3.773,-1.238c2.176,0.668 2.404,1.431 2.88,2.733l13.295,47.422Zm2.264,8.076l41.257,147.157l54.372,0.087l-0.2,-222.373l-95.428,75.129Zm-64.189,50.535l52.132,96.531l45.265,0.077l-39.798,-141.955l-57.599,45.347Zm-122.236,96.234l165.556,0.282l-49.497,-91.653l-116.059,91.371Zm18.691,-24.574l93.632,-73.714l-11.32,-20.961l-82.311,94.676Zm-9.853,-0.473l88.232,-101.485l-16.746,-31.008l-71.486,132.494Zm97.595,-100.449l12.067,22.344l59.071,-46.505l-12.224,-43.602l-58.914,67.763Z" 
        fill="currentColor" 
        fillRule="nonzero" 
      />
    </g>
  </svg>
);

// --- SCROLLING LOGO ANIMATION ---
const AnimatedLogo = () => {
  const wrapperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let rafId;

    const updatePosition = () => {
      if (!wrapperRef.current) return;
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight * 0.45;
      const progress = Math.min(scrollY / maxScroll, 1);

      // Smooth ease-out cubic for buttery feel
      const ease = 1 - Math.pow(1 - progress, 3);

      const startY = window.innerHeight * 0.26;
      const endY = 12; // Slightly higher for smaller logo

      const currentY = startY + (endY - startY) * ease;

      // Scale down more on desktop (to 40px instead of 60px)
      const isDesktop = window.innerWidth >= 768;
      const targetScale = isDesktop ? 0.25 : 0.375; // 40px on desktop, 60px on mobile
      const scale = 1 - (ease * (1 - targetScale));

      wrapperRef.current.style.transform = `translate(-50%, ${currentY}px) scale(${scale})`;

      rafId = requestAnimationFrame(updatePosition);
    };

    rafId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed left-1/2 top-0 z-50 origin-top pointer-events-none text-[#1A1A1A]"
      style={{ transform: 'translate(-50%, 26vh) scale(1)', width: '160px', willChange: 'transform' }}
    >
      <div className={`transition-opacity duration-[1500ms] ease-out delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <LogoSVG className="w-full h-auto drop-shadow-sm" />
      </div>
    </div>
  );
};

// --- HERO SLIDESHOW & MESH BACKGROUND ---
const HeroBackground = () => {
  const images = [
    "https://images.unsplash.com/photo-1490806844510-18eb28dfbc6a?q=80&w=2000&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1510526084656-78b1d9d7bdba?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop",
  ];
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(images.length - 1); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => {
        setPrev(c); 
        return (c + 1) % images.length; 
      });
    }, 5500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 bg-[#F7F6F2] overflow-hidden">
      {/* True Crossfade Photo Slideshow */}
      <div className="absolute inset-0">
        {images.map((img, i) => {
          const isActive = i === current;
          const isPrev = i === prev;
          
          return (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2500ms] ease-in-out"
              style={{
                backgroundImage: `url(${img})`,
                opacity: isActive || isPrev ? 1 : 0,
                zIndex: isActive ? 2 : (isPrev ? 1 : 0),
              }}
            />
          );
        })}
      </div>

      {/* Animated Mesh Gradient Overlay */}
      <div className="absolute inset-0 hero-mesh mix-blend-multiply opacity-90 z-10" />

      {/* Base Lightening for Text Readability */}
      <div className="absolute inset-0 bg-[#F7F6F2]/30 z-10" />
    </div>
  );
};

// --- ANIMATION COMPONENTS ---
const FadeInUp = ({ children, delay = 0, className = '' }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  );
};

// Kinetic Text Line (Unmasked Slide & Fade to fix all clipping issues)
const KineticLine = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span className={`block ${className}`}>
      <span 
        className="block transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
          opacity: isVisible ? 1 : 0
        }}
      >
        {children}
      </span>
    </span>
  );
};

// --- MARQUEE COMPONENT ---
const Marquee = ({ text, bgColor = "bg-[#F7F6F2]", textColor = "text-[#1A1A1A]" }) => (
  <div className={`w-full overflow-hidden ${bgColor} ${textColor} py-5 border-y border-[#1A1A1A]/5 flex whitespace-nowrap`}>
    <div className="animate-marquee font-serif italic text-2xl md:text-3xl tracking-widest flex shrink-0">
      <span className="px-8">{text}</span>
      <span className="px-8">{text}</span>
      <span className="px-8">{text}</span>
      <span className="px-8">{text}</span>
    </div>
  </div>
);

// --- FLAWLESS HORIZONTAL SCROLL GALLERY ---
const StickyScrollGallery = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);

  // All available images - more variety for longer scroll
  const allImages = [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3af?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520483601560-389e4d774e1a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560439514-4e9645039924?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1491013516836-7db643ee125a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529156069898-4db257e91a28?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
  ];

  // Randomly sample images on mount
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Shuffle and pick random subset
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setImages(shuffled);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const updateLayoutAndScroll = () => {
      if (!containerRef.current || !stickyRef.current || !trackRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      // Increase horizontal scroll distance by 50%
      const scrollableWidth = trackWidth - windowWidth + (windowWidth * 0.5);

      // Dynamically set exact height
      const stickyHeight = stickyRef.current.offsetHeight;
      containerRef.current.style.height = `${stickyHeight + scrollableWidth}px`;

      const { top } = containerRef.current.getBoundingClientRect();
      const startOffset = 80;

      let progress = -(top - startOffset) / scrollableWidth;
      progress = Math.max(0, Math.min(progress, 1));

      // Smooth ease-out for buttery scroll feel
      const easedProgress = 1 - Math.pow(1 - progress, 2);

      trackRef.current.style.transform = `translate3d(-${easedProgress * scrollableWidth}px, 0, 0)`;
    };

    window.addEventListener('scroll', updateLayoutAndScroll, { passive: true });
    window.addEventListener('resize', updateLayoutAndScroll);

    // Initial calculation after images load
    setTimeout(updateLayoutAndScroll, 150);

    return () => {
      window.removeEventListener('scroll', updateLayoutAndScroll);
      window.removeEventListener('resize', updateLayoutAndScroll);
    };
  }, [images]);

  return (
    <div id="community" ref={containerRef} className="relative bg-[#F7F6F2] border-y border-black/5">
      <div ref={stickyRef} className="sticky top-[80px] w-full overflow-hidden py-16 md:py-24">
        
        <div className="pl-6 md:pl-12 z-10 mb-12 md:mb-16">
          <FadeInUp>
            <h2 className="font-serif text-5xl md:text-7xl text-[#1A1A1A]">Menschen.</h2>
            <p className="font-sans uppercase tracking-[0.3em] text-xs mt-4 text-[#1A1A1A]/60">Gemeinschaft erleben</p>
          </FadeInUp>
        </div>

        <div
          ref={trackRef}
          className="flex gap-6 md:gap-12 pl-6 md:pl-12 pr-12 items-center"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {images.map((src, idx) => (
            <div key={idx} className="w-[80vw] md:w-[45vw] lg:w-[30vw] shrink-0 global-grain-container relative group">
              <div className="w-full pt-[130%] relative overflow-hidden bg-[#e0ded8]">
                <img 
                  src={src} 
                  alt={`Community ${idx}`} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#F7F6F2] text-[#1A1A1A] min-h-screen font-sans selection:bg-[#1A1A1A] selection:text-[#F7F6F2] overflow-x-hidden relative">
      {/* GLOBAL STYLES & FONTS */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        
        /* Crisp, High-Contrast Global Film Grain */
        .global-grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 120px 120px; 
          opacity: 0.22; 
          mix-blend-mode: multiply;
          pointer-events: none;
          z-index: 9999; 
        }

        /* Animated Teal/Sage/Terracotta Mesh Gradient */
        .hero-mesh {
          background-image: 
            radial-gradient(circle at 15% 20%, rgba(61, 124, 127, 0.7) 0%, transparent 60%), 
            radial-gradient(circle at 85% 75%, rgba(167, 93, 77, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, rgba(124, 137, 115, 0.5) 0%, transparent 70%);
          background-size: 200% 200%;
          animation: meshPulse 12s ease-in-out infinite alternate;
        }

        @keyframes meshPulse {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }

        /* Kinetic Marquee */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #F7F6F2; }
        ::-webkit-scrollbar-thumb { background: #d0cec5; border-radius: 4px; }
      `}} />

      {/* Film Grain Overlay */}
      <div className="global-grain"></div>

      {/* FLOATING & SHRINKING LOGO */}
      <AnimatedLogo />

      {/* FIXED HEADER (Strict heights for perfect centering math) */}
      <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 flex items-center ${scrolled ? 'h-[80px] bg-[#F7F6F2]/85 backdrop-blur-md border-b border-[#1A1A1A]/5' : 'h-[120px]'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center relative w-full">
          <nav className="hidden md:flex space-x-12 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/80 font-medium w-1/3">
            <a href="#vision" className="hover:text-black transition-colors duration-300">Vision</a>
            <a href="#community" className="hover:text-black transition-colors duration-300">Gemeinschaft</a>
          </nav>
          
          {/* Exact dimension spacer strictly matching the scaled logo width (60x48) to preserve layout balance */}
          <div className="w-[60px] h-[48px] mx-auto opacity-0 flex-shrink-0" />
          
          <nav className="hidden md:flex justify-end space-x-12 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/80 font-medium w-1/3">
            <a href="#gatherings" className="hover:text-black transition-colors duration-300">Gottesdienste</a>
            <a href="#contact" className="hover:text-black transition-colors duration-300">Kontakt</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION WITH SLIDESHOW AND MESH GRADIENT */}
      <section className="relative h-[100svh] flex flex-col items-center justify-center px-4 md:px-6">
        
        <HeroBackground />
        
        {/* Typographic Centerpiece - Pushed down to rest directly below the logo */}
        <div className="text-center z-20 w-full relative pt-[44vh]">
          <h1 className="font-serif text-[16vw] md:text-[8rem] lg:text-[9.5rem] text-[#1A1A1A] leading-[1.0] md:leading-[0.9] tracking-tight">
            <KineticLine delay={400}>Glaube. Liebe.</KineticLine>
            <KineticLine delay={600} className="italic text-[#1A1A1A]/90">Hoffnung.</KineticLine>
          </h1>
          
          <FadeInUp delay={900}>
            <p className="font-sans font-medium tracking-[0.25em] uppercase text-[10px] md:text-xs text-[#1A1A1A]/60 mt-8 md:mt-12">
              Kirchehoch3 Berlin
            </p>
          </FadeInUp>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-50 z-20">
          <span className="text-[9px] uppercase tracking-[0.3em] mb-4 font-medium text-[#1A1A1A]">Scroll</span>
          <div className="w-[1px] h-12 bg-[#1A1A1A]/50"></div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee text="GLAUBE • LIEBE • HOFFNUNG • KIRCHEHOCH3 • " />

      {/* VISION SECTION */}
      <section id="vision" className="py-24 md:py-32 px-6 md:px-12 max-w-5xl mx-auto text-center relative z-20">
        <FadeInUp>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.3] text-[#1A1A1A]">
            Ein Raum für Fragen.<br/> <span className="text-[#1A1A1A]/50 italic">Ein Ort fürs Leben.</span>
          </h2>
        </FadeInUp>
        <FadeInUp delay={200}>
          <p className="font-sans font-light text-sm md:text-base text-[#1A1A1A]/60 max-w-2xl mx-auto mt-10 leading-relaxed">
            Wir sind eine bunte Mischung von Menschen in Berlin-Pankow. Egal, wo du herkommst, egal, ob du Christ*in bist oder nicht, komm wie du bist – du bist willkommen.
          </p>
          <div className="mt-16 flex justify-center">
             <button className="group flex flex-col items-center space-y-3 cursor-pointer">
                <span className="font-sans uppercase tracking-[0.3em] text-[10px] text-[#1A1A1A]/60 group-hover:text-[#1A1A1A] transition-colors duration-300">Mehr Erfahren</span>
                <span className="w-[1px] h-12 bg-[#1A1A1A]/20 group-hover:bg-[#1A1A1A] transition-all duration-500 group-hover:h-16"></span>
             </button>
          </div>
        </FadeInUp>
      </section>

      {/* HORIZONTAL SCROLL GALLERY SECTION */}
      <StickyScrollGallery />

      {/* MARQUEE */}
      <Marquee text="SONNTAGS • MITTEN IN BERLIN • JEDER IST WILLKOMMEN • " bgColor="bg-[#EBE7E0]" />

      {/* GOTTESDIENSTE & EVENTS */}
      <section id="gatherings" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 md:order-1 space-y-10 pr-0 md:pr-16">
            <FadeInUp>
              <h2 className="font-serif text-5xl md:text-7xl text-[#1A1A1A]">Gottesdienste.</h2>
              <p className="font-sans mt-8 text-[#1A1A1A]/70 leading-relaxed font-light text-sm md:text-base">
                Wir vertrauen auf den Gott, der in Jesus Christus Mensch geworden ist. Unser Gottesdienst ist der Herzschlag unserer Kirche – ein Moment des Innehaltens inmitten des Berliner Rauschens.
              </p>
              
              <div className="mt-12 space-y-8">
                <div className="border-l border-[#1A1A1A]/30 pl-6 py-2">
                  <h4 className="font-serif text-2xl mb-2">Sonntagsgottesdienst</h4>
                  <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/60">
                    Jeden Sonntag, 16:00 Uhr <br/> cafeimpuls, Breite Straße 49, 13187 Berlin
                  </p>
                </div>
                
                <div className="border-l border-[#1A1A1A]/30 pl-6 py-2">
                  <h4 className="font-serif text-2xl mb-2">LEGO® Brunch</h4>
                  <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/60">
                    1. Sonntag im Monat, 11:00 Uhr <br/> cafeimpuls, Breite Straße 49
                  </p>
                </div>
              </div>
            </FadeInUp>
          </div>
          
          <div className="order-1 md:order-2">
            <FadeInUp delay={200}>
              <div className="relative group overflow-hidden bg-[#e0ded8]">
                <img 
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80" 
                  alt="Worship Gathering" 
                  className="w-full h-[60vh] md:h-[75vh] object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] grayscale-[20%]"
                />
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#1A1A1A] text-[#F7F6F2] pt-32 pb-12 px-6 text-center relative z-20">
        <FadeInUp>
          <div className="w-[1px] h-20 bg-[#F7F6F2]/20 mx-auto mb-16"></div>
          <h2 className="font-serif text-4xl md:text-6xl mb-24">Kirchehoch3</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto mb-32 border-t border-[#F7F6F2]/10 pt-20">
            <div className="space-y-6">
              <h4 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#F7F6F2]/40">Adresse</h4>
              <p className="font-serif text-xl text-[#F7F6F2]/80">Breite Straße 49<br/>13187 Berlin-Pankow</p>
            </div>
            <div className="space-y-6">
              <h4 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#F7F6F2]/40">Kontakt</h4>
              <p className="font-serif text-xl text-[#F7F6F2]/80">info@kirchehoch3.berlin<br/>030 / 40 39 48 06</p>
            </div>
            <div className="space-y-6">
              <h4 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#F7F6F2]/40">Verbinden</h4>
              <div className="flex justify-center space-x-8 font-serif text-xl text-[#F7F6F2]/80">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">App Laden</a>
              </div>
            </div>
          </div>

          <p className="text-[#F7F6F2]/30 font-sans text-[9px] tracking-[0.4em] uppercase">
            © {new Date().getFullYear()} Kirchehoch3 Berlin. Glaube, Liebe, Hoffnung.
          </p>
        </FadeInUp>
      </footer>
    </div>
  );
}