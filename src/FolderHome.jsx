import React, { useEffect, useRef, useState } from "react";
import "./FolderHome.css";

const cardImages = {
  fankun: "/assets/projects/fankun/page-01.webp",
  "lora-makeup": "/assets/projects/lora/result-03b.webp",
  "flower-guangzhou": "/assets/projects/flower-guangzhou/flower-purple-wide.webp",
  "pixel-dwelling": "/assets/projects/pixel-dwelling/forest/forest-03.webp",
  "virtual-daike": "/assets/projects/virtual-daike/poster-main.webp",
};

const cardCategories = {
  fankun: "Product / UI UX",
  "lora-makeup": "AIGC / LoRA",
  "flower-guangzhou": "Visual / Motion",
  "pixel-dwelling": "Spatial / AIGC",
  "virtual-daike": "IP / Visual",
};

export default function FolderHome({ works, contacts, awards, onResume }) {
  const [activeId, setActiveId] = useState(null);
  const [spread, setSpread] = useState(false);
  const [pointerSpread, setPointerSpread] = useState(false);
  const [focusSpread, setFocusSpread] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const expanded = spread || pointerSpread || focusSpread;
  const active = works.find((work) => work.id === activeId);

  return (
    <main className="folder-home">
      <header className="folder-nav">
        <a href="#/" className="folder-wordmark" aria-label="张钊熙个人作品集首页">张钊熙<span>AI Designer & Visual Storyteller</span></a>
        <nav aria-label="首页导航">
          <button type="button" onClick={() => setBioOpen(true)}>关于我</button>
          <button type="button" onClick={onResume}>简历 <span aria-hidden="true">↗</span></button>
          <a href={`mailto:${contacts.email}`}>聊聊 <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="folder-stage" aria-label="个人简介与五个精选作品">
        <h1 className="folder-background-type"><span>The world</span><span>can wait</span></h1>

        <aside className={`folder-project-info${active ? " has-project" : ""}`} aria-live="polite" aria-atomic="true">
          {active ? (
            <div key={active.id} className="folder-info-content">
              <div className="folder-info-meta"><span>Selected work / {active.number}</span><time>{active.year}</time></div>
              <h2>{active.title}</h2>
              <p className="folder-info-subtitle">{active.subtitle}</p>
              <p className="folder-info-description">{active.intro}</p>
              <span className="folder-info-category">{active.category}</span>
              <span className="folder-info-open-hint">点击卡片，探索项目 <span aria-hidden="true">↗</span></span>
            </div>
          ) : (
            <div className="folder-info-content folder-info-idle">
              <span className="folder-info-meta">Selected works · 2026</span>
              <p>一些想法，<br />一些新的可能。</p>
              <span>把世界放慢一点，<br />打开我的创作文件夹。</span>
            </div>
          )}
        </aside>

        <div className={`folder-object${expanded ? " is-spread" : ""}${active ? " has-active" : ""}`}
          onPointerLeave={(event) => { if (event.pointerType !== "touch") { setPointerSpread(false); setActiveId(event.currentTarget.querySelector('.folder-work-card:focus-visible')?.dataset.workId || null); } }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocusSpread(false); if (!pointerSpread) setActiveId(null); } }}>
          <div className="folder-ground-shadow" aria-hidden="true" />
          <div className="folder-back" aria-hidden="true"><span>Ideas, in progress.</span></div>
          <div className="folder-card-stack">
            {works.map((work, index) => (
              <a key={work.id} href={`#/${work.id}`} data-work-id={work.id} className={`folder-work-card folder-card-${index}${activeId === work.id ? " is-active" : ""}`} aria-label={`查看作品：${work.title}`} onPointerEnter={(event) => { if (event.pointerType !== "touch" && window.matchMedia('(hover: hover) and (pointer: fine)').matches) { setPointerSpread(true); setActiveId(work.id); } }} onFocus={() => { setFocusSpread(true); setActiveId(work.id); }}>
                <div className="folder-card-meta"><span>{work.number}</span><time>{work.year}</time></div>
                <div className="folder-card-image"><img src={cardImages[work.id] || work.cover} alt={work.subtitle} decoding="async" draggable={false} /></div>
                <div className="folder-card-caption"><div><strong>{work.title}</strong><span>{cardCategories[work.id] || work.category}</span></div><span className="folder-card-arrow" aria-hidden="true">↗</span></div>
              </a>
            ))}
          </div>
          <div className="folder-front">
            <div className="folder-front-topline"><span>Personal file</span><span>05 projects inside</span></div>
            <div className="folder-person">
              <button className="folder-photo" type="button" onClick={() => setBioOpen(true)} aria-label="打开张钊熙个人简介"><img src="/assets/profile-candid.jpg" alt="张钊熙" /><span aria-hidden="true">✦</span></button>
              <div className="folder-person-copy"><h2>张钊熙</h2><p>AI 设计师 / AIGC 内容创作者</p><span>图像生成 / 视觉叙事 / 交互探索</span><div className="folder-profile-lines"><p>深圳大学 / 广州美术学院<br />环境设计本科 / 设计学硕士</p><p>研进组设计事务所<br />腾讯 PCG / AI 内容运营</p></div></div>
            </div>
            <div className="folder-front-bottom"><button type="button" className="folder-about-button" onClick={() => setBioOpen(true)}>个人简介 <span aria-hidden="true">↗</span></button><button type="button" className="folder-resume-button" onClick={onResume}>打开简历 <span aria-hidden="true">↗</span></button></div>
          </div>
          <span className="folder-sticker" aria-hidden="true">MAKE<br />IT REAL<span>✳</span></span>
        </div>

        <div className="folder-stage-controls"><span className="folder-hover-guidance">悬停展开作品，点击查看详情</span><span className="folder-touch-guidance">展开卡片，选择一个作品</span><button type="button" onClick={() => setSpread((value) => !value)} aria-expanded={expanded} aria-label={expanded ? "收起作品卡片" : "展开全部作品卡片"}>{expanded ? "收起卡片" : "展开全部"}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button></div>
      </section>

      <footer className="folder-home-footer"><span>© 2026 张钊熙</span><a href={`mailto:${contacts.email}`}>{contacts.email} <span aria-hidden="true">↗</span></a><span>保持好奇，慢慢创造。</span></footer>
      {bioOpen && <BiographyDialog contacts={contacts} awards={awards} onClose={() => setBioOpen(false)} onResume={() => { setBioOpen(false); onResume(); }} />}
    </main>
  );
}

