import * as React from "react";
import { Input } from "~/design-system/ui/input";
import { Label } from "~/design-system/ui/label";
import { Button } from "~/design-system/ui/button";

type FilterFormProps = {
  initialName: string;
  onSubmit: (nameFilter: string) => void;
  onNameChange?: (nameFilter: string) => void;
  description?: string;
};

export function FilterForm(props: FilterFormProps) {
  const { description, initialName, onNameChange, onSubmit } = props;
  const [nameFilter, setNameFilter] = React.useState(initialName);

  React.useEffect(() => {
    setNameFilter(initialName);
  }, [initialName]);

  const updateNameFilter = React.useCallback(
    (value: string) => {
      setNameFilter(value);
      onNameChange?.(value);
    },
    [onNameChange],
  );

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-(--text-primary) uppercase tracking-wider">
        Filters
      </h2>
      {description ? <p className="text-sm text-(--text-muted)">{description}</p> : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(nameFilter);
        }}
      >
        <Label
          htmlFor="name-filter"
          className="text-xs font-mono uppercase tracking-wider text-(--text-secondary)"
        >
          Filter by Name
        </Label>
        <Input
          id="name-filter"
          type="text"
          placeholder="Enter Pokemon name..."
          value={nameFilter}
          onChange={(e) => updateNameFilter(e.target.value)}
          className="mt-2 bg-(--bg-secondary) border-(--border-default) focus:border-(--accent-default) focus:ring-0 rounded-none font-mono text-sm"
        />
        <Button type="submit" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
}
