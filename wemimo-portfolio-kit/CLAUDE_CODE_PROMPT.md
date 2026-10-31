# Build my portfolio website: meetwemimo.com

You are building the live version of my professional portfolio website. I am **Wemimo Aluko**, an applied linguist, language educator, and learning designer. The full design has already been made and approved. Your job is to turn it into a clean, fast, responsive, accessible website that feels alive, **without changing my content or my design**.

Read this whole prompt first, then open every file in this folder before you write any code.

---

## 1. What is in this folder

```
wemimo-portfolio-kit/
├── CLAUDE_CODE_PROMPT.md        ← this file
├── design-reference/            ← the APPROVED design, one HTML file per page
│   ├── index.html               (Home)
│   ├── about.html
│   ├── research.html
│   ├── teaching.html
│   ├── learning-design.html
│   └── contact.html
├── assets/
│   ├── images/                  ← all my real photos (use only these)
│   ├── docs/                    ← my CV and lesson handout PDFs
│   └── slides/                  ← empty for now; I will add slide-deck PDFs here
└── content/
    ├── full-teaching-philosophy.md
    └── thesis-abstract.md
```

**The files in `design-reference/` are the source of truth** for every word, every section, the order of sections, the colors, fonts, spacing, and layout. They work in a browser (open them to see the design), but they use inline styles everywhere. Rebuild them properly; do not just copy them.

---

## 2. Tech stack and rules

- **Plain HTML, CSS, and vanilla JavaScript.** No framework, no build step, no npm packages. I need to be able to edit the text myself later.
- **One shared stylesheet** (`css/styles.css`) using CSS custom properties for every color, font, radius, and spacing value. No inline styles in the final pages.
- **One shared script** (`js/main.js`) for the navigation, animations, and lesson cards.
- The header and footer must be identical on every page. Keep them consistent by hand or with a tiny JS include, whichever you think is cleaner, but they must still work if JavaScript is off (so prefer writing them into each page).
- The site must work by simply opening `index.html` locally and must be ready to deploy as a static site (Netlify, GitHub Pages, or my current host for meetwemimo.com).

### Do not
- Do not change, shorten, or "improve" any of my wording. Copy the text exactly from `design-reference/`.
- Do not invent content: no fake testimonials, numbers, logos, links, or stock photos.
- Do not describe me as a "PhD student" in any headline, tagline, or bio. My Ph.D. appears only in the Education timeline on the About page.
- Do not add a dark mode. The cream and brown palette is my brand.
- Do not use heavy animation libraries.

---

## 3. Design system (match exactly)

### Colors (put these in `:root`)
| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F5EDE0` | Main page background |
| `--cream-light` | `#FBF6EE` | Cards, alternate section bands |
| `--tan` | `#EBDDC8` | Tags, pills, badges |
| `--tan-mid` | `#D9C3A5` | Image placeholders, timeline line |
| `--border` | `#E3D3BC` | Card borders, dividers |
| `--brown-dark` | `#3B2618` | Main text, footer background |
| `--brown-deep` | `#4A2E1C` | Contact band, quote band, dark cards |
| `--brown-card` | `#5C3B26` | Cards on dark bands |
| `--brown` | `#7A4E2D` | Buttons, icons, eyebrow labels, links |
| `--text-muted` | `#5A4232` | Body paragraphs and secondary text |
| `--on-dark` | `#E8D9C2` | Muted text on dark bands |
| `--accent-apricot` | `#E39A5B` | Small award badge and course label only |

### Typography
- Headings: **Lora** (600, with italic 500 for the philosophy goal quote), fallback `Georgia, serif`.
- Body: **Source Sans 3** (400, 500, 600), fallback `'Segoe UI', Arial, sans-serif`.
- Load both from Google Fonts with `display=swap`.
- Base body size 18px, line-height 1.6.
- Eyebrow labels: 15px, weight 600, uppercase, letter-spacing 0.12em, color `--brown`.
- H1 about 52–64px on desktop (home hero name is 64px); section H2 about 34–38px. Scale down smoothly on mobile with `clamp()`.

### Shapes and spacing
- Max content width 1120px, side padding 32px (20px on phones).
- Cards: radius 18px, 1px `--border`. Pills and buttons: fully rounded (999px).
- Photos: radius 18–24px. The home hero photo has an **arched top** (`border-radius: 200px 200px 24px 24px`) with a 10px `--cream-light` frame.
- Section vertical padding about 72–88px.

### Buttons
- Primary: `--brown` background, `--cream-light` text, min-height 48px, padding 0 28px.
- Secondary: transparent with a 2px `--brown` border.
- On dark bands: cream background with dark brown text.
- All buttons get a visible focus ring and a gentle hover (slight lift and darker shade).

