import { AuthenticateForm } from "@/components/AuthenticateForm";

type Params = {
  searchParams: {
    success: string;
  };
};

export default function LoginPage({ searchParams }: Params) {
  return (
    <div className="flex items-center justify-center flex-col h-screen gap-8">
      {searchParams.success === "true" && (
        <h2 className="font-bold text-2xl">
          Your account was created successfully. You can login now
        </h2>
      )}

      <AuthenticateForm behavior="login" onResultRedirectTo="/" />
    </div>
  );
}
