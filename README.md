# KID_APP

一个面向低龄儿童的英语启蒙小游戏网页应用，围绕动物、汽车、工程车等孩子高兴趣主题，用图片、语音、小游戏和奖励反馈帮助孩子学习英文单词。

## 当前功能

- 欢迎页、首页、主题页、家长区、收藏册完整可用。
- 3 个主题：动物、汽车、工程车。
- 单词预览支持自动播放与手动发音。
- 3 类小游戏串成完整挑战流程：
  - 听声音选图片
  - 图片配对
  - 场景找一找
- 答对后有可见的奖励停顿、星星反馈和动态装饰。
- 本地保存学习进度、累计星星、主题完成状态和设置项。
- 首页主题进度、完成页徽章墙、收藏册解锁状态已接入。

## 技术栈

- React
- TypeScript
- Vite
- 本地存储：localStorage
- 部署方式：静态站点 / Docker + Nginx

## 本地运行

### 方式 1：机器已安装 Node.js

```powershell
npm install
npm run dev
```

### 方式 2：使用仓库内便携 Node.js

当前仓库已使用本地便携 Node 进行开发。

```powershell
$env:Path = "C:\yangz\Copilot\kid_app\.tools\node-v24.16.0-win-x64;" + $env:Path
Set-Location "C:\yangz\Copilot\kid_app"
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

浏览器访问：

- 本机：`http://localhost:4173`
- 局域网其他设备：`http://你的电脑IP:4173`

## 构建

```powershell
npm run build
```

构建产物在 `dist/` 目录。

## 手机上访问

如果你只是在家里测试，可以让手机和电脑连到同一个 Wi-Fi，然后启动：

```powershell
npm run dev -- --host 0.0.0.0 --port 4173
```

再在手机浏览器访问：

- `http://你的电脑局域网IP:4173`

## 群晖 NAS 部署

项目已经补好了群晖可用的 Docker 部署文件：

- `Dockerfile`
- `nginx.conf`
- `compose.yaml`

详细说明见：

- [docs/deploy-synology-nas.md](docs/deploy-synology-nas.md)

## 项目结构

```text
src/
├─ components/common/     通用组件
├─ content/               主题和单词内容
├─ features/audio/        发音能力
├─ pages/                 页面与玩法页
├─ styles/                全局样式
├─ types/                 类型定义
├─ App.tsx                应用主入口
└─ main.tsx               挂载入口
```

## 主要页面

- 欢迎页
- 首页
- 收藏册
- 主题页
- 听声音选图片
- 图片配对
- 场景找一找
- 完成页
- 家长区

## 文档

- [docs/requirements.md](docs/requirements.md)
- [docs/information-architecture.md](docs/information-architecture.md)
- [docs/low-fidelity-prototype.md](docs/low-fidelity-prototype.md)
- [docs/content-manifest.md](docs/content-manifest.md)
- [docs/technical-plan.md](docs/technical-plan.md)
- [docs/deploy-synology-nas.md](docs/deploy-synology-nas.md)

## 后续方向

- 用真实插画和正式音频替换当前内置图形与浏览器语音。
- 加入更多主题和更丰富的奖励收集机制。
- 做成更完整的 PWA，支持桌面快捷方式和离线缓存。
