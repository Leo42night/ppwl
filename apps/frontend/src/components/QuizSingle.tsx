import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Props {
  options: string[]
  onAnswer: (index: number) => void
}

export default function QuizSingle({ options, onAnswer }: Props) {
  return (
    <RadioGroup onValueChange={(v) => onAnswer(Number(v))}>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <RadioGroupItem value={String(i)} />
          <span>{opt}</span>
        </div>
      ))}
    </RadioGroup>
  )
}