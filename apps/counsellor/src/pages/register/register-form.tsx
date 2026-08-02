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
  

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      
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
