import {
    Bookmark,
    BriefcaseBusiness,
    Search,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            isActive
                ? "bg-blue-50 font-semibold text-brand"
                : "text-muted hover:bg-paper hover:text-ink"
        }`;

    return (
        <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-line bg-white px-5 py-7">
            <NavLink to="/" className="mb-12 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                    <BriefcaseBusiness size={19} />
                </div>

                <span className="font-display text-xl font-extrabold tracking-tight text-ink">
                    jobsty
                </span>
            </NavLink>

            <p className="mb-3 text-xs font-semibold text-muted">
                WORKSPACE
            </p>

            <nav className="space-y-1">
                <NavLink to="/" end className={navClass}>
                    <Search size={18} />
                    Discover
                </NavLink>

                <NavLink to="/saved" className={navClass}>
                    <Bookmark size={18} />
                    Saved jobs
                </NavLink>
            </nav>

            <div className="mt-auto">
                <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted opacity-70"
                >
                    <Settings size={18} />
                    Settings
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;