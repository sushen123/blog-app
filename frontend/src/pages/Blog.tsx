import { useCallback, useEffect, useState } from "react"
import { BlogCard } from "../component/BlogCard"
import { Navbar } from "../component/NavBar"
import axios from "axios"
import { formateDate } from "../component/FormattedDate"
import { BACKEND_URL } from "../config"


interface Blog {
    id: number,
    name: string,
    title: string,
    content: string,
    createdAt: string,
    author: {name: string}

}



export const Blog = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<{ message: string }  | null>(null); 
    const [name, setName] = useState<string>("");


    const fethBlogs = useCallback(async () => {
        if(loading || !hasMore) return;

        setLoading(true)
        
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk?page=${page}`, {
               
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            const data = response.data
          
            setBlogs((prevBlogs) => [...prevBlogs, ...data.blog])
            setHasMore(page < data.totalPages);
      
          
            setPage((prevPage) => prevPage + 1)
        }
        catch(error) {
            if (axios.isAxiosError(error)) {
                setErr({ message: error.response?.data.message || "An error occurred" });
            } else {
                setErr({ message: "An error occurred" });
            }
        }
        finally {
            setLoading(false)
        }
    }, [page, hasMore, loading])



    useEffect(() => {
        fethBlogs()
       
    },[fethBlogs])

    const handleScroll = useCallback(() => {
        if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && hasMore && !loading) {
           fethBlogs();
        }
    }, [fethBlogs, hasMore, loading])
   
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll])

    const nameFn = useCallback(async() => {
        setLoading(true)
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/name`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        })
        setName(response.data.userName)
      
    },[])

    
    useEffect(() => {
        nameFn()
       
    },[])




    return <div className=" h-screen  ">
        <Navbar name={name} />
        {blogs.map((blog:Blog) => (
                <BlogCard key={blog.id} title={blog.title} content={blog.content} date={formateDate(blog.createdAt)}  id={blog.id}  name={blog.author.name} />
            ))}
            {loading && 
                <div role="status" className="w-12/12 pl-4  p-4 space-y-4 divide-y divide-gray-200 rounded  animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700  ">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                       
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>

                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                      
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                       
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                     
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                       
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                       
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                            <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                        </div>
                       
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
                }
            {err && <div>Error: {err.message}</div> }
    </div>
}