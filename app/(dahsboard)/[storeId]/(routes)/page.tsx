import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Store, CreditCard, Package, BarChart3, Image as ImageIcon, ShoppingBag } from "lucide-react";
import db from "@/lib/db";
import Overview from "@/components/overview";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { RecentSales } from "@/components/recent-sales";
import { formatter } from "@/lib/utils";
import { getRecentSales } from "@/actions/get-recent-sales";
import { getSalesCount } from "@/actions/get-sales-count";

interface DashboardPageProps {
  params: Promise<{ storeId: string }>;
}

const DashboardPage = async (props: DashboardPageProps) => {

  const { storeId } = await props.params; 

  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  const banners = await db.banner.findMany({
      where: {
        storeId: storeId,
      },
  });

  const products = await db.product.findMany({
    where: {
        storeId: storeId,
    },
  });
  
  const totalRevenue = await getTotalRevenue(storeId);
  const graphData = await getGraphRevenue(storeId);
  const recentSales = await getRecentSales(storeId);
  const salesCount = await getSalesCount(storeId);

  return (

    <div className="flex-col bg-slate-50/50 min-h-screen">
      <div className="flex-1 space-y-8 p-8 pt-6 max-w-7xl mx-auto">
        {/* Header dengan Icon */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-x-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                {store?.name || "Dashboard"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Selamat datang kembali di panel manajemen tokomu.
              </p>
            </div>
          </div>

        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600">
            <ImageIcon className="h-4 w-4 text-slate-500" />
            <span>{banners.length} Banner Promo</span>
          </div>
        </div>

        <Separator className="bg-slate-200/60"/>

        {/* Grid Kartu Statistik */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Total Pendapatan</CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {formatter.format(Number(totalRevenue))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total akumulasi transaksi lunas</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Produk Terdaftar</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{products.length}</div>
              <p className="text-xs text-slate-400 mt-1">Stok aman & siap jual</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden group hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Total Penjualan Toko</CardTitle>
              <ShoppingBag  className="h-4 w-4 text-orange-500"/>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">+{salesCount}</div>
              <p className="text-xs text-muted-foreground mt-1"></p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Placeholder untuk Chart/Grafik */}
        <Card className="col-span-1 lg:col-span-4 border-no
        
        const totalRevenue = await getTotalRevenue(params.storeId);
        const graphData = await getGraphRevenue(params.storeId);ne shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-slate-800">Ikhtisar Penjualan</CardTitle>
          <CardDescription>Grafik perkembangan omzet dari waktu ke waktu.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <Overview data={graphData} />
          </CardContent>
        </Card>

        {/* Penjualan Terakhir (3 Kolom) */}
          <Card className="col-span-1 lg:col-span-3 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl bg-white">
            <CardHeader>
              <CardTitle className="text-slate-800">Penjualan Terakhir</CardTitle>
              <CardDescription>Aktivitas transaksi terbaru yang masuk.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales data={recentSales} />
            </CardContent>
          </Card>
      </div>
    </div>
  </div>
  );
};
export default DashboardPage;