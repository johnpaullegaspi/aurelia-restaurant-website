/* =========================================================
   AURELIA — Content loader
   ---------------------------------------------------------
   All the site's editable content (restaurant info, hero/about
   copy, menu, gallery, testimonials, etc.) now lives as JSON
   under /content, edited by staff through the Decap CMS admin
   panel at /admin. That content is compiled by
   scripts/build-content.js (run automatically on every Netlify
   deploy) into the flat files under /data that this loader
   fetches at runtime — so a staff edit saved in the CMS shows
   up on the live site after the next deploy, with no other code
   changes needed.

   FALLBACK below is a complete copy of the site's original
   content. It's used if a fetch fails for any reason — most
   notably when this file is opened directly from disk
   (file://) rather than served over http(s), since browsers
   block fetch() of local files for security reasons. That
   means double-clicking index.html still shows a fully-populated
   page instead of a blank one.
   ========================================================= */

let RESTAURANT = {};
let HERO = {};
let ABOUT = {};
let SECTIONS = {};
let MENU_CATEGORIES = [];
let MENU_ITEMS = [];
let SIGNATURE_DISHES = [];
let GALLERY = [];
let TESTIMONIALS = [];
let FEATURES = [];

function moneyFmt(n) { return "$" + Number(n).toFixed(2); }

