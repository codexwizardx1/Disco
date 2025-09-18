
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";


export default function Home() {
  const [characterVisible, setCharacterVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  // === Contract overlay state ===
const [isContractOpen, setIsContractOpen] = useState(false);
  const [isTokenomicsOpen, setIsTokenomicsOpen] = useState(false);
  // --- BW mode (black & white, hero-only) ---
const [isBW, setIsBW] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const bw = params.get("bw");
  setIsBW(bw === "1");
}, []);

const goBW = () => {
  const url = new URL(window.location.href);
  url.searchParams.set("bw", "1");
  window.location.href = url.toString(); // refresh into bw mode
};


const [copied, setCopied] = useState(false);

// 👉 Put your real token address here
const contractAddress = "0xYOUR_CONTRACT_ADDRESS_HERE";

const [partyInView, setPartyInView] = useState(false);
  // Center the ball in the real gap between the two words
const partySectionRef = useRef(null);
const wordLeftRef = useRef(null);
const wordRightRef = useRef(null);
const [ballX, setBallX] = useState(null);
  const partyHeadingRef = useRef(null);




  const fullStory =
  "At the edge of a swamp, Disco, a humanoid eggplant, peers into a pond and sees not only his own reflection, but Pepe standing behind him.";
const [displayedText, setDisplayedText] = useState("");
  const shockedStory = "His eye widens in shock — Pepe is really there.";
const [shockedDisplayedText, setShockedDisplayedText] = useState("");
const [shockedStoryVisible, setShockedStoryVisible] = useState(false);
  const pepeShhStory = "shhhhhhhhhhhh, come to my party...";
const [pepeShhDisplayedText, setPepeShhDisplayedText] = useState("");
const [pepeShhStoryVisible, setPepeShhStoryVisible] = useState(false);
  // === Party (bottom) storyline ===
const partyStory = "You are the party, Disco!";
const [partyDisplayedText, setPartyDisplayedText] = useState("");
const [partyStoryVisible, setPartyStoryVisible] = useState(false);
const partyHeroRef = useRef(null);


useEffect(() => {
  if (pepeShhStoryVisible) {
    setPepeShhDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setPepeShhDisplayedText(pepeShhStory.slice(0, i));
      i++;
      if (i > pepeShhStory.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }
}, [pepeShhStoryVisible]);

  useEffect(() => {
  if (partyStoryVisible) {
    setPartyDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setPartyDisplayedText(partyStory.slice(0, i));
      i++;
      if (i > partyStory.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }
}, [partyStoryVisible]);


  

useEffect(() => {
  if (shockedStoryVisible) {
    setShockedDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setShockedDisplayedText(shockedStory.slice(0, i));
      i++;
      if (i > shockedStory.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }
}, [shockedStoryVisible]);


useEffect(() => {
  if (storyVisible) {
    setDisplayedText(""); // reset each time it shows
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullStory.slice(0, i));
      i++;
      if (i > fullStory.length) clearInterval(interval);
    }, 20); // typing speed
    return () => clearInterval(interval);
  }
}, [storyVisible]);

    const shockedRef = useRef(null);
  const { scrollYProgress } = useScroll({
  target: shockedRef,
  offset: ["0.5 1", "1 1"], // 👈 starts at halfway into section
});
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]); // zoom from 100% to 130%

  const pepeShhRef = useRef(null);
const { scrollYProgress: pepeShhProgress } = useScroll({
  target: pepeShhRef,
  offset: ["0.5 1", "1 1"], 
});
const pepeShhScale = useTransform(pepeShhProgress, [0, 1], [1, 1.3]);
// === Scroll-controlled disco ball (Party section) ===
const { scrollYProgress: partyProgress } = useScroll({
  target: partySectionRef,
  offset: ["start end", "start start"], 
  // 👈 only map while section top moves from viewport bottom → top
});

const ballY = useTransform(partyProgress, [0, 3], ["-120vh", "240vh"]);

const ballOpacity = useTransform(partyProgress, [0, 0.08], [0, 1]);


