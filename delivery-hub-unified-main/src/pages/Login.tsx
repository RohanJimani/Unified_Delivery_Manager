
import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";

const Login = () => {
  return (
    <Layout requireAuth={false}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md mb-8 text-center">
          <div className="text-delivery-blue font-bold text-3xl flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M8 11h8" />
              <path d="M12 15V7" />
            </svg>
            Unified Delivery Manager
          </div>
          <p className="text-muted-foreground">
            Manage all your delivery tasks from multiple platforms in one place
          </p>
        </div>
        <LoginForm />
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Demo credentials: demo@example.com / password
        </div>
      </div>
    </Layout>
  );
};

export default Login;
