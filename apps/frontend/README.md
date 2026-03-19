# ppwl-frontend
```bash
bunx kill-port 5173 # kill port frontend (supaya refresh jika run ulang, masalah port vite)
bun run build # untuk build ke ./dist (static web)
```
Build vercel terdapat Running "git diff HEAD^ HEAD --quiet -- ./apps/frontend". hanya akan run jika file kode yang berubah (README.md tidak akan dianggap).