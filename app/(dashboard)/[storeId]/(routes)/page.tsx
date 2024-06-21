import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/firebaseConfig';

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const querySnapshot = await getDocs(collection(db, 'stores'));
    const formattedStores: any[] = [];

    querySnapshot.forEach((storeDoc) => {
      const storeData = storeDoc.data();
      // Optionally, format date or perform any data transformation needed
      formattedStores.push({
          id: storeDoc.id,
          name: storeData.name,
          // Add more fields as needed from your storeData
    });
  });

  if (!formattedStores) {
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
        
      </div>
    </div>
  )
}

export default DashboardPage