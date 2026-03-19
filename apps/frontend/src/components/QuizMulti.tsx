import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
  options: string[]
  onAnswer: (answers: number[]) => void
}

export default function QuizMulti({ options, onAnswer }: Props) {
  // Gunakan state agar data tidak hilang saat re-render
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    // Di React, kita harus membuat salinan baru (immutability) 
    // agar React mendeteksi perubahan state
    const newSelected = new Set(selectedIds);

    if (newSelected.has(i)) {
      newSelected.delete(i);
    } else {
      newSelected.add(i);
    }

    // Update state
    setSelectedIds(newSelected);

    // Kirim data ke parent (konversi ke array)
    onAnswer(Array.from(newSelected));

    console.log("Current Selected:", Array.from(newSelected));
  }

  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Checkbox onCheckedChange={() => toggle(i)} />
          <span>{opt}</span>
        </div>
      ))}
    </div>
  )
}