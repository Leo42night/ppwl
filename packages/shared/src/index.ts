export interface HealthCheck {
  status: string
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number
  email: string
  name: string | null
}

export type QuestionType = 1 | 2 | 3 | 4;

export interface BaseQuestion {
  id: number;
  type: QuestionType;
  category: 1 | 2 | 3 | 4;
  language: 1 | 2 | 3 | 4;
  difficulty: 1 | 2 | 3;
  points: number;
  question: string;
}

export interface QuizSingleQuestion extends BaseQuestion {
  type: 1;
  answer: string[];
  correct_answer: number;
}

export interface QuizMultiQuestion extends BaseQuestion {
  type: 2;
  answer: string[];
  correct_answer: number[];
}

export interface CodeFillExactQuestion extends BaseQuestion {
  type: 3;
  answer: string;
  correct_answer: string[];
}

export interface CodeFillRegexQuestion extends BaseQuestion {
  type: 4;
  answer: string;
  correct_answer: string;
}

export type Question =
  | QuizSingleQuestion
  | QuizMultiQuestion
  | CodeFillExactQuestion
  | CodeFillRegexQuestion;

export const STORAGE_KEY = "quiz_questions_v2";

/**
 * Cipher Module untuk Randomize dan Unrandomize String
 */
export const Cipher = {
  /**
   * Mengacak string menggunakan XOR cipher dan mengonversinya ke Hexadecimal
   */
  encode: (text: string, key: string): string => {
    if (!key) throw new Error("Key must not be empty");

    return Array.from(text)
      .map((char: string, i: number) => {
        const charCode: number = char.charCodeAt(0);
        const keyCode: number = key.charCodeAt(i % key.length);

        // Operasi XOR
        const scrambled: number = charCode ^ keyCode;

        // Return sebagai hex string 2 digit
        return scrambled.toString(16).padStart(2, '0');
      })
      .join('');
  },

  /**
   * Mengembalikan string Hexadecimal ke teks asli menggunakan Key
   */
  decode: (hex: string, key: string): string => {
    if (!key) throw new Error("Key must not be empty");

    // Pecah hex menjadi array tiap 2 karakter
    const hexPairs: RegExpMatchArray | null = hex.match(/.{1,2}/g);

    if (!hexPairs) return '';

    return hexPairs
      .map((hexChar: string, i: number) => {
        const charCode: number = parseInt(hexChar, 16);
        const keyCode: number = key.charCodeAt(i % key.length);

        // Operasi XOR (kebalikan)
        return String.fromCharCode(charCode ^ keyCode);
      })
      .join('');
  }
};

// // --- Contoh Penggunaan (Type Safe) ---
// const myKey: string = "super-secret-key";
// const message: string = "TypeScript itu Keren!";

// try {
//     const scrambled: string = Cipher.encode(message, myKey);
//     const original: string = Cipher.decode(scrambled, myKey);

//     console.log({
//         original,
//         scrambled,
//         recovered: original
//     });
// } catch (error) {
//     console.error("Terjadi error:", (error as Error).message);
// }