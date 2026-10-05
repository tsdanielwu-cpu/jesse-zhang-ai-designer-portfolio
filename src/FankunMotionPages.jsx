import React, { useEffect, useRef, useState } from "react";
import "./FankunMotionPages.css";

export const FANKUN_MOTION_ROOT = "/assets/projects/fankun/motion/";
const ROOT = FANKUN_MOTION_ROOT;
const PAGE = [2400, 1500];
const expressionNames = ["饭困", "坚定", "有点期待", "还在纠结", "开心得意", "一脸茫然"];
const expressionRects = [255, 787].flatMap((y) => [118, 868, 1618].map((x) => [x, y, 562, 466]));
// The approved expression files are ordered by character version, while the page reads row by row.
const expressionFiles = [1, 3, 2, 4, 5, 6];
const phoneRects = [[123, 344, 428, 918], [652, 344, 428, 918]];
export const cardSpecs = [
  { id: "create", title: "还没有饭局！", sub: "发起一个饭局，约大家出发吧！", en: ["There's no dinner party yet!", "Let's organize a dinner party and invite everyone to come!"], frame: [1110, 255, 588, 588], card: [1158, 319, 486, 420], frames: 49, duration: 2400 },
  { id: "selected", title: "就吃这个！", sub: "已按你的口味和预算选好。", en: ["Let's eat this!", "It has been selected according to your preferences and budget."], frame: [1707, 255, 588, 588], card: [1755, 319, 486, 420], frames: 49, duration: 2400 },
  { id: "no-results", title: "没有找到相关的结果！", sub: "换个关键词再试试吧！", en: ["No relevant results were found!", "Try using a different keyword instead!"], frame: [1135, 795, 588, 588], card: [1158, 852, 486, 420], frames: 61, duration: 3000 },
  { id: "saved", title: "偏好已保存！", sub: "接下来交给饭困。", en: ["Preference saved!", "Now it's time to hand over to the FANKUN."], frame: [1731, 796, 588, 588], card: [1755, 852, 486, 420], frames: 41, duration: 2000 },
];

const vertex = `
precision highp float;
attribute vec2 aPosition;
uniform vec2 uPage;
uniform vec4 uRect;
uniform vec4 uUv;
varying vec2 vLocal;
varying vec2 vTexture;
void main() {
  vLocal = aPosition;
  vec2 xy = (uRect.xy + aPosition * uRect.zw) / uPage;
  gl_Position = vec4(xy.x * 2.0 - 1.0, 1.0 - xy.y * 2.0, 0.0, 1.0);
  vTexture = uUv.xy + vec2(aPosition.x, 1.0 - aPosition.y) * uUv.zw;
}`;
const fragment = `
precision highp float;
uniform sampler2D uImage;
uniform float uKeyWhite;
uniform float uRadius;
uniform vec4 uRect;
varying vec2 vLocal;
varying vec2 vTexture;
void main() {
  vec4 color = texture2D(uImage, vTexture);
  if (uKeyWhite > 0.5) {
    float low = min(color.r, min(color.g, color.b));
    float high = max(color.r, max(color.g, color.b));
    float neutral = 1.0 - smoothstep(0.035, 0.14, high - low);
    float light = smoothstep(0.70, 0.91, low);
    color.a *= 1.0 - neutral * light;
  }
  if (uRadius > 0.0) {
    vec2 point = abs((vLocal - 0.5) * uRect.zw) - (uRect.zw * 0.5 - uRadius);
    float dist = length(max(point, 0.0)) + min(max(point.x, point.y), 0.0) - uRadius;
    color.a *= 1.0 - smoothstep(-1.5, 1.5, dist);
  }
  gl_FragColor = color;
}`;

function shader(gl, type, source) {
  const result = gl.createShader(type);
  gl.shaderSource(result, source);
  gl.compileShader(result);
  if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
  return result;
}

export function makeRenderer(canvas, pageSize = PAGE) {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
  if (!gl) throw new Error("WebGL unavailable");
  const program = gl.createProgram();
  const vs = shader(gl, gl.VERTEX_SHADER, vertex);
  const fs = shader(gl, gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const pageUniform = gl.getUniformLocation(program, "uPage");
  gl.uniform2f(pageUniform, ...pageSize);
  gl.uniform1i(gl.getUniformLocation(program, "uImage"), 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  return { gl, program, vs, fs, buffer, pageUniform, uniforms: Object.fromEntries(["uRect", "uUv", "uKeyWhite", "uRadius"].map((name) => [name, gl.getUniformLocation(program, name)])) };
}

export function texture(gl) {
  const result = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, result);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
  return result;
}

export function draw(renderer, source, rect, uv = [0, 0, 1, 1], keyWhite = false, radius = 0) {
  const { gl, uniforms } = renderer;
  gl.bindTexture(gl.TEXTURE_2D, source);
  gl.uniform4fv(uniforms.uRect, rect);
  gl.uniform4fv(uniforms.uUv, uv);
  gl.uniform1f(uniforms.uKeyWhite, keyWhite ? 1 : 0);
  gl.uniform1f(uniforms.uRadius, radius);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function loadVideo(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    video.addEventListener("loadeddata", () => resolve(video), { once: true });
    video.addEventListener("error", () => reject(new Error(`Video failed: ${url}`)), { once: true });
    video.src = url;
    video.load();
  });
}

export async function loadAtlas(url, size = 2048) {
  const img = new Image();
  img.src = url;
  await img.decode();
  // Smaller atlas textures keep the original page affordable; the standalone gallery requests more detail.
  if (typeof createImageBitmap === "function") {
    try { return await createImageBitmap(img, { imageOrientation: "flipY", resizeWidth: size, resizeHeight: size, resizeQuality: "high" }); }
    catch { /* use the full-resolution source below */ }
  }
  return img;
}

