"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Eye,
  Clock,
  Target,
  Zap,
  Mail,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────── Design Tokens ─────────────── */
const c = {
  navy: "#0B1D2A",
  dark: "#071420",
  surface: "#0F2A3D",
  teal: "#17B2A6",
  mint: "#AEEBE1",
  lightMint: "#E6FAF6",
  gray: "#8BA3B5",
  white: "#FFFFFF",
  border: "#1A3D52",
} as const;

/* ─────────────── Chart Data ─────────────── */
const datasetData = [
  { name: "Normal", count: 850 },
  { name: "Cataract", count: 850 },
  { name: "Blepharitis", count: 850 },
  { name: "Conjunctivitis", count: 850 },
];

/* ─────────────── Navbar ─────────────── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Problem", id: "problem" },
    { label: "Methods", id: "methods" },
    { label: "Results", id: "results" },
    { label: "Contact", id: "contact" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1D2A]/90 backdrop-blur-md border-b border-[#1A3D52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2 group">
          <Eye className="w-7 h-7 text-[#17B2A6]" />
          <span className="text-[#E6FAF6] font-semibold text-lg tracking-tight">
            OPTISCAN AI
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(l.id); }}
              className="text-sm font-medium text-[#8BA3B5] hover:text-[#E6FAF6] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#/"
            className="text-sm font-medium text-[#8BA3B5] hover:text-[#E6FAF6] transition-colors"
          >
            Portfolio
          </a>
          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#17B2A6] text-white text-sm font-medium rounded-lg hover:bg-[#118A81] active:scale-[0.98] transition-all"
          >
            Get in Touch
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[#E6FAF6]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0B1D2A] border-t border-[#1A3D52] px-4 pb-4 pt-2 space-y-2">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { scrollTo(l.id); setMobileOpen(false); }}
              className="block w-full text-left py-2 text-sm font-medium text-[#8BA3B5] hover:text-[#E6FAF6] transition-colors"
            >
              {l.label}
            </button>
          ))}
          <a
            href="#/"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-sm font-medium text-[#8BA3B5] hover:text-[#E6FAF6] transition-colors"
          >
            Portfolio
          </a>
          <button
            onClick={() => { scrollTo('contact'); setMobileOpen(false); }}
            className="block w-full text-center mt-2 px-6 py-2.5 bg-[#17B2A6] text-white text-sm font-medium rounded-lg hover:bg-[#118A81] active:scale-[0.98] transition-all"
          >
            Get in Touch
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Hero Section ─────────────── */
function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.hero-badge', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .fromTo('.hero-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .fromTo('.hero-desc', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .fromTo('.hero-mockup', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.25')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#071420]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E6FAF6] leading-tight tracking-tight">
            Smarter Scans.
            <br />
            Better Decisions.
            <br />
            Healthier Lives.
          </h1>
          <p className="hero-desc mt-6 text-lg text-[#8BA3B5] max-w-xl mx-auto lg:mx-0">
            An AI-powered eye disease classification system providing fast,
            accurate, and low-cost preliminary screening.
          </p>
        </div>

        <div className="hero-mockup flex-1 w-full max-w-lg">
          <img
            src="/images/optiscan-dashboard.png"
            alt="OptiScan AI Dashboard"
            className="w-full aspect-[4/3] object-contain rounded-2xl border border-[#1A3D52] shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Problem Cards ─────────────── */
function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cards = [
    {
      icon: Clock,
      title: "Slow & Expensive",
      description:
        "Many individuals delay checkups due to lack of accessible screening, leading to preventable vision loss.",
    },
    {
      icon: Target,
      title: "The Engineering Goal",
      description:
        "Develop an AI system that provides quick, low-cost preliminary eye disease screening using standard eye images.",
    },
    {
      icon: Zap,
      title: "The Solution",
      description:
        "Moving away from computationally heavy models to a lightweight EfficientNet-B0 architecture for practical, real-world deployment.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.problem-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.problem-card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="problem" className="py-20 bg-[#071420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="problem-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] text-center mb-12">
          The Vision Care Gap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="problem-card bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(23,178,166,0.15)] hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0B1D2A] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#17B2A6]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#E6FAF6]">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[#8BA3B5] leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Custom Chart Tooltip ─────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#0F2A3D] border border-[#1A3D52] rounded-lg px-4 py-2">
      <p className="text-sm font-semibold text-[#E6FAF6]">{label}</p>
      <p className="text-sm text-[#17B2A6] font-medium">{payload[0].value} images</p>
    </div>
  );
}

/* ─────────────── Methods Section ─────────────── */
function MethodsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bullets = [
    "Built with Python and PyTorch.",
    "Uses an EfficientNet-B0 CNN pretrained on ImageNet, fine-tuned on a custom dataset.",
    "Pipeline includes transfer learning with heavy data augmentation (flips, rotation, Gaussian noise) and a Streamlit web dashboard for instant classification.",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.methods-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.methods-bullet', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
        .fromTo('.methods-chart', { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="methods" className="py-20 bg-[#071420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="methods-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] text-center mb-12">
          How OptiScan AI Works
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 self-center">
            <ul className="space-y-5">
              {bullets.map((b, i) => (
                <li key={i} className="methods-bullet flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#0B1D2A] flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#17B2A6]" />
                  </span>
                  <span className="text-[#8BA3B5] leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="methods-chart flex-1 w-full self-center">
            <div className="bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-[#E6FAF6] mb-1">
                Dataset Balance
              </h3>
              <p className="text-sm text-[#8BA3B5] mb-6">
                3,400 total images across 4 classes
              </p>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datasetData}
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#1A3D52"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#8BA3B5", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#8BA3B5", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 1000]}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={48}>
                      {datasetData.map((_, index) => (
                        <Cell key={index} fill="#17B2A6" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Results Section ─────────────── */
function ResultsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stats = [
    { value: "90-95%", label: "External Test Accuracy" },
    { value: "3,400", label: "Training Images" },
    { value: "280", label: "Unseen Test Images" },
    { value: "86-90%", label: "Confidence Scores" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.results-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.results-stat', { opacity: 0, y: 24, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
        .fromTo('.results-note', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.15')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="results" className="py-20 bg-[#071420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="results-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] text-center mb-12">
          Proven Accuracy
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="results-stat bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-6 lg:p-8 text-center transition-all duration-300 hover:shadow-[0_12px_32px_rgba(23,178,166,0.15)] hover:-translate-y-1"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17B2A6]">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-[#8BA3B5] font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="results-note mt-10 text-center text-[#8BA3B5] max-w-3xl mx-auto leading-relaxed">
          Testing analysis showed zero misclassifications in the confusion matrix
          and consistently high precision, recall, and F1-score across all 4
          classes.
        </p>
      </div>
    </section>
  );
}

/* ─────────────── Use Cases Section ─────────────── */
function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cases = [
    "Preliminary screening in remote/underserved areas.",
    "Educational tool for medical students.",
    "Telemedicine apps for initial assessments.",
    "Integration into routine healthcare monitoring.",
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.usecases-title', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.usecase-item', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-[#071420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="usecases-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] text-center mb-12">
          Real-World Applications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {cases.map((c, i) => (
            <div
              key={i}
              className="usecase-item flex items-center gap-4 bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(23,178,166,0.15)] hover:-translate-y-1"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0B1D2A] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#17B2A6]" />
              </div>
              <p className="text-[#E6FAF6] font-medium leading-snug">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Contact Section ─────────────── */
function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.contact-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.contact-icon', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.25')
        .fromTo('.contact-email', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="py-20 lg:py-28 bg-[#0F2A3D]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="contact-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] mb-6">
          Invest, Collaborate, or Learn More
        </h2>
        <div className="contact-icon flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0B1D2A] flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#17B2A6]" />
          </div>
        </div>
        <a
          className="contact-email inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#17B2A6] hover:text-[#AEEBE1] transition-colors break-all max-w-full"
          href="mailto:hassanahmedshm@gmail.com"
        >
          hassanahmedshm@gmail.com
        </a>
      </div>
    </section>
  );
}

/* ─────────────── Team & References ─────────────── */
function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' } })
      tl.fromTo('.team-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
        .fromTo('.team-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-[#071420]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="team-title text-3xl sm:text-4xl font-bold text-[#E6FAF6] text-center mb-12">
          Team &amp; References
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            className="team-card bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-6 lg:p-8"
          >
            <h3 className="text-lg font-semibold text-[#E6FAF6] mb-3">
              The Team
            </h3>
            <p className="text-[#8BA3B5] leading-relaxed">
              Researchers &amp; Engineers: Mohamed Naguib, Mazen Mohamed, Hassan Ahmed, Badr Hassan
            </p>
          </div>
          <div
            className="team-card bg-[#0F2A3D] border border-[#1A3D52] rounded-2xl p-6 lg:p-8"
          >
            <h3 className="text-lg font-semibold text-[#E6FAF6] mb-3">
              References
            </h3>
            <p className="text-[#8BA3B5] leading-relaxed">
              Built utilizing: EfficientNet, PyTorch, timm library,
              Albumentations, Streamlit, Kaggle &amp; Roboflow datasets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */
function Footer() {
  return (
    <footer className="bg-[#071420] text-white py-8 border-t border-[#1A3D52]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#17B2A6]" />
          <span className="font-semibold text-sm text-[#E6FAF6]">OPTISCAN AI</span>
        </div>
        <p className="text-sm text-[#8BA3B5]">
          &copy; {new Date().getFullYear()} OptiScan AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#071420]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <MethodsSection />
        <ResultsSection />
        <UseCasesSection />
        <ContactSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