---

## 4. Shared components

**Header and navigation**
- Left: "Wemimo Aluko" in Lora 24px bold, linking to the home page.
- Right menu, in this order: About · Research · Teaching · Learning Design · Contact.
- The current page's link is underlined in `--brown` (2px, offset 6px) and gets `aria-current="page"`.
- Sticky at the top with the cream background; add a soft shadow once the page scrolls.
- On screens under 820px, collapse the menu into an accessible hamburger button (with `aria-expanded`, keyboard support, Escape to close).

**"Let's work together" band** (dark brown, centered) on Home and About, and the "Need lessons or course materials?" version on Learning Design. Its button goes to `contact.html`.

**Footer** (`--brown-dark`): "© 2026 Wemimo Aluko" on the left; on the right, my email **wemimoaluko@gmail.com** as a `mailto:` link, then a round LinkedIn icon button (`https://www.linkedin.com/in/wemimo-aluko`). Do not add Instagram or any other social media. Make the year update automatically.

**My links (use these everywhere):**
- Email: `wemimoaluko@gmail.com` (this replaces any university email)
- LinkedIn: `https://www.linkedin.com/in/wemimo-aluko`
- Google Scholar: `https://scholar.google.com/citations?hl=en&user=kPrs_x8AAAAJ`
- ResearchGate: `https://www.researchgate.net/profile/Wemimo-Aluko`
- CV: `assets/docs/Wemimo-Aluko-CV.pdf`

All external links open in a new tab with `rel="noopener"`.

---

## 5. Pages

Build each page from its file in `design-reference/`. Notes on what each needs to *do*:

### Home (`index.html`)
- Hero with my headshot in the arched frame, my name, the title line, the one-sentence statement, two buttons, and the "Presenting at AAAL and TESOL 2027" pill.
- "See My Work" → `research.html`. "Download CV" → `assets/docs/Wemimo-Aluko-CV.pdf` (opens in a new tab).
- "What I Do": three cards linking to Teaching, Research, and Learning Design.

### About (`about.html`)
- Photo, bio, and Download CV button; the dark "at a glance" band; the two-photo row with captions; Skills (five cards of tags, the Tools card is dark); Education timeline; Leadership and Service; Awards and Fellowships (the AAAL Indigenous Language Scholarship Support Fund is first and bold); Memberships; contact band.

### Research (`research.html`)
- Intro and four topic tags, Current Work cards, Featured Study with the dark "Upcoming presentations" box (keep the apricot "Award recipient" badge under AAAL 2027), the Research in Action photo row, Publications, Presentations, and "Find My Work" buttons.
- "Read the abstract →" opens a new page, `thesis-abstract.html`, built from `content/thesis-abstract.md` in the same design.
- Google Scholar, ResearchGate, and LinkedIn links open in a new tab with `rel="noopener"`.

### Teaching (`teaching.html`)
- Hero with my teaching photo, the short philosophy (with the italic goal quote in a cream box), the three-photo row, the six course cards, the dark "What Students Say" band (the first quote is large), and Classroom Observation with checkmark list.
- "Read my full teaching philosophy →" opens a new page, `teaching-philosophy.html`, built from `content/full-teaching-philosophy.md`, with a "Back to Teaching" link.

### Learning Design (`learning-design.html`)
- Intro with the UIUC certificate badge, "How I Design" row, Lessons, Courses, contact band.
- **Lessons must be data-driven** so I can add new ones easily. Put all lessons in `js/lessons.js` (an array of objects) and render the cards from it. Each lesson object holds: title, tags (level, skill, length, audience), description, a slides PDF path, a slides accent color, and a list of downloads (label + file). Keep the exact four lessons, text, and button labels from the design. Add a short comment at the top of the file showing me how to add a new lesson.
- When there are more than 6 lessons, automatically show filter chips (by skill) above the cards.
- **Download buttons** link to these files in `assets/docs/`:
  - Articles: `Lesson-Plan-Articles.pdf`, `Articles-Worksheet.pdf`, `Debate-Cards-Articles.pdf`
  - Present Progressive: `Lesson-Plan-Present-Progressive.pdf`, `Error-Correction-Present-Progressive.pdf`, `Schedule-Swap.pdf`
  - Listening: `Lesson-Plan-Listening.pdf`, `Opinion-Corners-Cards.pdf`
  - Asking for a Raise by Email: files not ready yet. Render these buttons as disabled with the label "Coming soon."
