import { useAuth } from "@/providers/useAuth";
import { useLogout } from "@/queries/auth/useLogout";
import { Button } from "@/components/ui/button";

function Dashboard() {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          {user && (
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Role:</span> {user.role}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">User ID:</span> {user.id}
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleLogout}
          disabled={isPending}
          className="bg-red-500 hover:bg-red-600"
        >
          {isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
