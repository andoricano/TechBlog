import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <h1 className="text-4xl font-extrabold text-sky-400 mb-4">
        TechBlog 프로젝트 가동 중!
      </h1>
      <p className="text-lg text-slate-300">
        Tailwind CSS가 적용되었다면 이 배경은 짙은 남색이고 글자는 하늘색입니다.
      </p>
      <div className="mt-8 p-4 bg-sky-500 hover:bg-sky-600 rounded-lg cursor-pointer transition-all">
        마우스를 올려보세요
      </div>
    </div>
  )
}
export default App
