# Verification — 20 November 2026

## Additional pages

- Home, Our Wines, Celebrations and Book an Occasion return HTTP 200 locally.
- JavaScript syntax passes. The shared script initialises on all four pages without errors in offline DOM checks.
- One main heading per page, unique IDs, image alt attributes, form labels, navigation destinations, anchor destinations and active-page markers pass.
- All 23 linked local page, stylesheet, font and image resources return HTTP 200.
- Classic and Chocolate selection with all seven pack sizes produces the correct booking URL on Home and Our Wines.
- Keyboard product selection, menu open/close/Escape and privacy disclosure pass offline DOM checks.
- Booking query values prefill wine, pack size, occasion and branding. Unrecognised values are ignored.
- Required name and age confirmation, whitespace-only names and invalid pack quantities are rejected in DOM checks.
- A valid enquiry renders a plain-text review and correctly encodes the WhatsApp URL, including special characters and all provided booking details.
- Preparing a review stays on the page. Changing details removes the previous WhatsApp URL until a fresh review is generated. Editing returns focus to the form.
- No WhatsApp links were opened, messages sent or enquiry details stored.
- The supplied original poster was visually inspected as a local image. Full-frame 640px and 1400px WebP copies were added without modifying the original file. The earlier bottle cutouts and generated editorial photographs remain in use.
- Blue Heavens Distributors Limited appears in the footer on all four pages. Both phone numbers remain correct.

## Verification limits

Browser access to the local preview was declined. No attempt was made to bypass that decision. Offline DOM and HTTP checks do not verify rendered layout, image cropping, real-browser interaction, focus appearance or scrolling. Visual review at 375, 768, 1024 and 1440 pixels remains pending.

The original responsive styles and reduced-motion support are retained. Additional page rules cover phone, tablet and desktop layouts, but these have not been visually verified in this session.

The checks above were completed locally before publication. GitHub publishing and live verification are separate deployment steps.
