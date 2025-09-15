'use client'

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Helper: only portal on the client (prevents SSR "document is not defined" crashes)
const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
function ClientPortal({ children }) {
  if (!canUseDOM) return null;
  return createPortal(children, document.body);
}

export default function Mobile() {
  // Section heights + top crop amounts (svh = viewport height safe)
  const HEIGHTS = {
    second: "60svh",
    shocked: "68svh",
    pepeShh: "70svh",
    party: "78svh",
  };
  // How much to crop from the TOP (move content up)
  const OFFSETS = {
    second: "10svh",
    shocked: "4svh",
    pepeShh: "3svh",
    party: "2svh",
  };
  // Close visual gap between sections (negative margin on shocked)
  const GAP_FIX = {
    shockedTop: "-2svh",
  };
  // Scale for all floating money on mobile (1 = original size)
const MONEY_SCALE = 0.72;


  // --- UI state ---
  const [characterVisible, setCharacterVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [showNav, setShowNav] = useState(true);

  // --- overlays like desktop ---
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isContractOpen, setIsContractOpen] = useState(false);
  const [isTokenomicsOpen, setIsTokenomicsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- storyline states ---
  const [storyVisible, setStoryVisible] = useState(false);
  const [shockedStoryVisible, setShockedStoryVisible] = useState(false);
  const [pepeShhStoryVisible, setPepeShhStoryVisible] = useState(false);
  const [partyStoryVisible, setPartyStoryVisible] = useState(false);

  // typed text buffers
  const fullStory =
    "At the edge of a swamp, Disco, a humanoid eggplant, peers into a pond and sees not only his own reflection, but Pepe standing behind him.";
  const shockedStory = "His eye widens in shock — Pepe is really there.";
  const pepeShhStory = "shhhhhhhhhhhh, come to my party...";
  const partyStory = "You are the party, Disco!";

  const [displayedText, setDisplayedText] = useState("");
  const [shockedDisplayedText, setShockedDisplayedText] = useState("");
  const [pepeShhDisplayedText, setPepeShhDisplayedText] = useState("");
  const [partyDisplayedText, setPartyDisplayedText] = useState("");

  // --- refs for observers ---
  const secondRef = useRef(null);
  const shockedRef = useRef(null);
  const pepeShhRef = useRef(null);
  const partyHeroRef = useRef(null);

  // --- PEPE'S PARTY (heading + ball) ---
  const partySectionRef = useRef(null);
  const partyHeadingRef = useRef(null);
  const wordLeftRef = useRef(null);
  const wordRightRef = useRef(null);
  const [ballX, setBallX] = useState(null);

  // --- nav hide on scroll ---
  const lastScrollYRef = useRef(0);

  // --- scroll zooms (match desktop behavior) ---
  const { scrollYProgress: shockedProg } = useScroll({
    target: shockedRef,
    offset: ["0.5 1", "1 1"],
  });
  const shockedScale = useTransform(shockedProg, [0, 1], [1, 1.3]);

  const { scrollYProgress: pepeProg } = useScroll({
    target: pepeShhRef,
    offset: ["0.5 1", "1 1"],
  });
  const pepeScale = useTransform(pepeProg, [0, 1], [1, 1.3]);

  // Scroll-controlled disco ball
  const { scrollYProgress: ballProg } = useScroll({
    target: partySectionRef,
    offset: ["start end", "start start"],
  });
  const ballY = useTransform(ballProg, [0, 3], ["-120vh", "240vh"]);
  const ballOpacity = useTransform(ballProg, [0, 0.08], [0, 1]);

  // =========================
  // Effects
  // =========================
  useEffect(() => {
    if (!canUseDOM) return;
    setCharacterVisible(true);
    setNavVisible(true);

    // Scroll handler (nav show/hide, hue bg, pepe slide)
    const onScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > lastScrollYRef.current && scrollY > 50) setShowNav(false);
      else setShowNav(true);
      lastScrollYRef.current = scrollY;

      // Hue shift for any disco background if present
      const discoBg = document.getElementById("disco-bg");
      if (discoBg) {
        const hue = scrollY % 360;
        discoBg.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
      }

      // Pepe slide timing relative to hero height
      const pepe = document.getElementById("pepeSlide");
      if (pepe) {
        const heroHeight = window.innerHeight;
        const slideStart = heroHeight + 50;
        const slideStopAt = heroHeight + 150;
        if (scrollY > slideStart) {
          const offset = Math.min(scrollY - slideStart, slideStopAt - slideStart);
          pepe.style.opacity = "1";
          pepe.style.transform = `translateY(${offset * 7 - 800}px)`;
        } else {
          pepe.style.opacity = "0";
          pepe.style.transform = `translateY(-800px)`;
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 // Party BG flasher — match desktop speed
useEffect(() => {
  if (!canUseDOM) return;
  const partyBg = document.getElementById("party-bg");
  if (!partyBg) return;

  let hue = 0;
  const interval = setInterval(() => {
    hue = (hue + 2) % 360; // same delta as desktop
    const grad = `linear-gradient(135deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
    partyBg.style.background = grad;
  }, 0.2); // same interval as desktop

  return () => clearInterval(interval);
}, []);


  // IntersectionObservers
  useEffect(() => {
    if (!canUseDOM) return;
    const cleaners = [];
    const mkObs = (el, onIn, onOut) => {
      if (!el || typeof IntersectionObserver === "undefined") return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((entry) => (entry.isIntersecting ? onIn() : onOut())),
        { threshold: 0.2 }
      );
      obs.observe(el);
      cleaners.push(() => obs.disconnect());
    };

    mkObs(
      secondRef.current,
      () =>
        setTimeout(() => {
          setStoryVisible(true);
          setShockedStoryVisible(false);
          setPepeShhStoryVisible(false);
          setPartyStoryVisible(false);
        }, 400),
      () => setStoryVisible(false)
    );

    mkObs(
      shockedRef.current,
      () =>
        setTimeout(() => {
          setStoryVisible(false);
          setShockedStoryVisible(true);
          setPepeShhStoryVisible(false);
          setPartyStoryVisible(false);
        }, 400),
      () => setShockedStoryVisible(false)
    );

    mkObs(
      pepeShhRef.current,
      () =>
        setTimeout(() => {
          setStoryVisible(false);
          setShockedStoryVisible(false);
          setPepeShhStoryVisible(true);
          setPartyStoryVisible(false);
        }, 400),
      () => setPepeShhStoryVisible(false)
    );

    mkObs(
      partyHeroRef.current,
      () =>
        setTimeout(() => {
          setStoryVisible(false);
          setShockedStoryVisible(false);
          setPepeShhStoryVisible(false);
          setPartyStoryVisible(true);
        }, 400),
      () => setPartyStoryVisible(false)
    );

    return () => cleaners.forEach((d) => d());
  }, []);

  // Typed text effects
  useEffect(() => {
    if (!storyVisible) return;
    setDisplayedText("");
    let i = 0;
    const id = setInterval(() => {
      setDisplayedText(fullStory.slice(0, i));
      if (++i > fullStory.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [storyVisible]);

  useEffect(() => {
    if (!shockedStoryVisible) return;
    setShockedDisplayedText("");
    let i = 0;
    const id = setInterval(() => {
      setShockedDisplayedText(shockedStory.slice(0, i));
      if (++i > shockedStory.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [shockedStoryVisible]);

  useEffect(() => {
    if (!pepeShhStoryVisible) return;
    setPepeShhDisplayedText("");
    let i = 0;
    const id = setInterval(() => {
      setPepeShhDisplayedText(pepeShhStory.slice(0, i));
      if (++i > pepeShhStory.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [pepeShhStoryVisible]);

  useEffect(() => {
    if (!partyStoryVisible) return;
    setPartyDisplayedText("");
    let i = 0;
    const id = setInterval(() => {
      setPartyDisplayedText(partyStory.slice(0, i));
      if (++i > partyStory.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [partyStoryVisible]);

  // Position the disco ball exactly between "PEPE'S" and "PARTY"
  useEffect(() => {
    if (!canUseDOM) return;
    if (!partySectionRef.current || !wordLeftRef.current || !wordRightRef.current) return;

    const sec = partySectionRef.current;
    const leftEl = wordLeftRef.current;
    const rightEl = wordRightRef.current;

    function positionBall() {
      const secRect = sec.getBoundingClientRect();
      const leftRect = leftEl.getBoundingClientRect();
      const rightRect = rightEl.getBoundingClientRect();
      const gapCenterPx = (leftRect.right + rightRect.left) / 2;
      const xWithinSection = gapCenterPx - secRect.left;
      setBallX(xWithinSection);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(positionBall));
    }
    positionBall();
    const t1 = setTimeout(positionBall, 100);
    const t2 = setTimeout(positionBall, 300);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(positionBall);
      ro.observe(leftEl);
      ro.observe(rightEl);
    }

    window.addEventListener("resize", positionBall);
    window.addEventListener("orientationchange", positionBall);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", positionBall);
      window.removeEventListener("orientationchange", positionBall);
    };
  }, []);

  // =========================
  // Render
  // =========================
  return (
    <div className="relative bg-black overflow-x-hidden overflow-y-auto min-h-[100svh]">
      {/* MAIN that will blur under overlays */}
      <div
        className={`transition-all duration-300 ${
          isLinksOpen || isContractOpen || isTokenomicsOpen ? "blur-lg" : ""
        }`}
      >
        {/* NAV */}
        <nav
          className={`fixed top-0 left-4 right-4 z-[100] bg-black/40 backdrop-blur-xl rounded-lg px-4 py-3
          transform transition-transform duration-700 ease-in-out
          ${showNav ? "translate-y-0" : "-translate-y-full"}`}
          style={{
            opacity: navVisible ? 1 : 0,
            transitionProperty: "opacity, transform",
            transitionDuration: "0.7s, 0.7s",
            transitionTimingFunction: "ease-out, ease-in-out",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center">
              <img
                src="/disco-logo.png"
                alt="Disco Logo"
                className="w-[120%] h-[120%] object-cover scale-110"
              />
            </div>
            <span
              className="flex-grow font-bbtorsos font-extrabold text-5xl tracking-wide select-none"
              style={{ color: "#a855f7" }}
            >
              DISCO
            </span>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <button
              type="button"
              onClick={() => setIsLinksOpen(true)}
              className="text-white text-lg font-semibold hover:text-purple-400 transition transform hover:-translate-y-1 hover:scale-110"
            >
              Links
            </button>

            <button
              type="button"
              onClick={() => setIsContractOpen(true)}
              className="text-white text-lg font-semibold hover:text-purple-400 transition transform hover:-translate-y-1 hover:scale-110"
            >
              Contract
            </button>

            <button
              type="button"
              onClick={() => setIsTokenomicsOpen(true)}
              className="text-white text-lg font-semibold hover:text-purple-400 transition transform hover:-translate-y-1 hover:scale-110"
            >
              Tokenomics
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section
          className="relative min-h-[100svh] bg-black overflow-hidden pt-20"
          style={{ opacity: characterVisible ? 1 : 0, transition: "opacity 0.6s ease-out" }}
        >
          {/* Clouds */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-repeat-x bg-top animate-clouds z-0"
            style={{ backgroundImage: "url('/clouds.png')" }}
          />

          {/* DISCO rows */}
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start pt-28 z-10 pointer-events-none">
            <div className="disco-row disco-row-1 font-bbtorsos">
              DISCO DISCO DISCO DISCO DISCO
            </div>
            <div className="disco-row disco-row-2 font-bbtorsos">
              DISCO DISCO DISCO DISCO DISCO
            </div>
            <div className="disco-row disco-row-3 font-bbtorsos">
              DISCO DISCO DISCO DISCO DISCO
            </div>
            <div className="disco-row disco-row-4 font-bbtorsos">
              DISCO DISCO DISCO DISCO DISCO
            </div>
          </div>

          {/* Character */}
          <img
            src="/character.png"
            alt="Disco Character"
            className="absolute left-1/2 w-[140vw] max-w-none z-20"
            style={{ bottom: 0, transform: "translateX(-50%)", userSelect: "none" }}
          />

          {/* Info box */}
          <motion.div
            className="absolute bottom-20 left-1/2 z-[59] w-[280px] h-[180px] rounded-2xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] px-6 py-12"
            style={{ pointerEvents: "auto", cursor: "default", left: "calc(50% - 140px)", transform: "none" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* overlay static */}
            <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen opacity-10">
              <img src="/static.gif" alt="Static" className="w-full h-full object-cover" />
            </div>

            {/* HEDZ logo */}
            <img
              src="/hedz-logo.png"
              alt="HEDZ Logo"
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[45%] z-30"
              style={{ width: "380px", maxWidth: "none" }}
              draggable="false"
            />

            {/* Bottom row */}
            <div className="absolute bottom-4 left-0 w-full px-4 flex items-center justify-center gap-2 z-30">
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full bg-purple-600 overflow-hidden flex items-center justify-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                    minHeight: "32px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/disco-logo.png"
                    alt="Disco Logo"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    draggable="false"
                  />
                </div>
                <span
                  className="text-xs text-purple-200 text-center font-bold leading-tight"
                  style={{
                    display: "inline-block",
                    maxWidth: "190px",
                    whiteSpace: "normal",
                    lineHeight: "1.2",
                    overflowWrap: "break-word",
                    fontSize: "0.65rem",
                  }}
                >
                  DISCO IS PART OF THE HEDZ COLLECTION BY MATT FURIE.
                </span>
              </div>
              <img src="/verified.gif" alt="Verified" className="w-5 h-5 object-contain ml-2" draggable="false" />
            </div>
          </motion.div>

          {/* Bottom border */}
          <img src="/border.avif" alt="Hero Border" className="absolute bottom-0 left-0 w-full z-[70] pointer-events-none" />
        </section>

        {/* SECOND SECTION */}
        <section ref={secondRef} className="relative w-full overflow-hidden" style={{ height: HEIGHTS.second }}>
          <div
            className="absolute inset-0 bg-repeat-x bg-top animate-clouds-right z-0"
            style={{ backgroundImage: "url('/clouds.png')", transform: "scaleY(-1)" }}
          />
          <div className="w-full h-full relative z-10">
            <img
              src="/second-mobile.png"
              alt="Second Section"
              className="absolute left-0 w-full object-contain z-10"
              style={{ top: "-22svh" }}
            />
            <img
              src="/pepe-slide-phone.png"
              alt="Pepe Slide"
              id="pepeSlide"
              className="absolute left-0 top-0 w-full h-full object-contain z-20 opacity-0 transition-transform duration-500 ease-out"
              style={{ objectPosition: "center top" }}
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-[60] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-[10px] bg-black z-[80] pointer-events-none" />
        </section>

        {/* DISCO SHOCKED */}
        <section
          ref={shockedRef}
          className="relative w-full overflow-hidden"
          style={{ height: HEIGHTS.shocked, marginTop: GAP_FIX.shockedTop }}
        >
          <motion.div className="absolute inset-0" style={{ scale: shockedScale }}>
            <div
              className="absolute inset-0 bg-repeat-x bg-top animate-clouds"
              style={{ backgroundImage: "url('/clouds.png')" }}
            />
            <div className="absolute inset-0" style={{ transform: "translateY(-6svh)" }}>
              <img
                src="/disco-shocked-phone.png"
                alt="Disco Shocked"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </motion.div>
          <div className="absolute top-0 left-0 w-full h-[10px] bg-black z-20 pointer-events-none" />
          <div className="absolute top-0 left-0 h-full w-[10px] bg-black z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-[10px] bg-black z-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-[10px] bg-black z-20 pointer-events-none" />
        </section>

        {/* PEPE SHH */}
        <section ref={pepeShhRef} className="relative w-full overflow-hidden" style={{ height: HEIGHTS.pepeShh }}>
          <motion.div className="absolute inset-0" style={{ scale: pepeScale }}>
            <div
              className="absolute inset-0 bg-repeat-x bg-top animate-clouds-right"
              style={{ backgroundImage: "url('/clouds.png')" }}
            />
            <div className="absolute inset-0" style={{ transform: "translateY(-5svh)" }}>
              <img
                src="/pepe-shh-phone.png"
                alt="Pepe Shh"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
          </motion.div>
          <div className="absolute top-0 left-0 w-full h-[10px] bg-black z-20 pointer-events-none" />
          <div className="absolute top-0 left-0 h-full w-[10px] bg-black z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-[10px] bg-black z-20 pointer-events-none" />
          <img src="/border 2.png" alt="Pepe Shh Border" className="absolute bottom-0 left-0 w-full z-[70] pointer-events-none" />
        </section>

        {/* PEPE'S / PARTY */}
        <section
          id="pepes-party-hero"
          ref={partySectionRef}
          className="relative h-[110svh] w-full bg-black overflow-hidden flex items-center justify-center"
          style={{ isolation: "isolate" }}
        >
          <div className="absolute top-0 left-0 w-full h-[8px] bg-black z-[80]" />
          <img src="/border 2.png" alt="Top Border" className="absolute top-0 left-0 w-full rotate-180 transform z-[70] pointer-events-none" />
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <span
              ref={wordLeftRef}
              className="font-[ProcerusRegular] text-green-400 leading-none tracking-[0.005em] transform scale-y-[1.12]
                 text-[40vh] sm:text-[42vh] md:text-[44vh] z-[120] pointer-events-none"
              style={{ textShadow: "0 12px 28px rgba(0,0,0,0.9), 0 0 34px rgba(0,0,0,0.6)" }}
            >
              PEPE&apos;S
            </span>

            {/* Disco ball */}
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 z-[140] select-none"
              style={{
                transform: "translate(-50%, -50%)",
                WebkitMaskImage: "radial-gradient(closest-side, black 88%, transparent 100%)",
                maskImage: "radial-gradient(closest-side, black 88%, transparent 100%)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
            >
              <motion.img
                src="/disco-ball.png"
                alt="Disco Ball"
                className="w-[72vh] md:w-[78vh] h-auto object-contain max-w-none"
                style={{
                  y: ballY,
                  opacity: ballOpacity,
                  willChange: "transform, opacity",
                  transformOrigin: "center top",
                  mixBlendMode: "normal",
                  filter:
                    "drop-shadow(0 22px 44px rgba(0,0,0,0.85)) drop-shadow(0 0 44px rgba(255,255,255,0.45)) drop-shadow(0 0 100px rgba(255,255,255,0.25))",
                  // If you need to center using computed X: left position via CSS var
                  left: ballX != null ? `calc(50% - ${Math.max(0, (document?.body?.clientWidth || 0) / 2 - ballX)}px)` : undefined,
                }}
                draggable={false}
              />
            </div>

            <span
              ref={wordRightRef}
              className="font-[ProcerusRegular] text-purple-400 leading-none tracking-[0.005em] transform scale-y-[1.12]
                 text-[46vh] sm:text-[48vh] md:text-[50vh] z-[160] pointer-events-none mt-[7vh]"
              style={{ textShadow: "0 10px 24px rgba(0,0,0,0.75)" }}
            >
              PARTY
            </span>
          </div>
        </section>

    {/* PARTY HERO (with floating money, scaled for mobile) */}
<section className="relative w-full overflow-hidden" style={{ height: HEIGHTS.party }}>
  <div className="absolute top-0 left-0 w-full h-[8px] bg-black z-[80]" />
  <img
    src="/border 2.png"
    alt="Top Border"
    className="absolute top-0 left-0 w-full rotate-180 transform z-[70] pointer-events-none"
  />

  <div
    id="party-hero"
    ref={partyHeroRef}
    className="relative w-full h-full overflow-hidden isolate"
    style={{ transform: `translateY(-${OFFSETS.party})` }}
  >
    {/* 🎇 Hue-shifting background lights */}
    <div
      id="party-bg"
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: "linear-gradient(135deg, #7f00ff, #e100ff)",
        transition: "background 0.5s ease",
        mixBlendMode: "screen",
      }}
    />

    {/* 💵 Floating notes behind the hero image */}
    <div
      className="absolute inset-0 z-[5] pointer-events-none"
      style={{ transform: `scale(${MONEY_SCALE})`, transformOrigin: "center top" }}
    >
      {[...Array(10)].map((_, i) => (
        <img
          key={`party-back-${i}`}
          src="/dollar.png"
          className="scroll-fall absolute opacity-60"
          style={{
            width: `${i % 2 === 0 ? 96 : 72}px`,
            left: `${i % 2 === 0 ? 12 + (i * 11) % 44 : 52 + (i * 13) % 42}%`,
            animationDuration: `${6 + (i % 6) * 1.2}s`,
            animationDelay: `${i * 1.25}s`,
          }}
        />
      ))}
    </div>

    {/* 🖼️ Party hero art */}
    <img
      src="/discopartymobile2.png"
      alt="Party Hero"
      className="absolute inset-0 w-full h-full object-cover z-10"
      style={{ objectPosition: "center top" }}
    />

    {/* 💵 Floating notes in front of the hero image */}
    <div
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ transform: `scale(${MONEY_SCALE})`, transformOrigin: "center top" }}
    >
      {[...Array(8)].map((_, i) => (
        <img
          key={`party-front-${i}`}
          src="/dollar.png"
          className="scroll-fall absolute"
          style={{
            width: `${i % 2 === 0 ? 110 : 84}px`,
            left: `${i % 2 === 0 ? 18 + (i * 10) % 46 : 58 + (i * 12) % 38}%`,
            animationDuration: `${5 + (i % 6) * 1.1}s`,
            animationDelay: `${i * 1.15}s`,
          }}
        />
      ))}
    </div>

    {/* 🟪 Gradient fades */}
    <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
  </div>
</section>


      
        {/* STORYLINE POPUP */}
<ClientPortal>
  <AnimatePresence>
    {(storyVisible || shockedStoryVisible || pepeShhStoryVisible || partyStoryVisible) && (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="fixed inset-x-0 mx-auto z-[200]
                   bg-black/80 backdrop-blur-xl border border-purple-500/40
                   shadow-[0_0_25px_#a855f7] px-3 py-3 rounded-lg flex items-center gap-2
                   w-[92vw] max-w-3xl"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        {storyVisible && (
          <>
            <div className="flex-shrink-0 text-purple-400 text-base font-extrabold tracking-wide">
              DISCO?
            </div>
            <div className="w-px h-8 bg-purple-500/40" />
            <div className="flex-1 text-left text-xs font-medium text-purple-200">
              <span>{displayedText}</span>
              <span className="text-purple-500/40">
                {fullStory.slice(displayedText.length)}
              </span>
            </div>
          </>
        )}

        {shockedStoryVisible && (
          <div className="flex-1 text-left text-xs font-medium text-purple-200">
            <span>{shockedDisplayedText}</span>
            <span className="text-purple-500/40">
              {shockedStory.slice(shockedDisplayedText.length)}
            </span>
          </div>
        )}

        {pepeShhStoryVisible && (
          <>
            <div className="flex-shrink-0 text-green-400 text-base font-extrabold tracking-wide">
              PEPE
            </div>
            <div className="w-px h-8 bg-green-500/40" />
            <div className="flex-1 text-left text-xs font-medium text-green-200">
              <span>{pepeShhDisplayedText}</span>
              <span className="text-green-500/40">
                {pepeShhStory.slice(pepeShhDisplayedText.length)}
              </span>
            </div>
          </>
        )}

        {partyStoryVisible && (
          <>
            <div className="flex-shrink-0 text-green-400 text-base font-extrabold tracking-wide">
              PEPE
            </div>
            <div className="w-px h-8 bg-green-500/40" />
            <div className="flex-1 text-left text-xs font-medium text-green-200">
              <span>{partyDisplayedText}</span>
              <span className="text-green-500/40">
                {partyStory.slice(partyDisplayedText.length)}
              </span>
            </div>
          </>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</ClientPortal>



        {/* GLOBAL STATIC OVERLAY */}
        <div className="fixed inset-0 z-[80] pointer-events-none mix-blend-screen opacity-10">
          {[...Array(5)].map((_, row) =>
            [...Array(5)].map((_, col) => (
              <img
                key={`static-${row}-${col}`}
                src="/static.gif"
                alt="Static"
                className="absolute object-cover"
                style={{ width: "480px", height: "360px", top: `${row * 360}px`, left: `${col * 480}px` }}
              />
            ))
          )}
        </div>
      </div>
      {/* 👆 CLOSE the BLUR WRAPPER */}

      {/* ===== LINKS OVERLAY ===== */}
{isLinksOpen && (
  <ClientPortal>
    <AnimatePresence>
      <>
        {/* Close button */}
        <motion.button
          key="links-close"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          onClick={() => setIsLinksOpen(false)}
          className="fixed top-6 left-1/2 -translate-x-1/2 -ml-6 w-16 h-16 rounded-full
                     bg-black/90 border border-purple-500/50 flex items-center justify-center
                     text-purple-200 text-3xl font-bold hover:bg-purple-600 hover:text-white
                     transition-colors shadow-lg z-[1100] pointer-events-auto"
        >
          ✕
        </motion.button>

        {/* Backdrop — click to close */}
        <motion.div
          key="links-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg pointer-events-auto"
          onClick={() => setIsLinksOpen(false)}
        />

        {/* Icon grid — same layout, tighter rows */}
        <motion.div
  key="links-grid"
  className="fixed left-0 right-0 bottom-0 top-36 z-[1002]
             flex flex-wrap justify-center content-start
             gap-x-5 gap-y-4 px-4"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.85, opacity: 0 }}
  transition={{ type: "spring", stiffness: 200, damping: 20 }}
  aria-hidden="true"
>

          {/* Telegram */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://t.me/DiscoHedz" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/telegram.svg" alt="Telegram" className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">Telegram</p>
          </div>

          {/* X */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://x.com/discohedzeth" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/x.svg" alt="X" className="w-9 h-9 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">X</p>
          </div>

          {/* Uniswap */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://app.uniswap.org/" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-pink-200 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/uniswap.svg" alt="Uniswap" className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">Uniswap</p>
          </div>

          {/* DEXscreener */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://dexscreener.com/ethereum/0x807ac92bc2f76876c2b20ad862d67a58727dc73c" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-gray-800 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/dexscreener.png" alt="DEXscreener" className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">DEXscreener</p>
          </div>

          {/* DEXTools */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://www.dextools.io/app/en/token/disco?t=1757971374692" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-gray-900 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/dextools.svg" alt="DEXTools" className="w-9 h-9 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">DEXTools</p>
          </div>

          {/* TikTok */}
          <div className="w-[112px] flex flex-col items-center gap-1">
            <a href="https://www.tiktok.com/@discohedzeth" target="_blank" rel="noreferrer" className="group">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img src="/icons/tiktok.svg" alt="TikTok" className="w-10 h-10 group-hover:scale-125 transition-transform duration-300" />
              </div>
            </a>
            <p className="text-xs leading-[1.1] text-purple-200 font-semibold">TikTok</p>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  </ClientPortal>
)}


      {/* ===== CONTRACT OVERLAY ===== */}
      {isContractOpen && (
        <ClientPortal>
          <AnimatePresence>
            <>
             <motion.button
  key="contract-close"
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -80, opacity: 0 }}
  transition={{ type: "spring", stiffness: 120, damping: 18 }}
  onClick={() => setIsContractOpen(false)}
 className="fixed top-6 left-1/2 -translate-x-1/2 -ml-6 w-16 h-16 rounded-full
           bg-black/90 border border-purple-500/50 flex items-center justify-center
           text-purple-200 text-3xl font-bold hover:bg-purple-600 hover:text-white
           transition-colors shadow-lg z-[1100] pointer-events-auto"

>
  ✕
</motion.button>


              <motion.div
                key="contract-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg pointer-events-auto"
              />

              <div className="fixed z-[1002] pointer-events-auto" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <motion.div
                  key="contract-pill"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-black/40 backdrop-blur-xl backdrop-saturate-150 text-white
                       px-6 md:px-10 py-4 rounded-full shadow-[0_0_25px_#a855f7]
                       flex items-center gap-6 md:gap-8 w-[min(92vw,900px)]"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center scale-125">
                      <img src="/disco-logo.png" alt="Disco Logo" className="w-[120%] h-[120%] object-cover scale-110" draggable="false" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-xl font-extrabold text-white">Disco</div>
                      <div className="text-[12px] text-gray-400 -mt-0.5">Ethereum</div>
                    </div>
                  </div>

                  <div
                    className="flex-1 text-center font-mono text-sm md:text-base tracking-wide overflow-hidden text-ellipsis whitespace-nowrap"
                    title="0x787B197F793F7D04366536F6a7a56a799868A64b"
                  >
                    0x787B197F793F7D04366536F6a7a56a799868A64b
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText("0x787B197F793F7D04366536F6a7a56a799868A64b");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      } catch (e) {
                        console.error("Clipboard copy failed", e);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         bg-purple-600 hover:bg-purple-500 active:bg-purple-700
                         transition-colors text-white font-semibold shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M16 1H6a2 2 0 0 0-2 2v10h2V3h10V1z" />
                      <path d="M18 5H10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 10H10V7h8v8z" />
                    </svg>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </motion.div>
              </div>
            </>
          </AnimatePresence>
        </ClientPortal>
      )}


  

      {/* ===== TOKENOMICS OVERLAY (mobile layout) ===== */}
      {isTokenomicsOpen && (
        <AnimatePresence>
          <>
            {/* Close button */}
           <motion.button
  key="tokenomics-close"
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -80, opacity: 0 }}
  transition={{ type: "spring", stiffness: 120, damping: 18 }}
  onClick={() => setIsTokenomicsOpen(false)}
  className="fixed top-6 left-1/2 -translate-x-1/2 -ml-6 w-16 h-16 rounded-full
           bg-black/90 border border-purple-500/50 flex items-center justify-center
           text-purple-200 text-3xl font-bold hover:bg-purple-600 hover:text-white
           transition-colors shadow-lg z-[1100] pointer-events-auto"

>
  ✕
</motion.button>


            {/* Backdrop */}
            <motion.div
              key="tokenomics-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg"
              onClick={() => setIsTokenomicsOpen(false)}
            />

            {/* Grid wrapper (with padding to avoid cut-off) */}
            <motion.div
              key="tokenomics-grid"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="fixed inset-x-2 top-32 bottom-6 z-[1002] overflow-auto px-2 py-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3 pb-12 scale-95 origin-top">
               {/* TICKER */}
<div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.6)] p-5 flex flex-col items-center justify-center text-center">
  <div className="text-xs tracking-widest text-purple-300/70">TICKER</div>
  <div className="text-3xl font-extrabold text-white mt-2">$DISCO</div>
</div>


              {/* LP */}
<div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.6)] p-5 flex flex-col justify-between text-center">
  <div className="text-xs tracking-widest text-purple-300/70">LIQUIDITY POOL</div>
  <div className="text-3xl font-extrabold text-white mt-5 leading-tight">LP<br />Locked</div>
  <div className="text-[11px] text-purple-200/80 mt-3">Rug Pull Risk: 0%</div>
</div>


                {/* SUPPLY — full width */}
                <div className="col-span-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.6)] p-5 text-center">
                  <div className="text-xs tracking-widest text-purple-300/70 mb-2">SUPPLY</div>
                  <div className="text-4xl font-extrabold text-white">1,000,000,000</div>
                  <div className="mt-2 text-xs text-purple-200/80">One Billion, Baby!</div>
                </div>

                {/* TAXES — full width */}
                <div className="col-span-2 rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.6)] p-5 text-center">
                  <div className="text-xs tracking-widest text-purple-300/70 mb-2">TAXES</div>
                  <div className="text-4xl font-extrabold text-white">0%</div>
                  <div className="mt-2 text-xs text-purple-200/80">Fees are for pussies.</div>
                </div>

                {/* NARRATIVE — full width image card */}
                <div className="col-span-2 relative rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.6)] border border-purple-500/30">
                  <img src="/discopartybrett.png" alt="Matt Furie Art" className="w-full h-[220px] object-cover" />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3">
                    <div className="text-xs tracking-widest text-white/85 mb-1">NARRATIVE</div>
                    <div className="text-2xl font-extrabold text-white leading-tight">The Last Dance</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        </AnimatePresence>
      )}
    </div>
  );
}
