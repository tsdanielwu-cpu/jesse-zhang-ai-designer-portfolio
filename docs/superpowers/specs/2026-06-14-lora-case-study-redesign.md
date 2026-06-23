# LoRA Case Study Redesign

## Goal

Rebuild the LoRA makeup model project as a native editorial case study. The page should present the project as a high-end AI designer portfolio piece rather than a sequence of exported PDF pages.

## Scope

This redesign applies only to the `lora-makeup` project detail page and its homepage cover. Other project detail pages and their PDF archives remain unchanged.

## Visual Direction

- Dark editorial presentation using the website's existing black, white, and red visual system.
- Use the selected pink-and-blue editorial portrait (`result-03b.webp`) as the primary project hero.
- Use large photography, asymmetric grids, disciplined spacing, thin dividers, and compact captions.
- Images carry the visual emphasis. Copy remains concise and supports the process narrative.
- Use the existing rounded image language consistently.
- Do not introduce generic dashboard cards or a template-like case study layout.

## Information Architecture

1. Project hero
   - Back navigation
   - Project title
   - Short project summary
   - Role, focus, and tools
   - Editorial triptych assembled from three portrait images
2. Project overview and training method
   - Problem and objective
   - Dataset and image-labeling strategy
   - Prompt decomposition framework derived from the portfolio PDF
   - Native text and image composition, with no PDF page screenshots
3. Validation
   - Four Before/After comparison groups
   - Each group includes a concise explanation of the makeup characteristics being tested
4. Final outputs
   - Six retained high-resolution images in an asymmetric editorial gallery
5. Project ending
   - Compact next-project navigation or return-to-works action

## Asset Decisions

### Retained final images

- `result-01b.webp`
- `result-02b.webp`
- `result-03b.webp`
- `result-04b.webp`
- `result-05b.webp`
- `result-06b.webp`

### Hero triptych

- Center: `result-03b.webp`, approximately 46% of the available width and slightly taller than the side images.
- Left: `result-02b.webp`, approximately 27% of the available width.
- Right: `result-05b.webp`, approximately 27% of the available width.
- Preserve the portrait compositions instead of cropping one image into a wide banner.
- Use narrow gaps and the existing rounded-corner language.
- Keep only restrained parallax. Do not apply additional image scaling that could expose softness.
- Collapse to a horizontal, scrollable portrait strip on narrow screens rather than shrinking all three images excessively.

### Deleted final images

These files correspond to the six JPG images the user asked to remove:

- `result-01.webp`
- `result-02.webp`
- `result-03.webp`
- `result-04.webp`
- `result-05.webp`
- `result-06.webp`

### Retained comparison images

- `compare-01-before.webp` and `compare-01-after.webp`
- `compare-02-before.webp` and `compare-02-after.webp`
- `compare-03-before.webp` and `compare-03-after.webp`
- `compare-04-before.webp` and `compare-04-after.webp`

## PDF Content Handling

- Remove all full-page PDF screenshots from the LoRA detail page.
- Remove the LoRA `PROCESS ARCHIVE` / `PdfArchive` section.
- Preserve useful project information from the PDF by rewriting it as semantic HTML.
- Associate each explanation with the relevant original or comparison image.
- Do not use PDF screenshots as the homepage cover, hero image, or method-section artwork.

## Motion

- Keep section typography stable and readable.
- Use restrained image reveal and light parallax only where they support visual hierarchy.
- Animate the three hero panels with a short staggered reveal as a single composition.
- Avoid animated font-size changes, bounce easing, pointer tracking, and expensive continuous effects.
- Respect `prefers-reduced-motion`.

## Responsive Behavior

- Optimize the primary layout for desktop with the existing approximately 1700px content width.
- Collapse asymmetric image-and-copy compositions into a clear single-column sequence on narrow screens.
- Preserve image aspect ratios and prevent captions or headings from overlapping imagery.

## Verification

- Confirm the six deleted images are no longer referenced or present in the LoRA asset directory.
- Confirm the LoRA detail page contains no `/assets/portfolio/page-*.jpg` references.
- Confirm the other three projects still render their existing archives.
- Run the production build.
- Inspect the homepage cover and LoRA detail page in the in-app browser at desktop and mobile widths.
- Check image loading, text hierarchy, rounded corners, reduced-motion behavior, and navigation.
