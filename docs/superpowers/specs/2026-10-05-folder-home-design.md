# Portfolio folder homepage

Implement the user's supplied reference: a light, spacious single-screen landing page with a translucent cyan physical folder. Five existing projects sit inside it as overlapping, individually selectable image cards. Preserve existing project content and hash routes.

The folder carries Zhang Zhaoxi's compact biography and a resume image preview action. A biography dialog contains the existing education, employment, research, contact and skills information. Use native dialogs for focus containment, Escape dismissal and focus restoration.

Cards use existing project imagery. Hover and keyboard focus lift a card out of the folder and update an upper-left information panel with the existing title, subtitle, category, year and summary. Clicking a card navigates directly to its existing project. An explicit expand/collapse action exposes all five cards; touch layouts always spread cards enough to select them.

The backdrop reads “The world can wait” with soft sculpted lettering behind the folder. Integrate the supplied React Bits LightPillar shader using the requested lavender/cream colors, width 8.5, height 0.3, rotation 43 and gentle rotation speed. Use its light mode to match the reference. Pause rendering when hidden, render a static frame for reduced motion, and provide a CSS fallback without WebGL.

Use CSS transform transitions for card movement, with hover capability gating and reduced-motion alternatives. Verify desktop, narrow screens, all five routes, resume opening and closing, focus, asset loading and a production build. Keep existing unrelated local changes.

## Refinement requested by the user

- Increase the desktop folder and card assembly to 125% of its previous size at each desktop breakpoint. Fit the assembly within narrow mobile viewports.
- Refine cards as printed portfolio covers: slim metadata margin with project index and year, a large cropped project image, a two-level title/category caption, defined paper edge and a compact arrow. Retain real project assets.
- Increase the biography photograph from 67 × 80 to 136 × 160 design pixels and put all identity, education and employment copy in the right column.
- Hovering any card expands all five cards. Keep the fan open while the pointer moves between cards or across the folder, and close it after the pointer leaves the assembly. Keyboard focus expands it too; preserve the explicit toggle for touch and persistent opening.
- Strengthen the supplied LightPillar shader with higher rendering quality, less white masking, faster gentle rotation, and a light-mode contrast control. Preserve the lavender/cream input colors, rotation 43, width 8.5 and the supplied ray-marching structure. Derive light-mode hue before tone compression so highlights do not wash every channel to white.

## Shared project background and publication

Use one fixed PortfolioBackground at the app root for the homepage and all five project routes. Keep the existing homepage LightPillar parameters and fallback exactly shared, and keep the renderer mounted across route changes. Remove the dark page background and decorative grid. Adapt page headings, prose, navigation and descriptive panels to the homepage ink colors so the light background remains readable; retain image/video surfaces, image-caption overlays and the Fankun prototype's own product styling. Validate the five routes, a project-to-home transition, scroll coverage and production build before publishing the complete local portfolio to the existing GitHub remotes and their Vercel deployment.

## Final homepage refinements

Remove the bottom guidance and expand button highlighted by the user. Hover or keyboard focus remains the desktop expansion trigger, and exposed card tops remain direct project links on touch. Lower the folder assembly by 36–72 viewport-dependent pixels, and raise the background phrase enough to reveal more of both lines. Use the folder's 21px rounded, blurred material for the project card frames, with white translucent highlights instead of cyan. Keep the work images clear. Increase the desktop fan arc by raising the center card 174px, its neighbors roughly 143px, and spreading the edge cards by 84px at 24-degree angles; scale the arc within the mobile viewport.
