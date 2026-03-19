import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "./ui/label"

interface Props {
  options: string[]
  onAnswer: (index: number) => void
}

export default function QuizSingle({ options, onAnswer }: Props) {
  const groupKey = options.join("|")

  return (
    <RadioGroup key={groupKey} onValueChange={(v) => onAnswer(Number(v))}>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <RadioGroupItem value={String(i)} id={`opt-${groupKey}-${i}`} />
          <Label htmlFor={`opt-${groupKey}-${i}`} className="cursor-pointer">
            {opt}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}