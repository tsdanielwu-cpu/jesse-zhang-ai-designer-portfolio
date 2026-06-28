import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import DarkVeil from "./DarkVeil";
import HeroParticleField from "./HeroParticleField";
import ProfileCard from "./ProfileCard";
import "./styles.css";

const contacts = {
  phone: "131 8986 0281",
  email: "787841181@qq.com",
  wechat: "131 8986 0281",
};

const resumeSummary = [
  "AI 设计师 / AIGC 创作者",
  "关注 AI 图像系统、视觉叙事、交互媒体与模型训练的呈现方式。",
  "Stable Diffusion / ComfyUI / Midjourney / Adobe Suite",
];

const works = [
  { id: "lora-makeup", number: "01", title: "LoRA 模型训练", subtitle: "特殊妆造图像风格训练", category: "AIGC 模型训练", year: "2026", cover: "/assets/projects/lora/result-03b.webp", intro: "围绕特殊妆造图像建立完整 LoRA 流程，涵盖数据集整理、图片打标、提示词结构、模型训练与效果评估。", details: ["数据集整理", "提示词结构", "模型评估"], tools: ["Stable Diffusion", "LoRA", "Prompt Engineering", "Photoshop"] },
  { id: "virtual-daike", number: "02", title: "虚拟角色物料制作", subtitle: "角色运营与节日传播视觉", category: "虚拟角色物料", year: "2026", cover: "/assets/projects/virtual-daike/poster-main.webp", pages: ["/assets/portfolio/page-11.jpg", "/assets/portfolio/page-12.jpg", "/assets/portfolio/page-13.jpg", "/assets/portfolio/page-14.jpg"], intro: "面向虚拟角色账号运营，节日活动主视觉与日常传播素材制作，强化角色IP与主题创作。", details: ["角色 IP", "节日活动", "社交媒体版式"], tools: ["AIGC", "AI角色运营", "视觉设计", "IP 内容"] },
  { id: "pixel-dwelling", number: "03", title: "像素栖居 2055", subtitle: "未来生活与工作枢纽", category: "未来栖居系统", year: "2026", cover: "/assets/projects/pixel-dwelling/cover.jpg", pages: ["/assets/projects/pixel-dwelling/process-ai-tools.png", "/assets/projects/pixel-dwelling/process-module-docking.png", "/assets/portfolio/page-18.jpg", "/assets/portfolio/page-20.jpg", "/assets/portfolio/page-32.jpg"], intro: "以 2055 年为背景，探索模块化居住单元在城市、森林、海洋与极地环境中的未来生活方式。", details: ["未来栖居", "世界观构建", "AI 图像与视频"], tools: ["Midjourney V7", "Nano Banana", "Flux1.Kontext", "即梦 AI", "Photoshop"] },
  { id: "flower-guangzhou", number: "04", title: "城市印象：花卉广州", subtitle: "建筑地标转译为花卉视觉", category: "城市视觉系统", year: "2026", cover: "/assets/projects/flower-guangzhou/flower-rose-wide.webp", pages: ["/assets/portfolio/page-49.jpg", "/assets/portfolio/page-50.jpg"], intro: "将广州地标建筑转译为花卉图像与动态影像，形成兼具城市记忆、地域符号与梦幻光影的视觉系统。", details: ["建筑转译", "SDXL 与 LoRA", "ControlNet 构图", "动态影像延展"], tools: ["ComfyUI", "SDXL", "ControlNet", "TouchDesigner", "Seedance"] },
];

const workOrder = ["lora-makeup", "flower-guangzhou", "pixel-dwelling", "virtual-daike"];
const displayedWorks = workOrder.map((id, index) => { const work = works.find((item) => item.id === id); if (!work) return null; return { ...work, number: String(index + 1).padStart(2, "0") }; }).filter(Boolean);

const awards = [
  {
    year: "2025",
    title: "第十届两岸新锐设计竞赛·华灿奖 - AIGC 赛道国奖 三等奖",
  },
  {
    year: "2025",
    title: "广州美术学院三等奖学金",
  },
  {
    year: "2025",
    title: "获 第十八届挑战杯 三等奖",
    project: "《梯田竹溢·悦动古河——古水旅游项目策划改造》",
  },
  {
    year: "2024",
    title: "获 12 届未来设计师广东赛区 二等奖",
    project: "《“超梦境”虚拟现实游戏社交空间 - 未来绿洲》",
  },
  {
    year: "2024",
    title: "获 第十八届中国创意挑战大赛广东赛区 二等奖",
    project: "《“超梦境”虚拟现实游戏社交空间 - 未来绿洲》",
  },
  {
    year: "2023",
    title: "获 新加坡金沙艺术设计大赛 SGADC 三等奖",
  },
  {
    year: "2023",
    title: "获 大学生可持续设计大赛 三等奖",
  },
  {
    year: "2022",
    title: "获 香港数字艺术设计大赛 HKDADC 三等奖",
  },
];

const loraComparisons = [
  { before: "/assets/projects/lora/compare-01-before.webp", after: "/assets/projects/lora/compare-01-after.webp", title: "柔光闪片妆", note: "观察皮肤质感、眼部高光与五官稳定性。" },
  { before: "/assets/projects/lora/compare-02-before.webp", after: "/assets/projects/lora/compare-02-after.webp", title: "清透绿色妆", note: "测试眼影、腮红与唇部光泽的颜色稳定性。" },
  { before: "/assets/projects/lora/compare-03-before.webp", after: "/assets/projects/lora/compare-03-after.webp", title: "高饱和眼妆", note: "测试夸张色块、睫毛细节与眉眼区域控制。" },
  { before: "/assets/projects/lora/compare-04-before.webp", after: "/assets/projects/lora/compare-04-after.webp", title: "装饰幻想妆", note: "测试局部装饰、编辑感造型与面部材质一致性。" },
];
const loraResults = ["/assets/projects/lora/result-03b.webp", "/assets/projects/lora/result-02b.webp", "/assets/projects/lora/result-06b.webp", "/assets/projects/lora/result-04b.webp", "/assets/projects/lora/result-05b.webp", "/assets/projects/lora/result-01b.webp"];
const loraMethodSteps = [
  { index: "01", label: "数据集", title: "样本筛选与整理", text: "收集妆造特征清晰的参考图，并按色彩、装饰、脸部角度与妆面材质进行分类。", image: "/assets/projects/lora/sample-dataset-overview.png" },
  { index: "02", label: "提示词", title: "提示词与标签结构", text: "用稳定标签描述妆面材质、五官特征、色彩关系与光线条件，提升生成结果的一致性。", image: "/assets/projects/lora/compare-02-after.webp" },
  { index: "03", label: "评估", title: "训练结果评估", text: "对近景输出进行对比，检查色彩准确度、皮肤纹理、局部装饰与整体风格控制。", image: "/assets/projects/lora/compare-03-after.webp" },
];

