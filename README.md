# InterviewLab AI

纯前端个人 AI 模拟面试官。支持选择题、开放问答、动态追问、简历/JD 分析、本地历史记录与五维面试报告。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

未配置 `VITE_SILICONFLOW_API_KEY` 时自动使用内置题库；配置后调用硅基流动 `Qwen/Qwen3.5-35B-A3B`。

## 安全说明

纯前端无法隐藏 API Key。请使用低余额、项目专用 Key，不要提交 `.env.local`。部署时可配置 GitHub Actions Secret `SILICONFLOW_API_KEY`，但构建后的 Key 仍能被网页访问者提取。
