import React, { useEffect, useRef, useState } from "react";
import { overlayIds, screenMap } from "./fankun/screenManifest";
import { figmaPrototypeGraph } from "./fankun/figmaPrototypeGraph";
import { carouselData } from "./fankun/carouselData";
import FankunOpeningAnimation from "./FankunOpeningAnimation";
import "./fankun/fankun.css";

const SPLASH = "brand-splash";
const START = "917:1421";
const NAV = [
  ["首页", "917:1482"], ["决策", "917:4058"],
  ["购物车", "917:3390"], ["我的", "917:3547"],
];
const NAV_SCREENS = new Set([
  "917:1482", "917:1587", "917:1634", "917:1679", "1149:4807",
  "917:1767", "917:1822", "917:2444", "917:2518", "917:2586",
  "917:2658", "917:2730", "917:2800", "917:3390", "917:3547", "917:4058",
  "917:3027", "917:3129", "917:3203", "917:4096", "917:4192", "917:4307", "917:4403",
]);
const HOME_NAV_SCREENS = new Set(["917:1482", "917:1587", "917:1634", "917:1679", "1149:4807", "917:1767", "917:1822"]);
const DECISION_SCREENS = new Set(["917:2444", "917:2518", "917:2586", "917:2658", "917:2730", "917:2800"]);
const FIXED_HEADER_SCREENS = new Set([...DECISION_SCREENS, "917:4096", "917:4307", "917:4403"]);
const TAKEAWAY_CATEGORIES = [
  ["中式正餐", "917:2444", "946-3542.svg"],
  ["粉面汤食", "917:2518", "947-3354.svg"],
  ["麻辣烧烤", "917:2586", "947-3395.svg"],
  ["轻食健康", "917:2730", "947-3435.svg"],
  ["西式快餐", "917:2658", "953-3679.svg"],
  ["异国风味", "917:2800", "953-3533.svg"],
];
const DINING_SCENES = [
  ["快速就餐", "917:4096", "953-3578.svg", "少走路 · 少等待"],
  ["舒适用餐", "917:4307", "953-3610.svg", "坐下完整吃一顿"],
  ["新鲜探索", "917:4403", "953-3643.svg", "尝试没吃过的"],
];
const VECTOR_ROOT = "/assets/projects/fankun/prototype/vectors/";
const STORE_TABS = [["招牌菜", "917:3027"], ["评价", "917:3129"], ["店铺信息", "917:3203"]];
const STORE_SCREENS = new Set(STORE_TABS.map(([, id]) => id));
const STORE_DISHES = [
  ["费大厨辣椒炒肉", "￥68", "128人推荐"],
  ["大王冰柠檬茶", "￥15", "168人推荐"],
  ["香酥大鲫鱼", "￥55", "46人推荐"],
  ["口味鸡爪", "￥49", "55人推荐"],
  ["皮蛋青椒擂茄子", "￥34", "46人推荐"],
  ["酸辣跳跳蛙", "￥68", "55人推荐"],
];
const DOCK_IMAGES = { home: "dock-home.png", decision: "dock-decision.png", cart: "dock-cart.png", profile: "dock-profile.png" };
const BATCH = ["917:1873", "917:1980", "917:2087", "917:2194"];
const WIDE_RAIL_IDS = new Set(["917:1980", "917:2087", "917:2194"]);
const RESULT_RAIL_IDS = new Set(["917:1873", "917:2872", "917:3275"]);
const RESULT_ACTION_IDS = new Set(["917:1873", "917:1980", "917:2087", "917:2194", "917:2872", "917:3275"]);
const RESULT_SCROLL_IDS = new Set(["917:1873", "917:1980", "917:2087", "917:2194", "917:2872"]);
const SOURCE_PHOTO_ROOT = "/assets/projects/fankun/prototype/source/";
const DETAIL_HEROES = {
  "917:2972": ["917-2972-hero.jpg", "wide"],
  "1164:5593": ["1164-5593-hero.jpg", "wide"],
  "1164:5676": ["1164-5676-hero.jpg", "square"],
  "917:3027": ["917-3027-hero.jpg", "store"],
  "917:3129": ["917-3027-hero.jpg", "store"],
  "917:3203": ["917-3027-hero.jpg", "store"],
};
const TRIMMED_SCREENS = new Set(["917:2972", "1164:5676", "1164:5593"]);
const CHROME_SCREENS = new Set(["917:1873", "917:1980", "917:2087", "917:2194", "917:2872", "917:2972", "1164:5676", "1164:5593", "917:3027", "917:3129", "917:3203", "917:4192"]);
const DINING_CATEGORIES = {
  "917:4096": { label: "快速就餐", image: "quick.png", x: 20 },
  "917:4307": { label: "舒适用餐", image: "comfort.png", x: 145 },
  "917:4403": { label: "新鲜探索", image: "explore.png", x: 270 },
};
const CATEGORY_IDS = { "快速就餐": "917:4096", "舒适用餐": "917:4307", "新鲜探索": "917:4403" };
const OVERLAYS = {
  "917:1510": [0, 0], "917:1584": [.061, .073],
  "917:4500": [0, .315], "917:4526": [.051, .129],
  "917:2422": [0, .117], "917:3269": [.725, .678],
  "917:4538": [0, null],
};
const EASING = {
  LINEAR: "linear", EASE_IN: "ease-in", EASE_OUT: "ease-out",
  EASE_IN_AND_OUT: "ease-in-out", QUICK: "ease-out",
  GENTLE: "ease-in-out", EASE_IN_BACK: "ease-in",
};

