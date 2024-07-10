import { useCallback, useEffect, useState } from "react"
import { Navbar } from "../component/NavBar"
import { BlogCardProfile } from "../component/BlogCardProfile"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { formateDate } from "../component/FormattedDate"

export const Profile = () => {
    const [draft, setDraft] = useState(true)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [blogs, setBlogs] = useState([])
    const [pub, setPub] = useState(false)
    const [pubBlog, setPubBlog] = useState([])
   
   

    const nameFn = useCallback(async() => {
        setLoading(true)
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/name`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        setName(response.data.userName)
       return response.data.userName
    },[])

    async function  getBlogs() {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/draft`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        setBlogs(response.data.blog)
        console.log(blogs)
    }

    useEffect(() => {
        nameFn()
        getBlogs()
        setLoading(false)
    },[])
  

    async function  published(userId) {
       
        const response = await axios.put(`${BACKEND_URL}/api/v1/blog/updatePublish`, {
           id: userId
        } , {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
          const data = response.data
          console.log(data)
          getBlogs()
    }

    async function userPublished() {
       
        try {
            setLoading(true)
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/userPublished`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            setPubBlog(response.data.blog)
            console.log(response.data.blog)
        } catch (error) {
            console.error("Error fetching published blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    return <div >
        <Navbar name={name}/>
        <div className="flex ml-3 items-center mt-3 mb-3">
            <h1 className="bg-colors1 w-8 h-8 text-center font-bold   pt-1 rounded-full">{name[0]}</h1>
            <h1 className="ml-2 font-semibold text-2xl">{name}</h1>
        </div>
      
        <div className="flex ml-3 mt-5 ">
            <button onClick={() => {
                setDraft(true)
                setPub(false)
            }} className={`pb-2 border-b-2 ${draft ? 'text-slate-950 border-slate-950' : 'text-slate-500 border-hidden'}`}>
               <h1 className="pb-2">Draft</h1>
               
                </button>
                <button onClick={() => {
                    setDraft(false)
                    setPub(true)
                    userPublished()
                }} className={`pb-2 ml-5 border-b-2 ${draft ? 'text-slate-500 border-hidden ' : 'text-slate-950 border-slate-950'}`}>
               <h1 className=" pb-2 ">Published</h1>
                </button>
        </div>
        <hr />
        <div>
         {draft &&  blogs.map((blog) => (
        <BlogCardProfile key={blog.id} id={blog.id} title={blog.title} content={blog.content} date={formateDate(blog.createdAt) } publishedAt={() => published(blog.id) } pubBool={blog.published} type={"draft"} />
         )) }
          {pub && pubBlog.map((blog) => (
        <BlogCardProfile key={blog.id} id={blog.id} title={blog.title} content={blog.content} date={formateDate(blog.createdAt) } publishedAt={() => published(blog.id)} pubBool={blog.published} type={"publish"} />
         )) }
        
        </div>
    </div>
}