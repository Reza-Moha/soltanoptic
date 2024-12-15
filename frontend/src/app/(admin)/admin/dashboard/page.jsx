import BgAdminDashboard from "./_components/BgAdminDashboard"; 

export default function AdminDashboard() {
  return (
    <section className="h-screen relative">
      <BgAdminDashboard />

      <div className="w-full h-full z-50 grid grid-cols-12 grid-rows-5 gap-4 p-8">
        <div className="col-span-3 row-span-2 backdropBox">1</div>
        <div className="col-span-3 row-span-2 col-start-4 backdropBox">2</div>
        <div className="col-span-3 row-span-2 col-start-7 backdropBox">3</div>
        <div className="col-span-3 row-span-2 col-start-10 backdropBox">4</div>
        <div className="col-span-3 row-span-3 col-start-10 row-start-3 backdropBox">6</div>
        <div className="col-span-3 row-span-2 col-start-7 row-start-3 backdropBox">7</div>
        <div className="col-span-3 col-start-7 row-start-5 backdropBox">8</div>
        <div className="col-span-3 row-span-3 col-start-4 row-start-3 backdropBox">9</div>
        <div className="col-span-3 row-span-3 col-start-1 row-start-3 backdropBox">10</div>
      </div>
    </section>
  );
}
