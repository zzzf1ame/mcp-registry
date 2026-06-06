import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Servers from './pages/Servers'
import ServerDetail from './pages/ServerDetail'
import Submit from './pages/Submit'
import About from './pages/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/servers/:slug" element={<ServerDetail />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
