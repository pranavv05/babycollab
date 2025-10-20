import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: "#3b82f6",
          },
        }}
      />
    </div>
  );
}