# deploy database
Development (ingin ada history migrasi, jika ingin berganti)
```bash
bunx prisma migrate dev --name init
```

Production: langsung ubah skema database tanpa riwayat migrasi.
```bash
bunx prisma db push
bunx prisma db execute --file file.sql # eksekusi query
bun prisma/seed.ts # seeder ulang
sqlite3 db.sqlite .dump > data.sql # export to sql
bunx prisma db execute --file file.sql && bun prisma/seed.ts && sqlite3 db.sqlite .dump > data.sq
# Jika ada perubahan `schema.prisma`, jalankan:
bunx prisma generate
```

Jalankan [turso CLI](https://docs.turso.tech/cli/introduction) DB production (pakai wsl jika di windows):
```bash
turso db shell ppwl-2026 < baseline.sql # reset ulang
turso db shell ppwl-2026 < data.sql # push data baru
```

untuk sekarang, shared workspace monorepo tidak di gunakan karena bun vercel monorepo elysia. Saya coba build dari root monorepo tapi gagal terus. hanya berhasil jika deploy dari backend ini.
```json
"dependencies": {
    "shared": "workspace:*"
}
```
