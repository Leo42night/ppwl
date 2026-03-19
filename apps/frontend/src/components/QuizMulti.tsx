import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Props {
  options: string[]
  onAnswer: (answers: number[]) => void
}

export default function QuizMulti({ options, onAnswer }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSelectedIds(new Set());
  }, [options]);

  function toggle(i: number) {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(i)) {
      newSelected.delete(i);
    } else {
      newSelected.add(i);
    }
    setSelectedIds(newSelected);
    onAnswer(Array.from(newSelected));
  }

  const groupKey = options.join("|");

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Checkbox
            id={`opt-${groupKey}-${i}`}
            checked={selectedIds.has(i)}
            onCheckedChange={() => toggle(i)}
          />
          <Label htmlFor={`opt-${groupKey}-${i}`} className="cursor-pointer">
            {opt}
          </Label>
        </div>
      ))}
    </div>
  )
}