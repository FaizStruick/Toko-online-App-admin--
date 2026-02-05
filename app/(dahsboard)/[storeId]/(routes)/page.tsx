import db from "@/lib/db";

interface DashboardPageProps {
    params: Promise<{storeId: string}>
}

const DashboardPage = async (props: DashboardPageProps) => {

    const params = await props.params;

    const store = await db.store.findFirst({
        where: {
            id: params.storeId
        }
    });
    return (
        <div className="p-4">
            Active Store : {store?.name || "Toko tidak ditemukan"}
        </div>
    );
}

export default DashboardPage;