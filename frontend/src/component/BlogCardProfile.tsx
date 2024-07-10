import { useNavigate } from "react-router-dom"

export const BlogCardProfile = ({title, content, id, date, publishedAt, pubBool, type}) => {
    
    const navigate = useNavigate()
    
    const shortContent = content.length > 100 ? `${content.substring(0,100)}...` : content;
    const shortTitle = title.length > 30 ? `${title.substring(0,100)}...` : title;


    return <div className="border-b pl-3 py-2  ">
       
        <div>
            <h1 className="font-bold text-xl ml-2 ">{shortTitle}</h1>
            <p className="text-slate-500 font-medium text-sm ml-2">{shortContent}</p>
        </div>
        <div className="text-slate-600 text-xs ml-2 mt-8 flex">
            <p>{date}</p>
            <button onClick={() => {
                navigate("/edit",{state: {id, title, content, pubBool }} )
            }} className="pl-2 hover:text-slate-950 hover:font-bold">Edit</button>
            <button onClick={() => {
                {publishedAt(id)}
            }} className={`${(type=="publish" ? "hidden": "flex")} pl-2 hover:text-slate-950 hover:font-bold`}>Publish</button>
        </div>
    </div>
}