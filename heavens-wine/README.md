# Heavens Fortified Wines

A static business website for Blue Heavens Distributors Limited. Open index.html in a browser or serve this directory with any static HTTP server. No build step or runtime dependencies.

## Pages
- `index.html`: the original home design, interactive wine collection, celebrations, branding, original poster and booking invitation.
- `wines.html`: the wine collection, all seven pack sizes and supplied product artwork.
- `celebrations.html`: weddings, introductions, Kuhingira, birthdays, graduations and personalised branding.
- `booking.html`: a dedicated booking enquiry form and FAQs.

All pages share navigation and footer links. Wine/pack selections and occasion links prefill the booking form. Visitors review their prepared message on the site, then choose to open WhatsApp and send it themselves. No enquiry is transmitted automatically or stored by the site.

## Content
- Classic and Chocolate sweet red fortified wine, based on supplied product posters.
- Advertised packs: 750 ml, 1, 2, 3, 5, 10 and 20 litres; confirm availability directly.
- Event branding: weddings, introductions, birthdays, graduations and Kuhingira.
- Business phone numbers from the supplied poster: +256 776 998 578 and +256 709 724 471.
- Call links and a WhatsApp enquiry form. The form prepares a message for the visitor to review and send. It does not submit an order or take payment.

## Publishing
The site is portable and uses relative file paths. Upload this directory to a static host.
For the existing GitHub Pages repository zorah11/zorah11.github.io, place it at /heavens-wine/ on the configured Pages branch. This yields https://zorah11.github.io/heavens-wine/ if the Pages source is the repository root.
The root portfolio files are outside this project.
When hosting elsewhere, update the absolute og:image URL in index.html.

## Images and fonts
The original customer-supplied `Heavens Wine-01.jpg.jpeg` is included as full-poster WebP copies at 640px and 1400px wide. The source file is preserved in Downloads. Images use responsive sizing without cropping the poster.
The two bottle cutouts are AI-assisted extractions of the supplied branded artwork. Inspect product packaging before using this site for final commercial photography.
The three editorial photographs are AI-generated illustration, not photographs of real customer events.
Fonts are self-hosted Cormorant Garamond and DM Sans. Their OFL licences are in assets/.
No analytics, tracking cookies or external font requests are included.

## Editing
index.html, wines.html, celebrations.html, booking.html: page content and business details.
style.css: brand colours, layout and responsive rules.
pages.css: additional pages, original-poster features, booking review and responsive additions.
app.js: shared navigation, product/pack selection, booking prefill, accordions, enquiry review and privacy disclosure. Page-specific controls initialise only where present.
assets/: fonts, imagery and icon.
