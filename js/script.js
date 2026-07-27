/* =========================================================
   AURELIA — Site interactions, rendering, and animations
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  initLoader();
  // Content (restaurant info, hero/about copy, menu, gallery, etc.) is fetched
  // from /data before anything renders — see js/data.js for where that comes
  // from and how it's kept in sync with staff edits made through the CMS.
  await loadSiteContent();
  renderSiteMeta();
  renderHero();
  renderAbout();
  renderSectionHeaders();
  initNavScroll();
  initMobileMenu();
  initSmoothScroll();
  renderMenu();
  renderSignatureDishes();
  renderGallery();
  renderTestimonials();
  renderFeatures();
  renderContactInfo();
  renderFooterAndSocial();
  initCounters();
  initReservationForm();
  initNewsletterForm();
  initRippleEffect();
  initBackToTop();
  initToast();
  initAOS();
  initGSAPHero();
  initSwiper();
  initGLightbox();
});

/* ---------- Loader ---------- */
function initLoader(){
  const loader = document.getElementById("page-loader");
  if (!loader) return;
  window.addEventListener("load", () => setTimeout(() => loader.classList.add("loaded"), 400));
  setTimeout(() => loader.classList.add("loaded"), 2200); // failsafe
}

/* ---------- Nav ---------- */
function initNavScroll(){
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const update = () => nav.classList.toggle("scrolled", window.scrollY > 60);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initMobileMenu(){
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const scrim = document.getElementById("mobile-scrim");
  // The button is a full 44x44px touch target (per mobile accessibility guidelines);
  // the small 3-line icon inside it is a separate element ("icon") that gets the
  // "open" class driving the X-transform animation.
  const icon = btn?.querySelector(".hamburger");
  if (!btn || !menu) return;
  const open = () => { menu.classList.add("open"); scrim.classList.add("open"); icon?.classList.add("open"); btn.setAttribute("aria-expanded", "true"); document.body.classList.add("no-scroll"); };
  const close = () => { menu.classList.remove("open"); scrim.classList.remove("open"); icon?.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll"); };
  btn.addEventListener("click", () => menu.classList.contains("open") ? close() : open());
  scrim?.addEventListener("click", close);
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById("site-nav")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------- Site meta (brand name wherever it appears) ---------- */
function renderSiteMeta(){
  document.querySelectorAll("[data-site-name]").forEach(el => { el.textContent = RESTAURANT.name; });
}

/* ---------- Hero ---------- */
function renderHero(){
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
  setText("hero-eyebrow", HERO.eyebrow);
  const titleEl = document.getElementById("hero-title");
  if (titleEl) titleEl.innerHTML = `${HERO.titleLine1 || ""}<br>${HERO.titleLine2 || ""}`;
  setText("hero-desc", HERO.description);
  setText("hero-cta-primary", HERO.primaryCtaText);
  setText("hero-cta-secondary", HERO.secondaryCtaText);
  const bg = document.getElementById("hero-bg");
  if (bg && HERO.backgroundImage) bg.style.backgroundImage = `url('${HERO.backgroundImage}')`;
}

/* ---------- About ---------- */
function renderAbout(){
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
  setText("about-eyebrow", ABOUT.eyebrow);
  const headingEl = document.getElementById("about-heading");
  if (headingEl) headingEl.innerHTML = `${ABOUT.headingLine1 || ""}<br>${ABOUT.headingLine2 || ""}`;
  setText("about-para1", ABOUT.paragraph1);
  setText("about-para2", ABOUT.paragraph2);
  const mainImg = document.getElementById("about-main-img");
  if (mainImg && ABOUT.mainImage) mainImg.src = ABOUT.mainImage;
  const chefImg = document.getElementById("about-chef-img");
  if (chefImg && ABOUT.chefImage) chefImg.src = ABOUT.chefImage;

  // initCounters() (called later, after this) reads these data-* attributes
  // off each .counter span to drive its count-up animation, so the CMS-edited
  // stat numbers have to land here before that runs.
  const setStat = (id, target, decimals, suffix) => {
    const el = document.getElementById(id);
    if (!el || target == null) return;
    el.dataset.target = target;
    el.dataset.decimals = decimals;
    el.dataset.suffix = suffix;
  };
  setStat("stat-years", ABOUT.statYears, 0, "+");
  setStat("stat-guests", ABOUT.statGuests, 0, "+");
  setStat("stat-dishes", ABOUT.statDishes, 0, "+");
  setStat("stat-rating", ABOUT.statRating, 1, "★");
}

/* ---------- Section eyebrows/headings/subtext ---------- */
function renderSectionHeaders(){
  const sections = {
    menu: ["menu-eyebrow", "menu-heading", "menu-subtext"],
    signatureDishes: ["signature-eyebrow", "signature-heading", null],
    gallery: ["gallery-eyebrow", "gallery-heading", "gallery-subtext"],
    testimonials: ["testimonials-eyebrow", "testimonials-heading", null],
    reservation: ["reservation-eyebrow", "reservation-heading", null],
    whyChooseUs: ["whychooseus-eyebrow", "whychooseus-heading", null],
    contact: ["contact-eyebrow", "contact-heading", null],
  };
  Object.entries(sections).forEach(([key, [eyebrowId, headingId, subtextId]]) => {
    const data = SECTIONS[key];
    if (!data) return;
    const eyebrowEl = document.getElementById(eyebrowId);
    if (eyebrowEl && data.eyebrow != null) eyebrowEl.textContent = data.eyebrow;
    const headingEl = document.getElementById(headingId);
    if (headingEl && data.heading != null) headingEl.textContent = data.heading;
    if (subtextId) {
      const subtextEl = document.getElementById(subtextId);
      if (subtextEl && data.subtext != null) subtextEl.textContent = data.subtext;
    }
  });

  const resBg = document.getElementById("reservation-bg");
  if (resBg && SECTIONS.reservation?.backgroundImage) {
    resBg.style.backgroundImage = `url('${SECTIONS.reservation.backgroundImage}')`;
  }
}

/* ---------- Footer text + social links (shared between Contact and Footer) ---------- */
function renderFooterAndSocial(){
  const setText = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.textContent = val; };
  setText("footer-blurb", RESTAURANT.footerBlurb);
  setText("footer-newsletter-blurb", RESTAURANT.newsletterBlurb);
  setText("footer-copyright", RESTAURANT.copyrightLine);
  setText("footer-address-line", `${RESTAURANT.address} · ${RESTAURANT.phone}`);

  document.querySelectorAll("[data-social]").forEach(a => {
    const url = RESTAURANT.socialLinks?.[a.dataset.social];
    if (url) a.setAttribute("href", url);
  });
}

/* ---------- Menu ---------- */
let activeMenuCategory = null;
function renderMenu(){
  const tabsWrap = document.getElementById("menu-tabs");
  const grid = document.getElementById("menu-grid");
  if (!tabsWrap || !grid) return;

  // Categories are staff-editable (content/settings/menu-categories.json), so
  // don't assume "Starters" is still first — fall back to whatever the CMS
  // content actually lists.
  if (!activeMenuCategory || !MENU_CATEGORIES.includes(activeMenuCategory)) {
    activeMenuCategory = MENU_CATEGORIES[0];
  }

  tabsWrap.innerHTML = MENU_CATEGORIES.map((cat, i) => `
    <button class="menu-tab ${cat === activeMenuCategory ? "active" : ""}" data-cat="${cat}">${cat}</button>`).join("");

  tabsWrap.querySelectorAll(".menu-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeMenuCategory = btn.dataset.cat;
      tabsWrap.querySelectorAll(".menu-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderMenuGrid();
    });
  });

  renderMenuGrid();
}

