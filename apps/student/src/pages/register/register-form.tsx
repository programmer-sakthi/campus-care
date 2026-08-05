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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const payload = {
        email: formData.get("email") as string | null,
        name: formData.get("name") as string | null,
        institutionCode: formData.get("code") as string | null,
        regNo: formData.get("register-number") as string | null,
      } as Record<string, any>;

      const apiBaseUrl = import.meta.env.VITE_API_URL;
      const endpoint = new URL("/students", apiBaseUrl).toString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = { message: await res.text() };
      }

      if (!res.ok) {
        setError(data?.message || "Failed to register");
      } else {
        setSuccess(data?.message || "Registered successfully");
        form.reset();
      }
    } catch (err: any) {
      setError(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register as Student</h1>
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
            <FieldLabel htmlFor="institution-code">Institution code</FieldLabel>
          </div>
          <Input
            id="institution-code"
            name="code"
            placeholder="SKCET"
            required


          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="institution-name">Student's Name</FieldLabel>
          </div>
          <Input
            id="name"
            name="name"
            placeholder="Sakthi"
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="register-number">Register Number</FieldLabel>
          </div>
          <Input
            id="register-number"
            name="register-number"
            placeholder="727723euitxxx"
            required
          />
        
        </Field>

        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Field>



        <Field>
          <FieldDescription className="text-center">
            {error && (
              <span className="block text-sm text-destructive">{error}</span>
            )}
            {success && (
              <span className="block text-sm text-success">{success}</span>
            )}
            <span className="mt-2 block">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Log in
              </a>
            </span>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
