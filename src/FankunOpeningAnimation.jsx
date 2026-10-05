import React from "react";
import "./FankunOpeningAnimation.css";

const ROOT = "/assets/projects/fankun/motion/opening/";
const place = (x, y, w, h, baseW = 393, baseH = 852) => ({
  left: `${(x / baseW) * 100}%`,
  top: `${(y / baseH) * 100}%`,
  width: `${(w / baseW) * 100}%`,
  height: `${(h / baseH) * 100}%`,
});

const accents = [
  { id: "rice-one", kind: "rice", x: 35.5, y: 160.5, w: 53, h: 25, rotate: 27, delay: 0 },
  { id: "rice-two", kind: "rice", x: 88.5, y: 126, w: 45, h: 26, rotate: 52, delay: .015 },
  { id: "bead-one", kind: "bead", x: 93, y: 183, w: 28, h: 28, src: "bead-upper.svg", delay: .03 },
  { id: "star-one", kind: "star", x: 287.76, y: 193.31, w: 38.57, h: 38.57, src: "star-upper.svg", delay: .045 },
  { id: "bead-two", kind: "bead", x: 333, y: 186, w: 20, h: 20, src: "bead-logo.svg", delay: .06 },
  { id: "star-two", kind: "star", x: 37.42, y: 359.85, w: 31, h: 31, src: "star-lower.svg", delay: .075 },
  { id: "rice-three", kind: "rice", x: 21.5, y: 407.5, w: 31, h: 15, rotate: 42, delay: .09 },
  { id: "bead-three", kind: "bead", x: 50, y: 427, w: 26, h: 26, src: "bead-lower.svg", delay: .105 },
  { id: "lime-one", kind: "lime", x: 309, y: 362.5, w: 20, h: 49, rotate: 17, delay: .12 },
  { id: "lime-two", kind: "lime", x: 339, y: 391.5, w: 20, h: 49, rotate: 35, delay: .135 },
];

function Vector({ name, className = "", style }) {
  return <img className={className} style={style} src={`${ROOT}${name}.svg`} alt="" draggable="false" />;
}

export default function FankunOpeningAnimation({ showChrome = false, active = true, loop = true }) {
  return (
    <div className={`fko-opening ${active ? "is-playing" : "is-paused"} ${loop ? "is-looping" : "is-one-shot"}`} aria-hidden="true">
      <Vector name="background" className="fko-background" />
      <Vector name="ground-shadow" className="fko-ground-shadow" style={place(49, 600, 293, 27)} />
      <Vector name="wordmark" className="fko-wordmark" style={place(94.5, 229, 204, 89.83)} />
      <div className="fko-mascot" style={place(3, 302, 390, 390)}>
        <img className="fko-mascot-body" src={`${ROOT}mascot.png`} alt="" draggable="false" />
        <div className="fko-eye fko-eye--left" style={place(70.29, 218.64, 33.59, 46.03, 390, 390)}>
          <Vector name="eye-left-white" className="fko-eye-white" />
          <Vector name="eye-left-pupil" className="fko-pupil fko-pupil--left" style={place(5.91, 14, 16.79, 23.01, 33.59, 46.03)} />
        </div>
        <div className="fko-eye fko-eye--right" style={place(158.92, 230.14, 37.94, 46.03, 390, 390)}>
          <Vector name="eye-right-white" className="fko-eye-white" />
          <Vector name="eye-right-pupil" className="fko-pupil fko-pupil--right" style={place(8.09, 14, 16.79, 23.01, 37.94, 46.03)} />
        </div>
        <Vector name="brow-left" className="fko-brow fko-brow--left" style={place(68.78, 194.11, 36, 15, 390, 390)} />
        <Vector name="brow-right" className="fko-brow fko-brow--right" style={place(157.41, 205.62, 41, 15, 390, 390)} />
      </div>
      {accents.map((item) => (
        <span key={item.id} className={`fko-accent fko-accent--${item.kind}`} style={{ ...place(item.x, item.y, item.w, item.h), "--fko-rotation": `${item.rotate || 0}deg`, "--fko-delay": `${item.delay}s` }}>
          <span className="fko-accent-inner">
            {item.src ? <Vector name={item.src.replace(".svg", "")} /> : null}
          </span>
        </span>
      ))}
      <div className="fko-tagline" style={place(28, 650, 337, 36)}>吃什么？交给饭困。</div>
      {showChrome && <>
        <span className="fko-status"><b>9:41</b><i /><img src="/assets/projects/fankun/prototype/source/917-4058-signal.svg" alt="" /></span>
        <span className="fko-home-indicator" />
      </>}
    </div>
  );
}
