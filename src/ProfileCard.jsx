import React, { useCallback, useMemo, useRef } from "react";
import "./ProfileCard.css";

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin);
}

export default function ProfileCard({
  avatarUrl,
  miniAvatarUrl,
  name = "Jesse Zhang",
  title = "AI 设计师",
  handle = "jesse-ai-design",
  status = "Available for AIGC / Visual Design",
  contactText = "预览简历",
  onContactClick,
  innerGradient = "linear-gradient(145deg, rgba(231,43,34,.42) 0%, rgba(19,22,26,.86) 48%, rgba(0,0,0,.96) 100%)",
  behindGlowColor = "rgba(231,43,34,.72)",
  className = "",
}) {
  const wrapRef = useRef(null);

  const style = useMemo(
    () => ({
      "--pc-inner-gradient": innerGradient,
      "--pc-behind-glow-color": behindGlowColor,
    }),
    [behindGlowColor, innerGradient],
  );

  const setCardPosition = useCallback((event) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100);
    const rotateX = mapRange(y, 0, 100, 10, -10);
    const rotateY = mapRange(x, 0, 100, -12, 12);

    wrap.style.setProperty("--pc-pointer-x", `${x}%`);
    wrap.style.setProperty("--pc-pointer-y", `${y}%`);
    wrap.style.setProperty("--pc-rotate-x", `${rotateX.toFixed(2)}deg`);
    wrap.style.setProperty("--pc-rotate-y", `${rotateY.toFixed(2)}deg`);
    wrap.style.setProperty("--pc-card-opacity", "1");
  }, []);

  const resetCardPosition = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.setProperty("--pc-pointer-x", "50%");
    wrap.style.setProperty("--pc-pointer-y", "50%");
    wrap.style.setProperty("--pc-rotate-x", "0deg");
    wrap.style.setProperty("--pc-rotate-y", "0deg");
    wrap.style.setProperty("--pc-card-opacity", ".42");
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={style}
      onPointerMove={setCardPosition}
      onPointerLeave={resetCardPosition}
    >
      <div className="pc-behind" />
      <section className="pc-card">
        <div className="pc-shine" />
        <img className="pc-avatar" src={avatarUrl} alt={`${name} portrait`} />
        <div className="pc-top-copy">
          <span>AI DESIGNER</span>
        </div>
        <div className="pc-details">
          <h3>{name}</h3>
          <p>{title}</p>
        </div>
        <div className="pc-user-info">
          <div className="pc-user-details">
            <span className="pc-mini-avatar">
              <img src={miniAvatarUrl || avatarUrl} alt={`${name} avatar`} />
            </span>
            <span>
              <b>@{handle}</b>
              <small>{status}</small>
            </span>
          </div>
          <button className="pc-contact-btn" type="button" onClick={onContactClick}>
            {contactText}
          </button>
        </div>
      </section>
    </div>
  );
}
