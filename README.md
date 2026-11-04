# 潜意识之境 · Realm of Unconscious

一个以精神分析理论为主题的 Vue 3 科普网站。项目通过首屏引导、人格结构交互、理论发展史与梦境实验室等模块，呈现意识、潜意识和人格结构的基础概念。

> 本项目仅用于心理学知识科普与学习交流，不构成临床诊断、心理治疗或医疗建议。如有持续心理困扰，请向具备相应资质的专业人士寻求帮助。

## 功能概览

- 首屏与站内锚点导航：支持首页、导言、理论、发展史、梦境和人格结构之间的平滑定位。
- 精神分析导言：介绍精神分析与潜意识的基础概念。
- 人格三元结构：可交互切换本我（Id）、自我（Ego）和超我（Superego）。
- 理论发展史：以时间轴形式展示弗洛伊德、荣格、阿德勒和拉康等理论节点。
- 梦境实验室：选择梦境意象，查看基于精神分析视角的示例解读。
- 全局状态：使用 Pinia 管理人格选择、滚动深度和音频开关状态。
- 响应式界面：导航栏在滚动和窄屏环境下均可用。

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
│   ├── AppNavbar.vue       # 顶部导航与音频开关入口
│   ├── HeroSection.vue     # 首屏
│   ├── IntroductionSection.vue
│   ├── TheorySection.vue
│   ├── TimelineSection.vue # 理论发展史
│   ├── DreamLab.vue        # 梦境实验室
│   ├── PersonalitySection.vue
│   └── AppFooter.vue       # 页脚与免责声明
├── data/                   # 理论与梦境示例数据
├── router/                 # Vue Router 配置
├── stores/                 # Pinia 全局状态
├── views/HomeView.vue      # 首页区块编排
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

- 新增页面区块时，应在 `HomeView.vue` 中完成编排，并补齐对应 section `id` 与导航锚点。
- 跨组件共享状态统一通过 `usePsychoStore` 管理；不要重复创建相同全局状态。
- 页面内容仅作科普，请保留学术免责声明并避免作出诊断性表述。
- 提交前请运行 `npm run build`，并确认未包含其他成员的无关改动。