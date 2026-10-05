import React, { useEffect, useRef, useState } from "react";
import { FANKUN_MOTION_ROOT as ROOT, cardSpecs, makeRenderer, texture, draw, loadAtlas } from "./FankunMotionPages";
import FankunOpeningAnimation from "./FankunOpeningAnimation";
import "./FankunMotionGallery.css";

const phones = [
  { id: "opening", label: "开场页 · 好奇发现" },
  { id: "network", label: "找不到网络啦" },
  { id: "thinking", label: "正在思考吃什么" },
];

export default function FankunMotionGallery() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const canvasRef = useRef(null);
  const [cardsActive, setCardsActive] = useState(false);
  const [phonesActive, setPhonesActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const videos = [...section.querySelectorAll("video")];
    const observer = new IntersectionObserver(([entry]) => {
      setPhonesActive(entry.isIntersecting);
      videos.forEach((video) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { rootMargin: "200px" });
    observer.observe(section);
    return () => { observer.disconnect(); videos.forEach((video) => video.pause()); };
  }, []);

  useEffect(() => {
    const grid = cardsRef.current;
    const canvas = canvasRef.current;
    if (!grid || !canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let renderer;
    let atlases = [];
    let textures = [];
    let raf = 0;
    let visible = false;
    let disposed = false;
    let initializing = false;
    let ready = false;
    let presented = false;
    let epoch = performance.now();
    let rects = [];

    const resize = () => {
      if (!renderer) return;
      const width = grid.clientWidth;
      const height = grid.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      renderer.gl.viewport(0, 0, canvas.width, canvas.height);
      renderer.gl.useProgram(renderer.program);
      renderer.gl.uniform2f(renderer.pageUniform, width, height);
      rects = [...grid.querySelectorAll(".fankun-gallery-card")].map((card) => [card.offsetLeft, card.offsetTop, card.offsetWidth, card.offsetHeight]);
    };

    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const render = (now) => {
      raf = 0;
      if (disposed || !visible || document.hidden || !ready) return;
      try {
        const { gl } = renderer;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        cardSpecs.forEach((card, index) => {
          const elapsed = (now - epoch) % (card.duration + 600);
          const frame = Math.min(card.frames - 1, Math.floor(Math.min(elapsed, card.duration) / 50));
          const column = frame % 8;
          const row = Math.floor(frame / 8);
          draw(renderer, textures[index], rects[index], [column / 8, (7 - row) / 8, 1 / 8, 1 / 8]);
        });
        if (!presented) { presented = true; setCardsActive(true); }
        raf = requestAnimationFrame(render);
      } catch (error) {
        console.warn("饭困独立动效已切换到静态画面：", error);
        presented = false;
        setCardsActive(false);
        stop();
      }
    };
    const start = () => { if (ready && visible && !document.hidden && !raf) raf = requestAnimationFrame(render); };
    const init = async () => {
      if (initializing || ready || disposed) return;
      initializing = true;
      try {
        renderer = makeRenderer(canvas, [grid.clientWidth, grid.clientHeight]);
        resize();
        const maxTexture = renderer.gl.getParameter(renderer.gl.MAX_TEXTURE_SIZE);
        const atlasSize = Math.min(maxTexture, window.innerWidth <= 700 ? 2048 : 3072);
        atlases = await Promise.all(cardSpecs.map((card) => loadAtlas(`${ROOT}${card.id}-atlas.png`, atlasSize)));
        if (disposed) { atlases.forEach((item) => item.close?.()); return; }
        textures = atlases.map((atlas) => {
          const result = texture(renderer.gl);
          renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, result);
          renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, atlas);
          if (renderer.gl.getError() !== renderer.gl.NO_ERROR) throw new Error("WebGL texture upload failed");
          return result;
        });
        ready = true;
        epoch = performance.now();
        start();
      } catch (error) {
        console.warn("饭困独立动效使用静态画面：", error);
      } finally {
        initializing = false;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { if (ready) start(); else init(); }
      else stop();
    }, { rootMargin: "240px" });
    observer.observe(grid);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(grid);
    const visibilityChange = () => { if (document.hidden) stop(); else start(); };
    document.addEventListener("visibilitychange", visibilityChange);
    const contextLost = (event) => { event.preventDefault(); stop(); setCardsActive(false); };
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      observer.disconnect();
      sizeObserver.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      canvas.removeEventListener("webglcontextlost", contextLost);
      stop();
      if (renderer) {
        textures.forEach((item) => renderer.gl.deleteTexture(item));
        renderer.gl.deleteBuffer(renderer.buffer);
        renderer.gl.deleteProgram(renderer.program);
        renderer.gl.deleteShader(renderer.vs);
        renderer.gl.deleteShader(renderer.fs);
      }
      atlases.forEach((item) => item.close?.());
    };
  }, []);

  return (
    <section ref={sectionRef} className="fankun-motion-gallery" aria-label="饭困开场与六个过渡动效">
      <div className="fankun-gallery-phone-row">
        {phones.map((phone) => (
          <div className="fankun-gallery-phone" key={phone.id} aria-label={phone.label}>
            {phone.id === "opening"
              ? <FankunOpeningAnimation showChrome active={phonesActive} />
              : <video src={`${ROOT}${phone.id}.webm`} poster={`${ROOT}${phone.id}-poster.webp`} muted loop playsInline preload="metadata" aria-label={phone.label} />}
          </div>
        ))}
      </div>
      <div ref={cardsRef} className={`fankun-gallery-card-grid ${cardsActive ? "is-active" : ""}`}>
        {cardSpecs.map((card) => (
          <article key={card.id} className={`fankun-gallery-card fankun-gallery-card--${card.id}`}>
            <div className="fankun-gallery-card-copy"><strong>{card.title}</strong><span>{card.sub}</span><small>{card.en[0]}<br />{card.en[1]}</small></div>
            <img src={`${ROOT}${card.id}-still.png`} alt="" loading="lazy" />
          </article>
        ))}
        <canvas ref={canvasRef} className="fankun-gallery-card-canvas" aria-hidden="true" />
      </div>
    </section>
  );
}
