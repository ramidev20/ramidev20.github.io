/* ================================================================
   YOUR SITE CONFIG — the home page and every project page read this file.
   ----------------------------------------------------------------
   avatar      "" = use your GitHub profile picture, or a path like "me.png".
   socials     Leave any link "" to hide its button.
   stats       Up to three short facts for the profile card.

   Each project:
   name          Project title
   slug          The page address: slug "daily-dz" → yoursite/daily-dz/
                 (needs a matching folder with an index.html — see README)
   category      Small label under the name, e.g. "Healthcare"
   note          Optional label instead of the category, e.g. "In progress"
   description   One or two sentences, plain language
   repo          "owner/repo" for the Source code button
   platforms     Any of "Mobile", "Web", "Desktop" (the filter buttons)
   tags          Short words: language, framework, etc.
   icon          Optional icon image path, e.g. "icons/notes.png"
   website       Optional live link → "Open app" button

   Versions and downloads (pick one):
   releasesFolder true = builds are files in this site repo, in
                 projects/<slug>/releases/<version>/  e.g.
                 projects/daily-dz/releases/1.1.0/DailyDZ-1.1.0.apk
                 (+ optional notes.txt; a first line "Date: 2026-11-10" sets the date)
   autoRelease   true = list every GitHub Release of the repo automatically.
   releasesRepo  Use this when the code repo is PRIVATE: publish the builds as
                 releases in a PUBLIC repo instead. Your site repo works:
                 "ramidev20/ramidev20.github.io".
   tagPrefix     When several apps share one releases repo, start each release
                 tag with the app's prefix: tagPrefix "daily-dz-" → tags like
                 "daily-dz-v1.0.0". The page shows only its own tags, as "v1.0.0".
   versions      Or list versions by hand (newest first):
                 { version: "1.2.0", date: "2026-11-01", notes: "What changed",
                   files: [ { platform: "Android", name: "app.apk", url: "https://…", size: "18 MB" } ] }
   ================================================================ */
const CONFIG = {
  // This site's own repo: used to find the build files you put in projects/<slug>/releases/
  site: { repo: "ramidev20/ramidev20.github.io", branch: "main" },
  name: "ramidev20",
  shortName: "ramidev",                // shown next to the logo
  location: "",                        // e.g. "Based in Lagos" (leave "" to hide)
  status: "Open to new projects",
  headline: "I build *web* platforms & medical ~AI~",
  // *word* = heavier pixels, ~word~ = colour gradient (stickers attach to these)
  stickers: ["PyTorch", "Computer vision", "React + Supabase"],   // purple + pink go on the ~word~, lime on the *word*
  lede: "I'm a developer building web platforms with React and Supabase, and applying deep learning to healthcare. Here are the projects I'm working on.",
  skills: ["Web platforms", "AI & computer vision", "Healthcare tech"],
  bio: "I like building products end to end, from a travel marketplace covering 11 countries to a model that flags pneumonia on chest X-rays.",
  stats: [
    { label: "Projects", value: "5 featured" },
    { label: "Stack", value: "React, Python" },
    { label: "Focus", value: "Web, AI" }
  ],
  stack: ["React", "Vite", "Tailwind CSS", "Supabase", "Python", "PyTorch", "Streamlit"],
  stackNote: "The languages, frameworks and platforms I work with most.",
  services: [
    { title: "Web platforms", text: "React and Supabase apps with accounts, messaging, maps and dashboards, deployed on Vercel." },
    { title: "AI & computer vision", text: "PyTorch models built with transfer learning, with a simple demo app people can try." },
    { title: "Healthcare tech", text: "Software for medical use cases, built with care for accuracy and clear limits." }
  ],
  servicesNote: "From the first idea to working software, I handle the product thinking and the code.",
  contactNote: "Have an idea, a question about one of my projects, or want to work together? Reach out and I'll get back to you.",
  avatar: "",
  github: "ramidev20",
  socials: {
    linkedin: "",                      // e.g. "https://www.linkedin.com/in/your-profile"
    email: ""                          // e.g. "you@example.com"
  },
  projects: [
    {
      name: "TripWay",
      slug: "tripway",
      category: "Travel",
      description: "A French-language travel marketplace covering 11 countries. Travelers compare agency offers, plan trips, check visas and weather, and message agencies directly.",
      repo: "ramidev-other/tripway",
      platforms: ["Web"],
      tags: ["React", "Vite", "Tailwind", "Supabase", "Leaflet"],
      website: "",                     // add the live link to show an "Open app" button
      autoRelease: false,
      versions: []
    },
    {
      name: "Medical Image Classifier",
      slug: "medical-image-classifier",
      category: "Healthcare",
      note: "In progress",
      description: "A deep learning model that classifies chest X-rays as normal or pneumonia, using a fine-tuned ResNet18 and a Streamlit demo.",
      repo: "ramidev-medical/medical-image-classifier",
      platforms: ["Web", "Desktop"],
      tags: ["Python", "PyTorch", "Streamlit", "scikit-learn"],
      autoRelease: true,
      versions: []
    },
    {
      name: "MedSync",
      slug: "medsync",
      category: "Healthcare",
      description: "",                 // TODO: one line on what MedSync does
      repo: "ramidev-medical/medsync",
      platforms: ["Web"],
      tags: [],
      releasesFolder: true,            // builds go in projects/medsync/releases/<version>/
      versions: []
    },
    {
      name: "Fascia",
      slug: "fascia",
      category: "",
      description: "",                 // TODO: one line on what Fascia does
      repo: "ramidev-other/fascia",
      platforms: ["Desktop"],
      tags: [],
      releasesFolder: true,            // builds go in projects/fascia/releases/<version>/
      versions: []
    },
    {
      name: "DailyDZ",
      slug: "daily-dz",
      category: "",
      description: "",                 // TODO: one line on what DailyDZ does
      repo: "ramidev-other/daily-dz",
      platforms: ["Mobile"],
      tags: [],
      releasesFolder: true,            // builds go in projects/daily-dz/releases/<version>/
      versions: []
    }
  ]
};