function spotsFor(id) {
  const map = new Map();
  for (const row of figmaPrototypeGraph[id] || []) {
    const [source, x, y, w, h, trigger, kind, target, transition, duration, curve, label] = row;
    if (!map.has(source)) map.set(source, { source, x, y, w, h, label, actions: [] });
    map.get(source).actions.push({ kind, target, transition, duration, curve });
  }
  if (["917:1482", "917:1587", "917:1634"].includes(id)) {
    map.set("menu", {
      source: "menu", x: .051, y: .073, w: .112, h: .052,
      label: "打开历史与个人抽屉",
      actions: [{ kind: "OVERLAY", target: "917:1510", transition: "DISSOLVE", duration: 300 }],
    });
  }
  if (id === "917:1634") {
    map.set("dine-in-ai", {
      source: "dine-in-ai", x: .051, y: .454, w: .898, h: .066,
      label: "AI 推荐到店餐厅",
      actions: [{ kind: "NAVIGATE", target: "917:1822", transition: "DISSOLVE", duration: 300 }],
    });
  }
  if (DECISION_SCREENS.has(id)) {
    map.set("decision-confirm", {
      source: "decision-confirm", x: .22, y: .829, w: .56, h: .058,
      label: "选好了",
      actions: [{ kind: "NAVIGATE", target: "917:2872", transition: "DISSOLVE", duration: 300 }],
    });
  }
  if (["917:1980", "917:2087", "917:2194"].includes(id)) {
    const resultLinks = [
      ["previous-dish", -.44, .26, .61, .22, "1164:5593", "上一道菜"],
      ["main-dish", .196, .26, .611, .22, "917:2972", "查看菜品详情"],
      ["next-dish", .832, .26, .611, .22, "1164:5676", "下一道菜"],
      ["store", .051, .55, .9, .06, "917:3203", "查看店铺"],
      ["reviews", .051, .65, .9, .06, "917:3129", "查看评价"],
    ];
    resultLinks.forEach(([source, x, y, w, h, target, label]) => map.set(source, {
      source, x, y, w, h, label,
      actions: [{ kind: "NAVIGATE", target, transition: "DISSOLVE", duration: 300 }],
    }));
  }
  if (STORE_SCREENS.has(id)) {
    STORE_TABS.forEach(([label, target], index) => map.set(`store-tab-${target}`, {
      source: `store-tab-${target}`,
      x: [0.115, 0.383, 0.635][index], y: 445 / screenMap[id].height,
      w: [0.205, 0.18, 0.253][index], h: 43 / screenMap[id].height,
      label,
      actions: [{ kind: "NAVIGATE", target, transition: "DISSOLVE", duration: 220 }],
    }));
  }
  return [...map.values()].filter((s) => s.y < 1 && s.x + s.w > 0 && s.y + s.h > 0);
}

