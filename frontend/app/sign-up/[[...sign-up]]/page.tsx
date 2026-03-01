import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] items-center justify-center gap-8">
      <SignUp signInUrl="/sign-in" afterSignUpUrl="/upload" />

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4 w-full max-w-[400px]">
          <div className="h-[1px] flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Or</span>
          <div className="h-[1px] flex-1 bg-border" />
        </div>

        <Button variant="outline" asChild className="rounded-full px-8 border-2">
          <Link href="/upload">Continue as Guest</Link>
        </Button>
      </div>
    </div>
  );
}
