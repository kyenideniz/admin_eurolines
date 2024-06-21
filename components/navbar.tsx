import React from 'react'
import { auth } from '@clerk/nextjs/server';
import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from "@clerk/nextjs";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface Store {
    name: string,
    id: string,
}
const Navbar = async () => {
  const { userId } = auth();

  if(!userId) {
    redirect("/sign-in")
  }

  
  const querySnapshot = await getDocs(collection(db, 'stores'));

  const formattedStores: Store[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
          id: doc.id,
          name: data.name,
      };
  });

  console.log(formattedStores, "storedoc")
  

  return (
    <div className='border-b'>
        <div className='flex items-center h-16 px-8'>
            <StoreSwitcher items={formattedStores} />
            <MainNav className='mx-6' />
            <div className='flex items-center ml-auto space-x-4'> 
                <ThemeToggle />
                <UserButton afterSignOutUrl='/'/>
            </div>
        </div>
    </div>
  )
}

export default Navbar