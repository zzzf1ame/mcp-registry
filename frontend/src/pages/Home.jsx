import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/servers?q=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔌 MCP Server Registry
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            发现、评估和管理 Model Context Protocol 服务器
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索 MCP 服务器..."
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 text-lg"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50"
              >
                搜索
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">MCP 服务器</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">分类</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-gray-600">评论</div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">热门服务器</h2>
          <div className="text-center py-12 text-gray-500">
            暂无数据，快来提交第一个 MCP 服务器吧！
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">如何使用</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold mb-2">1. 搜索</h3>
              <p className="text-gray-600 text-sm">浏览或搜索你需要的 MCP 服务器</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="font-semibold mb-2">2. 安装</h3>
              <p className="text-gray-600 text-sm">查看安装说明，快速集成到你的项目</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-semibold mb-2">3. 评价</h3>
              <p className="text-gray-600 text-sm">为服务器评分，帮助社区发现优质工具</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
