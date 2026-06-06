import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🔌</span>
            <span className="font-bold text-xl text-gray-900">MCP Registry</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/servers" className="text-gray-600 hover:text-gray-900">浏览</Link>
            <Link to="/submit" className="text-gray-600 hover:text-gray-900">提交</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">关于</Link>
          </nav>
          <a
            href="https://github.com/zzzf1ame/mcp-registry"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-gray-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  )
}