const projectChapters = {
  "virtual-daike": [
    { title: "活动主视觉", text: "多角色拼贴建立“冬旅归途”的活动叙事与节日氛围。", image: "/assets/portfolio/page-12.jpg" },
    { title: "票券式物料", text: "将每日任务包装成可连续发布的收藏票券。", image: "/assets/portfolio/page-13.jpg" },
    { title: "节日延展", text: "新年与节日内容继续扩展角色运营系统。", image: "/assets/portfolio/page-14.jpg" },
  ],
  "pixel-dwelling": [
    { title: "未来栖居设定", text: "以 2055 年为背景，构想移动生活与工作的模块化居住单元。", image: "/assets/portfolio/page-16.jpg" },
    { title: "场景分组", text: "通过海洋、森林、城市与极地场景测试不同环境下的栖居系统。", image: "/assets/portfolio/page-20.jpg" },
    { title: "生成流程", text: "参考图、提示词与后期处理共同建立统一的未来世界观。", image: "/assets/portfolio/page-23.jpg" },
    { title: "空间叙事", text: "居住舱、交通系统与生态环境构成可阅读的视觉故事。", image: "/assets/portfolio/page-27.jpg" },
    { title: "视频延展", text: "在静态效果图之后加入动态影像，强化速度、空间与氛围。", image: "/assets/portfolio/page-32.jpg" },
  ],
  "flower-guangzhou": [
    { title: "建筑提取", text: "城市地标的轮廓与记忆被转化为图像结构输入。", image: "/assets/portfolio/page-35.jpg" },
    { title: "花卉转译", text: "根据建筑气质匹配花材、色彩和画面氛围。", image: "/assets/portfolio/page-37.jpg" },
    { title: "图像生成", text: "通过 SDXL、LoRA 与 ControlNet 控制结构和花卉构图。", image: "/assets/portfolio/page-42.jpg" },
    { title: "动态影像", text: "用 TouchDesigner 与 Seedance 将花卉图像延展为动态视频。", image: "/assets/portfolio/page-50.jpg" },
  ],
};

const pixelConceptCards = [
  { title: "移动居住单元", text: "将居住、办公、交通与补给功能压缩进可迁移的未来生活模块。", image: "/assets/portfolio/page-18.jpg" },
  { title: "环境适配系统", text: "围绕海洋、森林、城市与极地条件，展示同一栖居系统在不同地貌、气候与生活节奏中的适配效果。", gallery: ["/assets/projects/pixel-dwelling/ocean/ocean-01.webp", "/assets/projects/pixel-dwelling/forest/forest-02.webp", "/assets/projects/pixel-dwelling/city/city-01.webp", "/assets/projects/pixel-dwelling/polar/polar-01.webp"] },
  { title: "分布式智能中枢", text: "以垂直塔楼、接驳平台与交通网络构成城市中枢，支撑移动居住单元在不同区域之间停靠、补给与协作。", image: "/assets/portfolio/page-20.jpg" },
];
const pixelSceneGroups = [
  { key: "ocean", index: "01", title: "海洋栖居", label: "海洋场景", text: "漂浮结构、蓝色光线与封闭式生活舱共同构成冷静的海洋生活场景。", images: ["/assets/projects/pixel-dwelling/ocean/ocean-01.webp", "/assets/projects/pixel-dwelling/ocean/ocean-02.webp", "/assets/projects/pixel-dwelling/ocean/ocean-03.webp", "/assets/projects/pixel-dwelling/ocean/ocean-04.webp"] },
  { key: "forest", index: "02", title: "森林栖居", label: "森林场景", text: "植被覆盖的高层结构、悬浮道路与模块化塔楼组成生态化居住系统。", images: ["/assets/projects/pixel-dwelling/forest/forest-01.webp", "/assets/projects/pixel-dwelling/forest/forest-02.webp", "/assets/projects/pixel-dwelling/forest/forest-03.webp", "/assets/projects/pixel-dwelling/forest/forest-04.webp", "/assets/projects/pixel-dwelling/forest/forest-05.webp"] },
  { key: "city", index: "03", title: "城市栖居", label: "城市场景", text: "高密度交通、透明居住模块与垂直城市结构形成未来都市工作枢纽。", images: ["/assets/projects/pixel-dwelling/city/city-01.webp", "/assets/projects/pixel-dwelling/city/city-02.webp", "/assets/projects/pixel-dwelling/city/city-03.webp", "/assets/projects/pixel-dwelling/city/city-04.webp"] },
  { key: "polar", index: "04", title: "极地栖居", label: "极地场景", text: "冷光、封闭载具与柔和室内空间强调极端环境中的移动性与舒适度。", images: ["/assets/projects/pixel-dwelling/polar/polar-01.webp", "/assets/projects/pixel-dwelling/polar/polar-02.webp"] },
];
const pixelProcessPages = [
  "/assets/projects/pixel-dwelling/process-ai-tools.png",
  "/assets/projects/pixel-dwelling/process-module-docking.png",
  "/assets/portfolio/page-18.jpg",
  "/assets/portfolio/page-20.jpg",
];

const daikeHeroPosters = [
  { title: "冬旅归途主视觉", text: "以多角色拼贴建立活动入口和节日叙事。", image: "/assets/projects/virtual-daike/poster-main.webp" },
  { title: "角色活动海报", text: "将活动机制与角色故事合成为适合传播的主海报。", image: "/assets/projects/virtual-daike/poster-winter.jpg" },
];
const daikeTicketCards = [
  { title: "古禹", text: "", meta: "", image: "/assets/projects/virtual-daike/ticket-new-year.webp" },
  { title: "席恩", text: "", meta: "", image: "/assets/projects/virtual-daike/ticket-system.jpg" },
  { title: "代柯", text: "", meta: "", image: "/assets/projects/virtual-daike/ticket-hotpot.jpg" },
  { title: "小麦", meta: "", image: "/assets/projects/virtual-daike/ticket-countdown.jpg" },
];
const daikeDailyImages = [
  { image: "/assets/projects/virtual-daike/daily-city.jpg" },
  {  image: "/assets/projects/virtual-daike/daily-rain.jpg" },
  { image: "/assets/projects/virtual-daike/daily-camp.jpg" },
  { image: "/assets/projects/virtual-daike/daily-icecream.jpg" },
];