function percentRect(rect) {
  return { left: `${rect[0] / PAGE[0] * 100}%`, top: `${rect[1] / PAGE[1] * 100}%`, width: `${rect[2] / PAGE[0] * 100}%`, height: `${rect[3] / PAGE[1] * 100}%` };
}

export default function FankunMotionPage({ page }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const isExpression = page === 18;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return undefined;
    let disposed = false, visible = false, started = false, initializing = false, presented = false, raf = 0, renderer, observer;
    let resources = [];
    let epoch = performance.now();
    const resize = () => {
      if (!renderer) return;
      const width = Math.min(2400, Math.round(host.clientWidth * Math.min(devicePixelRatio || 1, 1.5)));
      canvas.width = width;
      canvas.height = Math.round(width * PAGE[1] / PAGE[0]);
      renderer.gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const render = (now) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const { gl } = renderer;
      try {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (isExpression) {
          resources.forEach((item, index) => {
            if (item.video.readyState >= 2) {
              gl.bindTexture(gl.TEXTURE_2D, item.texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, item.video);
            }
            draw(renderer, item.texture, expressionRects[index], [0, 0.17, 1, 0.83], true);
          });
        } else {
          resources.slice(0, 2).forEach((item, index) => {
            if (item.video.readyState >= 2) {
              gl.bindTexture(gl.TEXTURE_2D, item.texture);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, item.video);
            }
            draw(renderer, item.texture, phoneRects[index], [0, 0, 1, 1], false, 52);
          });
          cardSpecs.forEach((card, index) => {
            const time = (now - epoch) % (card.duration + 600);
            const frame = Math.min(card.frames - 1, Math.floor(Math.min(time, card.duration) / 50));
            const col = frame % 8, row = Math.floor(frame / 8);
            draw(renderer, resources[index + 2].texture, card.frame, [col / 8, (7 - row) / 8, 1 / 8, 1 / 8]);
          });
        }
        if (!presented) {
          presented = true;
          setActive(true);
        }
        raf = requestAnimationFrame(render);
      } catch (error) {
        console.warn("饭困动效渲染失败，恢复静态画面：", error);
        presented = false;
        setActive(false);
        stop();
      }
    };
    const start = () => {
      if (!started || disposed || !visible || document.hidden) return;
      resources.filter((item) => item.video).forEach((item) => item.video.play().catch(() => {}));
      if (!raf) raf = requestAnimationFrame(render);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      resources.filter((item) => item.video).forEach((item) => item.video.pause());
    };
    const init = async () => {
      if (initializing || started) return;
      initializing = true;
      try {
        renderer = makeRenderer(canvas);
        const { gl } = renderer;
        resize();
        const urls = isExpression
          ? expressionFiles.map((n) => `${ROOT}expression-${n}.webm`)
          : [`${ROOT}network.webm`, `${ROOT}thinking.webm`];
        const videos = await Promise.all(urls.map(loadVideo));
        const atlases = isExpression ? [] : await Promise.all(cardSpecs.map((card) => loadAtlas(`${ROOT}${card.id}-atlas.png`)));
        if (disposed) return;
        resources = [...videos.map((video) => ({ video, texture: texture(gl) })), ...atlases.map((atlas) => {
          const tex = texture(gl);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
          return { texture: tex, atlas };
        })];
        started = true;
        epoch = performance.now();
        start();
      } catch (error) {
        console.warn("饭困动效使用静态备份画面：", error);
      } finally {
        initializing = false;
      }
    };
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { if (!started) init(); else start(); }
      else stop();
    }, { rootMargin: "240px" });
    observer.observe(host);
    window.addEventListener("resize", resize);
    const onVisibilityChange = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      observer.disconnect();
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (renderer) {
        resources.forEach((item) => { renderer.gl.deleteTexture(item.texture); item.atlas?.close?.(); });
        renderer.gl.deleteBuffer(renderer.buffer);
        renderer.gl.deleteProgram(renderer.program);
        renderer.gl.deleteShader(renderer.vs);
        renderer.gl.deleteShader(renderer.fs);
      }
    };
  }, [isExpression]);

  return (
    <figure ref={hostRef} className={`fankun-motion-page ${isExpression ? "is-expressions" : "is-transitions"} ${active ? "is-active" : ""}`} aria-label={`饭困动效设计第 ${page} 页`}>
      <img src={`/assets/projects/fankun/page-${page}.webp`} alt={`饭困项目作品集第 ${page} 页`} loading="lazy" decoding="async" />
      {isExpression ? <div className="fankun-expression-covers" aria-hidden="true">{expressionNames.map((name, index) => <span key={name} style={percentRect([100 + index % 3 * 750, index < 3 ? 245 : 845, 600, index < 3 ? 475 : 405])} />)}</div> : (
        <div className="fankun-transition-covers" aria-hidden="true">
          {cardSpecs.map((card) => (
            <div key={card.id} className={`fankun-motion-card fankun-motion-card--${card.id}`} style={percentRect(card.card)}>
              <div className="fankun-motion-card-copy"><strong>{card.title}</strong><span>{card.sub}</span><small>{card.en[0]}<br />{card.en[1]}</small></div>
              <img src={`${ROOT}${card.id}-still.png`} alt="" className="fankun-motion-still" />
            </div>
          ))}
        </div>
      )}
      <canvas ref={canvasRef} className="fankun-motion-canvas" aria-hidden="true" />
    </figure>
  );
}
