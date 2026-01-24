import { RegisterForm } from "@/components/register-form";
import React from "react";

// default export -- can import with any name
export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Register</h1>
      </div>

      <RegisterForm />
    </div>
  );
}
