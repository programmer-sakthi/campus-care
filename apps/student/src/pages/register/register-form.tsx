import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";

import { trpc } from "@/lib/trpc";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions({
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
      onError: (error: any) => {
        setSuccess(null);
        setError(error?.message ?? "Registration failed");
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    registerMutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      type: "STUDENT",
      studentRegNo: formData.get("register-number") as string,
      institutionCode: formData.get("code") as string,
      name: formData.get("name") as string,
    });
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
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <Input id="password" name="password" type="password" placeholder="Create a password" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="institution-code">Institution code</FieldLabel>

          <Input
            id="institution-code"
            name="code"
            placeholder="SKCET"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Student's Name</FieldLabel>

          <Input id="name" name="name" placeholder="Sakthi" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="register-number">Register Number</FieldLabel>

          <Input
            id="register-number"
            name="register-number"
            placeholder="727723EUITXXX"
            required
          />
        </Field>

        <Field>
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Registering..." : "Register"}
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
              <Link to="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </span>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
