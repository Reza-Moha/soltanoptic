export default function EmployeePage() {
  return (
    <>
      <div className="h-screen">
        <div className="h-[80%] grid grid-cols-6 grid-rows-3 gap-4">
          <div className="col-span-2 row-span-2 backdropBox">1</div>
          <div className="col-span-2 row-span-2 col-start-3 backdropBox">4</div>
          <div className="col-span-2 row-span-2 col-start-5 backdropBox">5</div>
          <div className="col-span-2 col-start-5 row-start-3 backdropBox">
            6
          </div>
          <div className="col-span-2 col-start-3 row-start-3 backdropBox">
            7
          </div>
          <div className="col-span-2 col-start-1 row-start-3 backdropBox">
            8
          </div>
        </div>
      </div>
    </>
  );
}