const flowerCaseSamples = [
  { title: "粤海关大楼", subtitle: "Custom House", image: "/assets/projects/flower-guangzhou/building-custom-house.jpg" },
  { title: "石室圣心大教堂", subtitle: "Sacred Heart Cathedral", image: "/assets/projects/flower-guangzhou/building-cathedral.jpg" },
  { title: "广州塔", subtitle: "Canton Tower", image: "/assets/projects/flower-guangzhou/building-guangzhou-tower.jpg" },
  { title: "中山纪念堂", subtitle: "Memorial Hall", image: "/assets/projects/flower-guangzhou/building-memorial.jpg" },
  { title: "爱群大厦", subtitle: "Aiqun Mansion", image: "/assets/projects/flower-guangzhou/building-aiqun.jpg" },
  { title: "广州图书馆", subtitle: "Guangzhou Library", image: "/assets/projects/flower-guangzhou/building-library.jpg" },
];
const flowerCaseTranslations = [
  { index: "01", title: "粤海关大楼 x 向日葵", text: "以暖黄色花卉回应建筑明亮立面和横向秩序。", building: "/assets/projects/flower-guangzhou/building-custom-house.jpg", result: "/assets/projects/flower-guangzhou/flower-sunflower-wide.webp" },
  { index: "02", title: "石室圣心大教堂 x 紫色花园", text: "把哥特式垂直线条转译为紫色花束和透明流动材质。", building: "/assets/projects/flower-guangzhou/building-cathedral.jpg", result: "/assets/projects/flower-guangzhou/flower-purple-ruins-wide.webp" },
  { index: "03", title: "广州塔 x 紫色流线", text: "用流动花卉与透明材质回应广州塔的曲线姿态。", building: "/assets/projects/flower-guangzhou/building-guangzhou-tower.jpg", result: "/assets/projects/flower-guangzhou/flower-purple-wide.webp" },
  { index: "04", title: "中山纪念堂 x 花园亭阁", text: "将纪念堂的屋顶层次转译为花园中央的仪式性亭阁。", building: "/assets/projects/flower-guangzhou/building-memorial.jpg", result: "/assets/projects/flower-guangzhou/flower-gazebo-wide.webp" },
  { index: "05", title: "爱群大厦 x 玫瑰", text: "红白玫瑰与暗色背景塑造复古、电影感的广州印象。", building: "/assets/projects/flower-guangzhou/building-aiqun.jpg", result: "/assets/projects/flower-guangzhou/flower-rose-wide.webp" },
  { index: "06", title: "广州图书馆 x 蓝白花墙", text: "蓝白花卉回应现代公共建筑的清洁立面秩序。", building: "/assets/projects/flower-guangzhou/building-library.jpg", result: "/assets/projects/flower-guangzhou/flower-blue-white-wide.webp" },
];
const flowerCaseAtmosphere = ["/assets/projects/flower-guangzhou/flower-rose-wide.webp", "/assets/projects/flower-guangzhou/flower-purple-wide.webp", "/assets/projects/flower-guangzhou/flower-sunflower-wide.webp"];
const flowerParticleScenes = [
  { label: "爱群", title: "爱群大厦", image: "/assets/projects/flower-guangzhou/flower-rose-wide.webp" },
  { label: "广州塔", title: "广州塔", image: "/assets/projects/flower-guangzhou/flower-purple-wide.webp" },
  { label: "海关", title: "粤海关大楼", image: "/assets/projects/flower-guangzhou/flower-sunflower-wide.webp" },
  { label: "图书馆", title: "广州图书馆", image: "/assets/projects/flower-guangzhou/flower-blue-white-wide.webp" },
  { label: "教堂", title: "石室圣心大教堂", image: "/assets/projects/flower-guangzhou/flower-purple-ruins-wide.webp" },
  { label: "纪念堂", title: "中山纪念堂", image: "/assets/projects/flower-guangzhou/flower-gazebo-wide.webp" },
];
const flowerPdfSamples = [
  { title: "爱群大厦", subtitle: "Oi Kwan Hotel", image: "/assets/projects/flower-guangzhou/building-aiqun.jpg" },
  { title: "广州塔", subtitle: "Canton Tower", image: "/assets/projects/flower-guangzhou/building-guangzhou-tower.jpg" },
  { title: "广州图书馆", subtitle: "Guangzhou Library", image: "/assets/projects/flower-guangzhou/building-library.jpg" },
  { title: "石室圣心大教堂", subtitle: "Sacred Heart Cathedral", image: "/assets/projects/flower-guangzhou/building-cathedral.jpg" },
  { title: "中山纪念堂", subtitle: "Sun Yat-sen Memorial Hall", image: "/assets/projects/flower-guangzhou/building-memorial.jpg" },
  { title: "粤海关大楼", subtitle: "Canton Customs House", image: "/assets/projects/flower-guangzhou/building-custom-house.jpg" },
];
const flowerPdfTranslations = [
  { index: "01", title: "爱群大厦 / Oi Kwan Hotel", keywords: "复古 / 玫瑰 / 密集花瓣", flowers: "玫瑰 / 大丽花", text: "红白花束制造旧广州的复古电影感。", building: "/assets/projects/flower-guangzhou/building-aiqun.jpg", result: "/assets/projects/flower-guangzhou/flower-rose-wide.webp" },
  { index: "02", title: "广州塔 / Canton Tower", keywords: "曲线 / 紫色 / 夜间流动", flowers: "雏菊 / 鸢尾", text: "紫色花卉和透明流线回应广州塔的结构曲线。", building: "/assets/projects/flower-guangzhou/building-guangzhou-tower.jpg", result: "/assets/projects/flower-guangzhou/flower-purple-wide.webp" },
  { index: "03", title: "广州图书馆 / Guangzhou Library", keywords: "蓝白 / 公共空间 / 秩序", flowers: "绣球 / 白色小花", text: "蓝白花墙建立现代公共建筑的干净秩序。", building: "/assets/projects/flower-guangzhou/building-library.jpg", result: "/assets/projects/flower-guangzhou/flower-blue-white-wide.webp" },
  { index: "04", title: "石室圣心大教堂 / Sacred Heart Cathedral", keywords: "哥特 / 紫色 / 神圣感", flowers: "百合 / 紫罗兰", text: "垂直花形强化建筑的仪式感和神圣氛围。", building: "/assets/projects/flower-guangzhou/building-cathedral.jpg", result: "/assets/projects/flower-guangzhou/flower-purple-ruins-wide.webp" },
  { index: "05", title: "中山纪念堂 / Memorial Hall", keywords: "纪念性 / 花园 / 红蓝对比", flowers: "朱槿 / 鸢尾", text: "纪念性屋顶被转译为花园中心的亭阁结构。", building: "/assets/projects/flower-guangzhou/building-memorial.jpg", result: "/assets/projects/flower-guangzhou/flower-gazebo-wide.webp" },
  { index: "06", title: "粤海关大楼 / Canton Customs House", keywords: "黄色 / 日光 / 立面秩序", flowers: "向日葵 / 桃色花束", text: "向日葵回应海关大楼明亮、稳定的建筑立面。", building: "/assets/projects/flower-guangzhou/building-custom-house.jpg", result: "/assets/projects/flower-guangzhou/flower-sunflower-wide.webp" },
];
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash.replace(/^#\/?/, "");
}

