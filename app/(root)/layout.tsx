import { redirect } from "next/navigation"
import { auth } from '@clerk/nextjs/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface DashboardType {
    children: React.ReactNode;
    params: { storeId: string };
}

export default async function SetupLayout({ children }: DashboardType) {

    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in');
    }

    const querySnapshot = await getDocs(collection(db, 'stores'));
    const storeDoc = querySnapshot.docs;
    console.log(storeDoc)
    if (storeDoc[0]){
        redirect(`/${storeDoc[0].id}`);
    }

    return (
        <>
            {children}
        </>
    );
}
