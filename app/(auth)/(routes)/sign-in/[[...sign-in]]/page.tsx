import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='items-center justify-center flex w-full h-full'>  
            <SignIn />
        </div>
    )
}