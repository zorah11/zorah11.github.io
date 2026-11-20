# CLAUDE.md — Website Design Standards

This file governs how you build websites in this project. The goal is a site that looks
**deliberately designed by a human studio**, not generated. Every rule below exists to keep
the output from sliding into the default "AI / vibe-coded" look. Follow it on every build.

---

## 0. The one rule that matters most

If a stranger could glance at the page for two seconds and say "an AI made this," you have
failed, regardless of whether the code works. Distinctiveness and restraint are the job, not
a bonus. When in doubt, make a *specific* choice tied to the subject instead of a safe,
generic one.

---

## 1. Hard bans (never ship these)

These are the fingerprints of a vibe-coded site. Do not use them.

- **Never replace an established brand colour just because it is purple.** Brand evidence
  wins. When there is no existing brand, do not reach automatically for the familiar
  violet/indigo startup palette (`#7c3aed`, `#8b5cf6`, `#6366f1`).
- **No purple-to-blue or purple-to-pink gradients** anywhere — backgrounds, buttons, or text.
- **No gradient-filled headline words** (e.g. one word in the headline tinted with a
  color gradient while the rest is dark). This is everywhere in generated sites.
- **No meaningless stat blocks** — the "25% · 95% · 2025" row of giant numbers with vague
  labels. Only show a number if it is real and sourced.
- **No emoji inside headings or section titles** (🚀 ✨ 🔒 etc.). Use real iconography instead,
  and use it sparingly.
- **No "Why Choose [Brand]?" sections.** Same for "Transform your X into Y," "Start it. Build
  it. Launch it." and other interchangeable SaaS slogans.
- **No glassmorphism by default** — frosted translucent cards with heavy blur and soft glow.
- **No pill-badge clutter** ("99.9% Uptime", "GDPR Compliant", "24/7 Support 🔒") stacked under
  the hero.
- **No default centered-everything layout** with a single column of centered text from top to
  bottom. Use real composition.
- **No raw system font / unstyled Inter** as the entire type system (see §3).
- **No rainbow of soft drop shadows** on every card. Shadow is an accent, not a texture.

If a design brief, existing site, logo, or reference explicitly calls for one of these, the
brand evidence wins. Execute it deliberately so it still looks designed rather than defaulted.

---

## 2. Follow the user's references first

If the user provides design examples, screenshots, links, an existing site, logo, or brand,
**those override the stylistic defaults below.** Before designing:

1. Identify the reference's palette (pull actual hex values), type style, spacing rhythm,
   and the one signature move that makes it feel like itself.
2. Match that direction. Do not "improve" it toward a generic look.
3. Preserve recognisable brand equity. Do not quietly recolour an established brand.

No references provided? Then pin the brief yourself: name the concrete subject, its audience,
and the page's single job, and design specifically for that.

---

## 3. Typography (always beautiful, always intentional)

Type carries the personality. Never leave it as a default.

- **Pair two faces with intent:** a characterful display/heading face used with restraint,
  plus a clean, legible body face. Optionally a third utility face for captions or data.
- **Avoid the tired defaults** as your whole system: plain Inter, Roboto, Open Sans, system-ui.
  They're fine as a *body* in some briefs, but pair them with a real display face and a
  deliberate scale.
- **Good starting palettes** (mix display + body, pick to fit the subject, not by habit):
  - Editorial / trustworthy: *Fraunces* or *Libre Caslon* display + *Inter Tight* body
  - Modern / technical: *Space Grotesk* or *General Sans* + *IBM Plex Sans*
  - Warm / human: *Bricolage Grotesque* + *Source Serif* body
  - Sharp / premium: *Geist* or *Satoshi* + *Newsreader* for long copy
- **Set a real type scale.** Define explicit sizes, weights, line-heights, and letter-spacing.
  Headlines get tighter leading and tracking; body copy gets generous line-height (~1.5–1.7).
- **Load fonts properly** (self-host or use a reliable CDN), set `font-display: swap`, and
  always declare fallbacks.

---

## 4. Color

- **Choose a palette of 4–6 named hex values** derived from the subject or reference — not a
  framework default.
- Anchor on a confident neutral base, add **one** disciplined accent, and use it sparingly.
- Ensure text/background contrast meets **WCAG AA** (4.5:1 for body, 3:1 for large text).
- If you want energy, get it from composition, type, and a single bold accent — not from a
  gradient.

---

## 5. Layout & composition

- The hero is a thesis: open with the most characteristic thing about the subject, not a
  centered slogan + two buttons + stat row.
- Use real composition — asymmetry, an editorial grid, intentional whitespace. Vary section
  rhythm; don't stack identical centered blocks.
- Structural devices (numbers, eyebrows, dividers, labels) must encode something true.
  Don't add `01 / 02 / 03` unless the content is genuinely a sequence.
- Match complexity to the vision: minimal directions need precise spacing and detail;
  maximal directions need committed execution.

### Give every site its own layout fingerprint

Do not reuse the same navbar + split hero + three cards + CTA band + footer formula between
clients. Before coding, define these six choices in a short design note:

