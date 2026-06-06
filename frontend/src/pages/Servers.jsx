import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { serversApi } from '../api/client'

const CATEGORIES = ['database', 'ai', 'web', 'cloud', 'tool', 'other']

export default function Servers() {
  const [params, setParams] = useSearchParams()
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchServers()
  }, [params])

  const fetchServers = async () => {
    setLoading(true)
    try {
      const data = await serversApi.list({
        q: params.get('q') || undefined,
        category: params.get('category') || undefined,
        page,
        page_size: 20,
      })
      setServers(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParams({ q, category, page: 1 })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">浏览 MCP 服务器</h1>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索服务器..."
          className="flex-1 min-w-0 px-4 py-2 border rounded-lg"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">全部分类</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          搜索
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center py-12">加载中...</div>
      ) : servers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          暂无服务器，<a href="/submit" className="text-blue-600 hover:underline">快来提交第一个吧</a>！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map(s => (
            <a key={s.id} href={`/servers/${s.slug}`} className="block p-4 bg-white rounded-lg border hover:shadow-md transition">
              <div className="font-semibold text-gray-900 mb-1">{s.name}</div>
              <div className="text-sm text-gray-600 mb-2 line-clamp-2">{s.description || '暂无描述'}</div>
              <div className="flex gap-2 text-xs text-gray-500">
                <span>⭐ {s.stars || 0}</span>
                <span>📦 {s.category}</span>
                <span>💬 {s.review_count || 0}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