function BiographyDialog({ contacts, awards, onClose, onResume }) {
  const dialogRef = useRef(null);
  useEffect(() => { dialogRef.current.showModal(); }, []);
  return (
    <dialog ref={dialogRef} className="folder-biography" aria-labelledby="biography-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <button className="folder-dialog-close" type="button" onClick={onClose} aria-label="关闭个人简介">×</button>
      <div className="folder-bio-heading"><img src="/assets/profile-candid.jpg" alt="张钊熙个人照片" /><div><span>你好，我是</span><h2 id="biography-title">张钊熙</h2><p>AI 设计师 / AIGC 内容创作者</p></div></div>
      <p className="folder-bio-intro">以 AI 图像生成、提示词系统、视觉叙事和网页呈现为主要方向，把概念设定、模型训练、图像实验和项目包装整理成可展示、可传播的设计成果。</p>
      <dl className="folder-bio-facts"><div><dt>教育经历</dt><dd>本科：深圳大学 — 环境设计<br />硕士：广州美术学院 — 设计学</dd></div><div><dt>工作经历</dt><dd>研进组设计事务所 — 设计师助理<br />腾讯 PCG — AI 内容运营</dd></div><div><dt>研究方向</dt><dd>AI 图像生成 / 视觉系统 / 模型训练</dd></div><div><dt>联系方式</dt><dd><a href={`tel:${contacts.phone.replaceAll(" ", "")}`}>{contacts.phone}</a><br /><a href={`mailto:${contacts.email}`}>{contacts.email}</a></dd></div></dl>
      <div className="folder-bio-skills"><h3>我的创作工具箱</h3><p>Stable Diffusion / ComfyUI / LoRA / Midjourney / 即梦 AI</p><p>Photoshop / Illustrator / InDesign / TouchDesigner</p><p>品牌视觉、海报物料、图像后期、动态图像、网页视觉与交互呈现</p></div>
      <details className="folder-bio-awards"><summary>证书与奖项 <span>+</span></summary>{awards.map((award) => <p key={`${award.year}-${award.title}`}><time>{award.year}</time><span>{award.title}{award.project && <small>{award.project}</small>}</span></p>)}</details>
      <button className="folder-bio-resume" type="button" onClick={onResume}>预览完整简历 <span aria-hidden="true">↗</span></button>
    </dialog>
  );
}
