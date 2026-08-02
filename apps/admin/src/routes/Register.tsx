import { RegisterForm } from "../pages/register/register-form"
import { Brain } from "lucide-react"
import registerBg from "../pages/register/asset/register-bg.jpeg"

const Register = () => {
  return (
  <div className="grid min-h-svh lg:grid-cols-2">
    <div className="relative hidden bg-muted lg:block">
        <img
          src={registerBg}
          alt="Register background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Brain className="size-4" />
            </div>
            Campus Care.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register