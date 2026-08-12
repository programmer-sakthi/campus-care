import React, { useRef, useState } from "react"
import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"
import { registerCounsellor } from "./api"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const name = (formData.get("name") as string) || undefined

    try {
      await registerCounsellor({ email, name })
      setStatus("idle")
      formRef.current?.reset()
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong")
    }
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
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Registering…" : "Register"}
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
