import { STORAGE_KEY, type Question } from "shared";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function loadQuestions(): Question[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}

export function editorTemplateToApi(template: string): string {
  // console.log("template", template);
  return template
    .replace(/\[ANS:([^\]]*)\]/g, (_m, ans: string) => `<<${Math.max(ans.length, 4)}>>`)
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t");
}

export function apiTemplateToEditor(apiAnswer: string, answers: string[]): string {
  let i = 0;
  return apiAnswer
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/<<\d+>>/g, () => `[ANS:${answers[i++] ?? ""}]`);
}

export function extractAnswersFromTemplate(template: string): string[] {
  return Array.from(template.matchAll(/\[ANS:([^\]]*)\]/g)).map((m) => m[1]);
}

export function formatArray(array: any) {
  return Array.isArray(array) ? JSON.stringify(array) : array;
}

export function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Mengecek apakah data adalah string yang berisi array JSON
 */
export const isJsonArray = (data: unknown): data is string => {
  // 1. Cek apakah tipe datanya string
  if (typeof data !== 'string') return false;

  // 2. Cek sekilas apakah diawali '[' dan diakhiri ']' untuk efisiensi
  const trimmed = data.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return false;

  try {
    // 3. Coba parse. Jika berhasil dan hasilnya array, return true
    const result = JSON.parse(trimmed);
    return Array.isArray(result);
  } catch (e) {
    // Jika gagal di-parse, berarti bukan JSON array yang valid
    return false;
  }
};

// // --- Test Cases ---
// console.log(isJsonArray(1));                         // false
// console.log(isJsonArray("Halo"));                    // false
// console.log(isJsonArray("[\"Elysia\",\"listen\"]")); // true
// console.log(isJsonArray("[1, 2, 3]"));               // true
// console.log(isJsonArray("{ \"key\": \"val\" }"));    // false (ini object)


// ----- QuestionPage -----

export function validateAnswer(question: Question, answer: any) {
  if (answer === null || answer === undefined) return false;
  // console.log("validateAnswer", question, answer);

  switch (question.type) {
    case 1:
      return typeof answer === "number";
    case 2:
      return Array.isArray(answer) && answer.length > 0;
    case 3:
      return Array.isArray(answer) && answer.length > 0 && answer.every((a: string) => a.trim() !== "");
    case 4:
      // answer string[]
      return (typeof answer === "string" && answer.trim() !== "") || (Array.isArray(answer) && answer.length > 0);
    default:
      return false;
  }
}