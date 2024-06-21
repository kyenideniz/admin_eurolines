export default function AuthLayout({
    children
}: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center w-full h-full pt-8">
            { children }
        </div>
    )
}