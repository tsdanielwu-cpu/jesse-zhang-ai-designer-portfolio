# DarkVeil Global Background

## Scope

Replace the current global `FerrofluidBackdrop` with a fixed WebGL `DarkVeil` background across the homepage and all project detail routes.

## Approved Direction

- Implement the effect with the lightweight `ogl` WebGL library.
- Render the canvas as a fixed, full-viewport background rather than a fixed 1080 by 1080 element.
- Keep the canvas behind all page content and exclude it from pointer interaction.
- Remove the current red liquid background from the rendered application.
- Preserve the existing black, white, and red content system above the new background.

## Parameters

Use the supplied values:

- `hueShift`: `-110`
- `noiseIntensity`: `0`
- `scanlineIntensity`: `1`
- `speed`: `0.5`
- `scanlineFrequency`: `24`
- `warpAmount`: `0`
- `resolutionScale`: `1`

## Component Behavior

- Create a reusable `DarkVeil` React component with the parameters exposed as props.
- Resize the WebGL renderer with the viewport.
- Cap device pixel ratio to control GPU cost.
- Reduce resolution on narrower or lower-power viewports.
- Stop the animation loop when the component unmounts.
- Pause continuous motion when the page is hidden.
- If WebGL initialization fails, retain a dark static background instead of leaving the page blank.

## Accessibility

- Mark the background as decorative and hide it from assistive technology.
- Do not track the pointer.
- Under `prefers-reduced-motion`, render a stable frame without a continuous animation loop.
- Preserve content contrast and readability independently of the canvas.

## Verification

- The background appears on the homepage and all detail routes.
- The former `FerrofluidBackdrop` is no longer imported or rendered.
- The effect does not intercept links or scrolling.
- The page remains readable if WebGL is unavailable.
- Production build completes successfully.
- Verify the canvas is nonblank at desktop and reduced-resolution mobile dimensions.