useEffect(() => {
  setCharacterVisible(true);
  setNavVisible(true);

const onScroll = () => {
  const scrollY = window.scrollY;
  const heroHeight = window.innerHeight;

  // ✅ Floating notes (money section) — only if it exists
  const money = document.getElementById("money-section");
  if (money) {
    const notes = document.querySelectorAll(".scroll-float");
    notes.forEach((note) => {
      const speed = parseFloat(note.dataset.speed) || 0.05;
      const baseOffset = 500;  
      let transform = `translateY(${baseOffset - scrollY * speed}px)`;

      if (note.dataset.flip === "true") {
        const flipSpeed = parseFloat(note.dataset.flipspeed) || 0.05;
        transform += ` rotateX(${scrollY * flipSpeed}deg)`;
      } else if (note.dataset.rotateonly === "true") {
        const rotateSpeed = parseFloat(note.dataset.rotatespeed) || 0.02;
        transform += ` rotate(${scrollY * rotateSpeed}deg)`;
      } else {
        transform += ` rotate(${note.dataset.rotate}deg)`;
      }

      note.style.transform = transform;
    });
  }

 

 // ✅ Hue shift for backgrounds
const discoBg = document.getElementById("disco-bg");
// ❌ deleted: const partyBg = document.getElementById("party-bg");
if (discoBg) {
  const hue = scrollY % 360;
  const grad = `linear-gradient(135deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
  discoBg.style.background = grad;
  // ❌ deleted: if (partyBg) partyBg.style.background = grad;
}


  // ✅ Pepe slide
  const pepe = document.getElementById("pepeSlide");
  if (pepe) {
    const slideStart = heroHeight + 50;
    const slideStopAt = heroHeight + 150;
    if (scrollY > slideStart) {
      let offset = Math.min(scrollY - slideStart, slideStopAt - slideStart);
      pepe.style.opacity = "1";
      pepe.style.transform = `translateY(${offset * 7 - 800}px)`;
    } else {
      pepe.style.opacity = "0";
      pepe.style.transform = `translateY(-800px)`;
    }
  }

  // ✅ Zoom container reset
  const zoomContainer = document.getElementById("second-section-content");
  if (zoomContainer) {
    zoomContainer.style.transform = "none";
  }
};




  window.addEventListener("scroll", onScroll);

  const cleanupFns = [];

  // 👇 First story observer
  const section = document.getElementById("second-section-content");
  if (section) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setStoryVisible(true);
              setShockedStoryVisible(false);
              setPepeShhStoryVisible(false);
            }, 800);
          } else {
            setStoryVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    cleanupFns.push(() => observer.disconnect());
  }

  // 👇 Shocked story observer
  const shockedSection = shockedRef.current;
  if (shockedSection) {
    const shockedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setShockedStoryVisible(true);
              setStoryVisible(false);
              setPepeShhStoryVisible(false);
            }, 800);
          } else {
            setShockedStoryVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    shockedObserver.observe(shockedSection);
    cleanupFns.push(() => shockedObserver.disconnect());
  }

  // 👇 Pepe Shh story observer
  const pepeShhSection = pepeShhRef.current;
  if (pepeShhSection) {
    const pepeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setPepeShhStoryVisible(true);
              setStoryVisible(false);
              setShockedStoryVisible(false);
            }, 800);
          } else {
            setPepeShhStoryVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    pepeObserver.observe(pepeShhSection);
    cleanupFns.push(() => pepeObserver.disconnect());
  }
  // 👇 Party (bottom) storyline observer
  const partyHeroEl = partyHeroRef.current || document.getElementById("party-hero");
  if (partyHeroEl) {
    const partyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setPartyStoryVisible(true);
              setStoryVisible(false);
              setShockedStoryVisible(false);
              setPepeShhStoryVisible(false);
            }, 800);
          } else {
            setPartyStoryVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    partyObserver.observe(partyHeroEl);
    cleanupFns.push(() => partyObserver.disconnect());
  }

  // cleanup everything
  return () => {
    window.removeEventListener("scroll", onScroll);
    cleanupFns.forEach((fn) => fn());
  };
}, []);

 // Compute the exact midpoint between "PEPE'S" (right edge) and "PARTY" (left edge)
// Uses fonts.ready + ResizeObserver to keep it exact, even after font/layout changes.
useEffect(() => {
  if (!partySectionRef.current || !wordLeftRef.current || !wordRightRef.current) return;

  const sec = partySectionRef.current;
  const leftEl = wordLeftRef.current;
  const rightEl = wordRightRef.current;

  function positionBall() {
    const secRect = sec.getBoundingClientRect();
    const leftRect = leftEl.getBoundingClientRect();
    const rightRect = rightEl.getBoundingClientRect();
    // Midpoint between the two words (viewport px)
    const gapCenterPx = (leftRect.right + rightRect.left) / 2;
    // Convert to section-relative px
    const xWithinSection = gapCenterPx - secRect.left;
    setBallX(xWithinSection);
  }

  // Reposition when fonts finish loading (prevents early wrong rects)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      requestAnimationFrame(positionBall);
    });
  }

  // Reposition now + a couple of follow-ups for late layout
  positionBall();
  const t1 = setTimeout(positionBall, 100);
  const t2 = setTimeout(positionBall, 300);

  // Track size changes of either word (covers wrapping, zoom, etc.)
  const ro = new ResizeObserver(positionBall);
  ro.observe(leftEl);
  ro.observe(rightEl);

  // Also on window resize/orientation
  window.addEventListener("resize", positionBall);
  window.addEventListener("orientationchange", positionBall);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    ro.disconnect();
    window.removeEventListener("resize", positionBall);
    window.removeEventListener("orientationchange", positionBall);
  };
}, []);

// === Auto-flashing Party BG ===
useEffect(() => {
  const partyBg = document.getElementById("party-bg");
  if (!partyBg) return;

  let hue = 0;
  const interval = setInterval(() => {
    hue = (hue + 2) % 360;
    const grad = `linear-gradient(135deg, hsl(${hue}, 100%, 50%), hsl(${(hue + 60) % 360}, 100%, 50%))`;
    partyBg.style.background = grad;
  }, 0.2); // smaller = faster flashing

  return () => clearInterval(interval);
}, []);


// ✅ Freeze nav style while Links is open
const navStyle = isLinksOpen
  ? { top: "1rem", opacity: 1 }
  : { top: navVisible ? "1rem" : "-5rem", opacity: navVisible ? 1 : 0 };

const navAnimClass = isLinksOpen
  ? "transition-none"
  : "transition-all duration-700 ease-out";

return (
 <div className={`relative bg-black overflow-x-hidden ${isBW ? "overflow-hidden grayscale" : "overflow-y-auto"}`}>

  {/* Main site content that will blur */}
  <div className={`transition-all duration-300 ${isLinksOpen || isContractOpen || isTokenomicsOpen ? "blur-lg" : ""}`}>




      {/* ✅ NAV WITH SCALE HOVER */}
  <nav
  className={`fixed left-1/2 transform -translate-x-1/2 z-[1000] ${navAnimClass}`}
  style={navStyle}
>

        <div className="bg-black/40 backdrop-blur-xl backdrop-saturate-150 text-white px-10 py-3 rounded-full shadow-[0_0_25px_#a855f7] flex gap-10 items-center justify-center">
          <div
  onClick={goBW}
  className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center scale-125 cursor-pointer"
>
  <img src="/disco-logo.png" alt="Disco Logo" className="w-[120%] h-[120%] object-cover scale-110" />
</div>

<span
  onClick={goBW}
  className="text-3xl font-extrabold tracking-wide text-purple-400 scale-110 font-bbtorsos cursor-pointer select-none"
>
  DISCO
</span>

          <button
  type="button"
  onClick={() => setIsLinksOpen(true)}
  className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110"
>
  <span className="text-xl font-semibold group-hover:text-purple-400 transition-all duration-200">Links</span>
</button>

         <button
  type="button"
  onClick={() => setIsContractOpen(true)}
  className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110"
>
  <span className="text-xl font-semibold group-hover:text-purple-400 transition-all duration-200">Contract</span>
</button>

          <button
  type="button"
  onClick={() => setIsTokenomicsOpen(true)}
  className="relative group transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110"
>
  <span className="text-xl font-semibold group-hover:text-purple-400 transition-all duration-200">Tokenomics</span>
</button>

        </div>
      </nav>

      {/* ✅ HERO */}
      <section
        className="relative h-screen bg-black overflow-hidden"
        style={{
          opacity: characterVisible ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      >
        {/* Clouds */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat-x bg-top animate-clouds z-0"
          style={{
            backgroundImage: "url('/clouds.png')",
            transform: characterVisible ? "scale(1)" : "scale(1.2)",
            transition: "transform 0.5s ease-out",
          }}
        />

       {/* ✅ DISCO TEXT ROWS (hide in BW mode) */}
{!isBW && (
  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start pt-28 z-10 pointer-events-none">
    <div className="disco-row disco-row-1 font-bbtorsos">DISCO DISCO DISCO DISCO DISCO</div>
    <div className="disco-row disco-row-2 font-bbtorsos">DISCO DISCO DISCO DISCO DISCO</div>
    <div className="disco-row disco-row-3 font-bbtorsos">DISCO DISCO DISCO DISCO DISCO</div>
    <div className="disco-row disco-row-4 font-bbtorsos">DISCO DISCO DISCO DISCO DISCO</div>
  </div>
)}


        {/* Character (hidden in bw mode) */}
{!isBW && (
  <img
    src="/character.png"
    alt="Disco Character"
    className="absolute bottom-0 left-1/2 w-[90vw] max-w-[800px] z-20 transform transition-all duration-500 ease-out"
    style={{
      transform: characterVisible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100%)",
      opacity: characterVisible ? 1 : 0,
    }}
  />
)}


        {/* ✅ DRAGGABLE HERO INFO BOX with NEW X POSITION */}
        <motion.div
          className="absolute bottom-40 left-[78%] transform -translate-x-1/2 z-[59]"
          drag
          dragMomentum
          dragElastic={0.8}
          dragConstraints={{ top: -450, bottom: 120, left: -1320, right: 50 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.07 }}
          style={{ cursor: "grab" }}
          layout
        >
          <motion.div
            className="relative w-[250px] md:w-[300px] h-[180px] rounded-2xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] px-6 py-12"
            layout
          >
            {/* Static overlay stays on box */}
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
                <div className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center">
                  <img
                    src="/disco-logo.png"
                    alt="Disco Logo"
                    className="w-[120%] h-[120%] object-cover scale-110"
                    draggable="false"
                  />
                </div>
                <span className="text-xs text-purple-200 text-center font-bold leading-tight">
                  DISCO IS PART OF THE HEDZ<br />COLLECTION BY MATT FURIE.
                </span>
              </div>
              <img
                src="/verified.gif"
                alt="Verified"
                className="w-5 h-5 object-contain ml-2"
                draggable="false"
              />
            </div>
          </motion.div>
        </motion.div>

              {!isBW && (
  <>
    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[60] pointer-events-none" />

    {/* Border image at bottom of Hero */}
    <img 
      src="/border.avif" 
      alt="Hero Border" 
      className="absolute bottom-0 left-0 w-full z-[70] pointer-events-none"
    />
  </>
)}


              {/* ✅ BW Mode Message */}
{isBW && (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-50 px-6">
    <p className="text-white text-lg md:text-2xl font-medium">
      The website as a meme is now live!
    </p>
    <p className="text-white text-lg md:text-2xl font-medium mt-3">
      Head to the{" "}
      <a
        href="/"
        className="text-purple-400 underline hover:text-purple-300 transition-colors"
      >
        homepage
      </a>
    </p>
  </div>
)}

</section>  {/* ✅ CLOSE HERO HERE */}




{/* ✅ SECOND SECTION */}
{!isBW && (
<section className="relative h-screen w-full overflow-hidden">
  {/* Clouds background (flipped vertically + moving right) */}
  <div
    className="absolute top-0 left-0 w-full h-full bg-repeat-x bg-top animate-clouds-right z-0"
    style={{
      backgroundImage: "url('/clouds.png')",
      transform: "scaleY(-1)", // 🔥 flips vertically
    }}
  />

  <div id="second-section-content" className="w-full h-full relative z-10">
    {/* Base art */}
    <img
      src="/second-section.png"
      alt="Second Section"
      className="absolute top-0 left-0 w-full h-full object-cover z-10"
    />

  {/* Overlay art flipped upside down + shifted right + on very top */}
<img
  src="/discoreflect.png"
  alt="Disco Reflect"
  className="absolute top-0 left-0 w-full h-full object-cover z-50"
  style={{ transform: "scaleY(-1) translateX(80px)" }} // tweak 80px as needed
/>



    {/* Pepe Slide */}
    <img
      src="/pepe-slide.png"
      alt="Pepe Slide"
      id="pepeSlide"
      className="absolute left-[0%] top-0 w-[2000px] z-30 opacity-0 transition-transform duration-500 ease-out"
    />

    {/* gradients */}
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-black to-transparent z-[60] pointer-events-none" />
  </div>
</section>
)} 


{/* ✅ DISCO SHOCKED SECTION WITH ZOOM + BORDER STRIPS */}
{!isBW && (
<section
  ref={shockedRef}
  className="relative h-screen w-full bg-black overflow-hidden"
>
  {/* Wrap clouds + image in one motion.div that zooms */}
  <motion.div
    className="absolute top-0 left-0 w-full h-full"
    style={{ scale }}
  >
    {/* Moving clouds background */}
    <div
      className="absolute top-0 left-0 w-full h-full bg-repeat-x bg-top animate-clouds"
      style={{
        backgroundImage: "url('/clouds.png')",
      }}
    />

    {/* Shocked guy */}
    <img
      src="/disco-shocked.png"
      alt="Disco Shocked"
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
  </motion.div>

  {/* 🔥 Thin top strip */}
  <div className="absolute top-0 left-0 w-full h-[12px] bg-black z-20 pointer-events-none" />

  {/* 🔥 Thin left strip */}
  <div className="absolute top-0 left-0 h-full w-[12px] bg-black z-20 pointer-events-none" />

  {/* 🔥 Thin right strip */}
  <div className="absolute top-0 right-0 h-full w-[12px] bg-black z-20 pointer-events-none" />
</section>
)} 


{/* ✅ PEPE SHH SECTION WITH ZOOM + BORDER STRIPS */}
 {!isBW && (
<section
  ref={pepeShhRef}
  className="relative h-screen w-full bg-black overflow-hidden"
>
  {/* Wrap clouds + image in one motion.div that zooms */}
  <motion.div
    className="absolute top-0 left-0 w-full h-full"
    style={{ scale: pepeShhScale }}
  >
    {/* Moving clouds background (going right, not flipped) */}
    <div
      className="absolute top-0 left-0 w-full h-full bg-repeat-x bg-top animate-clouds-right"
      style={{
        backgroundImage: "url('/clouds.png')",
      }}
    />

    {/* Pepe Shh image */}
    <img
      src="/pepe-shh.png"
      alt="Pepe Shh"
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
  </motion.div>

  {/* 🔥 Thin top strip */}
  <div className="absolute top-0 left-0 w-full h-[12px] bg-black z-20 pointer-events-none" />

  {/* 🔥 Thin left strip */}
  <div className="absolute top-0 left-0 h-full w-[12px] bg-black z-20 pointer-events-none" />

  {/* 🔥 Thin right strip */}
  <div className="absolute top-0 right-0 h-full w-[12px] bg-black z-20 pointer-events-none" />
    {/* Border image at bottom of Pepe Shhh */}
<img 
  src="/border 2.png" 
  alt="Pepe Shhh Border" 
  className="absolute bottom-0 left-0 w-full z-[70] pointer-events-none"
/>

</section>
)} 

{/* ✅ PEPE'S PARTY + PARTY HERO (with floating money) */}
{!isBW && (
  <section
    id="pepes-party-hero"
    ref={partySectionRef}
    className="relative h-[200vh] w-full bg-black flex flex-col items-center justify-start overflow-hidden"
  >
    {/* Top strip + border */}
    <div className="absolute top-0 left-0 w-full h-[8px] bg-black z-[80]" />
    <img
      src="/border 2.png"
      alt="Top Border"
      className="absolute top-0 left-0 w-full rotate-180 transform z-[70] pointer-events-none"
    />

    {/* First half — heading + ball */}
    <div className="relative h-screen flex items-center justify-center w-full">
     <h1
  ref={partyHeadingRef}
  className="font-[ProcerusRegular] text-white leading-none 
             text-[60vh] md:text-[70vh] lg:text-[80vh] tracking-[0.02em] 
             transform scale-y-[1.25] relative
             grid grid-cols-[1fr_auto_1fr] items-center justify-items-center w-full"
>
  {/* Left word — scaled horizontally */}
  <span
    ref={wordLeftRef}
    className="text-green-400 whitespace-nowrap inline-block relative z-[180] origin-center scale-x-[0.7]"
    style={{ textShadow: "0 6px 14px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.6)" }}
  >
    MATT FURIE’S
  </span>

  {/* Disco ball in the middle column */}
  <motion.img
    key="disco-ball"
    src="/disco-ball.png"
    alt="Disco Ball"
    className="w-[72vh] md:w-[86vh] lg:w-[100vh] max-w-none h-auto object-contain z-[140]"
    style={{
      y: ballY,
      opacity: ballOpacity,
      willChange: "transform, opacity",
      transformOrigin: "center top",
      filter:
        "drop-shadow(0 14px 28px rgba(0,0,0,0.85)) drop-shadow(0 0 26px rgba(255,255,255,0.5)) drop-shadow(0 0 60px rgba(255,255,255,0.25))",
    }}
  />

  {/* Right word — untouched */}
  <span
    ref={wordRightRef}
    className="text-purple-400 whitespace-nowrap inline-block relative z-[120]"
  >
    PARTY
  </span>
</h1>


    </div>

    {/* Second half — Party Hero with lights + money */}
<div id="party-hero" ref={partyHeroRef} className="relative h-screen w-full overflow-hidden isolate">


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

  {/* 💵 Floating notes behind party.png */}
 <div className="absolute inset-0 z-[5] pointer-events-none">

    {[...Array(12)].map((_, i) => (
      <img
        key={`party-back-${i}`}
        src="/dollar.png"
        className="scroll-fall absolute opacity-60"
       style={{
  width: `${i % 2 === 0 ? 120 : 80}px`,
  left: `${i % 2 === 0 ? 15 + (i * 12) % 40 : 55 + (i * 15) % 40}%`,
  animationDuration: `${6 + (i % 6) * 1.25}s`,
  animationDelay: `${i * 1.5}s`,
}}


        data-speed={0.1 + (i % 2) * 0.05}
        data-rotate={i % 2 === 0 ? -20 + i * 15 : 30}
      />
    ))}
  </div>

  {/* 🖼️ Party hero art */}
  <img
    src="/discopartybrett.png"
    alt="Party Hero"
    className="absolute inset-0 w-full h-full object-cover z-10"
  />

  {/* 💵 Floating notes in front of party.png */}
  <div className="absolute inset-0 z-20 pointer-events-none">
    {[...Array(10)].map((_, i) => (
      <img
        key={`party-front-${i}`}
        src="/dollar.png"
        className="scroll-fall absolute"
      style={{
  width: `${i % 2 === 0 ? 140 : 100}px`,
  left: `${i % 2 === 0 ? 15 + (i * 12) % 40 : 55 + (i * 15) % 40}%`,
  animationDuration: `${5 + (i % 6) * 1.15}s`,
  animationDelay: `${i * 1.5}s`,
}}


        data-speed={0.2 + (i % 2) * 0.05}
        data-rotate={i % 2 === 0 ? 45 : -15 + i * 10}
      />
    ))}
  </div>

  {/* 🟪 Gradient fades */}
  <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none" />
</div>

  </section>
)}





{/* ✅ MONEY SECTION (with debug for blurred notes) */}
{/*
{!isBW && (
<section id="money-section" className="relative h-[180vh] overflow-hidden">
  <div
    id="disco-bg"
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      background: "linear-gradient(135deg, #7f00ff, #e100ff)",
      transition: "background 0.5s ease",
    }}
  ></div>


  <div className="absolute inset-0 z-10 pointer-events-none">
    {[...Array(7)].map((_, i) => (
      <img
        key={`back-${i}`}
        src="/dollar.png"
        className="scroll-float absolute"
        style={{
          width: `${220 + (i % 2) * 50}px`,
          top: `${5 + (i * 12) % 90}%`,
          left: `${i % 2 === 0 ? 5 + (i * 10) % 40 : 50 + (i * 12) % 45}%`,
        }}
        data-speed={0.1 + (i % 2) * 0.05}
        data-rotate={i === 2 || i === 5 ? 75 : -30 + i * 10}
      />
    ))}
  </div>


  <div className="relative z-20 flex justify-center items-center h-full pointer-events-none">
    <img
      src="/seated-character.png"
      alt="Disco Meditating"
      className="w-[1600px] max-w-none scale-[1.1]"
    />
  </div>

  
  <div className="absolute inset-0 z-30 pointer-events-none">
    {[...Array(7)].map((_, i) => {
      const flip = i >= 4 && i !== 6;
      return (
        <img
          key={`mid-${i}`}
          src="/dollar.png"
          className="scroll-float absolute"
          style={{
            width: `${300 + (i % 3) * 50}px`,
            top: `${30 + i * 10}%`,
            left: `${10 + (i * 20) % 80}%`,
          }}
          data-speed={0.15 + (i % 2) * 0.05}
          data-rotate={i === 1 || i === 4 ? 70 : -20 + i * 15}
          data-flip={flip ? "true" : "false"}
          data-flipspeed={flip ? 0.2 + i * 0.03 : undefined}
        />
      );
    })}
  </div>


<div className="absolute inset-0 z-30 pointer-events-none">
  {[...Array(3)].map((_, i) => (
    <img
      key={`front-${i}`}
      src="/dollar.png"
      className="scroll-float absolute blur-sm"
      style={{
        width: `${500 + (i % 2) * 100}px`,
        top: `${60 + (i * 20) % 40}%`, // 👈 nudged even lower
        left: `${i % 2 === 0 ? 10 : 75}%`,
      }}
      data-speed={0.35 + i * 0.1}
      data-rotateonly={i === 1 ? "true" : undefined}
      data-rotatespeed={i === 1 ? 0.05 : undefined}
      data-rotate={i === 1 ? 85 : -10 + i * 20}
    />
  ))}
</div>





 
  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black via-black/60 to-transparent z-[60] pointer-events-none" />
  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-[60] pointer-events-none" />
</section>
)} 
*/}

           {/* ✅ GLOBAL STATIC OVERLAY */}
      <div className="fixed inset-0 z-[80] pointer-events-none mix-blend-screen opacity-10">
        {[...Array(5)].map((_, row) =>
          [...Array(5)].map((_, col) => (
            <img key={`static-${row}-${col}`} src="/static.gif" alt="Static" className="absolute object-cover"
              style={{ width: "480px", height: "360px", top: `${row * 360}px`, left: `${col * 480}px` }} />
          ))
        )}
      </div>

{/* ✅ STORYLINE POPUP (desktop: centered at bottom) */}
<motion.div
  initial={{ y: 100, opacity: 0 }}
  animate={
    (storyVisible || shockedStoryVisible || pepeShhStoryVisible || partyStoryVisible)
      ? { y: 0, opacity: 1 }
      : { y: 100, opacity: 0 }
  }
  transition={{ type: "spring", stiffness: 120, damping: 20 }}
  className="fixed inset-x-0 z-[200] pointer-events-none flex justify-center"
  style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}  // safe-area friendly
>
  <div className="pointer-events-auto bg-black/80 backdrop-blur-xl border border-purple-500/40 shadow-[0_0_25px_#a855f7] rounded-xl px-6 py-4 flex items-center gap-4 w-auto max-w-3xl mx-auto">

    {/* First story with DISCO? */}
    {storyVisible && (
      <>
        <div className="flex-shrink-0 text-purple-400 text-lg font-extrabold tracking-wide">
          DISCO?
        </div>
        <div className="w-px h-10 bg-purple-500/40" />
        <div className="flex-1 text-left text-sm font-medium text-purple-200">
          <span>{displayedText}</span>
          <span className="text-purple-500/40">
            {fullStory.slice(displayedText.length)}
          </span>
        </div>
      </>
    )}

    {/* Shocked story - no label */}
    {shockedStoryVisible && (
      <div className="flex-1 text-left text-sm font-medium text-purple-200">
        <span>{shockedDisplayedText}</span>
        <span className="text-purple-500/40">
          {shockedStory.slice(shockedDisplayedText.length)}
        </span>
      </div>
    )}

    {/* Pepe Shh story with PEPE */}
    {pepeShhStoryVisible && (
      <>
        <div className="flex-shrink-0 text-green-400 text-lg font-extrabold tracking-wide">
          PEPE
        </div>
        <div className="w-px h-10 bg-green-500/40" />
        <div className="flex-1 text-left text-sm font-medium text-green-200">
          <span>{pepeShhDisplayedText}</span>
          <span className="text-green-500/40">
            {pepeShhStory.slice(pepeShhDisplayedText.length)}
          </span>
        </div>
      </>
    )}

    {/* Party (bottom) storyline — with PEPE label (green) */}
    {partyStoryVisible && (
      <>
        <div className="flex-shrink-0 text-green-400 text-lg font-extrabold tracking-wide">
          PEPE
        </div>
        <div className="w-px h-10 bg-green-500/40" />
        <div className="flex-1 text-left text-sm font-medium text-green-200">
          <span>{partyDisplayedText}</span>
          <span className="text-green-500/40">
            {partyStory.slice(partyDisplayedText.length)}
          </span>
        </div>
      </>
    )}
  </div>
</motion.div>



{/* ===== LINKS OVERLAY (portal, above blur) ===== */}
{isLinksOpen &&
  createPortal(
    <AnimatePresence>
      <>
        {/* ✕ button */}
        <motion.button
          key="close-button"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          onClick={() => setIsLinksOpen(false)}
          className="fixed top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full
                     bg-black/90 border border-purple-500/50 flex items-center justify-center
                     text-purple-200 text-3xl font-bold hover:bg-purple-600 hover:text-white
                     transition-colors shadow-lg z-[1100] pointer-events-auto"
        >
          ✕
        </motion.button>

        {/* Blur backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg pointer-events-auto"
          onClick={() => setIsLinksOpen(false)}
        />

        {/* Modal content (icons + names) */}
        <motion.div
          key="icon-grid"
          className="fixed inset-0 z-[1002] flex flex-wrap items-center justify-center gap-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          aria-hidden="true"
        >
          {/* Telegram */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://t.me/DiscoHedz" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  className="w-20 h-20 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">Telegram</p>
          </div>

          {/* X (Twitter) */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://x.com/discohedzeth" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-black flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/x.svg"
                  alt="X"
                  className="w-16 h-16 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">X</p>
          </div>

          {/* DEXscreener */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://dexscreener.com/ethereum/0x807ac92bc2f76876c2b20ad862d67a58727dc73c" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-gray-800 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/dexscreener.png"
                  alt="DEXscreener"
                  className="w-20 h-20 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">DEXscreener</p>
          </div>

          {/* DEXTools */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://www.dextools.io/app/en/token/disco?t=1757971374692" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-gray-900 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/dextools.svg"
                  alt="DEXTools"
                  className="w-16 h-16 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">DEXTools</p>
          </div>

          {/* Uniswap */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://app.uniswap.org/" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-pink-200 flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/uniswap.svg"
                  alt="Uniswap"
                  className="w-20 h-20 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">Uniswap</p>
          </div>

          {/* TikTok */}
          <div className="flex flex-col items-center gap-2">
            <a href="https://www.tiktok.com/@discohedzeth" target="_blank" rel="noreferrer" className="group">
              <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center 
                              transition-transform duration-300 group-hover:scale-110 shadow-[0_0_25px_#a855f7]">
                <img
                  src="/icons/tiktok.svg"
                  alt="TikTok"
                  className="w-20 h-20 translate-x-1 transition-transform duration-300 group-hover:scale-125"
                />
              </div>
            </a>
            <p className="text-sm text-purple-200 font-semibold">TikTok</p>
          </div>
        </motion.div>
      </>
    </AnimatePresence>,
    document.body
  )
}


{/* ===== CONTRACT OVERLAY (portal, above blur) ===== */}
{isContractOpen &&
  createPortal(
    <AnimatePresence>
      <>
        {/* ✕ button (closes only via this) */}
        <motion.button
          key="contract-close"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          onClick={() => setIsContractOpen(false)}
          className="fixed top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full
                     bg-black/90 border border-purple-500/50 flex items-center justify-center
                     text-purple-200 text-3xl font-bold hover:bg-purple-600 hover:text-white
                     transition-colors shadow-lg z-[1100] pointer-events-auto"
        >
          ✕
        </motion.button>

        {/* Backdrop (no click-to-close) */}
        <motion.div
          key="contract-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg pointer-events-auto"
        />

       {/* Contract pill (nav-bar style, centered middle) */}
<div
  className="fixed z-[1002] pointer-events-auto"
  style={{
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // 👈 true horizontal + vertical center
  position: "fixed",
}}

  onClick={(e) => e.stopPropagation()} // don’t let backdrop clicks close it
>
  <motion.div
    key="contract-pill"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="bg-black/40 backdrop-blur-xl backdrop-saturate-150 text-white
               px-10 py-4 rounded-full shadow-[0_0_25px_#a855f7]
               flex items-center gap-8 w-[min(92vw,900px)]"
  >
    {/* Left: Logo + Disco/Ethereum */}
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-10 h-10 rounded-full bg-purple-600 overflow-hidden flex items-center justify-center scale-125">
        <img
          src="/disco-logo.png"
          alt="Disco Logo"
          className="w-[120%] h-[120%] object-cover scale-110"
          draggable="false"
        />
      </div>
      <div className="leading-tight">
        <div className="text-xl font-extrabold text-white">Disco</div>
        <div className="text-[12px] text-gray-400 -mt-0.5">Ethereum</div>
      </div>
    </div>

    {/* Middle: Contract address */}
    <div
      className="flex-1 text-center font-mono text-sm md:text-base tracking-wide
                 overflow-hidden text-ellipsis whitespace-nowrap"
      title="0x787B197F793F7D04366536F6a7a56a799868A64b"
    >
      0x787B197F793F7D04366536F6a7a56a799868A64b
    </div>

    {/* Right: Copy button */}
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
      {/* Two-squares icon */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           fill="currentColor" className="w-5 h-5">
        <path d="M16 1H6a2 2 0 0 0-2 2v10h2V3h10V1z"/>
        <path d="M18 5H10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 10H10V7h8v8z"/>
      </svg>
      {copied ? "Copied!" : "Copy"}
    </button>
  </motion.div>
</div>

      </>
    </AnimatePresence>,
    document.body
  )
}

{/* ===== TOKENOMICS OVERLAY (portal) ===== */}
{isTokenomicsOpen &&
  createPortal(
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
          className="fixed top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-lg pointer-events-auto"
        />

        {/* Centered container */}
        <div className="fixed inset-0 z-[1002] flex items-center justify-center pointer-events-none">
          <motion.div
            key="tokenomics-grid"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="pointer-events-auto w-[min(92vw,1100px)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* GRID START */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* TOP ROW */}
              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
                <div className="text-xs tracking-widest text-purple-300/70 mb-4">TICKER</div>
                <div className="text-5xl md:text-6xl font-extrabold text-white">$DISCO</div>
              </div>

              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center text-center">
                <div className="text-xs tracking-widest text-purple-300/70 mb-4">SUPPLY</div>
                <div className="text-5xl md:text-6xl font-extrabold text-white">1,000,000,000</div>
                <div className="mt-3 text-sm text-purple-200/80">One Billion, Baby!</div>
              </div>

              {/* MIDDLE ROW */}
              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 flex flex-col items-center justify-center text-center">
                <div className="text-xs tracking-widest text-purple-300/70 mb-4">LIQUIDITY POOL</div>
                <div className="text-4xl md:text-5xl font-extrabold text-white">LP Locked</div>
                <div className="mt-3 text-sm text-purple-200/80">Rug Pull Risk: 0%</div>
              </div>

              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 flex flex-col items-center justify-center text-center">
                <div className="text-xs tracking-widest text-purple-300/70 mb-4">TAXES</div>
                <div className="text-4xl md:text-5xl font-extrabold text-white">0%</div>
                <div className="mt-3 text-sm text-purple-200/80">Fees are for pussies.</div>
              </div>

              {/* CTO card — image only */}
              <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 row-span-2 flex items-center justify-center relative overflow-hidden">
               <img
  src="/disco-body.png"
  alt="Disco Body"
  className="w-full h-full object-contain scale-[1.5] origin-center"
/>


              </div>

              {/* BOTTOM WIDE CARD (kept inside the grid so col-span works) */}
              <div className="relative rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 lg:col-span-2 h-full overflow-hidden">
                {/* Background image */}
                <img
                  src="/discopartybrett.png"
                  alt="Matt Furie Art"
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                {/* Foreground content */}
                <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_25px_#a855f7] p-6 h-[300px] relative overflow-hidden">
                  <img src="/discopartybrett.png" alt="Matt Furie" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 flex flex-col text-center h-full">
                    <div className="mt-4 text-xs tracking-widest text-purple-300/70">NARRATIVE</div>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="text-3xl md:text-4xl font-extrabold text-white">
                        The Last Dance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* GRID END */}
            </div>
          </motion.div>
        </div>
      </>
    </AnimatePresence>,
    document.body
  )
}



    </div> {/* closes the blur wrapper */}
  </div>
  );
}
