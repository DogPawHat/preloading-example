import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="p-2 flex gap-2 bg-white text-black justify-between">
			<nav className="flex flex-row">
				<div className="px-2">
					<Link to="/" activeProps={{ className: "font-bold" }}>
						Home
					</Link>
				</div>

				<div className="px-2">
					<Link to="/basic" activeProps={{ className: "font-bold" }}>
						Basic Example
					</Link>
				</div>

				<div className="px-2">
					<Link to="/suspense" activeProps={{ className: "font-bold" }}>
						Suspense Example
					</Link>
				</div>

				<div className="px-2">
					<Link to="/preloading" activeProps={{ className: "font-bold" }}>
						Preloading Example
					</Link>
				</div>

				<div className="px-2">
					<Link
						to="/intent-preloading"
						preload="intent"
						activeProps={{ className: "font-bold" }}
					>
						Intent Preloading Example
					</Link>
				</div>

				<div className="px-2">
					<Link to="/pagination" activeProps={{ className: "font-bold" }}>
						Pagination Example
					</Link>
				</div>

				<div className="px-2">
					<Link to="/filters" activeProps={{ className: "font-bold" }}>
						Filters Example
					</Link>
				</div>
			</nav>
		</header>
	);
}
