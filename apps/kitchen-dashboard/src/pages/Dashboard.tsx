import { OrderStatus } from "@cloudkitchen/shared-types";

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800",
  [OrderStatus.PREPARING]: "bg-orange-100 text-orange-800",
  [OrderStatus.READY]: "bg-green-100 text-green-800",
  [OrderStatus.OUT_FOR_DELIVERY]: "bg-purple-100 text-purple-800",
  [OrderStatus.DELIVERED]: "bg-gray-100 text-gray-800",
  [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
};

const MOCK_ORDERS = [
  { id: "1", orderNumber: "ORD-001", status: OrderStatus.PENDING, customer: "Alice Johnson", items: 3, total: 42.5 },
  { id: "2", orderNumber: "ORD-002", status: OrderStatus.PREPARING, customer: "Bob Smith", items: 2, total: 28.0 },
  { id: "3", orderNumber: "ORD-003", status: OrderStatus.READY, customer: "Carol White", items: 1, total: 15.9 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending", count: 5, color: "bg-yellow-50 border-yellow-200" },
          { label: "Preparing", count: 3, color: "bg-orange-50 border-orange-200" },
          { label: "Ready", count: 2, color: "bg-green-50 border-green-200" },
          { label: "Delivered Today", count: 14, color: "bg-blue-50 border-blue-200" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-4 ${stat.color}`}>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Active Orders</h2>
        </div>
        <div className="divide-y">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">{order.customer} · {order.items} items · ${order.total.toFixed(2)}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
