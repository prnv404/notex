export default function AuthCodeError() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <div className="max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
                <h1 className="mb-4 text-2xl font-bold text-red-600">Authentication Error</h1>
                <p className="text-zinc-700 dark:text-zinc-300">
                    Sorry, we couldn't complete your authentication. Please try again.
                </p>
                <a
                    href="/"
                    className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}