async function fetchJSON(path, fallback) {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${path} responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[content] Falling back to built-in content for ${path}:`, err.message);
    return fallback;
  }
}

async function loadSiteContent() {
  const [restaurant, hero, about, sections, categories, menuItems, signatureDishes, gallery, testimonials, features] = await Promise.all([
    fetchJSON("data/restaurant.json", FALLBACK.restaurant),
    fetchJSON("data/hero.json", FALLBACK.hero),
    fetchJSON("data/about.json", FALLBACK.about),
    fetchJSON("data/sections.json", FALLBACK.sections),
    fetchJSON("data/menu-categories.json", FALLBACK.menuCategories),
    fetchJSON("data/menu-items.json", FALLBACK.menuItems),
    fetchJSON("data/signature-dishes.json", FALLBACK.signatureDishes),
    fetchJSON("data/gallery.json", FALLBACK.gallery),
    fetchJSON("data/testimonials.json", FALLBACK.testimonials),
    fetchJSON("data/features.json", FALLBACK.features),
  ]);

  RESTAURANT = restaurant;
  HERO = hero;
  ABOUT = about;
  SECTIONS = sections;
  MENU_CATEGORIES = categories.categories || categories;
  MENU_ITEMS = menuItems;
  SIGNATURE_DISHES = signatureDishes;
  GALLERY = gallery;
  TESTIMONIALS = testimonials;
  FEATURES = features;
}

/* ---------------------------------------------------------
   Built-in fallback content (mirrors the seed files under
   /content at the time this site was built).
   --------------------------------------------------------- */
const IMG = (id, w = 900, h = 1125) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const FALLBACK = {
  restaurant: {
    name: "AURELIA",
    tagline: "A Modern Culinary Journey",
    phone: "+1 (555) 284-9910",
    email: "reservations@aureliarestaurant.com",
    address: "412 Marchmont Lane, Downtown District, New York, NY 10014",
    mapQuery: "412 Marchmont Lane New York NY",
    hours: [
      { day: "Monday – Thursday", time: "5:30 PM – 10:00 PM" },
      { day: "Friday – Saturday", time: "5:30 PM – 11:30 PM" },
      { day: "Sunday", time: "5:00 PM – 9:30 PM" },
    ],
    capacity: "Up to 80 guests, including 3 private dining rooms",
    dressCode: "Smart casual to elegant — jackets suggested for gentlemen after 7 PM",
    policy: "Reservations held for 15 minutes past booking time. Parties of 6+ require a 48-hour cancellation notice.",
    footerBlurb: "A modern culinary journey rooted in seasonal ingredients, quiet craftsmanship, and gracious hospitality since 2011.",
    newsletterBlurb: "Seasonal menus & exclusive invitations, straight to your inbox.",
    copyrightLine: "© 2026 AURELIA Restaurant. All rights reserved.",
    socialLinks: { facebook: "#", instagram: "#", tiktok: "#", twitter: "#" },
  },
  hero: {
    eyebrow: "Fine Dining · Est. 2011",
    titleLine1: "Elevate Every",
    titleLine2: "Evening",
    description: "A modern culinary journey rooted in seasonal ingredients, quiet craftsmanship, and gracious hospitality. Welcome to AURELIA.",
    primaryCtaText: "View Menu",
    secondaryCtaText: "Reserve a Table",
    backgroundImage: IMG("photo-1517248135467-4c7edcad34c4", 1800, 1200),
  },
  about: {
    eyebrow: "Our Story",
    headingLine1: "Where Craft Meets",
    headingLine2: "Quiet Elegance",
    paragraph1: "Founded in 2011 by Chef Antoine Marchetti, AURELIA began as a single idea: that fine dining should feel both extraordinary and effortless. Every dish on our menu is built around the season's finest ingredients, sourced from farms and purveyors we've partnered with for over a decade.",
    paragraph2: "Chef Marchetti trained in Lyon and Tokyo before bringing his refined, ingredient-first philosophy to New York. Today, his kitchen blends classical French technique with modern restraint — nothing on the plate without purpose, nothing missing that should be there.",
    mainImage: IMG("photo-1550966871-3ed3cdb5ed0c", 900, 1125),
    chefImage: IMG("photo-1577219491135-ce391730fb2c", 500, 625),
    statYears: 15, statGuests: 20000, statDishes: 100, statRating: 4.9,
  },
  sections: {
    menu: { eyebrow: "Featured Menu", heading: "Seasonal & Signature", subtext: "A curated selection from our full menu — crafted daily with the season's finest ingredients." },
    signatureDishes: { eyebrow: "Chef's Table", heading: "Signature Dishes" },
    gallery: { eyebrow: "Gallery", heading: "Moments at AURELIA", subtext: "A glimpse into our dining rooms, our kitchen, and the evenings we're proud to be part of." },
    testimonials: { eyebrow: "Testimonials", heading: "What Our Guests Say" },
    reservation: { eyebrow: "Reservation", heading: "Book Your Table", backgroundImage: IMG("photo-1414235077428-338989a2e8c0", 1800, 1200) },
    whyChooseUs: { eyebrow: "Why Choose Us", heading: "The AURELIA Difference" },
    contact: { eyebrow: "Contact", heading: "Visit or Reach Us" },
  },
  menuCategories: { categories: ["Starters", "Main Courses", "Seafood", "Steaks", "Pasta", "Desserts", "Drinks", "Signature Specials"] },
  menuItems: [
    { id: "m1", order: 1, category: "Starters", name: "Heirloom Beet Carpaccio", desc: "Thin-sliced roasted beets, whipped goat cheese, candied walnuts, aged balsamic.", price: 18, popular: true, img: IMG("photo-1467003909585-2f8a72700288", 700, 525) },
    { id: "m2", order: 2, category: "Starters", name: "Seared Foie Gras", desc: "Brioche toast, fig compote, port wine reduction, sea salt.", price: 26, popular: false, img: IMG("photo-1476124369491-e7addf5db371", 700, 525) },
    { id: "m3", order: 3, category: "Main Courses", name: "Herb-Crusted Rack of Lamb", desc: "Rosemary jus, roasted root vegetables, potato gratin.", price: 48, popular: true, img: IMG("photo-1544025162-d76694265947", 700, 525) },
    { id: "m4", order: 4, category: "Main Courses", name: "Duck Confit", desc: "Crispy leg confit, cherry gastrique, braised red cabbage.", price: 42, popular: false, img: IMG("photo-1432139555190-58524dae6a55", 700, 525) },
    { id: "m5", order: 5, category: "Seafood", name: "Pan-Seared Chilean Sea Bass", desc: "Saffron beurre blanc, fennel confit, micro herbs.", price: 46, popular: true, img: IMG("photo-1519708227418-c8fd9a32b7a2", 700, 525) },
    { id: "m6", order: 6, category: "Seafood", name: "Chilled Seafood Tower", desc: "Oysters, jumbo shrimp, king crab, mignonette, cocktail sauce.", price: 68, popular: false, img: IMG("photo-1559847844-5315695dadae", 700, 525) },
    { id: "m7", order: 7, category: "Steaks", name: "Dry-Aged Ribeye", desc: "28-day dry-aged, bone marrow butter, roasted bone marrow, jus.", price: 58, popular: true, img: IMG("photo-1546833999-b9f581a1996d", 700, 525) },
    { id: "m8", order: 8, category: "Steaks", name: "Filet Mignon", desc: "8oz center cut, truffle pomme purée, red wine reduction.", price: 54, popular: false, img: IMG("photo-1414235077428-338989a2e8c0", 700, 525) },
    { id: "m9", order: 9, category: "Pasta", name: "Black Truffle Tagliatelle", desc: "Fresh egg pasta, shaved black truffle, parmesan cream.", price: 36, popular: true, img: IMG("photo-1551183053-bf91a1d81141", 700, 525) },
    { id: "m10", order: 10, category: "Pasta", name: "Lobster Ravioli", desc: "House-made ravioli, brandy cream sauce, chive oil.", price: 40, popular: false, img: IMG("photo-1621996346565-e3dbc353d2e5", 700, 525) },
    { id: "m11", order: 11, category: "Desserts", name: "Valrhona Chocolate Fondant", desc: "Molten dark chocolate, salted caramel gelato, gold leaf.", price: 16, popular: true, img: IMG("photo-1488477181946-6428a0291777", 700, 525) },
    { id: "m12", order: 12, category: "Desserts", name: "Classic Tiramisu", desc: "Espresso-soaked ladyfingers, mascarpone cream, cocoa dust.", price: 14, popular: false, img: IMG("photo-1551024506-0bccd828d307", 700, 525) },
    { id: "m13", order: 13, category: "Drinks", name: "Aurelia Signature Old Fashioned", desc: "Small-batch bourbon, orange bitters, smoked cherry.", price: 19, popular: true, img: IMG("photo-1470337458703-46ad1756a187", 700, 525) },
    { id: "m14", order: 14, category: "Drinks", name: "Sommelier's Red Wine Pairing", desc: "Curated glass selected nightly by our head sommelier.", price: 22, popular: false, img: IMG("photo-1510626176961-4b57d4fbad03", 700, 525) },
    { id: "m15", order: 15, category: "Signature Specials", name: "Chef's Tasting Menu", desc: "Seven-course seasonal journey through Aurelia's finest dishes.", price: 145, popular: true, img: IMG("photo-1414235077428-338989a2e8c0", 700, 525) },
    { id: "m16", order: 16, category: "Signature Specials", name: "Whole Roasted Turbot for Two", desc: "Table-side filleted, brown butter caper sauce, seasonal vegetables.", price: 96, popular: false, img: IMG("photo-1546069901-ba9599a7e63c", 700, 525) },
  ],
  signatureDishes: [
    { id: "s1", order: 1, name: "Truffle-Crusted Wagyu Tenderloin", price: 78, desc: "Our most celebrated dish — A5 Wagyu tenderloin finished with a black truffle crust, served over a bed of roasted bone marrow purée with a 48-hour red wine jus.", ingredients: "A5 Wagyu beef, black truffle, bone marrow, aged red wine, micro herbs", img: IMG("photo-1546833999-b9f581a1996d", 1000, 1250) },
    { id: "s2", order: 2, name: "Lobster Thermidor Royale", price: 64, desc: "Whole Maine lobster, gently poached and finished under the grill with a cognac cream sauce, gruyère, and fresh tarragon.", ingredients: "Maine lobster, cognac, gruyère cheese, tarragon, cream", img: IMG("photo-1559847844-5315695dadae", 1000, 1250) },
    { id: "s3", order: 3, name: "Golden Saffron Risotto with Seared Scallops", price: 52, desc: "Slow-cooked Carnaroli rice infused with saffron, finished with Hokkaido scallops and a whisper of white truffle oil.", ingredients: "Carnaroli rice, saffron, Hokkaido scallops, white truffle oil, parmesan", img: IMG("photo-1519708227418-c8fd9a32b7a2", 1000, 1250) },
  ],
  gallery: [
    { id: "g1", order: 1, cat: "Interior", caption: "The Main Dining Room", img: IMG("photo-1517248135467-4c7edcad34c4", 800, 1000) },
    { id: "g2", order: 2, cat: "Dining Area", caption: "Candlelit Evening Ambience", img: IMG("photo-1550966871-3ed3cdb5ed0c", 800, 600) },
    { id: "g3", order: 3, cat: "Dishes", caption: "Wagyu Tenderloin Plating", img: IMG("photo-1546833999-b9f581a1996d", 800, 1000) },
    { id: "g4", order: 4, cat: "Chef", caption: "Chef Marchetti at Work", img: IMG("photo-1577219491135-ce391730fb2c", 800, 1000) },
    { id: "g5", order: 5, cat: "Cocktails", caption: "The Aurelia Old Fashioned", img: IMG("photo-1470337458703-46ad1756a187", 800, 1000) },
    { id: "g6", order: 6, cat: "Desserts", caption: "Valrhona Chocolate Fondant", img: IMG("photo-1488477181946-6428a0291777", 800, 600) },
    { id: "g7", order: 7, cat: "Guests", caption: "An Evening to Remember", img: IMG("photo-1529543544282-ea669407fca3", 800, 1000) },
    { id: "g8", order: 8, cat: "Outdoor", caption: "The Garden Terrace", img: IMG("photo-1552566626-52f8b828add9", 800, 1000) },
    { id: "g9", order: 9, cat: "Interior", caption: "The Private Dining Room", img: IMG("photo-1414235077428-338989a2e8c0", 800, 600) },
    { id: "g10", order: 10, cat: "Dishes", caption: "Lobster Thermidor Royale", img: IMG("photo-1559847844-5315695dadae", 800, 1000) },
    { id: "g11", order: 11, cat: "Chef", caption: "Plating with Precision", img: IMG("photo-1414235077428-338989a2e8c0", 800, 1000) },
    { id: "g12", order: 12, cat: "Cocktails", caption: "The Bar at Golden Hour", img: IMG("photo-1510626176961-4b57d4fbad03", 800, 600) },
  ],
  testimonials: [
    { id: "t1", order: 1, name: "Charlotte Bennett", rating: 5, date: "June 2026", text: "Every course was a revelation. The Wagyu tenderloin alone is worth the trip — impeccable service from the moment we walked in.", avatar: IMG("photo-1544005313-94ddf0286df2", 120, 120) },
    { id: "t2", order: 2, name: "James Whitfield", rating: 5, date: "May 2026", text: "Aurelia is the finest dining experience I've had in this city. The tasting menu was a masterclass in flavor and presentation.", avatar: IMG("photo-1500648767791-00dcc994a43e", 120, 120) },
    { id: "t3", order: 3, name: "Sophia Marlowe", rating: 5, date: "May 2026", text: "Celebrated our anniversary here and it exceeded every expectation. The staff made the evening feel truly special.", avatar: IMG("photo-1487412720507-e7ab37603c6f", 120, 120) },
    { id: "t4", order: 4, name: "Daniel Ashford", rating: 4, date: "April 2026", text: "Exceptional food and a beautiful dining room. The sommelier's wine pairing elevated the whole meal.", avatar: IMG("photo-1472099645785-5658abf4ff4e", 120, 120) },
    { id: "t5", order: 5, name: "Isabella Cruz", rating: 5, date: "April 2026", text: "From the bread service to the dessert, everything was thoughtfully crafted. This is fine dining done right.", avatar: IMG("photo-1524504388940-b1c1722653e1", 120, 120) },
    { id: "t6", order: 6, name: "Marcus Reilly", rating: 5, date: "March 2026", text: "A truly memorable evening — the lobster thermidor and the ambience made for a perfect night out.", avatar: IMG("photo-1519345182560-3f2917c472ef", 120, 120) },
    { id: "t7", order: 7, name: "Olivia Grant", rating: 5, date: "March 2026", text: "The attention to detail here is unmatched. Every dish told a story. We'll be back for every special occasion.", avatar: IMG("photo-1438761681033-6461ffad8d80", 120, 120) },
  ],
  features: [
    { id: "f1", order: 1, title: "Fresh Ingredients", desc: "Sourced daily from trusted purveyors and prepared the same day for peak freshness.", icon: "leaf" },
    { id: "f2", order: 2, title: "Award-Winning Chef", desc: "Led by Chef Marchetti, recipient of three regional culinary excellence awards.", icon: "award" },
    { id: "f3", order: 3, title: "Cozy Ambience", desc: "Warm lighting, curated music, and thoughtfully designed rooms for every occasion.", icon: "ambience" },
    { id: "f4", order: 4, title: "Premium Wines", desc: "An award-winning cellar of over 300 labels, curated by our in-house sommelier.", icon: "wine" },
    { id: "f5", order: 5, title: "Excellent Service", desc: "A dedicated team trained to anticipate every detail of your evening.", icon: "service" },
    { id: "f6", order: 6, title: "Locally Sourced Produce", desc: "Partnering with regional farms to bring seasonal, sustainable ingredients to your table.", icon: "produce" },
  ],
};
