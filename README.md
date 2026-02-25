# 像素风闯关游戏 🎮

这是一个基于 React + Vite 打造的 2000 年代复古像素风问答游戏。题目数据和成绩统计完全依赖于 Google Sheets 和 Google Apps Script 实现，无需额外部署后端数据库。

## ✨ 特色功能

- **复古像素 UI**：使用 `Press Start 2P` 字体沉浸式街机体验。
- **随机关主生成**：透过 DiceBear API 生成独特的像素风小怪、关主图片。
- **Google Sheets 驱动**：使用 Google Sheets 作为题目题库与玩家成绩数据库，修改存取超简单。

---

## 🚀 极速安装与启动

### 1. 前端项目配置

请确保你的电脑已经安装了 [Node.js](https://nodejs.org/)。

```bash
# 1. 抓取本项目
# 进入目录
cd pixel-game

# 2. 安装依赖包
npm install

# 3. 复制环境变量范例并建立配置档
# 在根目录建立 .env 文件，内容如下：
# VITE_GOOGLE_APP_SCRIPT_URL=你的GoogleAppScript网址
# VITE_PASS_THRESHOLD=3
# VITE_QUESTION_COUNT=5

# 4. 启动本地开发伺服器
npm run dev
```

打开浏览器访问 `http://localhost:5173/` 即可看到游戏画面。

---

## 📊 Google Sheets 与 Apps Script 配置指南

此游戏仰赖 Google Sheets 提供资料，请按照以下步骤配置后端：

### 步骤 1：建立 Google Sheets 数据库

1. 新开一个空的 [Google Sheets](https://sheets.google.com/) 试算表。
2. 建立两个工作表，名称必须命名为：
   - **题目** (用于放题库)
   - **回答** (用于记录玩家成绩)

### 步骤 2：设定「题目」工作表栏位

在「题目」工作表的第一行（A1 到 G1）填入以下标头（必须完全一致）：
| 题号 | 题目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| (底下填入题目内容，例如：1、2、3...) | (你的题目...) | ... | ... | ... | ... | (填入A,B,C或D) |

*（可以在本说明文件最底部复制 20 题测试题目贴上）*

### 步骤 3：设定「回答」工作表栏位

在「回答」工作表的第一行（A1 到 G1）填入以下标头：
| ID | 闯关次数 | 总分 | 最高分 | 第一次通关分数 | 花了几次通关 | 最近游戏时间 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

这边的资料会在玩家每一次游戏结束（GameOver 或是 Clear）后由系统自动填入更新。

### 步骤 4：部署 Google Apps Script

1. 在刚刚建好的 Google Sheets 画面上方清单，点击 **扩展功能** (Extensions) -> **Apps Script**。
2. 将默认的程序代码清空。
3. 把本项目中 `google-apps-script-example.js` 档案里的**所有代码**复制，贴到 Apps Script 编辑器中。
4. 点选右上角的 **部署** (Deploy) -> **新增部署** (New deployment)。
5. 点击齿轮图示，选择类型为 **网络应用程式** (Web App)。
6. 设定如下：
   - 描述：(可随意填例如：`Pixel Game API`)
   - 执行身份 (Execute as)：**我** (Me - `<你的信箱>`)
   - 存取权限 (Who has access)：**所有人** (Anyone)
7. 点击 **部署**，并在跳出的视窗中给予存取授权 (Advance -> Go to ... (unsafe))。
8. 授权完成后，会得到一串 **网路应用程式网址 (Web App URL)**，将其复制。

### 步骤 5：连线前端与后端

将刚刚复制的 Web App URL 贴到你的前端项目 `.env` 档案中：

```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/xxxxxxxxxxxx/exec
```

储存后重新启动 `npm run dev`，你的像素游戏就正式连上真实资料库了！

---

## 🌐 自动部署到 GitHub Pages

此项目已经设定好 **GitHub Actions** 流程，只要将代码推送到 GitHub，就会自动打包并部署到 GitHub Pages。

### 部署步骤：

1. **建立 GitHub 仓库 (Repository)**
   - 在你的 GitHub 建立一个新仓库。
   - 将本地代码推送到该仓库：
     ```bash
     git remote add origin <你的仓库网址>
     git branch -M main
     git push -u origin main
     ```

2. **配置 GitHub Secrets (环境变量)**
   为了保护你的 Google Apps Script URL 以及设定关卡，你必须去 GitHub 仓库设定密码：
   - 到你的仓库页面，点击 **Settings** -> **Secrets and variables** -> **Actions**。
   - 点击 **New repository secret**，分别新增以下三个 Secrets（对应你在 `.env.example` 中的值）：
     - `VITE_GOOGLE_APP_SCRIPT_URL` : 填入你部署的 Web App URL (以 `/exec` 结尾)
     - `VITE_PASS_THRESHOLD` : 填入通关门槛 (例如 `3`)
     - `VITE_QUESTION_COUNT` : 填入题目数量 (例如 `5`)

3. **启用 GitHub Pages 功能**
   - 到仓库的 **Settings** -> **Pages**。
   - 在 **Build and deployment** 区块下，将 **Source** 更改为 **GitHub Actions**。

4. **触发自动部署**
   每次你推送代码到 `main` 或 `master` 分支，GitHub Actions 就会自动读取这些 Secrets 并建立网页。
   部署完成后，你可以在 Settings -> Pages 看到游戏上线的网址 (通常为 `https://<你的帐号>.github.io/<仓库名称>/`)！

---

## 📝 附录：20题「生成式AI基础知识」题库测资

请直接复制以下表格内容（包含标头若你还没建立），贴入你 Google Sheets 的「题目」工作表中：

| 题号 | 题目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 生成式AI（Generative AI）的主要功能是什么？ | 只能对数据进行分类与排序 | 生成新的文本、图片、音频或影片等内容 | 专门用来拦截电脑病毒 | 清理电脑硬碟中的多余档案 | B |
| 2 | 下列哪一项是生成式AI的常见应用例子？ | ChatGPT 写文章 | Excel 计算总和 | Word 设定字体粗细 | 玩超级玛利欧 | A |
| 3 | ChatGPT 是由哪一家公司开发的？ | Google | Microsoft | OpenAI | Apple | C |
| 4 | LLM 在人工智慧领域中代表什么？ | Large Language Model (大型语言模型) | Low Level Machine (低阶机器) | Linear Logic Module (线性逻辑模块) | Local Link Method (区域连结法) | A |
| 5 | Midjourney 主要是用来生成什么类型的内容？ | 音乐 | 影片剪辑 | 图像 | 程式码 | C |
| 6 | 下列关于“提示词（Prompt）”的描述，何者正确？ | 它是输入给AI的指令或问题，用来引导AI产出结果 | 它是AI的一种报错代码 | 它是用来格式化硬碟的指令 | 它是AI运行所需的一种实体晶片 | A |
| 7 | 生成式AI在训练过程中通常需要什么？ | 极少的数据 | 大量的数据（通常是文字、图片等） | 只需要人工逐条输入规则 | 不需要任何数据 | B |
| 8 | 下列哪一个是著名的文字生成影片模型？ | Sora | Siri | Alexa | Cortana | A |
| 9 | 所谓“幻觉（Hallucination）”在生成式AI中是指什么现象？ | AI产生立体的视觉效果 | AI模型因为太热而当机 | AI产出听起来合理但实际上错误或捏造的资讯 | AI获得自我意识 | C |
| 10 | 为什么不建议将公司高度机密输入给公共的生成式AI工具？ | 会导致AI立刻当机 | 因为输入的内容可能会被用作未来的训练资料而造成泄密 | 会让网路速度变慢 | AI 会拒绝回答所有问题 | B |
| 11 | GPT-4 相比于 GPT-3，主要的差异之一是什么？ | 变笨了 | 增加了多模态能力（例如看图说话） | 只能用英文 | 不再需要网路 | B |
| 12 | 深度学习（Deep Learning）是人工智慧领域的哪一部分？ | 和AI毫无关系 | 属于机器学习（Machine Learning）的子集 | 是电脑组装的一门技术 | 专门用在物联网感测器 | B |
| 13 | “Fine-tuning（微调）”在AI模型中的目的是什么？ | 让电脑的运算声音变小 | 在已训练好的模型基础上，针对特定领域的数据再次训练以提升专业能力 | 调整萤幕的色彩对比度 | 缩小AI模型的档案大小以便存于随身碟 | B |
| 14 | 哪一个技术名称通常与图像生成任务相关（例如 Stable Diffusion）？ | 排序演算法（Sorting Algorithm） | 扩散模型（Diffusion Model） | 二元树搜寻（Binary Search Tree） | 哈希映射（Hash Mapping） | B |
| 15 | AI生成的内容版权目前在多国的常见争议点是什么？ | AI产生的内容字体不够好看 | AI生成的内容是否具备著作权，以及训练资料是否侵权 | AI的图像档案太大无法寄送邮件 | AI生成的内容一定要使用彩色打印 | B |
| 16 | 如果你给AI一个模糊且简短的Prompt，结果通常会如何？ | AI会产出完全符合你心中所想的答案 | AI无法运作并直接关机 | AI会瞎猜或提供非常表面、泛泛的答案 | AI会帮你写出比原来长一百倍的Prompt | C |
| 17 | RAG（检索增强生成）技术的作用是什么？ | 让AI在回答前先检索外部资料库以提高准确性并减少幻觉 | 让AI强制播放音乐以干扰使用者 | 把文字直接转成3D列印物件 | 清除浏览器的Cache | A |
| 18 | Google 所推出的对话式 AI 机器人原名为 Bard，后来改名叫什么？ | Bing | Gemini | Claude | Watson | B |
| 19 | 当生成式AI给出错误的程式码时，作为工程师的最佳作法是什么？ | 直接放弃写程式 | 完全照抄不加检查 | 指出错误并要求它修正，或自行审查调整 | 责怪电脑硬体不好 | C |
| 20 | “Token” 在语言模型中指的是什么意思？ | 实体游乐场代币 | AI 处理文本的最小基本运算单位（通常对应于单词或词根） | 一种虚加密货币用来买AI | 网站登入的账号密码 | B |
