import { SignInInput } from "@sushen1234/blog-common"
import { Button } from "./Button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"


export const SigninBox = () => {
    const [inputs, setInputs] = useState<SignInInput>({
        username: "",
        password: ""
    })
    const navigate = useNavigate()
    const [err, setErr] = useState("")
    const [load, setLoad] = useState(false)

    return <div className="h-screen flex justify-center items-center ">
        <div className="bg-bluecolor shadow-2xl mx-2 rounded-md">
        <h1 className="text-center font-bold text-3xl">Sign In</h1>
        <p className="text-center px-10 mb-6 mt-2">Enter your information for Login</p>
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
        <Button href={"/signup"} type={load ? "Signing In...": "Sign in"} otype={"Sign up"} text={"Do not have any account?"} onClick={async() => {
            try {
                setLoad(true)
                const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, inputs  )
                const token = await response.data.token;
                localStorage.setItem("token", token)
                navigate("/blog")
                setLoad(false)
            }
            catch(err) {
               
                setErr(err.response.data.message)
                
            }
        }} />
        {err && <div> 
            <p className="text-center text-red-700" >{err}</p>
            </div>}
        </div>
    </div>
}