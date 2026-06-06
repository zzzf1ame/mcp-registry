import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ServerDetail() {
  const { slug } = useParams()
  const [server, setServer] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServer()
    fetchReviews()
  }, [slug])

  const fetchServer = async () => {
    try {
      const res = await fetch(`/api/v1/servers/${slug}`)
      const data = await res.json()
      setServer(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/v1/reviews/?server_id=${slug}`)
      const data = await res.json()
      setReviews(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">加载中...</div>
  if (!server) return <div className="text-center py-12 text-gray-500">服务器不存在</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Server Header */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{server.name}</h1>
            <p className="text-gray-600 mt-1">{server.description}</p>
          </div>
          <a
            href={server.repo_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
          >
            GitHub
          </a>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>⭐ {server.stars || 0}</span>
          <span>🍴 {server.forks || 0}</span>
          <span>📦 {server.category}</span>
          <span>💬 {reviews.length} 评论</span>
        </div>
      </div>

      {/* README */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">README</h2>
        <div className="prose max-w-none text-gray-700">
          {server.readme ? (
            <pre className="whitespace-pre-wrap text-sm">{server.readme}</pre>
          ) : (
            <p className="text-gray-500">暂无 README</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">评论 ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">暂无评论，来写第一条吧！</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">{r.author}</span>
                  <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                {r.title && <div className="font-medium text-sm mb-1">{r.title}</div>}
                <p className="text-gray-700 text-sm">{r.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
