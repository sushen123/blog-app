
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Blog } from "./pages/Blog"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Write } from "./pages/Write"
import { Profile } from "./pages/Profile"
import { Edit } from "./pages/EditWrite"
import { SeeBlog } from "./pages/SeeBlog"
function App() {
  

  return (
    <div >
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/> 
        <Route path="/blog" element={<Blog/>}/> 
        <Route path="/write" element={<Write/>}/> 
        <Route path="/profile" element={<Profile/>}/>   
        <Route path="/edit" element={<Edit/>}/>
        <Route path="/selectblog" element={<SeeBlog/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
