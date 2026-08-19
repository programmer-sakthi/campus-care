import React, { useState } from "react"
import { Link, useNavigate } from "react-router"
import { cn } from "@repo/ui/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@repo/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { trpc } from "../../lib/trpc"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [institutionCode, setInstitutionCode] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        navigate("/login", { replace: true })
      },
      onError: (error: unknown) => {
        setStatus("error")
        setMessage(
          error instanceof Error ? error.message : "Unable to create institution account.",
        )
      },
    }),
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setMessage("")
    

    registerMutation.mutate({
      email,
      password,
      type: "INSTITUTION",
      institutionCode,
      institutionName,
    })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register as admin</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="institution-code">Institution code</FieldLabel>
          </div>
          <Input
            id="institution-code"
            name="code"
            placeholder="SKCET"
            required
            value={institutionCode}
            onChange={(event) => setInstitutionCode(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="institution-name">Institution name</FieldLabel>
          </div>
          <Input
            id="institution-name"
            name="name"
            placeholder="Sri Krishna"
            required
            value={institutionName}
            onChange={(event) => setInstitutionName(event.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={status === "saving" || registerMutation.isPending}>
            {status === "saving" || registerMutation.isPending ? "Registering…" : "Register"}
          </Button>
        </Field>

        {message ? (
          <Field>
            <FieldDescription
              className={`text-center ${
                status === "error" ? "text-destructive" : "text-success text-green-300"
              }`}
            >
              {message}
            </FieldDescription>
          </Field>
        ) : null}

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