function useDragScroll(key, initialOffset = 0) {
  const rail = useRef(null);
  const drag = useRef({ active: false, moving: false, suppressClick: false, x: 0, scroll: 0 });

  useEffect(() => {
    if (rail.current) rail.current.scrollLeft = rail.current.clientWidth * initialOffset;
  }, [key, initialOffset]);

  return {
    ref: rail,
    onPointerDown: (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag.current = { active: true, moving: false, suppressClick: false, x: event.clientX, scroll: rail.current.scrollLeft };
    },
    onPointerMove: (event) => {
      if (!drag.current.active || event.pointerType !== "mouse") return;
      const distance = event.clientX - drag.current.x;
      if (!drag.current.moving && Math.abs(distance) > 5) {
        drag.current.moving = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      if (drag.current.moving) {
        rail.current.scrollLeft = drag.current.scroll - distance;
        event.preventDefault();
      }
    },
    onPointerUp: (event) => {
      if (!drag.current.active) return;
      drag.current.active = false;
      if (drag.current.moving) {
        drag.current.suppressClick = true;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        window.setTimeout(() => { drag.current.suppressClick = false; }, 0);
      }
    },
    onPointerCancel: () => { drag.current.active = false; },
    onClickCapture: (event) => {
      if (!drag.current.suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      drag.current.suppressClick = false;
    },
  };
}

function CardRail({ screen, spots, activate, selected }) {
  const data = carouselData[screen.id];
  const drag = useDragScroll(screen.id);
  const cardSpots = spots.filter((spot) => Math.abs(spot.y - data.top) < .025 && spot.w > .6)
    .sort((a, b) => a.x - b.x);

  return (
    <div className="fkx-card-rail" aria-label="横向浏览餐品类别"
      style={{ top: (data.top * 100) + "%", height: ((data.height * screen.height + 10) / screen.height * 100) + "%", gap: (data.gap / screen.width * 100) + "cqw" }}
      {...drag}>
      {data.cards.map((card, index) => {
        const spot = cardSpots[index];
        return (
          <button type="button" key={card.image}
            className={"fkx-card-rail-item" + (spot && selected.has(spot.source) ? " is-selected" : "")}
            aria-label={card.title} aria-pressed={spot?.actions.some((action) => action.kind === "CHANGE_TO") ? selected.has(spot.source) : undefined}
            onClick={() => spot && activate(spot)}>
            <img src={card.image} alt="" loading="lazy" draggable="false" />
            <span className="fkx-card-rail-copy">
              <strong>{card.title}</strong>
              <span><span>{card.description}</span><span>{card.detail}</span></span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CategoryRail({ screen, activate }) {
  const takeaway = DECISION_SCREENS.has(screen.id);
  const categories = takeaway ? TAKEAWAY_CATEGORIES : DINING_SCENES;
  const currentIndex = categories.findIndex(([, id]) => id === screen.id);
  const drag = useDragScroll(screen.id, takeaway ? Math.max(0, currentIndex - 2) * 91 / 393 : 0);
  return (
    <div className={"fkx-category-rail" + (takeaway ? " is-takeaway" : " is-dining")}
      style={{ top: ((takeaway ? 256 : 276) / screen.height * 100) + "%" }}
      aria-label={takeaway ? "外卖餐食分类，横向滚动查看更多" : "到店用餐情境"}
      {...drag}>
      {categories.map(([label, id, icon, description]) => (
        <button type="button" key={id} className={"fkx-category-card" + (id === screen.id ? " is-current" : "")}
          aria-label={label} aria-current={id === screen.id ? "page" : undefined}
          onClick={() => id !== screen.id && activate({ source: id, label, actions: [{ kind: "NAVIGATE", target: id, transition: "SMART_ANIMATE", duration: 300 }] })}>
          <img src={VECTOR_ROOT + icon} alt="" draggable="false" />
          <strong>{label}</strong>
          {description && <small>{description}</small>}
        </button>
      ))}
    </div>
  );
}

function PreferenceRail({ screen, spots, selected, activate }) {
  const chips = spots.filter((spot) => spot.y > .75 && spot.y < .79 && spot.h < .05 && spot.label);
  const drag = useDragScroll(screen.id);
  return (
    <div className="fkx-preferences" style={{ top: (621 / screen.height * 100) + "%" }}>
      <div className="fkx-preference-heading"><strong>用餐偏好</strong><span>可选</span><span>添加偏好</span></div>
      <div className="fkx-preference-rail" {...drag} aria-label="用餐偏好，横向滚动查看更多">
        {chips.map((spot) => (
          <button type="button" key={spot.source} className={selected.has(spot.source) ? "is-selected" : ""}
            aria-pressed={selected.has(spot.source)} onClick={() => activate(spot)}>{spot.label}</button>
        ))}
      </div>
    </div>
  );
}

function StoreDishGrid({ screen }) {
  return (
    <div className="fkx-store-dish-grid" aria-label="招牌菜"
      style={{ top: (502 / screen.height * 100) + "%" }}>
      {STORE_DISHES.map(([title, price, recommendation], index) => {
        return <div className="fkx-store-dish" key={title}>
          <div className="fkx-store-dish-photo">
            <img className="fkx-store-dish-source" src={SOURCE_PHOTO_ROOT + `917-3027-imgFrame${372 + index}.jpg`}
              alt="" draggable="false" loading="lazy" />
          </div>
          <div className="fkx-store-dish-copy">
            <div><strong>{title}</strong><strong>{price}</strong></div>
            <span>{recommendation}</span>
          </div>
        </div>;
      })}
    </div>
  );
}

const GROUP_STORES = [
  [50, "费大厨小炒肉", "川湘菜 · 人均 ¥68", "1.1 km · 当前不等位", "4.8", 20, 267, 232, "917:3599"],
  [57, "广沁麒麟阁", "粤菜 · 人均 ¥74", "0.8 km · 等位约10分钟", "4.4", 202, 267, 200, "917:3688"],
  [51, "JAN·Dining&Wine", "西式餐厅 · 人均 ¥78", "0.9 km · 当前不等位", "4.5", 202, 547, 232, "917:3860"],
  [54, "怂火锅厂", "火锅 · 人均 ¥89", "1.3 km · 当前不等位", "4.7", 20, 579, 232, "917:3688"],
  [52, "万岁寿司", "异国料理 · 人均 ¥79", "1.6 km · 当前不等位", "4.6", 202, 859, 232, "917:3946"],
  [55, "泰咀刁·泰国料理", "泰国料理 · 人均 ¥109", "2 km · 等位约5分钟", "4.5", 20, 891, 232, "917:3688"],
  [53, "椰宴·椰子鸡火锅", "火锅烧烤 · 人均 ¥76", "1.1 km · 等位约10分钟", "4.8", 202, 1171, 232, "917:3688"],
  [56, "小荔园·广州名菜", "粤菜 · 人均 ¥77", "0.7 km · 当前不等位", "4.5", 20, 1203, 232, "917:3688"],
];

function GroupStoreGrid({ activate }) {
  return <div className="fkx-group-store-grid" aria-label="可滚动浏览全部店铺">
    {GROUP_STORES.map(([number, title, category, distance, rating, x, y, photoHeight, target]) =>
      <button type="button" key={number} className="fkx-group-store"
        style={{ left: (x / 393 * 100) + "%", top: (y / 393 * 100) + "cqw" }}
        onClick={() => activate({ source: `group-store-${number}`, label: title, actions: [{ kind: "NAVIGATE", target, transition: "DISSOLVE", duration: 300 }] })}>
        <img src={SOURCE_PHOTO_ROOT + `917-4192-imgRectangle${number}.jpg`}
          alt="" draggable="false" loading="lazy" style={{ height: (photoHeight / 393 * 100) + "cqw" }} />
        <span className="fkx-group-store-copy"><span><strong>{title}</strong><b>☆ {rating}</b></span><small>{category}</small><small>{distance}</small></span>
      </button>)}
  </div>;
}

const SIX_CATEGORIES = [
  ["粉面汤饭", "汤粉、米线、馄饨、粥汤", "947-3354.svg", "917:1767"],
  ["中式正餐", "蒸菜、炖菜、家常饭", "946-3542.svg", "917:2444"],
  ["轻食健康", "低脂套餐、营养饭、暖沙拉", "947-3435.svg", "917:2730"],
  ["麻辣烧烤", "麻辣烫、川湘火锅、烧烤", "947-3395.svg", "917:2586"],
  ["西式快餐", "汉堡炸鸡、披萨意面", "953-3679.svg", "917:2658"],
  ["异国风味", "寿司、韩式烤肉、东南亚菜系", "953-3533.svg", "917:2800"],
];

function SixCategoryList({ activate }) {
  return <div className="fkx-six-categories" aria-label="全部六类餐食">
    {SIX_CATEGORIES.map(([title, description, icon, target]) =>
      <button type="button" key={title} className="fkx-six-category"
        onClick={() => activate({ source: `six-${target}`, label: title, actions: [{ kind: "NAVIGATE", target, transition: "DISSOLVE", duration: 300 }] })}>
        <img src={VECTOR_ROOT + icon} alt="" draggable="false" />
        <span><strong>{title}</strong><small>{description}</small></span>
      </button>)}
    <div className="fkx-six-actions">
      <button type="button" onClick={() => activate({ source: "six-collapse", actions: [{ kind: "NAVIGATE", target: "917:1679", transition: "DISSOLVE", duration: 300 }] })}>收起</button>
      <button type="button" onClick={() => activate({ source: "six-confirm", actions: [{ kind: "NAVIGATE", target: "917:1873", transition: "DISSOLVE", duration: 300 }] })}>都可以，直接推荐</button>
    </div>
  </div>;
}

function DiningConditions({ screen }) {
  const [distance, setDistance] = useState(3);
  const [budget, setBudget] = useState(1);
  const [queue, setQueue] = useState(1);
  useEffect(() => { setDistance(3); setBudget(1); setQueue(1); }, [screen.id]);
  const choiceRow = (title, values, current, choose) => (
    <div className="fkx-condition-row"><div className="fkx-condition-label">{title}</div>
      <div className="fkx-condition-options">{values.map((value, index) =>
        <button key={value} type="button" className={current === index ? "is-selected" : ""}
          aria-pressed={current === index} onClick={() => choose(index)}>{value}</button>)}</div>
    </div>
  );
  return (
    <section className="fkx-dining-conditions" style={{ top: (630 / screen.height * 100) + "%" }}>
      <div className="fkx-conditions-heading"><strong>补充条件</strong><span>可选</span></div>
      <div className="fkx-condition-row">
        <div className="fkx-condition-label">距离 <b>{distance.toFixed(1)} km</b></div>
        <input aria-label="距离" type="range" min="0.5" max="5" step="0.5" value={distance}
          style={{ "--fkx-progress": ((distance - .5) / 4.5 * 100) + "%" }}
          onChange={(event) => setDistance(Number(event.target.value))} />
        <div className="fkx-range-labels"><span>500 m</span><span>3 km</span><span>不限</span></div>
      </div>
      {choiceRow("人均", ["¥50内", "¥50–100", "¥100–200", "不限"], budget, setBudget)}
      {choiceRow("排队接受度", ["15分钟内", "30分钟内", "1小时内", "不限"], queue, setQueue)}
    </section>
  );
}

function StatusChrome() {
  return <div className="fkx-native-status" aria-hidden="true">
    <span>9:41</span><i />
    <img className="fkx-status-icons" src={SOURCE_PHOTO_ROOT + "917-4058-signal.svg"} alt="" />
  </div>;
}

function FixedHeader({ back, navigate }) {
  return (
    <div className="fkx-fixed-header">
      <StatusChrome />
      <button type="button" className="fkx-header-back" aria-label="返回" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 4-8 8 8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="fkx-header-location"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/></svg><div><small>配送地点</small><strong>海珠区，广州美术学院 ﹀</strong></div></div>
      <button className="fkx-header-avatar" type="button" aria-label="个人中心" onClick={() => navigate("917:3547")} />
      <strong className="fkx-header-title">今天想吃什么？</strong>
      <div className="fkx-header-search" aria-label="搜索餐食"><span aria-hidden="true">⌕</span>有想好的方向？试试直接搜索</div>
    </div>
  );
}

function FixedScreenChrome({ screen, back, activate, selected }) {
  const like = spotsFor(screen.id).find((spot) => spot.label === "like");
  if (DETAIL_HEROES[screen.id]) {
    return <div className="fkx-screen-chrome is-transparent">
      <StatusChrome />
      <button type="button" aria-label="返回" className="fkx-chrome-back" onClick={back}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 4-8 8 8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {like && <button type="button" aria-label="收藏" aria-pressed={selected.has(like.source)}
        className={"fkx-chrome-like" + (selected.has(like.source) ? " is-liked" : "")} onClick={() => activate(like)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 8.2c0 4.2-4.8 8.3-8.5 11-3.7-2.7-8.5-6.8-8.5-11a4.6 4.6 0 0 1 8.5-2.4 4.6 4.6 0 0 1 8.5 2.4Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" /></svg>
      </button>}
    </div>;
  }
  return <div className="fkx-screen-chrome">
    <img src={screen.image} alt="" draggable="false" style={{ width: (screen.imageWidth / screen.width * 100) + "%", left: ((screen.width - screen.imageWidth) / 2 / screen.width * 100) + "%" }} />
    <button type="button" aria-label="返回" className="fkx-chrome-back" onClick={back} />
    {like && <button type="button" aria-label="收藏" className="fkx-chrome-like" onClick={() => activate(like)} />}
  </div>;
}

function WideImageRail({ screen, spots, activate }) {
  const top = .245;
  const height = .232;
  const canvasOffset = (screen.imageWidth - screen.width) / 2;
  const drag = useDragScroll(screen.id, canvasOffset / screen.width);
  const cards = spots.filter((spot) => spot.y >= top && spot.y < top + height && spot.w > .4)
    .sort((a, b) => a.x - b.x);

  return (
    <div className="fkx-wide-rail" aria-label="横向浏览推荐餐品"
      style={{ top: (top * 100) + "%", height: (height * 100) + "%" }} {...drag}>
      <div className="fkx-wide-rail-canvas" style={{ width: (screen.imageWidth / screen.width * 100) + "%" }}>
        <img src={screen.image} alt="" draggable="false"
          style={{ top: -(top * screen.height / screen.width * 100) + "cqw" }} />
        {cards.map((spot) => (
          <button type="button" key={spot.source} aria-label={spot.label}
            style={{
              left: ((spot.x * screen.width + canvasOffset) / screen.imageWidth * 100) + "%",
              top: ((spot.y - top) / height * 100) + "%",
              width: (spot.w * screen.width / screen.imageWidth * 100) + "%",
              height: (spot.h / height * 100) + "%",
            }}
            onClick={() => activate(spot)} />
        ))}
      </div>
    </div>
  );
}

function ResultRail({ screen, spots, activate }) {
  const dining = screen.id === "917:3275";
  const drag = useDragScroll(screen.id, 193 / 393);
  const cards = dining ? [
    ["紫金食坊", "917:3027", "917-3275-imgRectangle23.jpg", "人均¥50"],
    ["禾味小馆", "917:3027", "917-3275-imgRectangle24.jpg", "人均¥68"],
    ["费大厨小炒肉", "917:3027", "917-3275-imgRectangle25.jpg", "人均¥70"],
  ] : [
    ["炸酱面", "1164:5593", "917-1873-imgRectangle23.jpg"],
    ["番茄牛肉米线", "917:2972", "917-1873-imgRectangle24.jpg"],
    ["番茄鸡蛋手工面", "1164:5676", "917-1873-imgRectangle25.jpg"],
  ];
  return <div className="fkx-result-rail" style={{ top: ((screen.id === "917:1873" ? 248 : screen.id === "917:2872" ? 228 : 230) / screen.height * 100) + "%" }}
    aria-label="横向浏览推荐菜品" {...drag}>
    {cards.map(([title, target, imageName, detail], index) => <button key={index} type="button" className={"fkx-result-card" + (dining ? " is-store" : "")}
      onClick={() => activate({ source: target, label: title, actions: [{ kind: "NAVIGATE", target, transition: "DISSOLVE", duration: 300 }] })}>
      <img className="fkx-result-photo" src={SOURCE_PHOTO_ROOT + imageName} alt="" draggable="false" />
      {dining ? <div className="fkx-result-copy"><span><strong>{title}</strong><small>☆ 4.8</small></span><small>中式正餐 · 步行8分钟 · 无需等位</small><small>{detail}</small></div>
        : <div className="fkx-result-copy"><strong>{title}</strong><span><b>￥28</b><small>遇见小面　30分钟</small></span></div>}
    </button>)}
  </div>;
}

function ShopPhotoRail({ screen }) {
  const drag = useDragScroll(screen.id);
  return <div className="fkx-shop-photo-rail" style={{ top: ((screen.id === "917:2872" ? 683 : 707) / screen.height * 100) + "%" }}
    aria-label="横向浏览店铺照片" {...drag}>
    {[27, 26, 28, 29].map((number) => <img key={number} className="fkx-shop-photo"
      src={SOURCE_PHOTO_ROOT + `917-1873-imgRectangle${number}.jpg`} alt="" draggable="false" />)}
  </div>;
}

function ResultActions({ screen, activate, navigate, selected }) {
  const refresh = spotsFor(screen.id).find((spot) => spot.label === "ChangeBatchButton");
  return <div className="fkx-result-actions">
    <button type="button" className={"fkx-result-refresh" + (refresh && selected.has(refresh.source) ? " is-selected" : "")}
      aria-pressed={refresh ? selected.has(refresh.source) : false} onClick={() => refresh && activate(refresh)}>
      <img src={SOURCE_PHOTO_ROOT + "971-3480-refresh.svg"} alt="" aria-hidden="true" />换一批
    </button>
    <button type="button" className="fkx-result-confirm"
      onClick={() => navigate(screen.id === "917:3275" ? "917:3027" : "917:2972", { transition: "SMART_ANIMATE", duration: 300 })}>选好了</button>
  </div>;
}

function TasteChips({ spots, selected, activate }) {
  return <div className="fkx-taste-chips">
    {spots.filter((spot) => spot.actions.some((action) => action.kind === "CHANGE_TO")).map((spot) =>
      <button type="button" key={spot.source} className={selected.has(spot.source) ? "is-selected" : ""}
        aria-pressed={selected.has(spot.source)} style={{ left: (spot.x * 100) + "%", top: (spot.y * 100) + "%", width: (spot.w * 100) + "%", height: (spot.h * 100) + "%" }}
        onClick={() => activate(spot)}>{spot.label === "汤面" && spot.y > .4 ? "常温" : spot.label}</button>)}
  </div>;
}

function Art({ screen, activate, selected, categoryActive, video = false }) {
  const spots = spotsFor(screen.id);
  const diningCategory = DINING_CATEGORIES[screen.id];
  const hero = DETAIL_HEROES[screen.id];
  return (
    <div className={"fkx-art" + (screen.id === "917:4192" ? " is-group-list" : "") + (screen.id === "917:4058" ? " is-decision-entry" : "")} style={{ aspectRatio: screen.width + " / " + screen.height }}>
      {hero && <div className="fkx-detail-hero-patch"><img className={"is-" + hero[1]}
        src={SOURCE_PHOTO_ROOT + hero[0]} alt="" draggable="false" /></div>}
      <img src={screen.image} alt="" draggable="false" className={"fkx-screen-image" + (CHROME_SCREENS.has(screen.id) ? " is-chrome-masked" : "") + (NAV_SCREENS.has(screen.id) && screen.height === 852 ? " is-footer-masked" : "") + (screen.id === "917:4192" ? " is-group-masked" : "") + (screen.id === "1149:4807" ? " is-six-masked" : "")}
        style={{
          width: (screen.imageWidth / screen.width * 100) + "%",
          left: ((screen.width - screen.imageWidth) / 2 / screen.width * 100) + "%",
          "--fkx-chrome-mask": (106 / screen.height * 100) + "%",
        }} />
      {screen.id === "917:3129" && (
        <div className="fkx-review-continuation" aria-label="用户02的评价">
          <div className="fkx-review-heading">
            <span className="fkx-review-avatar" aria-hidden="true" />
            <span className="fkx-review-user"><strong>用户02</strong><small>到店 · 7月25日</small></span>
            <span className="fkx-review-stars" aria-label="五星评价">★★★★★</span>
          </div>
          <p>辣椒炒肉很下饭，肉片鲜嫩，店里环境整洁，<br />周末中午到店也没有等位。</p>
          <div className="fkx-review-photos" aria-label="评价照片">
            {[34, 94, 154].map((x) => <span key={x}><img src={screen.image} alt="" draggable="false"
              style={{ left: (-x / screen.width * 100) + "cqw", top: (-719 / screen.width * 100) + "cqw" }} /></span>)}
          </div>
        </div>
      )}
      {diningCategory && categoryActive !== screen.id && (
        <img className="fkx-category-neutral" draggable="false" alt=""
          src={`/assets/projects/fankun/prototype/cards/${diningCategory.image}`}
          style={{ left: (diningCategory.x / screen.width * 100) + "%", top: (276 / screen.height * 100) + "%", width: (104 / screen.width * 100) + "%" }} />
      )}
      {video && (
        <video className="fkx-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/assets/projects/fankun/prototype/welcome-mascot.webm" type="video/webm" />
        </video>
      )}
      {spots.filter((spot) => spot.x < 1 && spot.y < 1
        && !(FIXED_HEADER_SCREENS.has(screen.id) && spot.y < .43)
        && !(DECISION_SCREENS.has(screen.id) && spot.y > .75 && spot.y < .79 && spot.h < .05)
        && !(screen.id === "1274:5125" && spot.actions.some((action) => action.kind === "CHANGE_TO"))
      ).map((spot) => (
        <button type="button" key={spot.source} data-source-node={spot.source}
          className={"fkx-hotspot" + (CATEGORY_IDS[spot.label] ? " fkx-hotspot--category" : "")
            + (spot.label === "ChangeBatchButton" ? " fkx-hotspot--refresh" : "")
            + (spot.label === "like" ? " fkx-hotspot--like" : "")
            + (screen.id === "1274:5125" && spot.actions.some((action) => action.kind === "CHANGE_TO") ? " fkx-hotspot--taste" : "")
            + (selected.has(spot.source) && !CATEGORY_IDS[spot.label] ? " is-selected" : "")}
          aria-label={spot.label || "打开"}
          aria-pressed={CATEGORY_IDS[spot.label] ? categoryActive === CATEGORY_IDS[spot.label] : spot.actions.some((a) => a.kind === "CHANGE_TO") ? selected.has(spot.source) : undefined}
          style={{
            left: (Math.max(0, spot.x) * 100) + "%",
            top: (Math.max(0, spot.y) * 100) + "%",
            width: (Math.max(0, Math.min(1 - Math.max(0, spot.x), spot.w + Math.min(0, spot.x))) * 100) + "%",
            height: (Math.max(0, Math.min(1 - Math.max(0, spot.y), spot.h + Math.min(0, spot.y))) * 100) + "%",
            "--fkx-component-duration": (spot.actions.find((a) => a.kind === "CHANGE_TO")?.duration || 300) + "ms",
          }}
          onClick={() => activate(spot)}
        />
      ))}
      {carouselData[screen.id] && <CardRail screen={screen} spots={spots} activate={activate} selected={selected} />}
      {FIXED_HEADER_SCREENS.has(screen.id) && <CategoryRail screen={screen} activate={activate} />}
      {DECISION_SCREENS.has(screen.id) && <PreferenceRail screen={screen} spots={spots} selected={selected} activate={activate} />}
      {DINING_CATEGORIES[screen.id] && <DiningConditions screen={screen} />}
      {screen.id === "917:3027" && <StoreDishGrid screen={screen} />}
      {screen.id === "917:4192" && <GroupStoreGrid activate={activate} />}
      {screen.id === "1149:4807" && <SixCategoryList activate={activate} />}
      {WIDE_RAIL_IDS.has(screen.id) && <WideImageRail screen={screen} spots={spots} activate={activate} />}
      {RESULT_RAIL_IDS.has(screen.id) && <ResultRail screen={screen} spots={spots} activate={activate} />}
      {["917:1873", "917:2872"].includes(screen.id) && <ShopPhotoRail screen={screen} />}
      {screen.id === "1274:5125" && <TasteChips spots={spots} selected={selected} activate={activate} />}
    </div>
  );
}

function SplashScreen({ onEnter }) {
  return (
    <button type="button" className="fkx-splash" onClick={onEnter}
      aria-label="进入饭困，前往欢迎页">
      <FankunOpeningAnimation loop={false} />
      <span className="fkx-native-status" aria-hidden="true">
        <span>9:41</span><i />
        <img className="fkx-status-icons" src={SOURCE_PHOTO_ROOT + "917-4058-signal.svg"} alt="" />
      </span>
      <span className="fkx-splash-home-indicator" aria-hidden="true" />
    </button>
  );
}

export default function FankunPrototype() {
  const [currentId, setCurrentId] = useState(SPLASH);
  const [history, setHistory] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [categoryActive, setCategoryActive] = useState(null);
  const [motion, setMotion] = useState(null);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [phoneScrollY, setPhoneScrollY] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const viewport = useRef(null);
  const stage = useRef(null);
  const navigationTimer = useRef(null);
  const current = screenMap[currentId] || screenMap[START];
  const isSplash = currentId === SPLASH;
  const overlay = overlays.length ? screenMap[overlays.at(-1).id] : null;
  const showDock = NAV_SCREENS.has(currentId) && !overlay;
  const dockTheme = currentId === "917:3390" || currentId === "917:3496" ? "cart"
    : currentId === "917:3547" ? "profile"
      : HOME_NAV_SCREENS.has(currentId) ? "home" : "decision";

  useEffect(() => { if (viewport.current) viewport.current.scrollTop = 0; setPhoneScrollY(0); }, [currentId]);
  useEffect(() => () => window.clearTimeout(navigationTimer.current), []);
  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);
  useEffect(() => {
    if (!isSplash || !focused || !pageVisible) return undefined;
    const timer = window.setTimeout(() => navigate(START, { transition: "DISSOLVE", duration: 450 }), 2800);
    return () => window.clearTimeout(timer);
  }, [isSplash, focused, pageVisible]);
  useEffect(() => {
    setSelected(new Set());
  }, [currentId]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setFocused(entry.intersectionRatio >= .35);
    }, { threshold: [0, .35, .65], rootMargin: "-5% 0px -5% 0px" });
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setQuantity(2); }, [currentId]);

  function back() {
    window.clearTimeout(navigationTimer.current);
    if (overlays.length) { setOverlays((stack) => stack.slice(0, -1)); return; }
    if (!history.length) return;
    setCurrentId(history.at(-1));
    setSelected(new Set());
    setCategoryActive(null);
    setHistory((items) => items.slice(0, -1));
    setMotion({ type: "DISSOLVE", duration: 220, curve: "EASE_OUT", key: Date.now() });
  }

  function navigate(id, action = {}) {
    window.clearTimeout(navigationTimer.current);
    if (!screenMap[id] || overlayIds.has(id)) return;
    if (!DINING_CATEGORIES[id] || !DINING_CATEGORIES[currentId]) setCategoryActive(null);
    if (id !== currentId) {
      setHistory((items) => currentId === SPLASH ? items : [...items, currentId]);
      setCurrentId(id);
      setSelected(new Set());
      setMotion({
        type: action.transition || "DISSOLVE",
        duration: action.duration || 300,
        curve: action.curve || "EASE_OUT",
        key: Date.now(),
      });
    }
    setOverlays([]);
  }

  function activate(spot) {
    if (overlay?.id === "917:4500" && spot.source === "917:4512") {
      setOverlays((stack) => stack.slice(0, -1));
      return;
    }
    if (DECISION_SCREENS.has(currentId) && spot.y >= .44 && spot.y <= .46 && spot.w > .6
      && spot.actions.every((action) => action.kind === "CHANGE_TO")) {
      setSelected(new Set([spot.source]));
      window.clearTimeout(navigationTimer.current);
      navigationTimer.current = window.setTimeout(() => navigate("917:2872", {
        transition: "SMART_ANIMATE", duration: 400,
      }), 220);
      return;
    }
    if (DINING_CATEGORIES[currentId] && CATEGORY_IDS[spot.label]) {
      setCategoryActive(CATEGORY_IDS[spot.label]);
    }
    for (const action of spot.actions) {
      if (action.kind === "CHANGE_TO") {
        setSelected((old) => {
          const next = new Set(old);
          next.has(spot.source) ? next.delete(spot.source) : next.add(spot.source);
          return next;
        });
        if (spot.label === "ChangeBatchButton" && BATCH.includes(currentId)) {
          const next = BATCH[(BATCH.indexOf(currentId) + 1) % BATCH.length];
          window.setTimeout(() => navigate(next, { transition: "DISSOLVE", duration: 300 }), 160);
        }
      } else if (action.kind === "BACK") {
        back();
      } else if (action.kind === "OVERLAY" && screenMap[action.target]) {
        setOverlays((stack) => [...stack, { id: action.target, action }]);
      } else if (action.kind === "NAVIGATE") {
        navigate(action.target, action);
      }
    }
  }

  function reset() {
    window.clearTimeout(navigationTimer.current);
    setCurrentId(SPLASH); setHistory([]); setOverlays([]); setSelected(new Set()); setCategoryActive(null); setMotion(null);
  }

  const position = overlay && (OVERLAYS[overlay.id] || [0, 0]);
  const overlayTop = currentId === "1149:4807" && overlay?.id === "917:4500" ? .254
    : ["917:2087", "917:2194"].includes(currentId) && overlay?.id === "917:2422" ? .112
    : overlay?.id === "917:3269" ? (position[1] * current.height - phoneScrollY / (viewport.current?.clientWidth || 1) * 393) / 852
    : position?.[1];
  const style = motion ? {
    "--fkx-duration": motion.duration + "ms",
    "--fkx-easing": EASING[motion.curve] || "ease-out",
  } : undefined;

  return (
    <div className={"fkx" + (focused ? " is-focused" : "")} aria-label="饭困高保真交互原型">
      <div className="fkx-stage" ref={stage}>
        <span className="fkx-side-key fkx-side-key--action" aria-hidden="true" />
        <span className="fkx-side-key fkx-side-key--volume-up" aria-hidden="true" />
        <span className="fkx-side-key fkx-side-key--volume-down" aria-hidden="true" />
        <span className="fkx-side-key fkx-side-key--power" aria-hidden="true" />
        <span className="fkx-side-key fkx-side-key--camera" aria-hidden="true" />
        <div className="fkx-phone" style={style}>
          <div className={"fkx-viewport" + (isSplash ? " is-splash" : "")} ref={viewport} onScroll={(event) => setPhoneScrollY(event.currentTarget.scrollTop)}>
            <div key={currentId + (motion?.key || 0)}
              className={"fkx-screen" + (motion ? " fkx-screen--" + motion.type.toLowerCase() : "") + (TRIMMED_SCREENS.has(currentId) ? " is-trimmed" : "") + (RESULT_SCROLL_IDS.has(currentId) ? " is-result-scroll" : "")}
              style={RESULT_SCROLL_IDS.has(currentId) ? { "--fkx-result-height": (Math.min(current.height, 932) / 393 * 100) + "cqw" } : undefined}>
              {isSplash ? <SplashScreen onEnter={() => navigate(START, { transition: "DISSOLVE", duration: 450 })} />
                : <Art screen={current} activate={activate} selected={selected} categoryActive={categoryActive} video={currentId === START} />}
            </div>
          </div>
          {!overlay && CHROME_SCREENS.has(currentId) && <FixedScreenChrome screen={current} back={back} activate={activate} selected={selected} />}
          {!overlay && currentId === "1149:4807" && <div className="fkx-status">
            <img src={current.image} alt="" draggable="false"
              style={{ width: (current.imageWidth / current.width * 100) + "%", left: ((current.width - current.imageWidth) / 2 / current.width * 100) + "%" }} />
          </div>}
          {!overlay && FIXED_HEADER_SCREENS.has(currentId) && <FixedHeader back={back} navigate={navigate} />}
          {overlay && (
            <div className={"fkx-overlay" + (overlays.at(-1)?.action?.transition === "MOVE_IN" ? " is-move-in" : "")}
              role="dialog" aria-label={overlay.name}>
              <button className="fkx-dismiss" type="button" aria-label="关闭弹层"
                onClick={() => setOverlays((stack) => stack.slice(0, -1))} />
              <div className="fkx-overlay-art" style={{
                left: (position[0] * 100) + "%",
                top: overlayTop == null ? undefined : (overlayTop * 100) + "%",
                bottom: overlayTop == null ? 0 : undefined,
                width: (overlay.width / 393 * 100) + "%",
              }}>
                {overlay.id === "917:3269" ? <div className="fkx-quantity-stepper" aria-label="菜品数量">
                  <button type="button" aria-label="减少数量" disabled={quantity <= 1}
                    onClick={() => setQuantity((n) => Math.max(1, n - 1))}>
                    <img src={SOURCE_PHOTO_ROOT + "917-3269-imgMinusCircle.svg"} alt="" /></button>
                  <span>{quantity}</span>
                  <button type="button" aria-label="增加数量" onClick={() => setQuantity((n) => n + 1)}>
                    <img src={SOURCE_PHOTO_ROOT + "917-3269-imgAddCircle.svg"} alt="" /></button>
                </div> : <Art screen={overlay} activate={activate} selected={selected} categoryActive={categoryActive} />}
              </div>
            </div>
          )}
          {showDock && (
            <div className="fkx-dock">
              <img src={`/assets/projects/fankun/prototype/chrome/${DOCK_IMAGES[dockTheme]}`} alt="" aria-hidden="true" />
              <nav className="fkx-nav" aria-label="原型导航">
                {NAV.map(([label, id]) => (
                  <button type="button" key={id} aria-label={label}
                    onClick={() => navigate(id, { transition: "SMART_ANIMATE", duration: 300 })} />
                ))}
              </nav>
              <span className="fkx-dock-indicator" aria-hidden="true" />
            </div>
          )}
          {!overlay && RESULT_ACTION_IDS.has(currentId) && <ResultActions screen={current} activate={activate} navigate={navigate} selected={selected} />}
          {!showDock && !overlay && current.height > 852 && (
            <div className="fkx-home-indicator" aria-hidden="true"><span /></div>
          )}
        </div>
        <div className="fkx-tools">
          <button type="button" onClick={back} disabled={!history.length && !overlays.length}
            aria-label="返回上一步">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" onClick={reset} aria-label="重新开始">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 11a7 7 0 1 1-2.2-5.1M19 4v5h-5"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
