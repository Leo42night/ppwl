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

Jalankan query ke DB:
```bash
turso db shell ppwl-2026 "DROP TABLE user_questions"
turso db shell ppwl-2026 "DROP TABLE questions"
turso db shell ppwl-2026 "DROP TABLE users"
turso db shell ppwl-2026 < baseline.sql # lihat di prisma/migrations
```
