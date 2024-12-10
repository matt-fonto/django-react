import { AuthenticateForm } from "@/components/AuthenticateForm";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <AuthenticateForm
        behavior="signup"
        onResultRedirectTo="/login?success=true"
      />
    </div>
  );
}
