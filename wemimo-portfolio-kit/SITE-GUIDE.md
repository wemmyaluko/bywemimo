# bywemimo.com — site guide

The finished website is in the **`site/`** folder. That folder is what you upload. Everything else in
this kit (design-reference, content, this guide) is for reference only.

## Things you still need to fill in (search the files for `TODO: Wemimo`)

1. ~~Contact form~~ Replaced by the Cal.com booking calendar (see below).
2. ~~[Organization name]~~ Done (University of Northern Iowa, CIEP).
3. **Courses placeholder card**: `site/learning-design.html`. It's hidden until you set
   `SHOW_COURSES = true` at the top of `site/js/lessons.js`.
4. **"Asking for a Raise by Email" handouts**: in `site/js/lessons.js`, add the file names once the
   PDFs are in `site/assets/docs/`. Until then the buttons say "Coming soon".
5. **Slide PDFs**: `site/assets/slides/`. The four decks are in place now. New decks go here too.

## Booking calendar (Cal.com)

The Contact page shows your Cal.com calendar: https://cal.com/aluko-wemimo-mldjk3/30min

- **Change your hours, questions, or meeting length** in your Cal.com account. The website updates
  by itself; no re-upload needed.
- **Use a different event**: in `site/contact.html`, find `aluko-wemimo-mldjk3/30min` (it appears twice)
  and replace both with the part of your new link after `cal.com/`. Then re-upload the site.
- Bookings and visitors' answers arrive by email and on your Google Calendar.

## Your course: Write Your Way In

The course lives at `site/courses/write-your-way-in/` (online at bywemimo.com/courses/write-your-way-in/).
It no longer needs Articulate.

- **All the course text** (lessons, activities, quiz questions, answers, feedback) is in
  `site/courses/write-your-way-in/course-data.js`. Open it in Notepad to fix a word, then re-upload.
  Easiest: tell Claude what to change.
- The pass mark for each self-check is 80%. Learners' progress is saved in their own browser.
- The card on the Learning Design page is in `site/learning-design.html` (search for "Write Your Way In").
- The course is complete with four modules and a course summary.
- **Final essay submit button:** it currently opens an email to you. To use a Google Form instead, send Claude the form link.

## Deploy to Netlify (drag and drop)

1. Go to https://app.netlify.com and sign up (free).
2. Open **Sites**, then drag the whole **`site`** folder onto the "Drag and drop your site output folder here" box.
3. Netlify gives you an address like `something-random.netlify.app`. Open it and click around to check.
4. To update the site later: open the site in Netlify → **Deploys** → drag the `site` folder in again.

## Connect bywemimo.com

1. In Netlify, open your site → **Domain management** → **Add a domain** → type `bywemimo.com` → **Verify** → **Add domain**.
2. Netlify shows you DNS settings. The simplest option is **Netlify DNS**: choose
   "Set up Netlify DNS", and Netlify gives you 4 nameservers (like `dns1.p01.nsone.net`).
3. Log in to the company where you bought bywemimo.com (GoDaddy, Namecheap, etc.), find
   **Nameservers** for the domain, choose "Custom", and paste in Netlify's 4 nameservers.
   - Don't want to change nameservers? Instead add the two records Netlify lists at your registrar:
     an **A record** for `@` pointing to Netlify's load balancer IP, and a **CNAME** for `www`
     pointing to your `*.netlify.app` address.
4. Wait (usually under an hour, sometimes up to 24 hours). Netlify then turns on HTTPS automatically.
   Under **Domain management → HTTPS** you'll see "Your site has HTTPS enabled".

## Add a new lesson

1. Put the handout PDFs in `site/assets/docs/` (use names without spaces, e.g. `Lesson-Plan-Idioms.pdf`).
2. Put the slide deck PDF in `site/assets/slides/` (e.g. `idioms-slides.pdf`).
3. Open `site/js/lessons.js`. Copy one whole `{ ... }` lesson block, paste it after the last one,
   and put a comma between them. Change the title, tags, description, file paths, and slide colors.
4. Save, open `site/learning-design.html` in your browser to check, then re-upload the `site` folder.

When there are more than 6 lessons, filter buttons (by skill) appear above the cards automatically.
If a lesson has no slide file yet, set `file: ""` in its `slides` and the button reads "Slides coming soon".

## Edit text

All words are plain HTML in the `site/*.html` files. Open one in any text editor (Notepad or VS Code),
change the words between the tags, save, and re-upload. Colors, fonts, and spacing are in
`site/css/styles.css` at the top, under `:root`.

## Replacing a photo

- **Home page portrait:** `headshot-cutout.webp` and `headshot-cutout.png` (your Canva cut-out with a see-through background). `headshot.jpg` is still used as the preview image when your site is shared on social media.
- **About page photo:** `about_crop.webp` / `about_crop.jpg` (a tighter crop of `about_table.jpg`).

Replace the `.jpg` in `site/assets/images/` with the same file name. Each photo also has a `.webp` copy,
which browsers load first, so **replace both**: convert your new photo to WebP with the same name
(free at https://squoosh.app). If you skip the WebP, also delete that photo's `<source ... .webp>` line
in the HTML page, or visitors will still see the old photo.
