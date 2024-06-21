import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const docRef = doc(db, 'stores', params.storeId);
  const docSnap = await (await getDoc(docRef)).data();

  if (!docSnap) {
    return (
      <div className="flex-col">
        <div className="flex-1 p-8 pt-6 space-y-4">
          <Heading title="Error" description="Store not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                100
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Sales
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +20
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Products in Stock
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                15
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
           
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage