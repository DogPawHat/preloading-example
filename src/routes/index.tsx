;
import { useState } from "react";
import logo from "../logo.svg";

export const Route = createFileRoute({
	component: App,
});

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="text-center">
			<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
				<img
					src={logo}
					className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
					alt="logo"
				/>
				<p>
					Edit <code>src/routes/index.tsx</code> and save to reload.
				</p>
				<button
					type="button"
					className="mt-4 px-6 py-2 rounded bg-[#61dafb] text-[#282c34] font-bold hover:bg-[#21a1f3] transition"
					onClick={() => setCount((c) => c + 1)}
				>
					Counter: {count}
				</button>
				<a
					className="text-[#61dafb] hover:underline mt-4"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<a
					className="text-[#61dafb] hover:underline"
					href="https://tanstack.com"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn TanStack
				</a>
			</header>
		</div>
	);
}
