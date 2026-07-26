import db from "@/lib/db"
import { ColorForm } from "./components/color-form"

interface ColorPageProps {
  params: Promise<{
    colorId: string;
  }>;
}

const ColorPage = async (props: ColorPageProps) => {
  const params = await props.params;

  const color = await db.color.findUnique({
    where: { id: params.colorId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}

export default ColorPage