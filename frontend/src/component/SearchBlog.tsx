import { useNavigate } from "react-router-dom"

 

 export const SearchBlog = ({blog, object}) => {
    const navigate = useNavigate()
    const {id, title, content, published, name} = blog

    return <div className="ml-2 pr-1 border-b-2 pb-2" onClick={() => {
        navigate("/selectblog", {state: {id, title, content, published, name}})
    }}>
        <h1 className="font-semibold my-2">{highlightText(title, object)}</h1>
        <div className="flex items-center ">
            <div className="w-8 h-8 rounded-full bg-bluecolor flex justify-center items-center">{name[0]}</div>
            <h1 className="ml-2" >{highlightText(name, object)}</h1>
           
        </div>
    </div>
       
 }


 const highlightText = (text, searchTerm) => {
    if(!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

    return parts.map((part, index) => 
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className="bg-yellow-400 font-semibold">
                {part}
            </span>
        ) : (
            part
        )
    )
 }