import { Routes, Route, Navigate } from 'react-router-dom'
import Loading from '@/components/Loading'
import { lazy, Suspense } from 'react'
import Layout from '@/layout'
import Login from '@/pages/Login/index.tsx'
import Calendar from '@/pages/Calendar'
import Downloader from '@/pages/Downloader'
import VideoPlayer from '@/pages/VideoPlayer'

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}
const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/player" element={<VideoPlayer />}></Route>
      <Route path="/" element={<Layout />}>
      <Route path="/calendar" element={<Calendar />}></Route>
      <Route path="/downloader" element={<Downloader />}></Route>
        <Route path="/" element={<Navigate to="/calendar" />}></Route>
        <Route
          path="/*"
          element={lazyLoad(
            lazy(async () => import('@/pages/Admin/index.tsx'))
          )}></Route>
      </Route>
    </Routes>
  )
}

export default Router
