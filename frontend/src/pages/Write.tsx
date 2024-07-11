import { useNavigate,  } from "react-router-dom";
import { useState, useRef, useEffect} from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import prettier from 'prettier/standalone';
import * as parsers from 'prettier/parser-markdown';



export const Write = () => {
    
    const [profileOptions, setProfileOptions ] = useState(false)
    const navigate = useNavigate()
    const profileRef = useRef(null);
    const [title, setTitle] = useState("")
    const [story, setStory] = useState("")
    const [saved, setSaved] = useState(false)
    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState("")
    const [publoading, setPubLoadiing] = useState(false)
    const [saveLoading, setSaveLoadiing] = useState(false)
    const [publish, setPublish] = useState(false)
    const [alerts, setAlert] = useState<string | null>(null);

    const handleProfileClick = () => {
        setProfileOptions(!profileOptions)
    }

    const [rows, setRows] = useState<number>(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textareaLineHeight = 24; 
        const previousRows = event.target.rows;
        event.target.rows = 1; 

        const currentRows = Math.floor(event.target.scrollHeight / textareaLineHeight);

        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }

        setRows(currentRows);
       
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.rows = rows;
        }
    }, [rows]);


    


        
        async function saveBlog() {
            setSaveLoadiing(true)
            const formattedStory = await prettier.format(story, {
                parser: "markdown",
                plugins: [parsers],
            });
            console.log(formattedStory)
             const response = await axios.post(`${BACKEND_URL}/api/v1/blog/write`, {
                    title: title,
                    content: formattedStory,
                    name: name
                 }, {
                 headers: {
                     "Authorization": localStorage.getItem("token")
                 }
             
             })
                
                if(response.status===200) {
                    setSaved(true)
                    setId(response.data.id)
                    setAlert("Saved Successfully")
                   
                }
                setSaveLoadiing(false)
           
        
        }

        async function updateBlog() {
                setSaveLoadiing(true)
            const formattedStory = await prettier.format(story, {
                parser: "markdown",
                plugins: [parsers],
            });
    
            const response = await  axios.put(`${BACKEND_URL}/api/v1/blog/update`, {
                   id: id,
                   title: title,
                   content: formattedStory
                
                }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            
            })
               if(response.status===200) {
                   setSaved(true)
                   setAlert("Updated Successfully")
                 
               }
               setSaveLoadiing(false)
       
       }

       async function getName() {
            
        const response = await  axios.get(`${BACKEND_URL}/api/v1/user/name`,  {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        
        })
           const data = response.data
           setName(data.userName)
      
   
   }

   useEffect(() => {
    getName()
   },[])
        
        function  handle() {
            if(saved) {
                updateBlog()
                console.log(id)
            }
            else {
                saveBlog()
            }
       }

       async function updatePublish() {
        setPubLoadiing(true);
        
        try {
            const response = await axios.put(`${BACKEND_URL}/api/v1/blog/updatePublish`, {
                id: id
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
    
            if (response.status === 200) {
                setPublish(true);
                setAlert("Publish Successfully");
            }
        } catch (error) {
            console.error("Failed to publish:", error);
        } finally {
            setPubLoadiing(false);
        }
    }

       
async function updateUnPublish() {
    setPubLoadiing(true);
    
    try {
        const response = await axios.put(`${BACKEND_URL}/api/v1/blog/unPublish`, {
            id: id
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });

        if (response.status === 200) {
            setPublish(false);
            setAlert("Unpublish Successfully");
        }
    } catch (error) {
        console.error("Failed to unpublish:", error);
    } finally {
        setPubLoadiing(false);
    }
}

       useEffect(() => {

        const timeoutId = setTimeout(() => {
            setAlert("");
        }, 2000);
    
        return () => {
            clearTimeout(timeoutId);
        };
       },[alerts])


       
 


    return  <div>
    <div className="flex border-b justify-between">
        <div className="flex m-2 ml-5 items-center">
        <button onClick={() => {
            navigate("/blog")
        }} className="font-bold text-3xl mt-2 sm:text-5xl" >TW</button>
        <div className="flex ml-2 sm:ml-5 h-full mt-2 items-center ">
           <button onClick={() => {
           handle()
            setSaved(true)
           }} className={` ${saveLoading ? "hidden" : "flex"} bg-blue-500 px-3 py-1 rounded-full hover:bg-opacity-50`}> {saved ? "Update": "Save"} </button>
           <button disabled type="button" className={`${saveLoading ? "flex": "hidden"}  py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center`}>
<svg aria-hidden="true" role="status" className="inline w-3 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
</svg>
Loading...
</button>
        </div>
        </div>
        <div className={`mt-5 text-xs ${alerts ? "flex" : "hidden"}`}>
           {alerts}
        </div>
        <div className="flex items-center mt-2">
            <button onClick={() => {
                if(publish) {
                    updateUnPublish()
                }
                else {
                    updatePublish()
                }
            }} className={`bg-green-400 p-1 pr-2 rounded-full hover:bg-opacity-50 ${publoading ? "hidden": "flex"} `}>{publish ? "UnPublish": "Publish"}</button>
            <button disabled type="button" className={`${publoading ? "flex": "hidden"} py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center`}>
<svg aria-hidden="true" role="status" className="inline w-3 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
</svg>
Loading...
</button>
        <button onClick={handleProfileClick} className="flex m-2 mx-2 sm:mx-5 items-center w-8 h-8 justify-center  rounded-full bg-cyan-400 hover:bg-opacity-50" ref={profileRef}>
            {name[0]}
        </button>
        {profileOptions && <ProfileClick />}
        </div>
       
    </div>
    <div className="mt-3"> 
    <textarea onChange={(e) => {
        setTitle(e.target.value)
    }}
        className="text-3xl px-5 w-screen outline-none mb-3 resize-none"
        
        placeholder="Title"
        
    />
    <textarea
        className="text-base px-5 w-screen outline-none resize-none"
        placeholder="Write your story..."
        rows={rows}
        onChange={(e) => {
            setStory(e.target.value)
            handleChange(e)
        }}
        ref={textareaRef }
       
    />
    </div>
    </div>

}


const ProfileClick = () => {
    const navigate = useNavigate()

    return <div className="absolute right-0 top-16 w-48 bg-white border shadow-md ">
    
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