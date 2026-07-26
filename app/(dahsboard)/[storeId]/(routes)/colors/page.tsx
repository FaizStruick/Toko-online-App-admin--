import db from "@/lib/db"
import { ColorClient } from "./components/client"
import { ColorColumn } from "./components/columns"
import { format } from "date-fns"

interface ColorsPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

const ColorsPage = async (props: ColorsPageProps) => {
  const params = await props.params;

  const colors = await db.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: "desc" },
  })

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMM do, yyyy"),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto w-full">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  )
}

export default ColorsPage