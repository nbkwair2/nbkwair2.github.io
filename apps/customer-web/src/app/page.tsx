import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          🍽️ CloudKitchen OS
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg">
          Fresh, delicious food from our cloud kitchen, delivered straight to your door.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Browse Menu
        </Link>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          My Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 w-full max-w-3xl">
        {[
          { icon: "🚀", title: "Fast Delivery", desc: "30 minutes or less" },
          { icon: "👨‍🍳", title: "Expert Chefs", desc: "Freshly prepared meals" },
          { icon: "📱", title: "Easy Ordering", desc: "Order in seconds" },
        ].map((feature) => (
          <div key={feature.title} className="flex flex-col items-center gap-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <span className="text-4xl">{feature.icon}</span>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground text-center">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
