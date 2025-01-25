import AsideBasicDefinition from "./_components/asideBasicDefinition";
import BasicPrividers from "./_components/BasicPrividers";

export default function BasicDefinitionLayout({ children }) {
  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-12 md:grid-rows-1 p-2 sm:pl-0">
        <aside className="bg-secondary-100 rounded-lg shadow-md hidden md:block md:col-span-2 ml-7">
          <AsideBasicDefinition />
        </aside>
        <div className="col-span-1 md:col-span-10 md:overflow-auto">
          <BasicPrividers>{children}</BasicPrividers>
        </div>
      </div>
    </>
  );
}
