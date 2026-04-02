import { createContext, useContext } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "./ui/button";

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
        <Label
          htmlFor="name-filter"
          className="text-xs font-mono uppercase tracking-wider text-charcoal-light"
        >
          Filter by Name
        </Label>
        <Input
          id="name-filter"
          type="text"
          placeholder="Enter Pokemon name..."
          value={submitContext.nameFilter}
          onChange={(e) => submitContext.updateNameFilter(e.target.value)}
          className="mt-2 bg-warm border-hairline focus:border-amber focus:ring-0 rounded-none font-mono text-sm"
        />
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
}
