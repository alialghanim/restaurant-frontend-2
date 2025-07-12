import TopNavBar from "@/components/TopNavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopNavBar />
      <main>{children}</main>
    </div>
  );
}