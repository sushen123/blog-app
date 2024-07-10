
import { Logo } from "../component/Logo"
import { SignupBox } from "../component/Signup"



export const Signup = () => {
    

    return <div className="grid grid-cols-1 sm:grid-cols-2">
            <div>
        <SignupBox />
        </div>
        <div className="hidden sm:block">
         <Logo />
         </div>
    </div>
}