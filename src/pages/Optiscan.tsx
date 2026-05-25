"use client";

import { useState } from "react";
import {
  Eye,
  Clock,
  Target,
  Zap,
  Mail,
  Image as ImageIcon,
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

/* ─────────────── Design Tokens ─────────────── */
const colors = {
  deepNavy: "#0B1D2A",
  teal: "#17B2A6",
  mint: "#AEEBE1",
  lightMint: "#E6FAF6",
  gray: "#6B7280",
  white: "#FFFFFF",
  tealHover: "#118A81",
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
    { label: "Problem", href: "#problem" },
    { label: "Methods", href: "#methods" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E6FAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Eye className="w-7 h-7 text-[#17B2A6]" />
          <span className="text-[#0B1D2A] font-semibold text-lg tracking-tight">
            OPTISCAN AI
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#6B7280] hover:text-[#0B1D2A] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#17B2A6] text-white text-sm font-medium rounded-lg hover:bg-[#118A81] active:scale-[0.98] transition-all"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#0B1D2A]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E6FAF6] px-4 pb-4 pt-2 space-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-[#6B7280] hover:text-[#0B1D2A] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center mt-2 px-6 py-2.5 bg-[#17B2A6] text-white text-sm font-medium rounded-lg hover:bg-[#118A81] active:scale-[0.98] transition-all"
          >
            Get in Touch
          </a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── Hero Section ─────────────── */
function HeroSection() {
  return (
    <section
      id="hero"
      className="pt-24 pb-16 md:pt-32 md:pb-24"
      style={{
        background: "linear-gradient(to bottom, #E6FAF6, #FFFFFF)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B1D2A] leading-tight tracking-tight">
            Smarter Scans.
            <br />
            Better Decisions.
            <br />
            Healthier Lives.
          </h1>
          <p className="mt-6 text-lg text-[#6B7280] max-w-xl mx-auto lg:mx-0">
            An AI-powered eye disease classification system providing fast,
            accurate, and low-cost preliminary screening.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a
              href="#results"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#17B2A6] text-white font-medium rounded-lg hover:bg-[#118A81] active:scale-[0.98] transition-all"
            >
              View Results <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#methods"
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[#0B1D2A] font-medium rounded-lg border border-[#17B2A6] hover:bg-[#E6FAF6] active:scale-[0.98] transition-all"
            >
              Explore Methods <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right - Placeholder */}
        <div className="flex-1 w-full max-w-lg">
          <div className="w-full aspect-[4/3] border-2 border-dashed border-[#17B2A6] rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/60">
            <ImageIcon className="w-12 h-12 text-[#17B2A6]" />
            <span className="text-sm font-medium text-[#6B7280]">
              Dashboard UI Screenshot Placeholder
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Problem Cards ─────────────── */
function ProblemSection() {
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

  return (
    <section id="problem" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1D2A] text-center mb-12">
          The Vision Care Gap
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white border border-[#E6FAF6] rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(11,29,42,0.1)] hover:-translate-y-1"
                style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#E6FAF6] flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#17B2A6]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0B1D2A] mb-3">
                  {card.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed">
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
    <div className="bg-white border border-[#E6FAF6] rounded-lg px-4 py-2 shadow-[0_8px_24px_rgba(11,29,42,0.05)]">
      <p className="text-sm font-semibold text-[#0B1D2A]">{label}</p>
      <p className="text-sm text-[#17B2A6] font-medium">{payload[0].value} images</p>
    </div>
  );
}

/* ─────────────── Methods Section ─────────────── */
function MethodsSection() {
  const bullets = [
    "Built with Python and PyTorch.",
    "Uses an EfficientNet-B0 CNN pretrained on ImageNet, fine-tuned on a custom dataset.",
    "Pipeline includes transfer learning with heavy data augmentation (flips, rotation, Gaussian noise) and a Streamlit web dashboard for instant classification.",
  ];

  return (
    <section id="methods" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1D2A] text-center mb-12">
          How OptiScan AI Works
        </h2>
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left - Text */}
          <div className="flex-1">
            <ul className="space-y-5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#E6FAF6] flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#17B2A6]" />
                  </span>
                  <span className="text-[#6B7280] leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Chart */}
          <div className="flex-1 w-full">
            <div
              className="bg-white border border-[#E6FAF6] rounded-2xl p-6 lg:p-8"
              style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
            >
              <h3 className="text-lg font-semibold text-[#0B1D2A] mb-1">
                Dataset Balance
              </h3>
              <p className="text-sm text-[#6B7280] mb-6">
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
                      stroke="#E6FAF6"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 12 }}
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
  const stats = [
    { value: "90-95%", label: "External Test Accuracy" },
    { value: "3,400", label: "Training Images" },
    { value: "280", label: "Unseen Test Images" },
    { value: "86-90%", label: "Confidence Scores" },
  ];

  return (
    <section id="results" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1D2A] text-center mb-12">
          Proven Accuracy
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#E6FAF6] rounded-2xl p-6 lg:p-8 text-center transition-all duration-300 hover:shadow-[0_12px_32px_rgba(11,29,42,0.1)] hover:-translate-y-1"
              style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17B2A6]">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-[#6B7280] font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
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
  const cases = [
    "Preliminary screening in remote/underserved areas.",
    "Educational tool for medical students.",
    "Telemedicine apps for initial assessments.",
    "Integration into routine healthcare monitoring.",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1D2A] text-center mb-12">
          Real-World Applications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {cases.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white border border-[#E6FAF6] rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(11,29,42,0.1)] hover:-translate-y-1"
              style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E6FAF6] flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#17B2A6]" />
              </div>
              <p className="text-[#0B1D2A] font-medium leading-snug">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Team & References ─────────────── */
function TeamSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Team */}
          <div
            className="bg-white border border-[#E6FAF6] rounded-2xl p-6 lg:p-8"
            style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
          >
            <h3 className="text-lg font-semibold text-[#0B1D2A] mb-3">
              Team
            </h3>
            <p className="text-[#6B7280] leading-relaxed">
              Researchers &amp; Engineers: Mohamed Naguib, Mazen Mohamed
            </p>
          </div>
          {/* References */}
          <div
            className="bg-white border border-[#E6FAF6] rounded-2xl p-6 lg:p-8"
            style={{ boxShadow: "0 8px 24px rgba(11, 29, 42, 0.05)" }}
          >
            <h3 className="text-lg font-semibold text-[#0B1D2A] mb-3">
              References
            </h3>
            <p className="text-[#6B7280] leading-relaxed">
              Built utilizing: EfficientNet, PyTorch, timm library,
              Albumentations, Streamlit, Kaggle &amp; Roboflow datasets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Contact Section ─────────────── */
function ContactSection() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#E6FAF6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0B1D2A] mb-6">
          Invest, Collaborate, or Learn More
        </h2>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center">
            <Mail className="w-8 h-8 text-[#17B2A6]" />
          </div>
        </div>
        <a
          href="mailto:hassanahmedshm@gmail.com"
          className="inline-block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#17B2A6] hover:text-[#118A81] transition-colors break-all"
        >
          hassanahmedshm@gmail.com
        </a>
      </div>
    </section>
  );
}

/* ─────────────── Footer ─────────────── */
function Footer() {
  return (
    <footer className="bg-[#0B1D2A] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#17B2A6]" />
          <span className="font-semibold text-sm">OPTISCAN AI</span>
        </div>
        <p className="text-sm text-[#6B7280]">
          © {new Date().getFullYear()} OptiScan AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────── Page ─────────────── */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <MethodsSection />
        <ResultsSection />
        <UseCasesSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
