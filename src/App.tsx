import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar, { SECTIONS } from './components/Navbar'
import Listing from './pages/Listing'
export default function App() {
  return (<BrowserRouter><Navbar /><Routes>
    <Route path="/" element={<Listing home />} /><Route path="/search" element={<Listing />} />
    {SECTIONS.map(([s]) => <Route key={s} path={`/${s.toLowerCase()}`} element={<Listing />} />)}
  </Routes></BrowserRouter>)
}
