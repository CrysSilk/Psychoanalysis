# 潜意识之境 · Realm of Unconscious

一个以精神分析理论为主题的 Vue 3 科普网站。网站采用多页面专题结构，从首页主题入口出发，探索基础概念、理论人物、人格结构与梦境等内容。

> 本项目仅用于心理学知识科普与学习交流，不构成临床诊断、心理治疗或医疗建议。如有持续心理困扰，请向具备相应资质的专业人士寻求帮助。

## 功能概览

- 多页面专题导航：首页、基础概念、理论脉络、人格结构、梦境探索和参考资料。
- 探索入口：首页按主题卡片引导用户进入感兴趣的专题。
- 精神分析基础概念：介绍潜意识、梦与联想、心理防御等主题。
- 人格三元结构：可交互切换本我（Id）、自我（Ego）和超我（Superego）。
- 理论发展史：以时间轴形式展示弗洛伊德、荣格、阿德勒和拉康等理论节点。
- 梦境实验室：选择梦境意象，查看基于精神分析视角的示例解读。
- 全局状态：使用 Pinia 管理人格选择、滚动深度和音频开关状态。
- 响应式界面：导航栏文字在不同屏幕尺寸下清晰可读，窄屏导航可横向浏览。
- 可读性：专题入口与正文中的文字链接采用统一字号，并提供清晰的交互提示。

## 技术栈

- Vue 3
- Vite
- Vue Router
- Pinia
- CSS3

## 项目结构

```text
src/
├── components/             # 页面区块与公共组件
│   ├── AppNavbar.vue       # 顶部导航与静谧模式开关
│   ├── UniverseBackground.vue # 全站宇宙粒子背景
│   ├── GalaxyCanvas.vue    # 首页 Canvas 粒子星系
│   ├── HeroSection.vue     # 首屏
│   ├── IntroductionSection.vue
│   ├── TheorySection.vue
│   ├── TimelineSection.vue # 理论发展史
│   ├── DreamLab.vue        # 梦境实验室
│   ├── PersonalitySection.vue
│   ├── ReferenceSection.vue # 参考资料与内容说明
│   └── AppFooter.vue       # 全站页脚
├── data/                   # 理论与梦境示例数据
├── router/                 # Vue Router 多页面路由
├── stores/                 # Pinia 全局状态
├── views/                  # 首页与各专题页面
│   ├── HomeView.vue
│   ├── FoundationsView.vue
│   ├── TheoriesView.vue
│   ├── PersonalityView.vue
│   ├── DreamsView.vue
│   └── ReferencesView.vue
├── App.vue                 # 路由出口
├── main.js                 # 应用入口
└── style.css               # 全局样式
```

## 本地运行

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

预览构建产物：

```bash
npm run preview
```

## 开发约定

- 新增专题页面时，在 `src/router/index.ts` 注册路由，并在导航或相关内容中提供入口。
- 多页面共享的导航与页脚由 `App.vue` 统一编排；专题内容组件应保持可复用。
- 跨组件共享状态统一通过 `usePsychoStore` 管理；不要重复创建相同全局状态。
- 页面内容仅作科普，请保留学术免责声明并避免作出诊断性表述。
- 提交前请运行 `npm run build`，并确认未包含其他成员的无关改动。