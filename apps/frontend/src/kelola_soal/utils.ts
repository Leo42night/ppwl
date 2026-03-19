import { STORAGE_KEY, BACKEND_URL, type Question } from "../types";

export async function loadQuestions(): Promise<Question[]> {
  try {
    const data_json = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (data_json.length > 0) return data_json as Question[];

    // load data dari BACKEND_URL
    const res = await fetch(BACKEND_URL);
    if (!res.ok) throw new Error("Failed to fetch");

    const data_be: Question[] = await res.json();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data_be));

    return data_be;
  } catch {
    return [];
  }
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}