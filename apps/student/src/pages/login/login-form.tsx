import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Link, useNavigate } from "react-router"
import { trpc } from "../../lib/trpc"
import { saveSession } from "../../lib/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const login = useMutation(trpc.auth.login.mutationOptions({
    onSuccess: (result) => {
      if (result.user.type !== "STUDENT") { setError("This account is not a student account."); return }
      saveSession({ token: result.token, user: result.user })
      navigate("/book-appointment", { replace: true })
    },
    onError: (cause) => setError(cause.message || "Unable to log in"),
  }))
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null)
    const data = new FormData(event.currentTarget)
    login.mutate({ email: String(data.get("email")), password: String(data.get("password")) })
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={submit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login as student</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit" disabled={login.isPending}>{login.isPending ? "Logging in..." : "Login"}</Button>
        </Field>
        {error && <p className="text-center text-sm text-destructive">{error}</p>}

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
