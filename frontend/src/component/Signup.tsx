import { useState } from "react"
import { Button } from "./Button"
import axios from "axios"

import { SignUpInput } from "@sushen1234/blog-common"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"


export const SignupBox = () => {
    const [inputs, setInputs] = useState<SignUpInput>({
        name: "",
        username: "",
        password: ""
    })
    const navigate = useNavigate()
    const [error, setError ] = useState("")


    return <div className="h-screen flex justify-center items-center ">
        <div className="bg-bluecolor shadow-2xl mx-2 rounded-md">
        <h1 className="text-center font-bold text-3xl">Sign Up</h1>
        <p className="text-center px-2 mb-6 mt-2">Enter your information to create an account</p>
        <label htmlFor="Name" className="font-bold ml-3">Name</label>
        <br />
        <input type="text" placeholder="Sushen Oli"  className="rounded-md w-11/12 mb-2 py-1 px-3 mx-3 mt-1"  maxLength={45} onChange={(e) => {
                setInputs({
                    ...inputs,
                    name: e.target.value
                })
        }}/>
        <label htmlFor="Username" className="font-bold ml-3">Username</label>
        <br />
        <input type="text" placeholder="email@gmail.com" className="rounded-md w-11/12 mb-2 py-1 px-3 mx-3 mt-1"  maxLength={45} onChange={(e) => {
                setInputs({
                    ...inputs,
                    username: e.target.value
                })
        }}/>
        <label htmlFor="Password" className="font-bold ml-3">Password</label>
        <br />
        <input type="text" placeholder="password" className="rounded-md w-11/12 mb-2 py-1 px-3 mx-3 mt-1"  maxLength={45} onChange={(e) => {
                setInputs({
                    ...inputs,
                    password: e.target.value
                })
        }}/>
        <Button href={"/"} type={"Sign Up"} otype={"Sign In"} text={"Already have an account?"} onClick={async() => {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, inputs)
                const token = await response.data.token;
                localStorage.setItem("token", token)
                navigate("/blog")
            }
            catch(error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message || "An error occurred");
                } else {
                    setError("An error occurred");
                }
              
            }
        }}/>
         {error && <div> 
            <p className="text-center text-red-700" >{error}</p>
            </div>}
        </div>
    </div>
}