function renderMenuGrid(){
  const grid = document.getElementById("menu-grid");
  if (!grid) return;
  const items = MENU_ITEMS.filter(m => m.category === activeMenuCategory);
  grid.innerHTML = items.map((m, i) => `
    <div class="dish-card" data-aos="fade-up" data-aos-delay="${(i % 4) * 80}">
      <div class="dish-img-wrap">
        ${m.popular ? `<span class="badge-popular">Popular</span>` : ""}
        <img src="${m.img}" alt="${m.name}" loading="lazy">
      </div>
      <div class="p-5">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-head text-lg leading-snug">${m.name}</h3>
          <span class="font-head text-lg text-gold whitespace-nowrap" style="color:var(--c-gold)">${moneyFmt(m.price)}</span>
        </div>
        <p class="text-sm text-charcoal/60 mt-2 leading-relaxed">${m.desc}</p>
      </div>
    </div>`).join("");
  if (window.AOS) AOS.refreshHard();
}

/* ---------- Signature dishes ---------- */
function renderSignatureDishes(){
  const wrap = document.getElementById("signature-grid");
  if (!wrap) return;
  wrap.innerHTML = SIGNATURE_DISHES.map((d, i) => `
    <div class="grid md:grid-cols-2 gap-0 items-stretch ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""} mb-16 md:mb-24 last:mb-0" data-aos="fade-up">
      <div class="signature-card aspect-portrait">
        <img src="${d.img}" alt="${d.name}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <div class="flex flex-col justify-center p-8 md:p-12 bg-white">
        <span class="badge-chef w-fit mb-5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>
          Chef's Recommendation
        </span>
        <h3 class="font-head text-2xl md:text-3xl mb-4">${d.name}</h3>
        <p class="text-sm md:text-base text-charcoal/65 leading-relaxed mb-5">${d.desc}</p>
        <p class="text-xs uppercase tracking-widest text-charcoal/40 mb-1">Ingredients</p>
        <p class="text-sm text-charcoal/60 mb-6">${d.ingredients}</p>
        <p class="font-head text-2xl" style="color:var(--c-gold)">${moneyFmt(d.price)}</p>
      </div>
    </div>`).join("");
  if (window.AOS) AOS.refreshHard();
}

