import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['database', 'ai', 'web', 'cloud', 'tool', 'other']

export default function Submit() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    repo_url: '',
    category: '',
    description: '',
    submitted_by: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/v1/servers/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || '提交失败')
      }
      const data = await res.json()
      navigate(`/servers/${data.slug}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">提交 MCP 服务器</h1>
      <p className="text-gray-600 mb-6">
        提交你的 MCP 服务器，审核通过后会展示在注册中心。
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">服务器名称 *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="如：My Awesome MCP Server"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub 仓库地址 *</label>
          <input
            type="url"
            required
            value={form.repo_url}
            onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://github.com/user/repo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">请选择分类</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder="简单描述这个 MCP 服务器的功能..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">提交者（可选）</label>
          <input
            type="text"
            value={form.submitted_by}
            onChange={(e) => setForm({ ...form, submitted_by: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="你的 GitHub 用户名"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交服务器'}
        </button>
      </form>
    </div>
  )
}
