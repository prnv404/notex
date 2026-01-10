"use client"

import * as React from "react"
import { LogOut, ChevronUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function UserProfile() {
    const [user, setUser] = React.useState<any>(null)
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const router = useRouter()
    const supabase = createClient()

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/auth/login')
    }

    if (!user) return null

    const email = user.email || "User"
    const name = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0]
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture
    const initials = name.substring(0, 2).toUpperCase()

    return (
        <div className="relative border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar-bg)]">
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full px-3 py-3 flex items-center gap-3 hover:bg-[var(--vscode-list-hover)] transition-colors group"
            >
                {/* Avatar */}
                <div className="relative w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : null}
                    {!avatarUrl && (
                        <span className="text-white text-sm font-semibold">
                            {initials}
                        </span>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-left overflow-hidden">
                    <div className="text-sm font-medium text-[var(--foreground)] truncate">
                        {name}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)] truncate">
                        {email}
                    </div>
                </div>

                {/* Chevron */}
                <ChevronUp
                    size={16}
                    className={`text-[var(--muted-foreground)] transition-transform shrink-0 ${isMenuOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 right-0 mb-1 mx-2 bg-[var(--vscode-bg)] border border-[var(--vscode-border)] rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                            onClick={handleSignOut}
                            className="w-full px-3 py-2.5 flex items-center gap-3 text-sm text-[var(--foreground)] hover:bg-[var(--vscode-list-hover)] transition-colors"
                        >
                            <LogOut size={16} className="text-[var(--muted-foreground)]" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
