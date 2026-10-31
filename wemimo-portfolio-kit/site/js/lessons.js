/* ==========================================================================
   LESSONS — the lesson cards on learning-design.html are built from this list.

   HOW TO ADD A NEW LESSON
   1. Put the handout PDFs in assets/docs/ and the slide deck PDF in assets/slides/.
   2. Copy one of the { ... } blocks below, paste it at the end of the list
      (put a comma after the previous block), and change the text and file names.
   3. Save. The new card appears on the Learning Design page automatically.

   Field guide:
     title        Card heading. You can use <em>...</em> for italics.
     tags         { level, skill, length, audience } — shown as the small pills.
                  "skill" is also used for the filter chips, which appear
                  automatically once there are more than 6 lessons.
     description  One or two sentences. <em>...</em> allowed.
     stripe       Color of the thin bar across the top of the card.
     slides       file: path to the slide PDF ("" = shows "Slides coming soon")
                  bg / text / icon: the "View slides" button colors for that deck.
     downloads    List of { label, file }. The first one is the filled button.
                  Use file: "" for a handout that is not ready yet
                  (it shows as a disabled "Coming soon" button).
   ========================================================================== */

// Set to true when your first course is ready (then edit the placeholder card in learning-design.html).
var SHOW_COURSES = true;

var LESSONS = [
  {
    title: "Articles: <em>the</em> vs. No Article",
    tags: { level: "B2", skill: "Grammar", length: "120 min", audience: "Adult ESL" },
    description: "Learners spot common article mistakes, learn three simple rules, practice with a worksheet, and then use the rules in a lively debate about education and money.",
    stripe: "#A84B26",
    slides: { file: "assets/slides/articles-slides.pdf", bg: "#12343B", text: "#F7F2E8", icon: "#F2CC8F" },
    downloads: [
      { label: "Lesson plan", file: "assets/docs/Lesson-Plan-Articles.pdf" },
      { label: "Worksheet", file: "assets/docs/Articles-Worksheet.pdf" },
      { label: "Debate cards", file: "assets/docs/Debate-Cards-Articles.pdf" }
    ]
  },
  {
    title: "Talking About Plans: Present Progressive for the Future",
    tags: { level: "B2", skill: "Grammar and speaking", length: "120 min", audience: "Adult ESL" },
    description: "Learners talk about their week, fix common errors in pairs, and interview a partner about their fixed plans in a Schedule Swap.",
    stripe: "#F2A65A",
    slides: { file: "assets/slides/present-progressive-slides.pdf", bg: "#23255A", text: "#F5F3FC", icon: "#F4B942" },
    downloads: [
      { label: "Lesson plan", file: "assets/docs/Lesson-Plan-Present-Progressive.pdf" },
      { label: "Error correction", file: "assets/docs/Error-Correction-Present-Progressive.pdf" },
      { label: "Schedule Swap", file: "assets/docs/Schedule-Swap.pdf" }
    ]
  },
  {
    title: "Listening for Ideas and Sound Patterns",
    tags: { level: "Intermediate", skill: "Listening and vocabulary", length: "50 min", audience: "Adult ESL" },
    description: "Learners watch a short video on genetically modified foods three times, for the main idea, the details, and natural speech patterns, then share their views in Opinion Corners.",
    stripe: "#F2A65A",
    slides: { file: "assets/slides/listening-slides.pdf", bg: "#1E3A2B", text: "#F3F6EC", icon: "#9BCB4C" },
    downloads: [
      { label: "Lesson plan", file: "assets/docs/Lesson-Plan-Listening.pdf" },
      { label: "Opinion Corners cards", file: "assets/docs/Opinion-Corners-Cards.pdf" }
    ]
  },
  {
    title: "Asking for a Raise by Email",
    tags: { level: "B2", skill: "Workplace writing", length: "50 min", audience: "Adult ESL" },
    description: "Learners draw a job card, write a polite email to their boss using <em>because</em>, <em>although</em>, and <em>unless</em>, and then reply to a partner's email as the supervisor.",
    stripe: "#A84B26",
    slides: { file: "assets/slides/email-slides.pdf", bg: "#2E1A3B", text: "#FBF6F1", icon: "#E39A5B" },
    downloads: [
      // TODO: Wemimo — add the file names here when these handouts are ready.
      { label: "Lesson plan", file: "" },
      { label: "Job cards and planning sheet", file: "" }
    ]
  }
];
