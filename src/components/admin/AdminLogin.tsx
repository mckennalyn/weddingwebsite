"use client";

import { useActionState } from "react";
import { loginAdmin } from "@/actions/admin-auth";

export function AdminLogin() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-6 text-center">
      <p className="letter-wide text-xs uppercase text-ink/70">
        Administration
      </p>
      <form action={action} className="mt-8 w-full">
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoFocus
          className="w-full border-b border-line bg-transparent px-2 py-3 text-center font-display text-xl text-ink outline-none placeholder:text-ink/50 focus:border-gold"
        />
        {state?.error && (
          <p className="mt-3 text-sm text-red-700">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="letter-wide mt-6 w-full border border-gold px-8 py-3 text-xs uppercase text-gold-deep transition-colors hover:bg-gold hover:text-paper disabled:opacity-50"
        >
          {pending ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
