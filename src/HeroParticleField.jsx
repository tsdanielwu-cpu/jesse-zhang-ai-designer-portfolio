import React, { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Texture, Triangle, Vec2 } from "ogl";

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uMouse;
uniform float uTime;
uniform float uInteraction;
uniform float uCellScale;
uniform float uFloatStrength;
uniform float uInteractionStrength;
uniform float uBaseImageStrength;
varying vec2 vUv;

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 456.21));
  point += dot(point, point + 45.32);
  return fract(point.x * point.y);
}

void main() {
  vec2 pixel = vUv * uResolution;
  float cellSize = mix(4.1, 5.2, smoothstep(900.0, 1800.0, uResolution.x)) * uCellScale;
  vec2 cell = floor(pixel / cellSize);
  vec2 sourceCenter = (cell + 0.5) * cellSize;

  float frameAspect = uResolution.x / max(uResolution.y, 1.0);
  float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
  vec2 coverScale = imageAspect > frameAspect
    ? vec2(frameAspect / imageAspect, 1.0)
    : vec2(1.0, imageAspect / frameAspect);
  vec2 imageUv = (sourceCenter / uResolution - 0.5) * coverScale + 0.5;

  vec3 sampled = texture2D(uImage, imageUv).rgb;
  float luminance = dot(sampled, vec3(0.2126, 0.7152, 0.0722));
  float detail = max(max(sampled.r, sampled.g), sampled.b);
  float chroma = detail - min(min(sampled.r, sampled.g), sampled.b);
  float presence = max(luminance, detail * 0.72 + chroma * 0.48);

  float seed = hash21(cell);
  vec2 idle = vec2(
    sin(uTime * (0.62 + seed * 0.72) + seed * 18.0),
    cos(uTime * (0.48 + seed * 0.64) + seed * 24.0)
  );
  vec2 drift = vec2(
    sin(uTime * 0.3 + sourceCenter.y * 0.012 + seed * 9.0),
    cos(uTime * 0.24 + sourceCenter.x * 0.009 + seed * 12.0)
  );
  idle = (idle * mix(1.9, 6.8, luminance) + drift * mix(1.2, 3.4, seed)) * uFloatStrength;

  vec2 mouseDelta = sourceCenter - uMouse;
  float mouseDistance = length(mouseDelta);
  float influence = (1.0 - smoothstep(8.0, 142.0, mouseDistance)) * uInteraction;
  float softCore = 1.0 - smoothstep(0.0, 68.0, mouseDistance);
  vec2 pushDirection = mouseDelta / max(mouseDistance, 1.0);
  vec2 tangentDirection = vec2(-pushDirection.y, pushDirection.x);
  vec2 shimmerDirection = vec2(
    sin(seed * 31.0 + uTime * 1.7),
    cos(seed * 37.0 + uTime * 1.45)
  );
  vec2 interactionOffset = (
    tangentDirection * mix(7.4, 14.0, softCore)
    + shimmerDirection * mix(2.2, 6.8, softCore)
  ) * influence * uInteractionStrength;

  vec2 particleCenter = sourceCenter + idle + interactionOffset;
  float particleDistance = length(pixel - particleCenter);
  float particleRadius = mix(0.72, 2.32, pow(presence, 0.58));
  particleRadius *= mix(0.82, 1.16, seed);
  particleRadius *= 1.0 + influence * 0.08 * uInteractionStrength;
  float dotMask = 1.0 - smoothstep(particleRadius * 0.38, particleRadius, particleDistance);

  vec3 shadowColor = vec3(0.48, 0.07, 0.22);
  vec3 midColor = pow(sampled, vec3(0.62)) * vec3(1.64, 1.48, 1.52);
  vec3 highlightColor = vec3(1.0, 0.95, 0.88);
  vec3 color = mix(shadowColor, midColor, smoothstep(0.025, 0.46, presence));
  color = mix(color, highlightColor, smoothstep(0.66, 0.98, detail));
  vec3 interactionTint = mix(vec3(1.0, 0.48, 0.78), highlightColor, softCore * 0.35);
  float sparkle = influence * (0.45 + 0.55 * hash21(cell + floor(uTime * 10.0)));
  color = mix(color, interactionTint, sparkle * 0.18 * uInteractionStrength);
  color *= 1.0 + sparkle * 0.2 * uInteractionStrength;

  float backgroundPresence = mix(0.48, 1.0, smoothstep(0.0, 0.16, presence));
  float particleMask = dotMask * backgroundPresence;
  vec3 baseImage = pow(sampled, vec3(0.92)) * uBaseImageStrength;
  vec3 finalColor = mix(baseImage, color, particleMask);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function HeroParticleField({
  imageSrc,
  className = "",
  cellScale = 1,
  floatStrength = 1,
  interactionStrength = 1.35,
  baseImageStrength = 0.035,
  fps = 48,
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const interactionTarget = host?.parentElement;
    if (!host || !interactionTarget) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer;
    let animationFrame = 0;
    let resizeObserver;
    let disposed = false;
    let isVisible = !document.hidden;
    let pointerInside = false;
    let interaction = 0;
    let lastFrameTime = 0;
    const mouseTarget = new Vec2(0, 0);
    const mouseCurrent = new Vec2(0, 0);

    try {
      const mobile = window.matchMedia("(max-width: 820px)").matches;
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.18),
      });

      const gl = renderer.gl;
      gl.clearColor(0.008, 0.004, 0.01, 1);
      gl.canvas.setAttribute("aria-hidden", "true");
      host.appendChild(gl.canvas);

      const texture = new Texture(gl, {
        generateMipmaps: false,
        minFilter: gl.LINEAR,
        magFilter: gl.LINEAR,
      });
      const image = new Image();
      image.decoding = "async";
      image.fetchPriority = "high";
      image.src = imageSrc;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uImage: { value: texture },
          uResolution: { value: new Vec2(1, 1) },
          uImageSize: { value: new Vec2(1, 1) },
          uMouse: { value: mouseCurrent },
          uTime: { value: 0 },
          uInteraction: { value: 0 },
          uCellScale: { value: cellScale },
          uFloatStrength: { value: floatStrength },
          uInteractionStrength: { value: interactionStrength },
          uBaseImageStrength: { value: baseImageStrength },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        const width = host.clientWidth;
        const height = host.clientHeight;
        renderer.setSize(Math.max(1, width), Math.max(1, height));
        program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
        if (!mouseCurrent.x && !mouseCurrent.y) {
          mouseCurrent.set(gl.canvas.width * 0.5, gl.canvas.height * 0.5);
          mouseTarget.set(gl.canvas.width * 0.5, gl.canvas.height * 0.5);
        }
      };

      const setPointer = (event) => {
        const rect = interactionTarget.getBoundingClientRect();
        const scaleX = gl.canvas.width / Math.max(rect.width, 1);
        const scaleY = gl.canvas.height / Math.max(rect.height, 1);
        mouseTarget.set(
          (event.clientX - rect.left) * scaleX,
          (rect.bottom - event.clientY) * scaleY,
        );
        pointerInside = true;
      };

      const clearPointer = () => {
        pointerInside = false;
      };

      const startTime = performance.now();
      const render = (now) => {
        if (disposed) return;
        if (!isVisible) {
          animationFrame = 0;
          return;
        }
        const minFrameInterval = 1000 / Math.max(fps, 1);
        if (now - lastFrameTime < minFrameInterval) {
          animationFrame = requestAnimationFrame(render);
          return;
        }
        lastFrameTime = now;

        const motionEnabled = !reduceMotion.matches;
        const targetInteraction = pointerInside && motionEnabled ? 1 : 0;
        interaction += (targetInteraction - interaction) * 0.075;
        mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.12;
        mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.12;
        program.uniforms.uInteraction.value = interaction;
        program.uniforms.uTime.value = motionEnabled ? (now - startTime) / 1000 : 0;
        renderer.render({ scene: mesh });
        animationFrame = requestAnimationFrame(render);
      };

      const start = () => {
        if (!animationFrame && isVisible) {
          animationFrame = requestAnimationFrame(render);
        }
      };

      const onVisibilityChange = () => {
        isVisible = !document.hidden;
        if (!isVisible && animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          return;
        }
        start();
      };

      image.addEventListener("load", () => {
        if (disposed) return;
        texture.image = image;
        program.uniforms.uImageSize.value.set(image.naturalWidth, image.naturalHeight);
        host.classList.add("is-ready");
      });

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      interactionTarget.addEventListener("pointermove", setPointer, { passive: true });
      interactionTarget.addEventListener("pointerleave", clearPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibilityChange);
      resize();
      start();

      return () => {
        disposed = true;
        cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        interactionTarget.removeEventListener("pointermove", setPointer);
        interactionTarget.removeEventListener("pointerleave", clearPointer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      host.classList.add("hero-particle-fallback");
      return undefined;
    }
  }, [baseImageStrength, cellScale, floatStrength, fps, imageSrc, interactionStrength]);

  return <div className={`hero-particle-field ${className}`.trim()} ref={hostRef} aria-hidden="true" />;
}