- **"View slides" buttons** keep each deck's own color: Articles `#12343B`, Present Progressive `#23255A`, Listening `#1E3A2B`, Email `#2E1A3B`. They open the matching PDF in `assets/slides/` (`articles-slides.pdf`, `present-progressive-slides.pdf`, `listening-slides.pdf`, `email-slides.pdf`) in a full-screen modal viewer (with a close button, Escape to close, and a "Open in new tab" link). If a slide file is missing, show the button as "Slides coming soon" instead of a broken link.
- **Courses section:** build it exactly as designed, but control it with a single setting `SHOW_COURSES = false` at the top of `js/lessons.js`. While false, the whole Courses section is hidden. Keep the placeholder card ready for when I add my first course.

### Contact (`contact.html`)
Build it from `design-reference/contact.html`.
- Eyebrow "Contact", heading "Let's connect", and the intro sentence from the design.
- **Left column, contact cards:** Email (`mailto:wemimoaluko@gmail.com`), LinkedIn, and a dark "Curriculum Vitae · Download my CV (PDF)" card linking to the CV. Below them, outline buttons for Google Scholar and ResearchGate.
- **Right column, "Send a message" form**, subtitled "For academic and professional inquiries." Fields:
  - Name (required) and Email (required), side by side on desktop
  - Organization (optional)
  - "What is your inquiry about?" as selectable pill buttons (single choice, required, accessible as a radio group): Research collaboration · Speaking or conference invitation · Teaching opportunity · Learning design or curriculum project · Job or internship opportunity · Lesson materials · Other
  - Message (required)
  - "Send message" button, and the note "I usually reply within a few days."
- Submit the form with **Formspree** to `https://formspree.io/f/YOUR_FORM_ID` (placeholder, with a comment telling me where to paste my ID). Messages should arrive at wemimoaluko@gmail.com. Include the chosen inquiry topic in the email subject, for example "New inquiry: Research collaboration".
- Add a hidden honeypot field for spam, friendly validation messages, and an inline success message ("Thank you! I'll get back to you soon.") without leaving the page. If sending fails, show: "Something went wrong. Please email me directly at wemimoaluko@gmail.com."

---

## 6. Make it come alive (subtle and professional)

- Sections and cards fade up gently as they scroll into view (IntersectionObserver, about 0.5s, small 16px movement, slight stagger for card grids). Run it once per element.
- Cards lift slightly with a soft shadow on hover; photos zoom very slightly inside their frame on hover.
- Smooth scrolling for in-page links.
- Header gains a shadow on scroll.
- **Respect `prefers-reduced-motion`**: turn every animation and transition off for people who ask for it.
- Nothing should flash, bounce, or delay content from being readable.

---

## 7. Quality checklist (do all of these)

**Responsive:** test at 375px, 768px, 1024px, and 1440px. Cards and photo rows stack on phones. No horizontal scrolling anywhere.

**Accessibility:** semantic HTML (`header`, `nav`, `main`, `section`, `footer`, one `h1` per page); a "Skip to content" link; keep every image's alt text from the design; visible focus states; color contrast of at least 4.5:1 for body text; all buttons and links reachable by keyboard.

**Performance:** convert photos to WebP with JPG fallback using `<picture>`, cap them around 1600px wide, add `width`, `height`, and `loading="lazy"` (except the hero photo on each page). Preconnect to Google Fonts.

**SEO and sharing:** a unique `<title>` and meta description per page; Open Graph and Twitter card tags using `headshot.jpg`; a simple favicon (a "WA" monogram in Lora, cream on `--brown`); `sitemap.xml` and `robots.txt` for `https://meetwemimo.com`.

**Links:** check that every internal link, PDF, and image path works.

---

## 8. Placeholders to leave visible

Leave these exactly as they are in the design, and mark each with an HTML comment `<!-- TODO: Wemimo -->` so I can find them:
- Teaching page: "[Organization name]" on the volunteer ESL card.
- Learning Design: the Courses placeholder card (hidden by the setting above).
- Contact: the Formspree form ID.
- Slide PDFs in `assets/slides/` (I will add them).

---

## 9. How to work

1. Open and read every file in this folder.
2. Show me a short plan: the file structure and how you'll build the shared parts.
3. Build the design system and shared header/footer first, then each page in this order: Home, About, Research, Teaching, Learning Design, Contact, then the two extra pages.
4. Run a local server, check every page at the four screen widths, and fix anything that doesn't match the design reference.
5. When finished, give me:
   - a list of every file you created,
   - the list of TODO placeholders I still need to fill,
   - simple, step-by-step instructions for deploying to Netlify (drag and drop) and connecting my domain meetwemimo.com,
   - simple instructions for adding a new lesson and its slides later.
