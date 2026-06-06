export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">关于 MCP Registry</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 mb-4">
          MCP Registry 是一个开源的 Model Context Protocol (MCP) 服务器注册中心。
          类似于 npmjs.com 之于 Node.js 包，我们致力于成为 MCP 服务器的集中发现和评估平台。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">什么是 MCP？</h2>
        <p className="text-gray-700 mb-4">
          Model Context Protocol (MCP) 是 Anthropic 推出的开放协议，
          用于标准化 AI 应用与外部数据源和工具之间的连接。
          通过 MCP，开发者可以构建可复用的服务器，为 AI 助手提供上下文、工具和数据。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">为什么需要 MCP Registry？</h2>
        <p className="text-gray-700 mb-4">
          随着 MCP 生态的快速发展，越来越多的 MCP 服务器被创建，
          但缺乏一个统一的发现和评估平台。MCP Registry 旨在：
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li>提供统一的 MCP 服务器目录</li>
          <li>支持搜索、筛选和分类浏览</li>
          <li>通过用户评论和评分帮助发现优质服务器</li>
          <li>追踪服务器版本和 GitHub 数据</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">技术栈</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-4">
          <li><strong>后端</strong>：FastAPI + SQLAlchemy 2.0 (异步) + Pydantic v2</li>
          <li><strong>前端</strong>：React + Vite + Tailwind CSS</li>
          <li><strong>数据库</strong>：SQLite / PostgreSQL</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">贡献</h2>
        <p className="text-gray-700 mb-4">
          欢迎贡献！请访问 <a href="https://github.com/zzzf1ame/mcp-registry" className="text-blue-600 hover:underline">GitHub 仓库</a> 查看贡献指南。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">许可证</h2>
        <p className="text-gray-700">
          MIT License — 自由使用、修改和分发。
        </p>
      </div>
    </div>
  )
}
