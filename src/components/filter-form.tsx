import { createContext, useContext } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const FilterSubmitContext = createContext<{
	handleSubmit: () => void;
	updateNameFilter: (nameFilter: string) => void;
	nameFilter: string;
} | null>(null);

export function FilterForm() {
	const submitContext = useContext(FilterSubmitContext);

	if (!submitContext) {
		throw new Error("FilterSubmitContext not found");
	}

	return (
		<div className="space-y-4">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					submitContext.handleSubmit();
				}}
			>
				<Label htmlFor="name-filter" className="text-sm font-medium">
					Filter by Name
				</Label>
				<Input
					id="name-filter"
					type="text"
					placeholder="Enter Pokemon name..."
					value={submitContext.nameFilter}
					onChange={(e) => submitContext.updateNameFilter(e.target.value)}
					className="mt-1"
				/>
			</form>
		</div>
	);
}
