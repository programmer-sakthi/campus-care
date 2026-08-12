import React, { useState } from "react"
import { cn } from "@repo/ui/lib/utils"
import { Button } from "@repo/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field"
import { Input } from "@repo/ui/components/input"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [institutionCode, setInstitutionCode] = useState("")
  const [institutionName, setInstitutionName] = useState("")
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("saving")
    setMessage("")

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL ?? ""
      const response = await fetch(`${baseUrl}/institutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: institutionCode,
          name: institutionName,
        }),
      })

      let responseBody: any = null
      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        try {
          responseBody = await response.json()
        } catch (err) {
          responseBody = null
        }
      } else {
        // Fallback: try to read text body and coerce to message if present
        try {
          const text = await response.text()
          if (text) {
            try {
              responseBody = JSON.parse(text)
            } catch {
              responseBody = { message: text }
            }
          }
        } catch {
          // ignore
        }
      }

      if (!response.ok) {
        const errMsg = responseBody?.message || response.statusText || "Unable to create institution."
        throw new Error(errMsg)
      }

      setStatus("success")
      setMessage("Institution created successfully.")
      setEmail("")
      setInstitutionCode("")
      setInstitutionName("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Unexpected error")
    }
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
          <Button type="submit" disabled={status === "saving"}>
            {status === "saving" ? "Registering…" : "Register"}
          </Button>
        </Field>

        {message ? (
          <Field>
            <FieldDescription
              className={`text-center ${
                status === "error" ? "text-destructive" : "text-success"
              }`}
            >
              {message}
            </FieldDescription>
          </Field>
        ) : null}

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
