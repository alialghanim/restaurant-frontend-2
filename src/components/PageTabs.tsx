"use client";

export default function PageTabs() {
  return (
    <div className="flex gap-6 border-b pb-2 text-sm font-medium text-muted-foreground">
      <button className="text-primary border-b-2 border-primary pb-1">Restaurant Summary</button>
      <button className="hover:text-primary">Restaurant Performance</button>
      <button className="hover:text-primary">Smart Analytics</button>
      <button className="hover:text-primary">Reports</button>
    </div>
  );
}
