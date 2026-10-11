/* Unseen Bangladesh 2.0 — bilingual UI (Bengali default, English on request).
   One dictionary serves every page. Text nodes and attributes are translated in place and their
   Bengali originals are kept, so switching back restores the page exactly. A MutationObserver
   translates content that scripts render later (planner results, dialogs, district cards, map labels).
   Data files (tourist places, emergency notes) keep their own text: they are content, not UI. */
(() => {
  const D = {
    "টিপস: ম্যাপের জেলায় সরাসরি ক্লিক করেও বাছাই করতে পারেন।":"Tip: you can also select districts by clicking them on the map.",
    "নিজের দেশকে নতুন করে আবিষ্কারের গল্প। অজানা সৌন্দর্য খুঁজে বের করুন, ভ্রমণের স্মৃতি ধরে রাখুন! ভালোবাসায় চিনে নিন আমাদের বাংলাদেশ।":"A story of rediscovering our own country. Find hidden beauty, keep your travel memories alive, and get to know Bangladesh with love.",
    "৬৪ জেলার পরিচিত ও অল্পচেনা দর্শনীয় স্থান ঘুরে দেখুন। কীভাবে যাবেন, কখন যাবেন, আনুমানিক খরচ ও থাকার ব্যবস্থা সব তথ্য একসাথে।":"Explore well-known and lesser-known places across all 64 districts. How to get there, when to go, estimated costs and where to stay, all in one place.",
    "জনপ্রতি দৈনিক খাবার (৳)":"Daily food per person (৳)",
    "কোনো গন্তব্য যোগ হয়নি":"No destination added yet","বাংলাদেশ ভ্রমণ ম্যাপ":"Bangladesh travel map","আপনার বাংলাদেশ ভ্রমণ ম্যাপ":"Your Bangladesh travel map",
    "মোট: —":"Total: —",
    "দিন":"Days",
    "উপজেলা, জেলা বা বিভাগ খুঁজুন…":"Search upazila, district or division…","উপজেলার নাম":"Upazila name",
    "টিপস: ম্যাপে একটি জেলায় ক্লিক করুন, জেলাটি জুম হয়ে উপজেলাগুলো দেখাবে।":"Tip: click a district on the map to zoom in and see its upazilas.",
    "টিপস: ম্যাপের দেশে ক্লিক বা ট্যাপ করে বাছাই করতে পারেন। ছোট দেশগুলো তালিকা থেকে বেছে নেওয়া সহজ।":"Tip: click or tap a country on the map to select it. Small countries are easier to pick from the list.",
    "দেশ বা মহাদেশ খুঁজুন…":"Search country or continent…","দেশের নাম":"Country name",
    "আরও জেলা ঘুরে ওপরে উঠুন।":"Visit more districts to climb higher.","পুরো বাংলাদেশ ঘোরা হয়ে গেছে! 🎉":"You have covered all of Bangladesh! 🎉",
    "যাত্রা মাত্র শুরু!":"The journey has just begun!",
    "টিপস: উপজেলার সীমানায় ক্লিক করে বাছাই করুন। অন্য জেলায় যেতে তালিকার জেলার নামে ক্লিক করুন; পুরো বাংলাদেশে ফিরতে খোলা জেলার নামে আবার ক্লিক করুন।":"Tip: click an upazila boundary to select it. To switch district, click its name in the list; to return to all of Bangladesh, click the open district's name again.",
    "টিপস: একাধিক জেলার উপজেলা একসাথে দেখা যাচ্ছে। যেকোনো উপজেলার সীমানায় ক্লিক করে বাছাই করুন বা বাদ দিন। পুরো বাংলাদেশ দেখতে খোলা জেলার নামে আবার ক্লিক করুন।":"Tip: upazilas from several districts are shown together. Click any upazila boundary to select or deselect it. To see all of Bangladesh, click the open district's name again.",
    "উপজেলার সীমানা-ডেটা (assets/data/upazila.json) পাওয়া যায়নি। জেলা মোড আগের মতোই কাজ করছে।":"Upazila boundary data (assets/data/upazila.json) was not found. District mode works as before.",
    "ম্যাপ ডাউনলোড করা যায়নি। আবার চেষ্টা করুন।":"The map could not be downloaded. Please try again.",
    "দুঃখিত, ছবিটি পড়া যায়নি। JPG বা PNG ছবি দিয়ে চেষ্টা করুন।":"Sorry, the image could not be read. Try a JPG or PNG image.",
    "এই ব্রাউজারে সরাসরি শেয়ার করা যাচ্ছে না। ছবিটি ডাউনলোড হয়েছে।":"Direct sharing is not possible in this browser. The image has been downloaded.",
    "আপনার ম্যাপ তৈরি!":"Your map is ready!","PDF তৈরি!":"PDF ready!","তৈরি হচ্ছে…":"Creating…",
    "শুরুর জেলাকে গন্তব্য হিসেবে যোগ করা যাবে না।":"The starting district cannot be added as a destination.",
    "অন্তত একটি গন্তব্য যোগ করুন।":"Add at least one destination.","প্রথমে একটি গন্তব্য জেলা বেছে নিন।":"First choose a destination district.",
    "চলো ভ্রমণ করি,":"Let's travel,","বাংলাদেশ নতুন করে চিনি।":"Let's rediscover Bangladesh.",
    "ছবি তৈরি করা যাচ্ছে না।":"The image could not be created.","কার্ড PNG হিসেবে ডাউনলোড হচ্ছে।":"The card is downloading as PNG.",
    "ছবি বদলান":"Change photo","বিশ্ব ভ্রমণ ম্যাপ":"World travel map","আমার বাংলাদেশ":"My Bangladesh","আমার বিশ্ব ভ্রমণ":"My world travels",
    "Unseen Bangladesh 2.0 — ভ্রমণ ম্যাপ ও ৬৪ জেলার তথ্য":"Unseen Bangladesh 2.0 — travel map and information on 64 districts",
    "ইতিহাস":"History","কীভাবে যাবেন":"How to get there","কেন বিখ্যাত":"Why it is famous","খরচ":"Cost","উপযুক্ত সময়":"Best time",
    "ভ্রমণ টিপস":"Travel tips","সতর্কতা":"Warnings","দূরত্ব":"Distance","কাছাকাছি স্থান":"Nearby places","তথ্যসূত্র":"Source","ম্যাপ":"Map",
    "📍 ম্যাপ":"📍 Map","বিস্তারিত দেখুন →":"View details →","লোড হচ্ছে...":"Loading...","লোড হচ্ছে…":"Loading…",
    "জেলার তথ্য লোড করা যায়নি।":"District information could not be loaded.",
    "জেলার নম্বর লোড করা যায়নি: assets/data/emergency.json ফাইলটি আছে কি না দেখুন এবং ওয়েব সার্ভার/হোস্টিং থেকে পেজটি খুলুন (সরাসরি ফাইল খুললে কাজ করে না)।":"District numbers could not be loaded: check that assets/data/emergency.json exists, and open the page from a web server (not directly as a file).",
    "কোনো গন্তব্য যোগ হয়নি":"No destination added yet","দিন":"Days","জনপ্রতি":"per person","দৈনিক গড়":"Daily average",
    "দর্শনীয় স্থান":"Places to see","স্থানীয় সেবা":"Local services","জেলার দর্শনীয় স্থান":"Places to see in district",
    /* ----- global / chrome ----- */
    "আমার ম্যাপ":"My Map","আমার ম্যাপ বানান":"Build My Map","ভ্রমণ গাইড":"Travel Guide","প্ল্যানার":"Planner",
    "জরুরি সেবা":"Emergency","হোম":"Home","সম্পর্কে":"About","গোপনীয়তা নীতি":"Privacy Policy",
    "মেনু":"Menu","মেনু খুলুন":"Open menu","মেনু বন্ধ করুন":"Close menu","বন্ধ করুন":"Close",
    "প্রধান মেনু":"Main menu","অনুসন্ধান":"Search","বাংলা":"বাংলা","Switch language / ভাষা বদলান":"Switch language",
    "অদেখা বাংলাদেশ ২.০":"Unseen Bangladesh 2.0","সৌন্দর্যে ভরা প্রিয় বাংলাদেশ":"The beautiful Bangladesh we love",
    "৬৪ জেলা · ৮ বিভাগ":"64 districts · 8 divisions",
    "© ২০২৬ Unseen Bangladesh 2.0 — সর্বস্বত্ব সংরক্ষিত।":"© 2026 Unseen Bangladesh 2.0 — All rights reserved.",
    "অচেনা পথ, নতুন অনুভূতি":"Unknown roads, new feelings",
    "সাউন্ড চালু-বন্ধ":"Sound on / off","চালু":"On","স্লাইড বদলান":"Change slide","স্লাইড ১":"Slide 1","স্লাইড ২":"Slide 2","স্লাইড ৩":"Slide 3",
    "প্রকৃতি, মানুষ আর নতুন অভিজ্ঞতার গল্প খুঁজে নিন দেশের পথে পথে।":"Discover stories of nature, people and new experiences along the roads of the country.",
    "পাহাড়, নদী, সমুদ্র আর সবুজের মাঝে খুঁজে নিন বাংলাদেশের সৌন্দর্য।":"Find the beauty of Bangladesh among hills, rivers, sea and green.",
    "প্রতিটি ভ্রমণ রেখে যায় নতুন কিছু স্মৃতি, নতুন কিছু গল্প।":"Every journey leaves new memories and new stories.",
    "দেশটাকে চিনুন নতুন করে":"Know your country anew",
    "বাংলাদেশের":"Bangladesh","পথে পথে":"Along the Road",
    "নিজের মতো করে ভ্রমণ পরিকল্পনা করুন":"Plan your trip your own way",
    "জেলা বেছে নিন, রুট ও আনুমানিক বাজেট দেখুন, তারপর আপনার পরিকল্পনা সেভ করুন।":"Pick districts, see the route and estimated budget, then save your plan.",
    "ঘোরা জেলাগুলো বাছাই করে নিজের ভ্রমণ ম্যাপ বানান, আর ট্রিপ প্ল্যানারে পরের ভ্রমণ সাজান। সাইন-আপ লাগে না।":"Mark the districts you have visited to build your own travel map, and plan your next trip in the trip planner. No sign-up needed.",
    "এই সেবা ব্যবহারের জন্য কোনো অ্যাকাউন্ট বা সাইন-আপের প্রয়োজন নেই।":"No account or sign-up is needed to use this service.",
    "কিছু পাওয়া যায়নি।":"Nothing found.",
    "সামাজিক যোগাযোগমাধ্যম:":"Social media:",
    "Cloudflare-এর গোপনীয়তা নীতি":"Cloudflare Privacy Policy","Google-এর গোপনীয়তা নীতি":"Google Privacy Policy",
    "সর্বশেষ হালনাগাদ: ৭ অক্টোবর ২০২৬":"Last updated: 7 October 2026",
    /* ----- index: map and picker ----- */
    "যেসব জেলায় গিয়েছি":"Districts I have visited","কতগুলো জেলা ঘুরেছেন?":"How many districts have you visited?",
    "জেলা খুঁজুন…":"Search districts…","জেলা খুঁজুন":"Search districts","সব মার্ক করুন":"Mark all","সব মুছে ফেলুন":"Clear all",
    "জেলা":"Districts","উপজেলা":"Upazilas","বিশ্ব ম্যাপ":"World map","বিভাগ ফিল্টার":"Division filter","সব বিভাগ":"All divisions",
    "সব বাছাই":"Select all","জেলা নির্বাচন":"District selection","জেলা সমূহ":"Districts","জেলার নাম":"District name",
    "জেলা বা দর্শনীয় স্থানের নাম খুঁজুন…":"Search districts or places…","জেলার নাম বা জায়গা":"District name or place",
    "নির্বাচিত জেলা":"Selected districts","নিয়ন্ত্রণ দেখতে ক্লিক করুন":"Click to show controls",
    "ম্যাপের থিম":"Map theme","থিম":"Theme","থিম ও অন্যান্য প্রদর্শন-সংক্রান্ত সেটিংস;":"Theme and other display settings;",
    "ট্রিপ বা ম্যাপ তৈরির অন্যান্য স্থানীয় সেটিংস।":"Other local settings for trips and maps.",
    "গোধূলি":"Dusk","গোধূলি থিম":"Dusk theme","নীল-বেগুনি":"Blue-violet","নীল-বেগুনি থিম":"Blue-violet theme",
    "পান্না":"Emerald","পান্না থিম":"Emerald theme","সাগর":"Sea","সাগর থিম":"Sea theme","সবুজ রাত":"Green night","সবুজ রাত থিম":"Green night theme",
    "লেবেল":"Labels","নাম":"Name","ছবি":"Photo","ছবি যোগ করুন":"Add photo","ছবি বসাতে ক্লিক করুন":"Click to add a photo",
    "আপনার ছবি যোগ করুন":"Add your photo","ম্যাপে আপনার ছবি যোগ করুন":"Add your photo to the map",
    "ম্যাপে যোগ করা ছবি। এসব ছবি আপনার ডিভাইসেই প্রক্রিয়াজাত হয় এবং আমাদের সার্ভারে আপলোড করা হয় না;":"Photos added to the map. They are processed on your device and not uploaded to our servers;",
    "আপনার নাম (ঐচ্ছিক)":"Your name (optional)","আপনার নাম":"Your name","ম্যাপে প্রদর্শনের জন্য আপনার দেওয়া নাম;":"The name you give for display on the map;",
    "আপনার ম্যাপ ডাউনলোড করুন":"Download your map","ডাউনলোড":"Download","আপনার তৈরি করা PNG বা JPG ম্যাপও আপনার ডিভাইসেই তৈরি ও ডাউনলোড করা হয়।":"The PNG or JPG map you create is also generated and downloaded on your device.",
    "শেয়ার করুন":"Share","প্রিভিউ":"Preview","আপনার নির্বাচন অনুযায়ী":"Based on your selection",
    "আপনি যে জেলা ও অন্যান্য স্থান নির্বাচন করেছেন;":"The districts and other places you selected;",
    "আপনার নির্বাচিত জেলা বা স্থানগুলোর বিস্তারিত তালিকা, আপনার নাম বা আপনার ছবি আমাদের সার্ভারে পাঠানো হয় না।":"The detailed list of your selected districts or places. Your name or photo is not sent to our servers.",
    "উপজেলার ম্যাপ-ডেটা লোড হচ্ছে…":"Loading upazila map data…","উপজেলার ম্যাপ-ডেটা লোড হচ্ছে…":"Loading upazila map data…",
    "বিশ্ব ম্যাপের ডেটা লোড করা যায়নি। জেলা ও উপজেলা ম্যাপ আগের মতোই কাজ করছে।":"World map data could not be loaded. The district and upazila maps work as before.",
    "এই জেলা ইতিমধ্যে যোগ করা আছে।":"This district is already added.",
    "ট্রিপ বা নিজের যাত্রা":"Trip or own journey",
    "দেশের মানচিত্রে ভ্রমণ রুট":"Travel route on the map",
    "বাংলাদেশের মানচিত্রে ভ্রমণ রুট":"Travel route on the map of Bangladesh",
    "মানচিত্র লোড করা যায়নি":"Map could not be loaded",
    "গুগল ম্যাপে খুলুন ↗":"Open in Google Maps ↗",
    "শুরু: ঢাকা":"Start: Dhaka",
    /* ----- planner ----- */
    "আপনার ভ্রমণ রুট":"Your travel route","যাত্রা ও গন্তব্য":"Journey & destinations",
    "শুরুর জেলা":"Starting district","গন্তব্য জেলা বেছে নিন":"Choose destination district",
    "গন্তব্য জেলা যোগ করুন":"Add destination district","গন্তব্য জেলা":"Destination district",
    "যোগ করুন":"Add","প্রথম জেলা বাছলেই যোগ হবে।":"It will be added as soon as you choose the first district.",
    "কোনো গন্তব্য যোগ হয়নি":"No destination added","প্রথম জেলা বাছলেই যোগ হবে।":"It will be added as soon as you choose the first district.",
    "এই জেলা ইতিমধ্যে যোগ করা আছে।":"This district is already added.",
    "ভ্রমণের সারসংক্ষেপ":"Trip summary","মোট দূরত্ব":"Total distance","মোট দিন":"Total days","মোট গন্তব্য":"Total destinations",
    "ভ্রমণকারী":"Travellers","ভ্রমণকারীর সংখ্যা":"Number of travellers","ভ্রমণের দিন":"Trip days","শুরুর তারিখ (ঐচ্ছিক)":"Start date (optional)",
    "আনুমানিক বাজেট":"Estimated budget","মোট আনুমানিক খরচ":"Total estimated cost","দলগত হিসাব":"Group totals",
    "খরচের বিভাজন":"Cost breakdown","যাতায়াত":"Transport","যাতায়াত ভাড়া (৳ প্রতি কিমি, জনপ্রতি)":"Fare (৳ per km, per person)",
    "স্থানীয় যাতায়াত":"Local transport","স্থানীয় যাতায়াত (৳ জনপ্রতি দৈনিক)":"Local transport (৳ per person per day)",
    "খাবার":"Food","জনপ্রতি দৈনিক খাবার (৳)":"Daily food per person (৳)","প্রবেশ ফি ও টিকিট":"Entry fees & tickets",
    "প্রবেশ ফি ও টিকিট (৳ জনপ্রতি)":"Entry fees & tickets (৳ per person)","আকস্মিক খরচ":"Contingency","আকস্মিক খরচ (মোট খরচের %)":"Contingency (% of total cost)",
    "মোট খরচের ৫%":"5% of total cost","যাত্রা · ১০৩ কি.মি (আনুমানিক)":"Trip · 103 km (approx.)",
    "দিন ভিত্তিক ভ্রমণ সূচি":"Day-by-day itinerary","দিন ১":"Day 1","গন্তব্য যোগ করলে এখানে ভ্রমণসূচি দেখাবে।":"Your itinerary will appear here once you add a destination.",
    "গন্তব্য যোগ করলে রুট মানচিত্রে দেখাবে।":"The route will appear on the map once you add a destination.",
    "ভ্রমণ কার্ড":"Travel card","ভ্রমণের দিন ":"Trip day ","নাম":"Name","শুরু: ঢাকা ":"Start: Dhaka ",
    "মোট: ০ কি.মি":"Total: 0 km","মোট: —":"Total: —","দূরত্ব আনুমানিক। নির্ভুল সড়ক দূরত্ব ও ভাড়ার জন্য গুগল ম্যাপ দেখুন।":"Distance is approximate. For exact road distance and fares, check Google Maps.",
    "যাচাইকৃত সড়ক দূরত্ব":"Verified road distance","সরলরেখার দূরত্ব × ১.৩০":"Straight-line distance × 1.30",
    "যাতায়াত খরচ মানচিত্রের মোট দূরত্ব অনুযায়ী হিসাব করা হয়েছে। সব খরচ আনুমানিক; প্রকৃত ভাড়া ও দাম ভিন্ন হতে পারে।":"Transport cost is calculated from the total map distance. All costs are estimates; actual fares and prices may differ.",
    "লোকেশনের ধরন":"Location type","সঠিক ঠিকানা ও কাছের পরিচিত স্থান জানান":"Give the exact address and a nearby landmark",
    "যোগাযোগ":"Contact","যোগ":"Add","নির্বাচিত":"Selected",
    "জনপ্রিয় গন্তব্য":"Popular destinations","জনপ্রিয় জেলা":"Popular districts","জনপ্রিয়":"Popular","⭐ জনপ্রিয়":"⭐ Popular",
    "ট্রিপ-সংক্রান্ত তথ্য":"Trip information","অগ্রগতি":"Progress",
    /* ----- guide ----- */
    "ভ্রমণ গাইড ও দর্শনীয় স্থান":"Travel guide & places to see","ভ্রমণ গাইড":"Travel Guide",
    "এই জেলার দর্শনীয় স্থানের তথ্য এখনো যোগ করা হয়নি।":"Information about places to see in this district has not been added yet.",
    "🌱 এই জেলার দর্শনীয় স্থানের তথ্য এখনো যোগ করা হয়নি।":"🌱 Information about places to see in this district has not been added yet.",
    "স্থানগুলো":"Places","দর্শনীয় স্থান":"Places to see",
    "বিভাগ":"Division","বিভাগ · মোট":"Division · total","মোট":"Total",
    "বিভাগ ও জেলা":"Division & district",
    /* ----- emergency ----- */
    "জাতীয় হটলাইন":"National hotlines","সারা দেশে":"Nationwide",
    "নম্বরগুলো সরকারি সূত্র থেকে যাচাই করা। ট্যাপ করলে ফোনের ডায়ালারে নম্বর বসে যায়।":"Numbers are verified from official sources. Tap to dial directly from your phone.",
    "জেলার নম্বর ও স্থানীয় সেবা JSON থেকে লোড হয়":"District numbers and local services are loaded from data",
    "এই জেলার জরুরি নম্বর":"Emergency numbers for this district","জেলার জরুরি নম্বর":"District emergency numbers",
    "জাতীয় জরুরি সেবা":"National Emergency Service","নারী ও শিশু নির্যাতন প্রতিরোধ":"Women & Children Violence Prevention",
    "চাইল্ড হেল্পলাইন":"Child Helpline","জাতীয় হেল্পলাইন":"National Helpline","স্বাস্থ্য বাতায়ন":"Health Batayan",
    "জরুরি সেবা":"Emergency Service","নিরাপত্তা":"Safety","শিশু সহায়তা":"Child support","সাধারণ হেল্পলাইন":"General helpline","স্বাস্থ্য":"Health",
    "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্সের জরুরি সহায়তা":"Emergency help from police, fire service and ambulance",
    "নারী ও শিশু নির্যাতনের শিকার ব্যক্তিদের আইনি পরামর্শ ও মনো-সামাজিক সহায়তা":"Legal advice and psychosocial support for people affected by violence against women and children",
    "শিশু ও শিশু-সংক্রান্ত যেকোনো বিপদে সহায়তা":"Help in any emergency involving a child",
    "বিভিন্ন সামাজিক সমস্যায় সরকারি তথ্য ও সহায়তা":"Government information and support for various social issues",
    "স্বাস্থ্যসংক্রান্ত পরামর্শ ও তথ্য":"Health advice and information",
    "কল করুন":"Call","📞 কল করুন":"📞 Call","📞 ফোনে যা বলবেন":"📞 What to say on the phone","ফোনে যা বলবেন":"What to say on the phone",
    "অপারেটরের নির্দেশ মেনে চলুন, আগে ফোন কাটবেন না":"Follow the operator's instructions and do not hang up first",
    "কী ঘটেছে তা সংক্ষেপে বলুন":"Briefly say what happened","সঠিক ঠিকানা ও কাছের পরিচিত স্থান জানান":"Give the exact address and a nearby landmark",
    "নম্বর কপি":"Copy number","📋 নম্বর কপি":"📋 Copy number","✅ কপি হয়েছে":"✅ Copied","📤 শেয়ার":"📤 Share",
    "স্থানীয় সেবা":"Local services","জেলার স্থানীয় সেবা":"local services",
    "বিভাগের অন্যান্য জেলা":"Other districts in the division","ঢাকা বিভাগের অন্যান্য জেলা":"Other districts in Dhaka Division",
    "জেলা বা বিভাগের নাম":"District or division name",
    /* ----- privacy / misc ----- */
    "সর্বশেষ আপডেট":"Last updated",
    /* ----- divisions ----- */
    "ঢাকা বিভাগ":"Dhaka Division","চট্টগ্রাম বিভাগ":"Chattogram Division","সিলেট বিভাগ":"Sylhet Division","বরিশাল বিভাগ":"Barishal Division",
    "খুলনা বিভাগ":"Khulna Division","রাজশাহী বিভাগ":"Rajshahi Division","রংপুর বিভাগ":"Rangpur Division","ময়মনসিংহ বিভাগ":"Mymensingh Division",
    "ঢাকা":"Dhaka","চট্টগ্রাম":"Chattogram","সিলেট":"Sylhet","বরিশাল":"Barishal","খুলনা":"Khulna","রাজশাহী":"Rajshahi","রংপুর":"Rangpur","ময়মনসিংহ":"Mymensingh",
    "ঢাকা জেলা":"Dhaka District","চট্টগ্রাম জেলার দর্শনীয় স্থান":"Places to see in Chattogram district","খুলনা বিভাগ ":"Khulna Division ",
    "ঢাকা → কিশোরগঞ্জ":"Dhaka → Kishoreganj","ঢাকা - কিশোরগঞ্জ।":"Dhaka - Kishoreganj.",
    /* ----- districts ----- */
    "গাজীপুর":"Gazipur","কিশোরগঞ্জ":"Kishoreganj","মানিকগঞ্জ":"Manikganj","মুন্সীগঞ্জ":"Munshiganj","মুন্সিগঞ্জ":"Munshiganj","নারায়ণগঞ্জ":"Narayanganj",
    "নরসিংদী":"Narsingdi","টাঙ্গাইল":"Tangail","ফরিদপুর":"Faridpur","গোপালগঞ্জ":"Gopalganj","মাদারীপুর":"Madaripur","রাজবাড়ী":"Rajbari","শরীয়তপুর":"Shariatpur",
    "কক্সবাজার":"Cox's Bazar","বান্দরবান":"Bandarban","রাঙ্গামাটি":"Rangamati","খাগড়াছড়ি":"Khagrachhari","কুমিল্লা":"Cumilla","ব্রাহ্মণবাড়িয়া":"Brahmanbaria",
    "চাঁদপুর":"Chandpur","নোয়াখালী":"Noakhali","ফেনী":"Feni","লক্ষ্মীপুর":"Lakshmipur","মৌলভীবাজার":"Moulvibazar","হবিগঞ্জ":"Habiganj","সুনামগঞ্জ":"Sunamganj",
    "ঝালকাঠি":"Jhalokathi","পিরোজপুর":"Pirojpur","পটুয়াখালী":"Patuakhali","বরগুনা":"Barguna","ভোলা":"Bhola",
    "বাগেরহাট":"Bagerhat","সাতক্ষীরা":"Satkhira","যশোর":"Jashore","ঝিনাইদহ":"Jhenaidah","মাগুরা":"Magura","নড়াইল":"Narail","কুষ্টিয়া":"Kushtia",
    "চুয়াডাঙ্গা":"Chuadanga","মেহেরপুর":"Meherpur","নওগাঁ":"Naogaon","নাটোর":"Natore","চাঁপাইনবাবগঞ্জ":"Chapainawabganj","পাবনা":"Pabna",
    "সিরাজগঞ্জ":"Sirajganj","বগুড়া":"Bogura","জয়পুরহাট":"Joypurhat","দিনাজপুর":"Dinajpur","ঠাকুরগাঁও":"Thakurgaon","পঞ্চগড়":"Panchagarh",
    "নীলফামারী":"Nilphamari","লালমনিরহাট":"Lalmonirhat","কুড়িগ্রাম":"Kurigram","গাইবান্ধা":"Gaibandha","জামালপুর":"Jamalpur","নেত্রকোণা":"Netrokona","শেরপুর":"Sherpur",
    "উপজেলা":"Upazila","উপজেলা ":"Upazila ",
    "এশিয়া":"Asia","ইউরোপ":"Europe","আফ্রিকা":"Africa","উত্তর আমেরিকা":"North America","দক্ষিণ আমেরিকা":"South America","ওশেনিয়া":"Oceania",
    "যেসব উপজেলায় গিয়েছি":"Upazilas I have visited","যেসব দেশে গিয়েছি":"Countries I have visited",
    "অস্ট্রেলীয় ভারত মহাসাগর অঞ্চল":"Australian Indian Ocean Territory",
    "উপজেলা ম্যাপ":"Upazila map","উপজেলা ম্যাপ ":"Upazila map ",
    "৬৪ জেলা":"64 districts",
    /* ----- form / labels / messages ----- */
    "ম্যাপ লোড হচ্ছে…":"Loading map…","মানচিত্র লোড হচ্ছে…":"Loading map…","লোড হচ্ছে…":"Loading…",
    "ম্যাপ ডাউনলোডের সময় শুধুমাত্র নির্বাচিত জেলার সংখ্যা পরিসংখ্যান তৈরির উদ্দেশ্যে আমাদের সার্ভারে পাঠানো হতে পারে।":"When you download the map, only the number of selected districts may be sent to our servers for statistics.",
    "অপব্যবহার প্রতিরোধ":"Abuse prevention",
    "সর্বোচ্চ":"Maximum","ন্যূনতম":"Minimum",
    "প্রতিবেদন":"Report","প্রতিক্রিয়া":"Feedback",
    "বাতিল":"Cancel","সেভ করুন":"Save","মুছুন":"Delete","সরান":"Remove","সরান ":"Remove ","বদলান":"Change",
    "ঠিক আছে":"OK","আরও দেখুন":"See more","আরও":"More","সব":"All","বন্ধ":"Closed","খোলা":"Open",
    "পরিবর্তন":"Change","তথ্য":"Information","বিস্তারিত":"Details","বিস্তারিত দেখুন":"View details",
    "দিন":"Days","জন":"People","টি":"",
    "দূরত্ব: ১০৩ কি.মি":"Distance: 103 km","মোট: ১০৩ কি.মি (আনুমানিক)":"Total: 103 km (approx.)",
    "ব্যাক্তি: ১ জন":"Persons: 1","সময়: ১ দিন":"Duration: 1 day",
    "দিন ১":"Day 1","আরও দিন যোগ করুন":"Add more days",
    "স্থানীয় যাতায়াত (৳ জনপ্রতি দৈনিক)":"Local transport (৳ per person per day)",
    "পুনরায় চেষ্টা করুন":"Try again","লোড করা যায়নি":"Could not load",
    "সাইটে আপনার ম্যাপ":"Your map on the site",
    "বিশ্ব ম্যাপ ":"World map ",
  };
  /* patterns for counts and dynamic labels that the dictionary cannot list one by one */
  const RX = [
    [/^(\d+)টি জেলা$/, "$1 districts"], [/^(\d+)টি স্থান$/, "$1 places"], [/^(\d+)টি গন্তব্য$/, "$1 destinations"],
    [/^(\d+) টি গন্তব্য$/, "$1 destinations"], [/^(\d+)টি স্থান$/, "$1 places"], [/^(\d+) জন$/, "$1 people"],
    [/^\((\d+)টি\)$/, "($1)"], [/^(\d+)টি$/, "$1"], [/^(\d+)টি স্থানের তথ্য/, "$1 places"],
    [/^আপনি (\d+)% ভ্রমণকারীর চেয়ে বেশি জেলা ঘুরেছেন।$/, "You have visited more districts than $1% of travellers."],
    [/^আনুমানিক মোট খরচ: (.+)$/, "Estimated total cost: $1"], [/^দর্শনীয়: (.+)$/, "Places to see: $1"], [/^তথ্যসূত্র: (.+)$/, "Source: $1"],
    [/^দিন (\d+)–(\d+)$/, "Days $1–$2"], [/^দিন (\d+)$/, "Day $1"],
    [/^(\d+)% বাংলাদেশ ঘোরা হয়েছে$/, "$1% of Bangladesh covered"], [/^(\d+)% বিশ্ব ঘোরা হয়েছে$/, "$1% of the world covered"],
    [/^(\d+) টি জেলা · 8টির মধ্যে (\d+) টি বিভাগ$/, "$1 districts · $2 of 8 divisions"], [/^(\d+)টি জেলা · 8টির মধ্যে (\d+)টি বিভাগ$/, "$1 districts · $2 of 8 divisions"],
    [/^(\d+)টি দেশ ও অঞ্চল · (\d+)টি মহাদেশ$/, "$1 countries & territories · $2 continents"], [/^(\d+) টি দেশ ও অঞ্চল · (\d+) টি মহাদেশ$/, "$1 countries & territories · $2 continents"],
    [/^(\d+)টি উপজেলা · (\d+)টি জেলা$/, "$1 upazilas · $2 districts"], [/^(\d+)টি জেলা · উপজেলা ম্যাপ$/, "$1 districts · upazila map"],
    [/^(\d+)\/(\d+)$/, "$1/$2"],
    [/^জনপ্রতি ৳ (.+)$/, "৳ $1 per person"], [/^দৈনিক গড় ৳ (.+)$/, "Daily average ৳ $1"],
    [/^(\d+) জন × (\d+) দিন × ৳(\d+)$/, "$1 people × $2 days × ৳$3"],
    [/^(\d+) জন × ৳(\d+)$/, "$1 people × ৳$2"],
    [/^(\d+) জন × (\d+) দিন$/, "$1 people × $2 days"],
    [/^(\d+) জন × ৳/, "$1 people × ৳"],
    [/^(\d+) টি গন্তব্য$/, "$1 destinations"], [/^(\d+) টি$/, "$1"],
    [/^(\d+) কি\.মি × ৳(\d+) × (\d+) জন$/, "$1 km × ৳$2 × $3 people"],
    [/^যাত্রা · (\d+) কি\.মি \(আনুমানিক\)$/, "Trip · $1 km (approx.)"],
    [/^মোট: (\d+) কি\.মি \(আনুমানিক\)$/, "Total: $1 km (approx.)"],
    [/^মোট: (\d+) কি\.মি$/, "Total: $1 km"],
    [/^(\d+) কি\.মি$/, "$1 km"],
    [/^মোট খরচের (\d+)%$/, "$1% of total cost"],
    [/^(\d+)টি জেলা \(/, "$1 districts ("],
    [/^সময়: (\d+) দিন$/, "Duration: $1 days"], [/^ব্যাক্তি: (\d+) জন$/, "Persons: $1"],
  ];
  /* words inside mixed strings (counts, units) */
  const TOK = [[/(^|[\s(×:·])জনপ্রতি(?=[\s(]|$)/g,"$1per person"],[/(^|[\s(×:·])জন(?=[\s)×:·]|$)/g,"$1people"],[/(^|[\s(×:·])দিন(?=[\s)×:·]|$)/g,"$1days"],
    [/(^|[\s(×:·])গন্তব্য(?=[\s)×:·]|$)/g,"$1destinations"],[/(^|[\s(×:·])স্থান(?=[\s)×:·]|$)/g,"$1places"],[/(^|[\s(×:·])কি\.মি(?=[\s)×:·]|$)/g,"$1km"],
    [/(^|[\s(×:·])জেলা(?=[\s)×:·]|$)/g,"$1districts"],[/\(আনুমানিক\)/g,"(approx.)"],[/(^|[\s(×:·])মোট(?=[\s:])/g,"$1Total"]];
  const BN_DIG = "০১২৩৪৫৬৭৮৯";
  /* Bengali letters can be stored in more than one Unicode form; compare in NFC so they match */
  const norm = s => s.normalize("NFC").replace(/\s+/g, " ").trim();
  const DN = {}; Object.keys(D).forEach(k => { DN[k.normalize("NFC")] = D[k]; });
  const bnRx = /[\u0980-\u09FF]/;
  const hits = new Map();
  const toAscii = t => t.replace(/[০-৯]/g, d => String(BN_DIG.indexOf(d)));
  const TOK2 = [[/(^|[\s(×:·])রুট(?=[\s:])/g, "$1Route"], [/(^|[\s(×:·])শুরু(?=[\s:])/g, "$1Start"]];
  const NOUNS = [[/^(.+) জেলার দর্শনীয় স্থান$/, "Places to see in %s district"], [/^(.+) জেলার স্থানীয় সেবা$/, "Local services in %s district"]].concat([[/^(.+) জেলা$/, "District"], [/^(.+) বিভাগ$/, "Division"], [/^(.+) উপজেলা$/, "Upazila"]]);
  const translate = raw => {
    const key = norm(raw);
    if (!key || !bnRx.test(key) && !/[০-৯]/.test(key)) return null;
    if (DN[key] !== undefined) return DN[key];
    for (const [re, noun] of NOUNS) {
      const m = key.match(re);
      if (!m) continue;
      if (noun.includes("%s")) return noun.replace("%s", DN[m[1]] !== undefined ? DN[m[1]] : m[1]);
      if (DN[m[1]] !== undefined) return `${DN[m[1]]} ${noun}`;
    }
    const asc = toAscii(key);
    const fixNum = t => t.replace(/\b1 days\b/g, "1 day").replace(/\b1 people\b/g, "1 person").replace(/\b1 destinations\b/g, "1 destination");
    for (const [re, rep] of RX) if (re.test(asc)) return fixNum(asc.replace(re, rep));
    let out = asc;
    for (const [re, rep] of TOK) out = out.replace(re, rep);
    for (const [re, rep] of TOK2) out = out.replace(re, rep);
    out = out.replace(/\b1 days\b/g, "1 day").replace(/\b1 people\b/g, "1 person").replace(/\b1 destinations\b/g, "1 destination");
    return out === key ? null : out;
  };
  const originals = new WeakMap();
  const ATTRS = ["placeholder", "aria-label", "title", "alt"];
  const attrOrig = new WeakMap();

  /* <option> labels can be translated, but their value must stay the Bengali name the scripts use */
  const pinOptionValues = () => document.querySelectorAll("option:not([value])").forEach(o => o.setAttribute("value", o.textContent.trim()));
  const skip = el => el.closest && el.closest("script,style,noscript,.bn,.en,[data-i18n-skip]");
  const lang = () => document.documentElement.getAttribute("data-lang") === "en" ? "en" : "bn";

  /* A node keeps {orig, tr}: the Bengali original and the English text we put there. When a script
     writes new Bengali into the same node, it no longer equals `tr`, so it is translated again. */
  function fixNode(node) {
    const p = node.parentElement;
    if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.tagName) || skip(p)) return;
    const cur = node.nodeValue;
    const rec = originals.get(node);
    if (lang() === "en") {
      if (rec && cur === rec.tr) return;
      const src = rec ? rec.orig : cur;
      const t = translate(src);
      if (t === null) return;
      const lead = src.match(/^\s*/)[0], trail = src.match(/\s*$/)[0];
      const out = lead + t + trail;
      originals.set(node, { orig: src, tr: out });
      if (cur !== out) node.nodeValue = out;
    } else if (rec) {
      if (cur === rec.tr) node.nodeValue = rec.orig;
      originals.delete(node);
    }
  }
  function fixAttrs(el) {
    ATTRS.forEach(a => {
      if (!el.hasAttribute || !el.hasAttribute(a)) return;
      const cur = el.getAttribute(a);
      let map = attrOrig.get(el); if (!map) attrOrig.set(el, map = {});
      const rec = map[a];
      if (lang() === "en") {
        if (rec && cur === rec.tr) return;
        const src = rec ? rec.orig : cur;
        const t = translate(src);
        if (t === null) return;
        map[a] = { orig: src, tr: t };
        if (cur !== t) el.setAttribute(a, t);
      } else if (rec) {
        if (cur === rec.tr) el.setAttribute(a, rec.orig);
        delete map[a];
      }
    });
  }
  function walk(root) {
    pinOptionValues();
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; let n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(fixNode);
    if (root.querySelectorAll) {
      root.querySelectorAll("[placeholder],[aria-label],[title],[alt]").forEach(fixAttrs);
      if (root.matches && root.matches("[placeholder],[aria-label],[title],[alt]")) fixAttrs(root);
    }
  }
  let observer;
  function apply(l) {
    if (l) document.documentElement.setAttribute("data-lang", l === "en" ? "en" : "bn");
    if (lang() === "en") loadDataNames();
    if (observer) observer.disconnect();
    walk(document.body);
    if (document.title) {
      const t = translate(document.title);
      if (lang() === "en" && t) { if (!document.documentElement.dataset.ubTitle) document.documentElement.dataset.ubTitle = document.title; document.title = t; }
      else if (lang() === "bn" && document.documentElement.dataset.ubTitle) { document.title = document.documentElement.dataset.ubTitle; delete document.documentElement.dataset.ubTitle; }
    }
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    report();
    document.dispatchEvent(new CustomEvent("ub:lang-change", { detail: { lang: lang() } }));
  }
  function report() {
    if (lang() !== "en") return;
  }
  observer = new MutationObserver(muts => {
    observer.disconnect();
    muts.forEach(m => {
      if (m.type === "characterData") fixNode(m.target);
      else if (m.type === "attributes") fixAttrs(m.target);
      else m.addedNodes.forEach(nd => {
        if (nd.nodeType === 3) fixNode(nd);
        else if (nd.nodeType === 1) walk(nd);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  });
  /* the upazila and world dropdowns take their names from the data files; their English names
     come from the same files, so the translator learns them there instead of a second list */
  const siteRoot = new URL("../../", (document.currentScript && document.currentScript.src) || location.href);
  let dataNamesLoaded = false;
  const addPairs = pairs => pairs.forEach(([bnName, enName]) => {
    if (!bnName || !enName) return;
    const k = norm(bnName);
    if (DN[k] === undefined) DN[k] = enName;
  });
  const loadDataNames = () => {
    if (dataNamesLoaded || !document.getElementById("mUpa")) return;
    dataNamesLoaded = true;
    const get = f => fetch(new URL(`assets/data/${f}`, siteRoot), { cache: "force-cache" }).then(r => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([get("upazila.json"), get("world.json")]).then(([u, w]) => {
      if (u && Array.isArray(u.u)) addPairs(u.u.map(x => [x.bn, x.n]));
      if (w && Array.isArray(w.f)) addPairs(w.f.map(x => [x.b, x.n]));
      if (lang() === "en") apply("en");
    });
  };

  window.UBI18N = { apply, translate, dictionary: D };
  /* canvas labels (download cards and posters) cannot be translated in the DOM: they call ubT() */
  window.ubT = text => { if (lang() !== "en") return text; const t = translate(String(text)); return t === null ? text : t; };
  const start = () => {
    let saved = "bn";
    try { saved = localStorage.getItem("ub.lang") || "bn"; } catch (e) {}
    apply(saved);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  /* re-run once the page's own scripts have rendered their content */
  addEventListener("load", () => { if (lang() === "en") apply("en"); });
})();
