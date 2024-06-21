import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation"
import Navbar  from "@/components/navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/firebaseConfig';

interface DashboardType {
    children: React.ReactNode;
    params: { storeId: string }
}

export default async function Dashboard({children, params}: DashboardType) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }

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
        redirect('/');
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}