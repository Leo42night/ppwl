import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function IntroTooltip() {
  const [open, setOpen] = useState(false);

  // Auto show saat pertama load
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 800); // delay biar smooth

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button>Klik Saya</Button>
        </PopoverTrigger>

        <PopoverContent className="w-64">
          <p className="text-sm">
            👋 Ini adalah tombol utama untuk memulai quiz!
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}