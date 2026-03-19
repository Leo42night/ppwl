/**
 * useToast.ts
 *
 * Re-exports `toast` dari sonner sebagai satu-satunya API notifikasi.
 * Tidak perlu state management manual — sonner mengelola antrian sendiri.
 *
 * Penggunaan:
 *   import { toast } from "@/hooks/useToast"
 *
 *   toast.success("Soal tersimpan!")
 *   toast.error("Pertanyaan tidak boleh kosong.")
 *   toast.info("3 soal diekspor.")
 *   toast.warning("Regex tidak valid.")
 *   toast.loading("Menyimpan...", { id: "save" })
 *   toast.dismiss("save")
 */

export { toast } from "sonner";