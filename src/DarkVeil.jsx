import React, { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import "./DarkVeil.css";

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

uniform float uTime;
uniform vec2 uResolution;
uniform float uHueShift;
uniform float uNoiseIntensity;
uniform float uScanlineIntensity;
uniform float uScanlineFrequency;
uniform float uWarpAmount;
varying vec2 vUv;

vec3 hueRotate(vec3 color, float angle) {
  const vec3 axis = vec3(0.57735026919);
  float cosine = cos(angle);
  return color * cosine
    + cross(axis, color) * sin(angle)
    + axis * dot(axis, color) * (1.0 - cosine);
}

float hash21(vec2 point) {
  point = fract(point * vec2(123.34, 345.45));
  point += dot(point, point + 34.345);
  return fract(point.x * point.y);
}

float veil(vec2 point, float time) {
  float waveA = sin(point.x * 2.4 + time * 0.42);
  float waveB = sin(point.y * 3.1 - time * 0.31);
  float waveC = sin((point.x + point.y) * 2.0 + time * 0.2);
  float waveD = sin(length(point + vec2(sin(time * 0.13), cos(time * 0.16))) * 4.4 - time * 0.35);
  return (waveA + waveB + waveC + waveD) * 0.25;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
  vec2 point = (uv - 0.5) * aspect;

  float time = uTime;
  float baseVeil = veil(point * 1.15, time);
  point += vec2(
    sin(point.y * 3.0 + time * 0.22),
    cos(point.x * 2.6 - time * 0.18)
  ) * uWarpAmount * 0.08;

  float detail = veil(point * 2.25 + baseVeil * 0.16, time * 0.72);
  float bands = smoothstep(-0.72, 0.82, baseVeil * 0.72 + detail * 0.46);
  float glow = exp(-2.7 * abs(detail + baseVeil * 0.32));

  vec3 black = vec3(0.012, 0.003, 0.009);
  vec3 shadowPink = vec3(0.18, 0.025, 0.12);
  vec3 brandPink = vec3(0.890, 0.349, 0.655);
  vec3 color = mix(black, shadowPink, bands);
  color = mix(color, brandPink, glow * 0.56);

  float vignette = smoothstep(0.9, 0.18, length((uv - 0.5) * vec2(1.0, 0.82)));
  color *= 0.42 + vignette * 0.84;

  float scanline = sin(uv.y * uResolution.y / max(uScanlineFrequency, 1.0) * 6.28318530718);
  color *= 1.0 - (0.035 + 0.025 * scanline) * uScanlineIntensity;

  float noise = hash21(gl_FragCoord.xy + fract(time) * 91.7) - 0.5;
  color += noise * uNoiseIntensity * 0.08;
  color = max(color, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function DarkVeil({
  hueShift = -110,
  noiseIntensity = 0,
  scanlineIntensity = 1,
  speed = 0.5,
  scanlineFrequency = 24,
  warpAmount = 0,
  resolutionScale = 1,
  fps = 36,
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer;
    let animationFrame = 0;
    let isVisible = !document.hidden;
    let startTime = performance.now();
    let frozenTime = 0;
    let lastFrameTime = 0;

    try {
      const mobileScale = window.matchMedia("(max-width: 820px)").matches ? 0.68 : 1;
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.15) * resolutionScale * mobileScale,
      });

      const gl = renderer.gl;
      gl.clearColor(0.003, 0.004, 0.008, 1);
      gl.canvas.setAttribute("aria-hidden", "true");
      host.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Vec2(1, 1) },
          uHueShift: { value: hueShift },
          uNoiseIntensity: { value: noiseIntensity },
          uScanlineIntensity: { value: scanlineIntensity },
          uScanlineFrequency: { value: scanlineFrequency },
          uWarpAmount: { value: warpAmount },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
      };

      const render = (now) => {
        animationFrame = 0;
        if (!isVisible) return;
        const minFrameInterval = 1000 / Math.max(fps, 1);

        if (!reduceMotion.matches && now - lastFrameTime < minFrameInterval) {
          animationFrame = requestAnimationFrame(render);
          return;
        }
        lastFrameTime = now;

        if (!reduceMotion.matches) {
          program.uniforms.uTime.value = ((now - startTime) / 1000) * speed;
        } else {
          program.uniforms.uTime.value = frozenTime;
        }

        renderer.render({ scene: mesh });
        if (!reduceMotion.matches) animationFrame = requestAnimationFrame(render);
      };

      const start = () => {
        if (!animationFrame && isVisible) animationFrame = requestAnimationFrame(render);
      };

      const onVisibilityChange = () => {
        isVisible = !document.hidden;
        if (!isVisible && animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          return;
        }
        startTime = performance.now() - (program.uniforms.uTime.value / Math.max(speed, 0.001)) * 1000;
        start();
      };

      const onMotionChange = () => {
        frozenTime = program.uniforms.uTime.value;
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
        start();
      };

      resize();
      window.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibilityChange);
      reduceMotion.addEventListener("change", onMotionChange);
      start();

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibilityChange);
        reduceMotion.removeEventListener("change", onMotionChange);
        if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      host.classList.add("dark-veil-fallback");
      return undefined;
    }
  }, [
    fps,
    hueShift,
    noiseIntensity,
    resolutionScale,
    scanlineFrequency,
    scanlineIntensity,
    speed,
    warpAmount,
  ]);

  return <div className="dark-veil" ref={hostRef} aria-hidden="true" />;
}