function App() {
  const route = useHashRoute();
  const [resumeOpen, setResumeOpen] = useState(false);
  const activeWork = useMemo(() => displayedWorks.find((work) => work.id === route), [route]);
  useScrollMotion(route);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  return (
    <>
      <DarkVeil
        hueShift={-110}
        noiseIntensity={0}
        scanlineIntensity={0.78}
        speed={0.42}
        scanlineFrequency={24}
        warpAmount={0}
        resolutionScale={0.76}
        fps={36}
      />
      {!activeWork && <OpeningAnimation />}
      <SiteNav activeWork={activeWork} onResume={() => setResumeOpen(true)} />
      {activeWork ? <WorkDetail work={activeWork} /> : <Home onResume={() => setResumeOpen(true)} />}
      <ContactFooter />
      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} />}
    </>
  );
}

function useScrollMotion(route) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const revealNodes = [...document.querySelectorAll("[data-reveal]")];
    const revealVisibleNodes = () => {
      const viewport = window.innerHeight || 1;
      revealNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.top < viewport * 0.92 && rect.bottom > viewport * 0.02) {
          node.classList.add("is-visible");
        }
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealNodes.forEach((node) => observer.observe(node));
    revealVisibleNodes();
    window.setTimeout(revealVisibleNodes, 300);

    let frame = 0;
    const parallaxNodes = [...document.querySelectorAll("[data-parallax]")];
    const updateParallax = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;
      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < viewport * -0.65 || rect.top > viewport * 1.65) {
          return;
        }
        const distance = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        const y = Math.max(-34, Math.min(34, distance * -58));
        node.style.setProperty("--parallax-y", `${y}px`);
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [route]);
}

function OpeningAnimation() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="opening-layer" aria-hidden="true">
      <div className="opening-panel" />
      <div className="opening-copy">
        <span>AI 设计师</span>
        <strong>张钊熙</strong>
      </div>
    </div>
  );
}

function SiteNav({ activeWork, onResume }) {
  return (
    <header className="site-nav">
      <a className="brand" href="#/" aria-label="张钊熙个人作品集首页">
        <span>JZ</span>
        <strong>{activeWork ? "作品详情" : "张钊熙"}</strong>
      </a>
      <nav>
        <a href="#/">作品</a>
        <button type="button" onClick={onResume}>简历</button>
        <a href={`mailto:${contacts.email}`}>联系</a>
      </nav>
    </header>
  );
}

