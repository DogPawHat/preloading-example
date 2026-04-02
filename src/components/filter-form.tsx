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
        <Label
          htmlFor="name-filter"
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          NAME
        </Label>
        <Input
          id="name-filter"
          type="text"
          placeholder="ENTER NAME..."
          value={submitContext.nameFilter}
          onChange={(e) => submitContext.updateNameFilter(e.target.value)}
          className="mt-1 border-3 border-[#0a0a0a] bg-white text-[#0a0a0a] placeholder:text-[#ccc] focus:border-[#ff2d2d] focus:ring-0 font-bold uppercase"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        />
      </form>
    </div>
  );
}
