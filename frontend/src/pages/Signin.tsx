
import { SigninBox } from "../component/Signin"
import { Logo } from "../component/Logo"


export const Signin = () => {
    return <div className="grid grid-cols-1 sm:grid-cols-2">
    <div>
    <SigninBox />
    </div>
    <div className="hidden sm:block">
    <Logo />
    </div>

</div>
}