import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {  useRef } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { SearchBlog } from "./SearchBlog"


export const Navbar = ({name}) => {
    const [profileOptions, setProfileOptions ] = useState(false)
    const navigate = useNavigate()
    const profileRef = useRef(null);
    const [object, setObject] = useState("")
    const [blogs, setBlogs] = useState([])
    const searchRef = useRef(null)
    const ignoredKeyWords = ["the", "a", "in", "are", "an", " " , "", "is", "that", "this"]
   
    function useDebounce(value:string, delay: number) {
        const [debounceValue, setDebounceValue] = useState(value)

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebounceValue(value)
            }, delay)

            return () => {
                clearTimeout(handler)
            }
        }, [value, delay])

        return debounceValue
    }

    const debounceObject = useDebounce(object, 300)

    

    const handleProfileClick = () => {
        setProfileOptions(!profileOptions)
    }

    async function search(object: string) {

        if(ignoredKeyWords.includes(object.toLowerCase())){
           
            return
        }
    
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/search?object=${object}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })

        setBlogs(response.data.blog)
    }

    useEffect(() => {
        if(debounceObject){
            search(debounceObject)
        }
        if(!object) {
            setBlogs([])
        }
       
    },[debounceObject])

    useEffect(() => {
        function handleClickOutside(event) {
            if(searchRef.current && !searchRef.current.contains(event.target)){
                setBlogs([])
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    },[searchRef])
   
    

    return <div className="flex border-b justify-between">
        <div className="flex m-1 ml-2 sm:ml-5 items-center">
        <button onClick={() => {
            navigate("/blog")
        }} className="font-bold text-3xl mt-1  sm:text-5xl" >TW</button>
        <div className="flex ml-2 sm:ml-5 h-full mt-2 items-center ">
            <button className="bg-slate-200 rounded-s-full pl-2 p-2">
        <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
    </button>
    <input onChange={(e) => {
        setObject(e.target.value)
    }} placeholder="Search" className="bg-slate-200 rounded-r-full p-2 outline-none "  type="text"  />
        </div>
        </div>
        <div className="flex items-center mt-2">
           <button onClick={() => {
            navigate("/write")
           }} className="pr-5 text-slate-500 hidden sm:flex hover:text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            <h1 className="pl-2 text-slate-500 ">Write</h1>
            </button>
            <div> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                </div>

        <button onClick={handleProfileClick} className="flex m-2 ml-1 sm:mx-5 items-center w-8 h-8 justify-center  rounded-full bg-cyan-400" ref={profileRef}>
           {name[0]}
        </button>
        {profileOptions && <ProfileClick />}
        </div>
       <div id="scrollbar"  className="sm:w-80 text-sm font-semibold sm:font-bold sm:text-base absolute w-8/12 h-auto max-h-96 bg-white top-14 left-24 overflow-y-auto shadow-2xl rounded-md " ref={searchRef}>
        
        <Search blogs={blogs} debounceObject={debounceObject} />
         

       </div>
    </div>
}

const ProfileClick = () => {
    const navigate = useNavigate()

    return <div className="absolute right-0 top-16 w-48 bg-white border shadow-md ">
    <button onClick={() => {
        navigate("/write")
    }} className="flex pr-5 text-slate-500 sm:hidden p-2  hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
        <h1 className="pl-2 text-slate-500  hover:text-slate-800">Write</h1>
        </button>
       <hr />
        <button onClick={() => {
            navigate("/profile")
        }} className="flex pr-5 text-slate-500 p-2 hover:text-slate-800">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>

        <h1 className="pl-2 text-slate-500 hover:text-slate-800">Profile</h1>
        </button>
        <hr />
        <button onClick={() => {
            localStorage.removeItem("token")
            navigate("/")
        }} className="flex pr-5 text-slate-500 p-2 hover:text-slate-800">
        
        <h1 className="pl-2 text-slate-500 hover:text-slate-800">Sign Out</h1>
        </button>

</div>
}


const Search = ({blogs, debounceObject}) => {


    return <div>
        <div>
       {blogs.map((blog) => (
        <SearchBlog key={blog.id} blog={blog}  object={debounceObject} />
       ) )}
       </div>
       <hr />
    </div>
}