


export const Button = ({onClick, type, text, otype, href}) => {
    
    
    return <div className="text-center my-2 ">
        <button className="bg-violetcolor p-2 rounded-lg w-11/12 hover:opacity-70" onClick={onClick} >{type}</button>
        <p>{text} <a href={href} className="underline text-colorstext hover:opacity-60">{otype}</a> </p>
    </div>
}