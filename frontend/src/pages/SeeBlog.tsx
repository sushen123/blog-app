import { useState, useEffect } from "react"
import { Navbar } from "../component/NavBar"
import { useLocation } from "react-router-dom"
import ReactMarkdown from "react-markdown";
import prettier from 'prettier/standalone';
import * as parsers from 'prettier/parser-markdown';

export const SeeBlog = () => {
    const {state} = useLocation()
    const title = state.title
    const content = state.content
    const name = state.name
    const date = state.date


    const [formattedContent, setFormattedContent] = useState<string | null>(null);

    useEffect(() => {
        const formatContent = async () => {
            try {
                const formatted = await prettier.format(content, {
                    parser: "markdown",
                    plugins: [parsers],
                });
                setFormattedContent(formatted);
            } catch (error) {
                console.error("Error formatting content:", error);
                setFormattedContent(content);
            }
        };

        if (content) {
            formatContent();
        }
    }, [content]);


    return <div>
        <Navbar name={name} />
       <div className="ml-3 mt-4">
        <h1 className="text-4xl font-bold ">{title}</h1>
        <div className="flex mt-4 items-center text-md font-semibold ">
        <h2 className="bg-fuchsia-600 flex w-8 h-8 rounded-full justify-center items-center">{name[0]}</h2>
        <h2 className="ml-2 ">{name}</h2>
        
        </div>
        <h2 className="ml-10">{date}</h2>
        <div className="mt-3 font-serif">
        <ReactMarkdown>{formattedContent}</ReactMarkdown>
        </div>
        </div> 
    </div>
}