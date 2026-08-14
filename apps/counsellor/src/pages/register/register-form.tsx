import React, { useRef, useState } from "react"
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
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        setStatus("idle")
        setError(null)
        formRef.current?.reset()
      },
      onError: (err: any) => {
        setStatus("error")
        setError(err?.message ?? "Registration failed")
      },
    }),
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = (formData.get("name") as string) || undefined

    setStatus("saving")

    registerMutation.mutate({
      email,
      password,
      type: "COUNSELLOR",
      counsellorEmail: email,
      name,
    })
  }

  return (
    <form
      ref={formRef}
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register as counsellor</h1>
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
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" placeholder="Create a password" required />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="counsellor-name">Counsellor name</FieldLabel>
          </div>
          <Input
            id="cousellor-name"
            name="name"
            required
          />
        </Field>

        <Field>
          <Button type="submit" disabled={status === "saving" || registerMutation.isPending}>
            {status === "saving" || registerMutation.isPending ? "Registering…" : "Register"}
          </Button>
        </Field>

        {error && (
          <Field>
            <p className="text-sm text-red-500">{error}</p>
          </Field>
        )}

        <Field>
          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              Log in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
