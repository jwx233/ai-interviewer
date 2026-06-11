# InterviewLab AI

纯前端个人 AI 模拟面试官。开始时一次生成整套题目，答题过程零 AI 请求，结束时一次生成逐题点评与五维报告，从而减少重复 Prompt 和 Token 消耗。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

未配置 `VITE_SILICONFLOW_API_KEY` 时自动使用内置题库；配置后调用硅基流动 `Qwen/Qwen3.5-35B-A3B`。

## 安全说明

纯前端无法隐藏 API Key。请使用低余额、项目专用 Key，不要提交 `.env.local`。部署时可配置 GitHub Actions Secret `SILICONFLOW_API_KEY`，但构建后的 Key 仍能被网页访问者提取。
