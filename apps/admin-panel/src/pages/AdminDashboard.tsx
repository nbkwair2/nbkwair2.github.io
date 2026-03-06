import { UserRole } from "@cloudkitchen/shared-types";

const MOCK_USERS = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: UserRole.CUSTOMER, orders: 12 },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: UserRole.KITCHEN_STAFF, orders: 0 },
  { id: "3", name: "Carol White", email: "carol@example.com", role: UserRole.ADMIN, orders: 0 },
];

const ROLE_COLORS: Record<string, string> = {
  [UserRole.CUSTOMER]: "bg-blue-100 text-blue-800",
  [UserRole.KITCHEN_STAFF]: "bg-orange-100 text-orange-800",
  [UserRole.ADMIN]: "bg-purple-100 text-purple-800",
  [UserRole.DELIVERY_DRIVER]: "bg-green-100 text-green-800",
};

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", count: 128, color: "bg-indigo-50 border-indigo-200" },
          { label: "Total Orders", count: 1024, color: "bg-green-50 border-green-200" },
          { label: "Revenue (Today)", count: "$2,450", color: "bg-yellow-50 border-yellow-200" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-4 ${stat.color}`}>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{user.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