/* ---------- Gallery ---------- */
function renderGallery(){
  const wrap = document.getElementById("gallery-masonry");
  if (!wrap) return;
  wrap.innerHTML = GALLERY.map((g, i) => {
    // Reserve the image's real aspect ratio (from its own URL's w/h params) up front,
    // so the masonry grid doesn't collapse to zero height (and then jump/reflow) while
    // the lazy-loaded photo is still fetching — most noticeable on slower mobile
    // connections, which is exactly the primary audience here.
    const params = new URL(g.img).searchParams;
    const ratio = `${params.get("w") || 800}/${params.get("h") || 1000}`;
    return `
    <a href="${g.img}" class="glightbox masonry-item" style="aspect-ratio:${ratio}" data-gallery="aurelia-gallery" data-title="${g.caption}" data-aos="fade-up" data-aos-delay="${(i % 6) * 60}">
      <img src="${g.img}" alt="${g.caption}" loading="lazy">
      <div class="masonry-zoom-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#141210" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
      </div>
      <div class="masonry-overlay">
        <div>
          <p class="text-[10px] uppercase tracking-widest text-gold-light" style="color:var(--c-gold-light)">${g.cat}</p>
          <p class="text-white text-sm font-medium mt-0.5">${g.caption}</p>
        </div>
      </div>
    </a>`;
  }).join("");
  if (window.AOS) AOS.refreshHard();
}

/* ---------- Testimonials ---------- */
function renderTestimonials(){
  const wrap = document.getElementById("testimonials-swiper-wrapper");
  if (!wrap) return;
  wrap.innerHTML = TESTIMONIALS.map(t => `
    <div class="swiper-slide h-auto">
      <div class="testimonial-card flex flex-col">
        <span class="quote-mark">"</span>
        <p class="stars-gold text-sm mb-3">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</p>
        <p class="text-sm text-charcoal/70 leading-relaxed flex-1">${t.text}</p>
        <div class="flex items-center gap-3 mt-6 pt-6 border-t" style="border-color:var(--c-line)">
          <img src="${t.avatar}" class="w-11 h-11 rounded-full object-cover" alt="${t.name}">
          <div>
            <p class="font-head text-sm">${t.name}</p>
            <p class="text-xs text-charcoal/40">${t.date}</p>
          </div>
        </div>
      </div>
    </div>`).join("");
}

/* ---------- Feature cards ----------
   Icons are picked from a fixed, curated set (by key, via a CMS dropdown)
   rather than letting staff paste raw SVG markup — keeps the design
   consistent and avoids injecting arbitrary SVG from the CMS into the page. */
const FEATURE_ICONS = {
  leaf: `<path d="M12 2c-3 4-6 8-6 12a6 6 0 0 0 12 0c0-4-3-8-6-12Z"/>`,
  award: `<path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>`,
  ambience: `<path d="M3 12h18M12 3v18"/><circle cx="12" cy="12" r="9"/>`,
  wine: `<path d="M8 3h8l-1 8a3 3 0 0 1-6 0L8 3Z"/><path d="M12 14v7M9 21h6"/>`,
  service: `<path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/><circle cx="12" cy="8" r="4"/>`,
  produce: `<path d="M12 2c-3 4-6 8-6 12a6 6 0 0 0 12 0c0-4-3-8-6-12Z"/><path d="M12 8v8"/>`,
  star: `<path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L6 21l1.6-7L2.2 9.2l7.1-.6L12 2Z"/>`,
  sparkle: `<path d="M12 3v4M12 17v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>`,
};