function Home({ onResume }) {
  return (
    <main>
      <section className="portfolio-hero">
        <div className="container hero-frame hero-frame-particles">
          <HeroParticleField
            imageSrc="/assets/floral-particle-source.webp"
            cellScale={0.92}
            floatStrength={1.18}
            interactionStrength={1.84}
            fps={48}
          />
          <div className="hero-particle-title">
            <span>张钊熙</span>
            <strong>AI 作品集</strong>
            <p>2026 AIGC 精选项目</p>
          </div>
          <div className="hero-center-image">
            <img src="/assets/profile-candid.jpg" alt="个人照片" decoding="async" />
          </div>
        </div>
      </section>

      <section className="intro-band" data-reveal="section">
        <div className="container intro-experience">
          <header className="intro-experience-head" data-reveal="title">
            <div>
              <h2>PROFILE EXPERIENCE</h2>
              <p>个人简介</p>
            </div>
            <a href="#works" aria-label="查看作品集">↘</a>
          </header>

          <div className="intro-profile-panel" data-reveal="card">
            <div className="intro-profile-card-slot">
              <ResumeCard onPreview={onResume} />
            </div>

            <article className="intro-profile-copy">
              <span className="intro-mini-label">RESUME SNAPSHOT</span>
              <h3>张钊熙 </h3>
              <p className="intro-lead">以 AI 图像生成、提示词系统、视觉叙事和网页呈现为主要方向，把概念设定、模型训练、图像实验和项目包装整理成可展示、可传播的设计成果。</p>

              <div className="intro-info-grid" aria-label="简历重点信息">
                <div>
                  <span>教育经历</span>
                  <strong>本科：深圳大学 - 环境设计<br />硕士：广州美术学院 - 设计学</strong>
                </div>
                <div>
                  <span>工作经历</span>
                  <strong>研进组设计事务所 - 设计师助理<br />腾讯 PCG - AI内容运营</strong>
                </div>
                <div>
                  <span>研究方向</span>
                  <strong>AI 图像生成 / 视觉系统 / 模型训练</strong>
                </div>
                <div>
                  <span>联系方式</span>
                  <strong>{contacts.phone} / {contacts.email}</strong>
                </div>
              </div>

              <div className="intro-skill-board" aria-label="设计技能">
                <div>
                  <span>AIGC 工作流</span>
                  <p>Stable Diffusion、ComfyUI、LoRA、Midjourney、即梦 AI、LORA模型训练</p>
                </div>
                <div>
                  <span>视觉与版式</span>
                  <p>作品集叙事、品牌视觉、海报物料、图像后期、网页视觉编排</p>
                </div>
                <div>
                  <span>交互与呈现</span>
                  <p>React / Vite、动态图像、视频延展、项目网页化展示、touchdesigner</p>
                </div>
              </div>

              <div className="intro-building">
                <span>DESIGN TOOLS</span>
                <div>
                  <em>Stable Diffusion</em>
                  <em>ComfyUI</em>
                  <em>Photoshop</em>
                  <em>Illustrator</em>
                  <em>Indesign</em>
                  <em>touchdesigner</em>
                </div>
              </div>

              <button type="button" onClick={onResume}>预览简历</button>
            </article>
          </div>

          <div className="career-path awards-path" data-reveal="card" style={{ "--stagger-index": 1 }}>
            <div className="career-title-row">
              <span>AWARDS / CERTIFICATES</span>
              <strong>证书 / 奖项</strong>
            </div>
            <div className="career-line" aria-hidden="true" />
            <div className="career-items award-items" aria-label="证书与奖项">
              {awards.map((award) => (
                <article key={`${award.year}-${award.title}`}>
                  <time>{award.year}年</time>
                  <h3>{award.title}</h3>
                  {award.project && <p>{award.project}</p>}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="works" className="works-section">
        <div className="container section-heading" data-reveal="title">
          <h2>作品集</h2>
        </div>
        <div className="container works-stack" aria-label="精选作品项目">
            {displayedWorks.map((work, index) => (
              <WorkCard
                index={index}
                key={work.id}
                work={work}
              />
            ))}
        </div>
      </section>
    </main>
  );
}

function ResumeCard({ onPreview }) {
  return (
    <aside className="resume-card-shell">
      <ProfileCard
        name="张钊熙"
        title="AI 设计师 / AIGC 内容创作者"
        handle="zhang-zhaoxi"
        status="广州美术学院"
        contactText="预览简历"
        avatarUrl="/assets/profile-candid.jpg"
        miniAvatarUrl="/assets/portrait.jpg"
        behindGlowColor="rgba(231,43,34,.72)"
        innerGradient="linear-gradient(145deg, rgba(231,43,34,.42) 0%, rgba(21,24,29,.82) 42%, rgba(0,0,0,.96) 100%)"
        onContactClick={onPreview}
      />
      <div className="resume-card-caption">
        {resumeSummary.map((item) => <p key={item}>{item}</p>)}
      </div>
    </aside>
  );
}

function WorkCard({ index, work }) {
  return (
    <a
      className={"work-card work-card-" + work.id + (index % 2 ? " is-reverse" : "")}
      href={`#/${work.id}`}
      data-reveal="project"
      style={{ "--stagger-index": index }}
    >
      <div className="work-image" data-parallax>
        <img src={work.cover} alt={work.title + "封面"} loading="lazy" decoding="async" />
      </div>
      <div className="work-card-copy">
        <div className="work-card-label">
          <span>{work.category}</span>
          <span>{work.year}</span>
        </div>
        <strong className="work-number">{work.number}</strong>
        <h3>{work.title}</h3>
        <p>{work.intro}</p>
        <div className="work-tools">
          {work.tools.slice(0, 4).map((tool) => <span key={tool}>{tool}</span>)}
        </div>
        <span className="work-link">查看项目</span>
      </div>
    </a>
  );
}

function WorkDetail({ work }) {
  if (work.id === "lora-makeup") {
    return <LoraWorkDetail work={work} />;
  }

  if (work.id === "flower-guangzhou") {
    return <FlowerWorkDetail work={work} />;
  }

  if (work.id === "pixel-dwelling") {
    return <PixelWorkDetail work={work} />;
  }

  if (work.id === "virtual-daike") {
    return <VirtualDaikeDetail work={work} />;
  }

  const chapters = projectChapters[work.id] || [];

  return (
    <main className="detail-page editorial-detail">
      <section className="detail-hero" data-reveal="section">
        <div className="container detail-hero-grid">
          <div>
            <a className="back-link" href="#/">返回作品集</a>
            <p className="eyebrow">{work.category} / {work.year}</p>
            <h1>{work.title}</h1>
            <p className="detail-subtitle">{work.subtitle}</p>
          </div>
          <div className="detail-cover">
            <img src={work.cover} alt={work.title + " 项目封面"} fetchPriority="high" decoding="async" />
          </div>
        </div>
      </section>

      <section className="detail-overview" data-reveal="section">
        <div className="container overview-grid">
          <div>
            <p className="eyebrow">项目概览</p>
            <h2>{work.intro}</h2>
          </div>
          <div className="detail-meta">
            <div>
              <strong>范围</strong>
              {work.details.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div>
              <strong>工具</strong>
              {work.tools.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="project-story">
        <div className="container story-list">
          {chapters.map((chapter, index) => (
            <article className={"story-row" + (index % 2 ? " is-reverse" : "")} key={chapter.title} data-reveal="card">
              <figure>
                <img src={chapter.image} alt={chapter.title} loading={index > 1 ? "lazy" : "eager"} />
              </figure>
              <div className="story-copy">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{chapter.title}</h2>
                <p>{chapter.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PdfArchive work={work} />
    </main>
  );
}

function VirtualDaikeDetail({ work }) {
  return (
    <main className="detail-page editorial-detail daike-detail">
      <section className="case-hero daike-case-hero">
        <div className="container case-hero-grid daike-hero-grid">
          <div className="case-title">
            <a className="back-link" href="#/">返回作品集</a>
            <p className="eyebrow">虚拟角色物料 / 2026</p>
            <h1>虚拟角色<br />物料制作</h1>
          </div>
          <div className="case-summary">
            <p>围绕虚拟角色IP日常与节日物料储备和运营，完成从主视觉海报、日常传播图片的系列物料设计。画面强调角色氛围、剧情感与活动信息的可读性，让 AIGC 生成内容更适合实际运营发布。</p>
            <dl>
              <div><dt>角色</dt><dd>AI 角色视觉运营</dd></div>
              <div><dt>重点</dt><dd>活动海报、票券卡片、日常物料</dd></div>
              <div><dt>工具</dt><dd>AIGC / Photoshop / 即梦AI</dd></div>
            </dl>
          </div>
        </div>

        <div className="container daike-hero-posters">
          {daikeHeroPosters.map((poster, index) => (
            <figure
              className={index === 0 ? "is-primary" : ""}
              key={poster.title}
              data-reveal="card"
              style={{ "--stagger-index": index }}
            >
              <img src={poster.image} alt={poster.title} loading={index ? "lazy" : "eager"} data-parallax />
              <figcaption>
                <strong>{poster.title}</strong>
                <span>{poster.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="case-results daike-campaign">
        <div className="container case-section-head">
          <span>新年活动</span>
          <h2>以“冬旅归途”为主题的活动视觉</h2>
          <p>主视觉采用电影海报式拼贴，将角色、雪景、车票、邮戳与活动信息组织成一张完整邀请函，强化跨年活动的故事感与参与入口。</p>
        </div>
        <div className="container daike-ticket-grid">
          {daikeTicketCards.map((card, index) => (
            <article className="daike-ticket-card" key={card.title} data-reveal="card" style={{ "--stagger-index": index }}>
              <figure>
                <img src={card.image} alt={card.title} loading={index > 1 ? "lazy" : "eager"} />
              </figure>
              <div>
                <span>{card.meta}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="project-story daike-daily">
        <div className="container case-section-head">
          <span>日常物料</span>
          <h2>日常内容物料</h2>
          <p>虚拟角色代柯的日常物料制作和储备</p>
        </div>
        <div className="container daike-daily-grid">
          {daikeDailyImages.map((item, index) => (
            <figure className={index % 2 ? "is-tall" : ""} key={item.title} data-reveal="card" style={{ "--stagger-index": index }}>
              <img src={item.image} alt={item.title} loading={index > 1 ? "lazy" : "eager"} data-parallax />
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="case-results daike-festival">
        <div className="container daike-festival-grid">
          <div className="daike-festival-copy" data-reveal="card">
            <span>节日资产</span>
            <h2>节日运营物料的系列化表达</h2>
            <p>通过海报、长图、角色单图与活动卡片的组合，把虚拟角色内容从单张效果图转化为可运营的节日传播资产。</p>
            <div className="daike-festival-points">
              {work.details.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <figure className="daike-festival-visual" data-reveal="card" style={{ "--stagger-index": 1 }}>
            <img src="/assets/portfolio/page-14.jpg" alt="节日主题物料作品集页面" data-parallax />
          </figure>
        </div>
      </section>

      <VerticalPdfArchive work={work} />
    </main>
  );
}

function LoraWorkDetail({ work }) {
  return (
    <main className="detail-page editorial-detail lora-detail">
      <section className="case-hero">
        <div className="container case-hero-grid">
          <div className="case-title">
            <a className="back-link" href="#/">返回作品集</a>
            <p className="eyebrow">AIGC 模型训练 / 2026</p>
            <h1>LoRA<br />特殊妆造<br />模型训练</h1>
          </div>
          <div className="case-summary">
            <p>围绕特殊妆造图像进行 LoRA 训练，建立从图片收集、打标、提示词结构、模型训练到生成结果评估的完整流程，提升眼妆、唇妆、皮肤纹理与整体妆面质感的可控性。</p>
            <dl>
              <div><dt>角色</dt><dd>AI 人像、美妆</dd></div>
              <div><dt>重点</dt><dd>数据集、提示词、效果评估</dd></div>
              <div><dt>工具</dt><dd>ComfyUI / LoRA / Photoshop</dd></div>
            </dl>
          </div>
        </div>
        <div className="container case-hero-triptych" aria-label="LoRA 特殊妆造生成结果">
          <figure className="triptych-side triptych-left" data-reveal="card" style={{ "--stagger-index": 0 }}>
            <img
              src="/assets/projects/lora/result-02b.webp"
              alt="LoRA 生成妆造侧面肖像"
              data-parallax
            />
          </figure>
          <figure className="triptych-main" data-reveal="card" style={{ "--stagger-index": 1 }}>
            <img
              src="/assets/projects/lora/result-03b.webp"
              alt="LoRA 生成妆造主视觉肖像"
              data-parallax
            />
          </figure>
          <figure className="triptych-side triptych-right" data-reveal="card" style={{ "--stagger-index": 2 }}>
            <img
              src="/assets/projects/lora/result-05b.webp"
              alt="LoRA 生成妆造补充肖像"
              data-parallax
            />
          </figure>
        </div>
      </section>

      <section className="case-method">
        <div className="container case-section-head">
          <span>方法</span>
          <h2>从参考样本到可复用风格模型</h2>
          <p>围绕特殊妆造图像进行 LoRA 训练，建立从图片打标、提示词结构、模型训练到结果评估的完整流程，提升眼妆、唇妆、皮肤质感与整体妆面的可控性。</p>
        </div>
        <div className="container method-editorial">
          {loraMethodSteps.map((step, index) => (
            <article className={"method-row" + (index % 2 ? " is-reverse" : "")} key={step.index} data-reveal="card">
              <figure>
                <img src={step.image} alt={step.title} loading={index ? "lazy" : "eager"} data-parallax />
              </figure>
              <div className="method-copy">
                <div className="method-meta">
                  <span>{step.index}</span>
                  <span>{step.label}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {index === 1 && (
                  <div className="prompt-axis" aria-label="提示词结构">
                    <span>主体</span>
                    <span>妆造风格</span>
                    <span>色彩关系</span>
                    <span>光线</span>
                    <span>材质控制</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-comparison">
        <div className="container case-section-head">
          <span>效果验证</span>
          <h2>训练前后效果对比</h2>
          <p>通过同一组妆容方向进行训练前后对比，观察模型在五官稳定、彩妆结构、局部细节与整体风格一致性上的提升。</p>
        </div>
        <div className="container comparison-list">
          {loraComparisons.map((item, index) => (
            <article className="comparison-item" key={item.title} data-reveal="card">
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.note}</p>
                </div>
              </header>
              <div className="comparison-images">
                <figure>
                  <img src={item.before} alt={item.title + " before"} loading={index > 0 ? "lazy" : "eager"} />
                  <figcaption>训练前</figcaption>
                </figure>
                <figure>
                  <img src={item.after} alt={item.title + " after"} loading={index > 0 ? "lazy" : "eager"} />
                  <figcaption>训练后</figcaption>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-results">
        <div className="container case-section-head">
          <span>输出结果</span>
          <h2>模型输出结果</h2>
          <p>最终输出覆盖甜酷、童趣、糖果色、未来感等多种妆造方向，用于验证模型在不同视觉主题下的泛化能力。</p>
        </div>
        <div className="container result-grid">
          {loraResults.map((image, index) => (
            <figure className={`result-${(index % 6) + 1}`} key={image} data-reveal="card">
              <img src={image} alt={"LoRA 输出结果 " + (index + 1)} loading={index > 3 ? "lazy" : "eager"} />
            </figure>
          ))}
        </div>
      </section>

      <section className="case-ending">
        <div className="container case-ending-inner">
          <p>下一个项目</p>
          <a href="#/flower-guangzhou">
            <span>02</span>
            <strong>城市印象：花卉广州</strong>
          </a>
        </div>
      </section>
    </main>
  );
}

function PixelWorkDetail({ work }) {
  const archiveWork = { ...work, pages: pixelProcessPages };

  return (
    <main className="detail-page editorial-detail pixel-detail">
      <section className="case-hero pixel-case-hero">
        <div className="container case-hero-grid pixel-hero-grid">
          <div className="case-title">
            <a className="back-link" href="#/">返回作品集</a>
            <p className="eyebrow">未来栖居系统 / 2026</p>
            <h1>像素栖居<br />2055</h1>
          </div>
          <div className="case-summary">
            <p>面向 2055 年的未来生活设想，构建移动居住单元在城市、森林、海洋与极地中的场景系统，探索生活与工作的空间枢纽如何在不同环境中迁移。</p>
            <dl>
              <div><dt>角色</dt><dd>AI 设计师</dd></div>
              <div><dt>重点</dt><dd>移动居住单元 / 枢纽系统 / 场景生成</dd></div>
              <div><dt>工具</dt><dd>{work.tools.join(" / ")}</dd></div>
            </dl>
          </div>
        </div>

        <div className="container pixel-hero-stage" data-reveal="card">
            <img src={work.cover} alt="像素栖居 2055 项目封面" data-parallax />
        </div>
      </section>

      <section className="case-method pixel-concept">
        <div className="container case-section-head">
          <span>概念</span>
          <h2>未来生活与工作枢纽</h2>
          <p>以 2055 年为时间背景，构想移动居住单元在城市、森林、海洋与极地环境中的生活方式，建立“可迁移栖居”的空间叙事。</p>
        </div>
        <div className="container pixel-concept-grid">
          <article className="pixel-design-note" data-reveal="card">
            <figure>
              <img src="/assets/projects/pixel-dwelling/design-note-city.png" alt="未来城市分布式智能中枢效果图" loading="lazy" />
            </figure>
            <span>设计说明</span>
            <p>作品讲述未来青年弹性就业常态化的图景，打造模块化可移动居住单元与分布式智能中枢联动的创新栖居体系。视频中故事以自由建筑设计师为第一视角，讲述其居住舱随工作跨城移动、无缝接驳中枢的日常。</p>
            <p>居住舱如灵动像素，支持功能模块灵活组合，智能切换起居与工作场景，平稳穿梭于城市分布式中枢间。中枢作为核心接驳节点与资源链接平台，遍布城市各处，既保障居住舱安稳停靠，又实现跨区域资源精准匹配，让流动青年轻松对接所需。</p>
          </article>
          {pixelConceptCards.map((item, index) => (
            <article className="pixel-concept-card" key={item.title} data-reveal="card" style={{ "--stagger-index": index + 1 }}>
              <figure className={item.gallery ? "pixel-concept-collage" : undefined}>
                {item.gallery ? (
                  item.gallery.map((image) => <img src={image} alt={item.title} loading="lazy" key={image} />)
                ) : (
                  <img src={item.image} alt={item.title} loading={index > 0 ? "lazy" : "eager"} />
                )}
              </figure>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-results pixel-scenes">
        <div className="container case-section-head">
          <span>场景生成</span>
          <h2>四种环境下的未来栖居</h2>
          <p>围绕海洋、森林、城市与极地四种环境展开场景生成，比较同一移动居住系统在不同气候、地貌与生活节奏中的视觉差异。</p>
        </div>
        <div className="container pixel-scene-list">
          {pixelSceneGroups.map((scene, sceneIndex) => (
            <article className={"pixel-scene-card pixel-" + scene.key} key={scene.key} data-reveal="card" style={{ "--stagger-index": sceneIndex % 2 }}>
              <div className="pixel-scene-copy">
                <span>{scene.index}</span>
                <p>{scene.label}</p>
                <h3>{scene.title}</h3>
                <div className="pixel-scene-line" />
                <p>{scene.text}</p>
              </div>
              <div className="pixel-scene-gallery">
                {scene.images.map((image, imageIndex) => (
                  <figure className={imageIndex === 0 ? "is-primary" : ""} key={image}>
                    <img
                      src={image}
                        alt={scene.title + " 效果图 " + (imageIndex + 1)}
                      loading={sceneIndex > 0 || imageIndex > 1 ? "lazy" : "eager"}
                      data-parallax={imageIndex === 0 ? true : undefined}
                    />
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-section pixel-video-section">
        <div className="container section-heading">
          <h2>AI视频制作</h2>
          <p>将像素栖居的场景设定延展为动态影像，用视频补充未来生活与工作枢纽的空间节奏。</p>
        </div>
        <div className="container pixel-video-card" data-reveal="card">
          <video
            src="/assets/projects/pixel-dwelling/pixel-dwelling-2055.mp4"
            poster="/assets/projects/pixel-dwelling/cover.jpg"
            controls
            playsInline
            preload="none"
          />
        </div>
      </section>

      <VerticalPdfArchive work={archiveWork} />
    </main>
  );
}

function FlowerWorkDetail({ work }) {
  const [activeParticleScene, setActiveParticleScene] = useState(0);
  const scene = flowerParticleScenes[activeParticleScene];

  return (
    <main className="detail-page editorial-detail flower-detail">
      <section className="case-hero flower-case-hero">
        <div className="container case-hero-grid">
          <div className="case-title">
            <a className="back-link" href="#/">返回作品集</a>
            <p className="eyebrow">城市视觉系统 / 2026</p>
            <h1>城市印象<br />花卉广州</h1>
          </div>
          <div className="case-summary">
            <p>{work.intro}</p>
            <dl>
              <div><dt>角色</dt><dd>AI 设计师</dd></div>
              <div><dt>重点</dt><dd>建筑转译、花卉视觉、动态影像</dd></div>
              <div><dt>工具</dt><dd>{work.tools.join(" / ")}</dd></div>
            </dl>
          </div>
        </div>

        <div className="container flower-particle-interface" data-reveal="card">
          <div className="flower-particle-stage">
            <HeroParticleField
              key={scene.image}
              imageSrc={scene.image}
              className="flower-detail-particles"
              cellScale={0.66}
              floatStrength={1.86}
              interactionStrength={1.62}
              baseImageStrength={0.052}
            />
            <div className="flower-particle-overlay">
              <span>互动粒子场</span>
              <strong>{scene.title}</strong>
            </div>
          </div>
          <aside className="flower-particle-controls" aria-label="花卉广州粒子控制">
            <div>
              <span>场景</span>
              <strong>{String(activeParticleScene + 1).padStart(2, "0")} / 06</strong>
            </div>
            <input
              type="range"
              min="0"
              max={flowerParticleScenes.length - 1}
              step="1"
              value={activeParticleScene}
              aria-label="切换花卉广州粒子场景"
              onChange={(event) => setActiveParticleScene(Number(event.target.value))}
            />
            <div className="flower-particle-buttons">
              {flowerParticleScenes.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  className={index === activeParticleScene ? "is-active" : ""}
                  onClick={() => setActiveParticleScene(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <p>从地标轮廓到花卉粒子，这个项目把广州转译为一套分层视觉系统：建筑提供结构，花卉建立氛围，动态影像把静态画面延展到时间线。</p>
          </aside>
        </div>

        <div className="container flower-hero-montage" aria-label="花卉广州头部图片">
          <figure className="flower-hero-main" data-reveal="card" style={{ "--stagger-index": 0 }}>
            <img src={flowerCaseAtmosphere[0]} alt="红玫瑰与白色花卉氛围图" data-parallax />
          </figure>
          <figure className="flower-hero-side" data-reveal="card" style={{ "--stagger-index": 1 }}>
            <img src={flowerCaseAtmosphere[1]} alt="紫色花卉氛围图" data-parallax />
          </figure>
          <figure className="flower-hero-side" data-reveal="card" style={{ "--stagger-index": 2 }}>
            <img src={flowerCaseAtmosphere[2]} alt="向日葵花卉氛围图" data-parallax />
          </figure>
        </div>
      </section>

      <section className="case-method">
        <div className="container case-section-head">
          <span>建筑样本</span>
          <h2>从城市地标到花卉视觉</h2>
          <p>以广州地标建筑为基础，提取轮廓、色彩与地域符号，再叠加花卉与粒子化光影，形成兼具城市识别度与梦幻氛围的系列视觉。</p>
        </div>
        <div className="container flower-building-grid">
          {flowerPdfSamples.map((sample, index) => (
            <figure key={sample.title} className="flower-building-card" data-reveal="card" style={{ "--stagger-index": index % 3 }}>
              <img src={sample.image} alt={sample.title} loading={index > 2 ? "lazy" : "eager"} />
              <figcaption>
                <strong>{sample.title}</strong>
                <span>{sample.subtitle}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="project-story flower-translation">
        <div className="container case-section-head">
          <span>转译逻辑</span>
          <h2>建筑轮廓与花卉语言的转译</h2>
          <p>选取广州塔、中山纪念堂、海关大楼、石室圣心大教堂等城市地标，将建筑的轮廓与色彩关系转译为不同花卉场景，形成兼具地域记忆与视觉想象的系列图像。</p>
        </div>
        <div className="container flower-pair-list">
          {flowerPdfTranslations.map((item, index) => (
            <article className="flower-pair-card" key={item.index} data-reveal="card" style={{ "--stagger-index": index % 3 }}>
              <div className="flower-pair-head">
                <span>{item.index}</span>
                <div>
                  <h3>{item.title}</h3>
                  <div className="flower-pair-meta">
                    <span>{item.keywords}</span>
                    <span>{item.flowers}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              </div>
              <div className="flower-pair-images">
                <figure className="flower-pair-building">
                  <img src={item.building} alt={item.title + " 建筑图"} loading={index > 1 ? "lazy" : "eager"} />
                </figure>
                <figure className="flower-pair-result">
                  <img src={item.result} alt={item.title + " 花卉转译图"} loading={index > 1 ? "lazy" : "eager"} data-parallax />
                </figure>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="gallery-section flower-video-showcase">
        <div className="container section-heading">
          <h2>城市印象动态影像</h2>
          <p>将花卉广州的静态生成图延展为动态影像，补充建筑花卉从画面到时间线的表达。</p>
        </div>
        <div className="container flower-video-card" data-reveal="card">
          <video
            src="/assets/projects/flower-guangzhou/city-impression.mp4"
            poster="/assets/projects/flower-guangzhou/flower-rose-wide.webp"
            controls
            playsInline
            preload="none"
          />
        </div>
      </section>

      <section className="case-results flower-process">
        <div className="container case-section-head">
          <span>生成流程</span>
          <h2>从建筑线稿到动态花卉场景</h2>
          <p>先整理广州地标建筑的轮廓与色彩特征，再通过 SDXL、LoRA 与 ControlNet 控制主体结构和花卉构图，最后用 TouchDesigner 与 Seedance 将画面延展为动态影像。</p>
        </div>
        <div className="container flower-process-grid">
          <figure className="flower-process-visual" data-reveal="card">
            <img src="/assets/projects/flower-guangzhou/flower-gazebo-wide.webp" alt="花卉亭台动态场景" data-parallax />
          </figure>
          <div className="flower-process-copy" data-reveal="card" style={{ "--stagger-index": 1 }}>
            <div className="flower-process-points">
              {work.details.map((item) => <span key={item}>{item}</span>)}
            </div>
            <p>ControlNet 用于稳定建筑主体的比例、透视和轮廓关系，避免花卉素材完全覆盖地标识别度；LoRA 和提示词则负责花材、色彩、光线与梦幻氛围的统一。</p>
            <p>动态阶段把静态图像拆解为前景花瓣、主体建筑、背景光影等层次，通过粒子运动和镜头推进，让城市印象从单张图像转化为可观看的时间体验。</p>
          </div>
        </div>
      </section>

      <VerticalPdfArchive work={work} />
    </main>
  );
}

function VerticalPdfArchive({ work }) {
  const archiveCopy = work.id === "pixel-dwelling"
    ? ""
    : work.id === "virtual-daike"
      ? "原活动页面以紧凑归档形式保留，用于补充主视觉系统的过程记录。"
      : "原过程页面保留在底部，作为视觉系统的参考与过程记录。";
  const archiveTitle = work.id === "pixel-dwelling" ? "设计过程" : "过程归档";

  return (
    <section className="gallery-section pdf-archive is-vertical">
      <div className="container section-heading">
        <h2>{archiveTitle}</h2>
        {archiveCopy && <p>{archiveCopy}</p>}
      </div>
      <div className="container page-gallery">
        {work.pages.map((page, index) => (
          <figure key={page} data-reveal="card" style={{ "--stagger-index": index % 3 }}>
            <img src={page} alt={work.title + " 过程归档 " + (index + 1)} loading={index > 1 ? "lazy" : "eager"} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function PdfArchive({ work }) {
  return (
    <section className="gallery-section pdf-archive">
      <div className="container section-heading">
        <h2>过程归档</h2>
        <p>原作品集页面保留为过程归档，用来补充项目的推导、版式和视觉过程，不再作为页面的主要叙事内容。</p>
      </div>
      <div className="container page-gallery">
        {work.pages.map((page, index) => (
          <figure key={page} className={index === 0 ? "wide" : ""} data-reveal="card" style={{ "--stagger-index": index % 4 }}>
            <img src={page} alt={work.title + " 过程归档 " + (index + 1)} loading={index > 1 ? "lazy" : "eager"} />
          </figure>
        ))}
      </div>
    </section>
  );
}

function ResumeModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="简历预览">
      <button className="modal-close" type="button" onClick={onClose}>关闭</button>
      <div className="resume-preview">
        <img src="/assets/resume.jpg" alt="简历预览" />
      </div>
    </div>
  );
}

function ContactFooter() {
  return (
    <footer className="contact-finale" data-reveal="section">
      <div className="container finale-inner">
        <p className="eyebrow">Contact</p>
        <h2 data-reveal="title">联系方式</h2>
        <div className="finale-actions">
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
          <a href={`tel:${contacts.phone.replaceAll(" ", "")}`}>{contacts.phone}</a>
          <span>微信 {contacts.wechat}</span>
        </div>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);
