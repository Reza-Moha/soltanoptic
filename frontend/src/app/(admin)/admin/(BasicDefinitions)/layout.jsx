import AsideBasicDefinition from "./_components/asideBasicDefinition";
import BasicPrividers from "./_components/BasicPrividers";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Card, CardContent } from "@/components/magicui/Card";
import { ShineBorder } from "@/components/magicui/shine-border";

export default function BasicDefinitionLayout({ children }) {
  return (
    <>
      <div className="h-full grid grid-cols-1 md:grid-cols-12 md:grid-rows-1 p-2 sm:pl-0">
        <aside className="rounded-lg hidden md:block md:col-span-2 ml-7 ">
          <Card className="relative w-full h-full overflow-hidden">
            <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            <CardContent>
              <AsideBasicDefinition />
            </CardContent>
          </Card>
        </aside>
        <div className="col-span-1 md:col-span-10 md:overflow-auto">
          <BasicPrividers>{children}</BasicPrividers>
        </div>
      </div>
    </>
  );
}
