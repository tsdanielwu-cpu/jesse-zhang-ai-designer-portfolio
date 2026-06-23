# TouchDesigner Floral Particle Interaction Design

## Goal

Create a real-time TouchDesigner 2022 artwork that converts a full-screen floral texture into an unmistakably particle-based, semi-abstract flower field. The source photograph must never be shown as a solid image or processed with image-space displacement. Flower colors and broad composition remain recognizable against a dark background, while individual points remain visible even when idle.

The primary output is a 1920 x 1080 interactive screen work running at 60 FPS. The network and process should also be clear enough to document in a portfolio.

## Visual Behavior

- Roughly 80 percent of particles sample the floral body.
- Roughly 20 percent of particles sample high-contrast floral edges and behave as lighter pollen.
- Idle particles retain visible spacing, size variation, and subtle breathing motion so the image reads as a point cloud rather than a photograph.
- Slow mouse movement creates a small, soft repulsion field.
- Fast mouse movement increases radius, force, edge curl, and trail intensity.
- Body particles return to their sampled home positions with spring motion.
- Edge particles take longer to return and leave fading trails.
- Particle color is sampled from the source image.
- The final composite uses a dark background and restrained bloom.

## Network Structure

### 1. Source Processing

The supplied floral image is loaded with `Movie File In TOP`. Its near-black background is excluded using luminance and color thresholds. The network outputs:

- `source_color`: source image color.
- `flower_mask`: binary or softened floral mask.
- `edge_mask`: floral boundary weight derived with edge detection.

The source is resized to a simulation resolution appropriate for the available GPU. A first target is 512 x 288, with inactive pixels discarded or hidden at render time.

### 2. Particle State

GPU textures and GLSL feedback store particle state:

- Home position.
- Current position.
- Velocity.
- Source color.
- Edge weight.

Position and velocity use a ping-pong feedback structure. The simulation is implemented with GLSL TOPs, not Displace TOPs. A reset pulse restores current position to home position and clears velocity.

### 3. Mouse Interaction

`Mouse In CHOP` supplies normalized cursor coordinates. A derivative or speed calculation creates a smoothed mouse-speed channel.

Mouse speed drives:

- Repulsion radius: approximately 40 to 220 pixels.
- Repulsion strength: approximately 0.2 to 2.5.
- Curl strength: low while moving slowly and high during fast movement.
- Trail brightness and persistence.

The simulation combines:

- Spring force toward home position.
- Radial mouse repulsion.
- Curl or rotational force weighted by `edge_mask`.
- Damping around 0.94.
- A maximum velocity clamp to prevent unstable bursts.

### 4. Rendering

Particles are rendered as GPU point sprites or instanced camera-facing quads with a GLSL material. The source photograph is not composited into the final output. Body particles use slightly larger, more opaque sprites. Edge pollen uses smaller, softer sprites.

The rendered particles pass through a separate feedback trail chain:

`Render TOP -> Composite TOP -> Level TOP -> Feedback TOP`

Trail decay begins around 0.92 to 0.97. A subtle bloom pass is applied after the current particle frame and fading trail are combined.

## Control Interface

A parent Base COMP exposes:

- Mouse Radius Minimum and Maximum.
- Repel Strength Minimum and Maximum.
- Spring Strength.
- Damping.
- Edge Curl Strength.
- Trail Decay.
- Body Particle Size.
- Pollen Particle Size.
- Bloom Amount.
- Reset pulse.

Default values should feel soft during ordinary movement and visibly more energetic during fast gestures without destroying the floral composition.

## Performance

- Target output: 1920 x 1080 at 60 FPS.
- Initial particle budget: 80,000 to 150,000 particles.
- Simulation runs at a lower texture resolution than final output.
- CPU Particle SOP simulation is not used for the main particle system.
- Bloom and trail passes should remain modest and can be reduced independently.

If performance is below target, reduce simulation resolution, particle count, trail resolution, and bloom passes in that order.

## Failure Handling

- If the source background key is noisy, soften and erode the mask before particle generation.
- If particles explode numerically, clamp mouse speed and particle velocity.
- If the flower loses readability, increase spring strength and reduce the percentage of edge pollen.
- If trails obscure the image, lower trail decay or composite opacity.
- If the mouse leaves the window, interaction force falls to zero and particles return home.

## Acceptance Criteria

- The floral composition remains recognizable while idle, but it is visibly constructed from separated particles at all times.
- No full-frame image warping, shaking, or Displace TOP approximation appears in the final output.
- Slow and fast mouse movement produce clearly different responses.
- Fast movement produces edge-weighted pollen curl and visible fading trails.
- Particles return smoothly after interaction.
- Original floral colors are preserved.
- The artwork runs at or near 60 FPS at 1920 x 1080 on the target computer.
- The TouchDesigner network is organized into named source, simulation, interaction, render, and output sections suitable for portfolio screenshots.