1. hero topology;
2. navigation character;
3. typography pairing;
4. image treatment;
5. section rhythm;
6. one motion signature.

At least four must be meaningfully specific to this client. Choose a fitting design grammar,
such as an editorial field journal, image-led documentary, technical catalogue, community
noticeboard, institutional report, or workshop ledger. This is a direction, not a template.
Page order should follow the visitor's questions, not a universal component sequence.

### Image-led composition

- Treat photography as content and structure, not as decoration dropped into rounded cards.
  Use full-bleed scenes, unexpected crops, portrait strips, inset documentary frames, image
  sequences, or editorial pull-outs when they suit the subject.
- **Text may sit over an image.** Protect readability with deliberate focal-point placement,
  a localised solid scrim, tonal image treatment, or an opaque text panel. Do not put body
  copy over a busy photograph or solve every image with a dark full-screen overlay.
- Set `object-position` per image and change the crop at mobile breakpoints when needed.
  A person's face, product, or important action must never be accidentally cropped away.
- Use real supplied images first. When samples are required, choose or generate a coherent
  set with matching light, colour, geography, and camera language; never mix unrelated stock
  aesthetics.
- Keep text in HTML. Do not bake headings, labels, or calls to action into raster images.

### Benchmark, then synthesise

When the brief asks for a premium or expressive result, review at least three relevant
references from sources such as Dribbble, Behance, Awwwards, or strong live sites. Record only
what is useful: hierarchy, crop, grid, pacing, transition, and navigation behaviour. Combine
principles from multiple references; never copy a complete layout or another brand's identity.
The finished site must still be credible for the client's sector, audience, location, and
actual amount of content.

---

## 6. Motion (lively, coherent, and restrained)

- Choose one to three related motion motifs: staggered editorial reveals, a restrained image
  mask/wipe, gentle depth on a hero photograph, a useful sticky story section, or crop/label
  changes on hover. Repeat them consistently so the site feels art-directed.
- Motion should clarify hierarchy, reveal content, or reward interaction. Avoid continuous
  bobbing, spinning ornaments, cursor gimmicks, and animating every element on scroll.
- Keep interactions responsive and calm: mostly transform and opacity, short durations, and
  no animation that delays navigation or hides essential content.
- Always respect `prefers-reduced-motion`.

---

## 7. Responsive: desktop AND mobile, every time

Non-negotiable. The site must look intentional at every width.

- **Build mobile-first**, then scale up. Test at minimum **375px, 768px, 1024px, 1440px**.
- Type, spacing, and layout all adapt — don't just let a desktop layout shrink.
- Tap targets ≥ 44×44px; no horizontal scroll; no overlapping or clipped elements on small
  screens.
- Images and media are responsive (`max-width: 100%`, correct aspect ratios, sensible
  `srcset` where relevant).
- Navigation collapses sensibly on mobile (and the mobile menu actually works).

---

## 8. Quality floor (build this in silently)

- Visible keyboard focus states on all interactive elements.
- Semantic HTML, alt text on meaningful images, labelled form controls.
- `prefers-reduced-motion` respected.
- Watch CSS specificity — don't let `.section` and element selectors cancel each other's
  padding/margins. Verify spacing actually applies.

---

## 9. Always check your work when done

After building, **do a real review pass before calling it finished.** Do not just stop when
the code runs.

1. **Screenshot / preview** the page at desktop and mobile widths if the environment allows.
   A picture is worth 1000 tokens.
2. **Run the vibe-code checklist** below. If any box is checked, fix it.
3. **Read your own copy** — does it sound like an interchangeable SaaS template? Rewrite it
   to be specific and plain.
4. **Click through** key interactions (nav, mobile menu, buttons, forms) and confirm they work.
5. Apply Chanel's rule: look at the finished page and remove one thing that isn't earning its
   place.
6. Report back what you checked and what you changed.

### Vibe-code checklist (every item must be NO)
- [ ] Was purple/violet chosen by habit rather than from the client's established brand?
- [ ] Are there any purple/blue/pink gradients?
- [ ] Are any headline words gradient-filled?
- [ ] Is there a row of giant meaningless stats?
- [ ] Are there emoji in headings?
- [ ] Is there a "Why Choose us?" or generic SaaS-slogan section?
- [ ] Is everything centered in one column?
- [ ] Is the type just default Inter/system with no display face?
- [ ] Do cards have frosted-glass + soft-glow styling?
- [ ] Does this repeat the same hero, card grid, and CTA sequence as the last client site?
- [ ] Are photographs merely filling boxes instead of shaping the composition?
- [ ] Is text over photography difficult to read at any breakpoint?
- [ ] Are animations scattered, repetitive, or present only to make the page feel busy?
- [ ] Does it break or look unstyled on mobile?

---

## 10. Process summary

Brainstorm → pin the brief / match the reference → draft a small token system (color, type,
layout, one signature element) → critique the plan against this file (would I produce this for
*any* site? then change it) → build → check your work (§9) → critique again.

Distinctiveness comes from the subject. Restraint makes it look designed. Beautiful type and a
clean responsive build are the floor, not the goal.
