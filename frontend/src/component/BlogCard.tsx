import { useNavigate } from "react-router-dom";

export const BlogCard = ({title, content, date , id, name}) => {
    const navigate = useNavigate()

    const shortContent = content.length > 200 ? `${content.substring(0,200)}...` : content;
    const shortTitle = title.length > 50 ? `${title.substring(0,100)}...` : title;

    return <button onClick={() => {
        navigate("/selectblog", {state: {id, title, content, date, name}})
    }} className="border-b pl-3 py-2 mt-4 block text-left w-11/12 ">
        <div className="flex ml-2 mt-3 items-center ">
            <div className="bg-slate-400 font-bold h-6 w-6 flex justify-center items-center rounded-full">{name[0]}</div> 
            <p className="pl-2 text-sm">{name}</p>
        </div>
        <div>
            <h1 className="font-bold text-lg ml-2 mb-2 ">{shortTitle}</h1>
            <p className="text-slate-500 font-medium text-sm ml-2">{shortContent}</p>
        </div>
        <div className="text-slate-600 text-xs ml-2 mt-8">
            <p>{date}</p>
        </div>
    </button>
}