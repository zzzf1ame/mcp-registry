export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">MCP Registry</h3>
            <p className="text-sm text-gray-600">
              发现、评估和管理 Model Context Protocol 服务器。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">链接</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/servers" className="text-gray-600 hover:text-gray-900">浏览服务器</a></li>
              <li><a href="/submit" className="text-gray-600 hover:text-gray-900">提交服务器</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">关于项目</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">资源</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://modelcontextprotocol.io" className="text-gray-600 hover:text-gray-900">MCP 官方文档</a></li>
              <li><a href="https://github.com/zzzf1ame/mcp-registry" className="text-gray-600 hover:text-gray-900">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          © 2026 MCP Registry. MIT 开源协议。
        </div>
      </div>
    </footer>
  )
}