function renderFeatures(){
  const wrap = document.getElementById("features-grid");
  if (!wrap) return;
  wrap.innerHTML = FEATURES.map((f, i) => `
    <div class="feature-card border" style="border-color:var(--c-line)" data-aos="fade-up" data-aos-delay="${(i % 3) * 100}">
      <div class="feature-icon-wrap">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--c-gold)" stroke-width="1.5" style="transition:stroke .4s">${FEATURE_ICONS[f.icon] || FEATURE_ICONS.leaf}</svg>
      </div>
      <h3 class="font-head text-lg mb-2">${f.title}</h3>
      <p class="text-sm text-charcoal/60 leading-relaxed">${f.desc}</p>
    </div>`).join("");
  if (window.AOS) AOS.refreshHard();
}

/* ---------- Contact info ---------- */
function renderContactInfo(){
  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText("contact-address", RESTAURANT.address);
  setText("contact-phone", RESTAURANT.phone);
  setText("contact-email", RESTAURANT.email);
  const phoneLinks = document.querySelectorAll("[data-tel-link]");
  phoneLinks.forEach(a => a.setAttribute("href", "tel:" + RESTAURANT.phone.replace(/[^\d+]/g, "")));
  const emailLinks = document.querySelectorAll("[data-email-link]");
  emailLinks.forEach(a => a.setAttribute("href", "mailto:" + RESTAURANT.email));

  const mapFrame = document.getElementById("contact-map-iframe");
  if (mapFrame && RESTAURANT.mapQuery) {
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT.mapQuery)}&output=embed`;
  }

  const hoursWrap = document.getElementById("contact-hours");
  if (hoursWrap){
    hoursWrap.innerHTML = RESTAURANT.hours.map(h => `
      <div class="flex justify-between text-sm py-1.5">
        <span class="text-charcoal/60">${h.day}</span><span class="font-medium">${h.time}</span>
      </div>`).join("");
  }
  const resHoursWrap = document.getElementById("reservation-hours");
  if (resHoursWrap){
    resHoursWrap.innerHTML = RESTAURANT.hours.map(h => `
      <div class="flex justify-between text-sm py-1.5 text-white/80">
        <span>${h.day}</span><span class="text-white">${h.time}</span>
      </div>`).join("");
  }
  const setResText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setResText("reservation-capacity", RESTAURANT.capacity);
  setResText("reservation-dresscode", RESTAURANT.dressCode);
  setResText("reservation-policy", RESTAURANT.policy);
}

/* ---------- Animated counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const decimals = el.dataset.decimals ? Number(el.dataset.decimals) : 0;
      const suffix = el.dataset.suffix || "";
      let cur = 0;
      const step = target / 60;
      const tick = () => {
        cur += step;
        if (cur >= target){ cur = target; }
        el.textContent = cur.toFixed(decimals) + suffix;
        if (cur < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* ---------- Reservation form ---------- */
function initReservationForm(){
  const form = document.getElementById("reservation-form");
  if (!form) return;

  const dateInput = document.getElementById("res-date");
  if (dateInput){
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const validators = [
      { id: "res-name", check: v => v.trim().length >= 2, msg: "Please enter your full name." },
      { id: "res-email", check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Please enter a valid email address." },
      { id: "res-phone", check: v => v.replace(/\D/g, "").length >= 7, msg: "Please enter a valid phone number." },
      { id: "res-guests", check: v => v !== "", msg: "Please select number of guests." },
      { id: "res-date", check: v => v !== "", msg: "Please choose a date." },
      { id: "res-time", check: v => v !== "", msg: "Please choose a time." },
    ];

    validators.forEach(({ id, check, msg }) => {
      const input = document.getElementById(id);
      const field = input.closest(".form-field");
      const errEl = field.querySelector(".field-error");
      if (!check(input.value)){
        field.classList.add("has-error");
        if (errEl) errEl.textContent = msg;
        valid = false;
      } else {
        field.classList.remove("has-error");
      }
    });

    if (!valid){
      form.querySelector(".has-error input, .has-error select")?.focus();
      return;
    }

    const submitBtn = document.getElementById("res-submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Booking...";

    setTimeout(() => {
      form.classList.add("hidden");
      const success = document.getElementById("reservation-success");
      success?.classList.remove("hidden");
      const nameSpan = document.getElementById("success-name");
      if (nameSpan) nameSpan.textContent = document.getElementById("res-name").value.trim().split(" ")[0];
      submitBtn.disabled = false;
      submitBtn.textContent = "Reserve Table";
    }, 900);
  });

  document.getElementById("res-book-another")?.addEventListener("click", () => {
    form.reset();
    form.querySelectorAll(".has-error").forEach(f => f.classList.remove("has-error"));
    form.classList.remove("hidden");
    document.getElementById("reservation-success")?.classList.add("hidden");
  });
}

/* ---------- Newsletter ---------- */
function initNewsletterForm(){
  document.querySelectorAll("[data-newsletter-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){
        showToast("Please enter a valid email address.");
        return;
      }
      showToast("Subscribed — welcome to the Aurelia table.");
      form.reset();
    });
  });
}

/* ---------- Ripple effect ---------- */
function initRippleEffect(){
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 700), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // The button floats at a fixed bottom-right viewport position, so without this it
  // sits directly on top of the footer's newsletter "Join" button once that scrolls
  // into the same bottom-right corner. Rather than tracking the whole footer (which
  // would keep lifting the button indefinitely, eventually pushing it off-screen on
  // short viewports), watch the actual colliding element and nudge the button up only
  // while it would truly overlap; revert to the default resting position otherwise.
  const collideTarget = document.querySelector("footer [data-newsletter-form] button");
  if (collideTarget) {
    const DEFAULT_BOTTOM = 24, SIZE = 46, GAP = 12;
    const reposition = () => {
      const r = collideTarget.getBoundingClientRect();
      const fabTop = window.innerHeight - DEFAULT_BOTTOM - SIZE;
      const fabBottomZone = window.innerHeight - DEFAULT_BOTTOM;
      const wouldOverlap = r.bottom > fabTop && r.top < fabBottomZone;
      btn.style.bottom = wouldOverlap ? `${(window.innerHeight - r.top) + GAP}px` : `${DEFAULT_BOTTOM}px`;
    };
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);
    reposition();
  }
}

/* ---------- Toast ---------- */
function initToast(){ window._toastTimer = null; }
function showToast(message){
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ---------- AOS ----------
   AOS drives nearly every scroll-reveal animation on this page via
   [data-aos] attributes (which AOS's own CSS hides by default until
   AOS.init() marks them animated). If the AOS CDN script fails to load
   for any reason (network hiccup, blocked request, ad blocker), those
   sections would stay permanently invisible. Guard against that by
   stripping the data-aos attributes so content simply renders normally,
   un-animated, instead of disappearing. */
function initAOS(){
  if (window.AOS){
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true, offset: 60 });
  } else {
    document.querySelectorAll("[data-aos]").forEach(el => el.removeAttribute("data-aos"));
  }
}

/* ---------- GSAP hero ----------
   Same failure mode as AOS above: the hero's headline/CTA elements are
   rendered with an inline opacity:0 starting state so GSAP can animate
   them in. If the GSAP CDN script fails to load, fall back to instantly
   revealing them via plain JS/CSS rather than leaving the hero blank. */
function initGSAPHero(){
  const heroEls = ["hero-eyebrow", "hero-title", "hero-desc", "hero-ctas", "scroll-indicator"];

  if (!window.gsap){
    heroEls.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = "opacity .8s ease, transform .8s ease";
      setTimeout(() => { el.style.opacity = "1"; el.style.transform = "none"; }, 250 + i * 150);
    });
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to("#hero-eyebrow", { opacity: 1, y: 0, duration: .8, delay: .3 })
    .to("#hero-title", { opacity: 1, y: 0, duration: 1 }, "-=0.5")
    .to("#hero-desc", { opacity: 1, y: 0, duration: .9 }, "-=0.6")
    .to("#hero-ctas", { opacity: 1, y: 0, duration: .9 }, "-=0.6")
    .to("#scroll-indicator", { opacity: 1, duration: .6 }, "-=0.4");

  if (window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-bg", {
      yPercent: 15,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  }
}

/* ---------- Swiper (testimonials) ---------- */
function initSwiper(){
  if (!window.Swiper) return;
  new Swiper(".testimonials-swiper", {
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    spaceBetween: 24,
    slidesPerView: 1,
    speed: 700,
    pagination: { el: ".testimonials-pagination", clickable: true },
    navigation: { nextEl: ".testimonials-next", prevEl: ".testimonials-prev" },
    breakpoints: {
      768: { slidesPerView: 2 },
      1100: { slidesPerView: 3 },
    },
  });
}

/* ---------- GLightbox (gallery) ---------- */
function initGLightbox(){
  if (!window.GLightbox) return;
  GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true });
}
