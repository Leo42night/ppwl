import requests

# Konfigurasi
BASE_URL = "http://localhost:3000/api/questions"
KEY = "learn"
HEADERS = {"Content-Type": "application/json"}


def update_question_points():
    # 1. Ambil data questions
    fetch_url = f"{BASE_URL}/real"
    params = {"key": KEY}

    try:
        response = requests.get(fetch_url, params=params)
        response.raise_for_status()
        questions = response.json()

        print(f"Memproses {len(questions)} data...")

        # 2. Iterasi tiap question
        new_data = 0
        for q in questions:
            data = q.get("points")
            new_data += data
            continue
            q_id = q.get("id")
            difficulty = q.get("difficulty")

            # Tentukan poin berdasarkan difficulty
            if difficulty == 3:
                new_points = 10
            elif difficulty == 2:
                new_points = 5
            elif difficulty == 1:
                new_points = 2
            else:
                continue  # Skip jika difficulty tidak sesuai kriteria

            # 3. Kirim update via PUT
            update_url = f"{BASE_URL}/{q_id}"
            payload = {"points": new_points}

            put_res = requests.put(
                update_url, params=params, json=payload, headers=HEADERS
            )

            if put_res.status_code == 200:
                print(
                    f"[SUCCESS] ID {q_id}: Difficulty {difficulty} -> {new_points} pts"
                )
            else:
                print(f"[FAILED] ID {q_id}: Status {put_res.status_code}")
        print(f"Total Score: {new_data}")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")


if __name__ == "__main__":
    update_question_points()
