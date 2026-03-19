import { useEffect, useState, useRef } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import { toast } from "sonner"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import QuizSingle from "@/components/QuizSingle"
import QuizMulti from "@/components/QuizMulti"
import CodeFill from "@/components/CodeFill"

import type { Question } from "shared"

import { submitAnswer } from "@/lib/submitAnswer"
import { useAuth } from "@/context/MainContext"
import { BACKEND_URL } from "@/types"
import { safeParse } from "@/lib/utils"
import { CATEGORIES, HL_LANGUAGES, LANGUAGES } from "@/constants"
import { DifficultyStars, TypeBadge } from "@/components/shared"
import { Badge } from "@/components/ui/badge"

interface AnsweredLog {
  user_id: number;
  question_id: number;
}

function validateAnswer(question: Question, answer: any) {
  if (answer === null || answer === undefined) return false;
  // console.log(question, answer);

  switch (question.type) {
    case 1:
      return typeof answer === "number";
    case 2:
      return Array.isArray(answer) && answer.length > 0;
    case 3:
      return Array.isArray(answer) && answer.length > 0 && answer.every((a: string) => a?.trim() !== "");
    case 4:
      return (typeof answer === "string" && answer.trim() !== "") || (Array.isArray(answer) && answer.length > 0);
    default:
      return false;
  }
}

export default function QuestionPage() {
  const {
    user,
    questions,
    activeQuestion,
    setActiveQuestion,
    setNewAnsweredQuestionIds,
    onTimeUpRef,
    addScore
  } = useAuth();

  const [answer, setAnswer] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<number[]>(
    () => safeParse(localStorage.getItem("answered_question_ids"), [])
  );
  const [notAnsweredQuestionIds, setNotAnsweredQuestionIds] = useState<number[]>(
    () => safeParse(localStorage.getItem("not_answered_question_ids"), [])
  );

  // --- START: handle paksa periksa answer ketika timer habis
  const answerRef = useRef<any>(null);
  // Wrapper setter agar ref selalu sync dengan state
  const handleSetAnswer = (val: any) => {
    answerRef.current = val;
    setAnswer(val);
  };

  // Register/unregister handler tiap activeQuestion berubah
  useEffect(() => {
    if (!activeQuestion) {
      onTimeUpRef.current = null;
      return;
    }

    onTimeUpRef.current = async () => {
      const currentAnswer = answerRef.current;

      // Answer kosong → skip, biarkan context lanjut ke setActiveQuestion + toast.warning
      if (!validateAnswer(activeQuestion, currentAnswer)) return;

      try {
        const result = await submitAnswer(activeQuestion, currentAnswer);

        if (result.correct) {
          toast.success(`Benar! +${activeQuestion.points} poin`, {
            description: "Jawaban Anda tepat sekali.",
            position: "top-left",
          });
          handleCorrect(activeQuestion.id, activeQuestion.points);
        } else {
          toast.error("Jawaban Salah", {
            description: "Coba periksa kembali jawaban Anda.",
            position: "bottom-left",
          });
        }
      } catch (e) {
        console.error(`Gagal submit ke server. ${e}`)
        toast.error(`Gagal terhubung ke server. ${e}`, { position: "top-center" });
      }
      // Setelah resolve, context akan lanjut: setActiveQuestion(null) → toast.warning
    };

    return () => {
      onTimeUpRef.current = null;
    };
  }, [activeQuestion]);


  // --- END: handle paksa periksa answer ketika timer habis


  const fetchAnsweredIds = async () => {
    if (!user || questions.length === 0) return;

    const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/question-ids`);
    if (!res.ok) return toast.error(`Gagal ambil riwayat quiz user: ${res.statusText}`);

    const userQuestionsIds: number[] = await res.json();
    setAnsweredQuestionIds(userQuestionsIds);
    localStorage.setItem("answered_question_ids", JSON.stringify(userQuestionsIds));

    // Hitung soal yang belum dijawab
    if (userQuestionsIds.length < questions.length) {
      const unanswered = questions
        .filter((q) => !userQuestionsIds.includes(q.id))
        .map((q) => q.id);
      setNotAnsweredQuestionIds(unanswered);
      localStorage.setItem("not_answered_question_ids", JSON.stringify(unanswered));
    } else {
      // Semua soal sudah dijawab
      setNotAnsweredQuestionIds([]);
      localStorage.setItem("not_answered_question_ids", JSON.stringify([]));
    }
  };

  useEffect(() => {
    fetchAnsweredIds();
  }, [user, questions]);

  // Jika notAnsweredQuestionIds kosong, reload answeredQuestionIds dari server
  useEffect(() => {
    if (notAnsweredQuestionIds.length === 0 && user && questions.length > 0) {
      fetchAnsweredIds();
    }
  }, [notAnsweredQuestionIds]);

  const getNextQuestion = (currentNotAnswered: number[]) => {
    if (currentNotAnswered.length === 0) {
      setActiveQuestion(null);
      return;
    }
    // ambil yang type 2
    const randomId = currentNotAnswered[Math.floor(Math.random() * currentNotAnswered.length)];
    const found = questions.find((q) => q.id === randomId);
    if (found) {
      setActiveQuestion(found);
      setAnswer(null);
      answerRef.current = null; // reset ref juga
    }
  };

  // Helper: hapus id dari notAnswered lalu lanjut ke soal berikutnya
  const handleCorrect = (qId: number, points: number) => {
    saveProgress(qId);
    addScore(points);
    setNewAnsweredQuestionIds((prev) =>
      prev.includes(qId) ? prev : [...prev, qId]
    );
    setNotAnsweredQuestionIds((prev) => {
      const updated = prev.filter((id) => id !== qId);
      localStorage.setItem("not_answered_question_ids", JSON.stringify(updated));
      getNextQuestion(updated); // ← langsung pakai nilai terbaru
      return updated;
    });
  };

  const getRandomQuestion = () => {
    if (!user) return toast.error("Silakan Login dulu!");
    if (questions.length === 0 || notAnsweredQuestionIds.length === 0) {
      toast.info("Semua soal sudah dijawab!");
      return;
    }
    getNextQuestion(notAnsweredQuestionIds);
  };

  const saveProgress = (qId: number) => {
    if (!user) return;

    const existingLogs: AnsweredLog[] = safeParse(localStorage.getItem("answered_questions"), []);
    const isAlreadyAnswered = existingLogs.some(
      (log) => log.user_id === user.id && log.question_id === qId
    );

    if (!isAlreadyAnswered) {
      const updatedLogs = [...existingLogs, { user_id: user.id, question_id: qId }];
      localStorage.setItem("answered_questions", JSON.stringify(updatedLogs));
    }
  };

  async function onSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!activeQuestion) return;

    if (!validateAnswer(activeQuestion, answer)) {
      toast.error("Jawaban belum lengkap!", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const result = await submitAnswer(activeQuestion, answer);

      if (result.correct) {
        toast.success(`Benar! +${activeQuestion.points} poin`, {
          description: "Jawaban Anda tepat sekali.",
          position: "top-center"
        });
        handleCorrect(activeQuestion.id, activeQuestion.points);
      } else {
        toast.error("Jawaban Salah", {
          description: "Coba periksa kembali jawaban Anda."
        });
      }
    } catch (e) {
      toast.error("Error", {
        description: `Gagal terhubung ke server. ${e}`,
        position: "top-center"
      });
    } finally {
      setLoading(false);
    }
  }

  function renderQuestion() {
    if (!activeQuestion) return null;

    switch (activeQuestion.type) {
      case 1:
        return <QuizSingle options={activeQuestion.answer as string[]} onAnswer={handleSetAnswer} />;
      case 2:
        return <QuizMulti options={activeQuestion.answer as string[]} onAnswer={handleSetAnswer} />;
      case 3:
      case 4:
        return <CodeFill template={activeQuestion.answer as string} language={HL_LANGUAGES[activeQuestion.language]} onAnswer={handleSetAnswer} />;
      default:
        return null;
    }
  }

  if (activeQuestion) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader className="font-semibold">
          <div className="flex flex-wrap gap-1.5 items-center">
            <TypeBadge type={activeQuestion.type} />
            <Badge variant="secondary" className="text-[11px]">
              {CATEGORIES[activeQuestion.category]}
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              {LANGUAGES[activeQuestion.language]}
            </Badge>
            <DifficultyStars level={activeQuestion.difficulty} />
            <Badge variant="outline" className="text-[11px]">
              {activeQuestion.points} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit}>
            <div className="prose max-w-none mb-3">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {activeQuestion.question}
              </ReactMarkdown>
            </div>

            {renderQuestion()}

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Submitting..." : "Submit Answer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader className="font-semibold">
        <Button onClick={getRandomQuestion} disabled={questions.length !== 0 && answeredQuestionIds.length !== 0 && notAnsweredQuestionIds.length === 0}>
          {questions.length !== 0 && answeredQuestionIds.length !== 0 && notAnsweredQuestionIds.length === 0 ? "Semua Soal Selesai 🎉" : "Mulai Quiz"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3>Seputar Quiz:</h3>
        <ol>
          <li>Materi terbagi atas BunJs, Tailwind, Git, ElysiaJs</li>
          <li>Tipe Quiz terbagi atas; Single answer, multi answer, exact code fill &amp; regex code fill</li>
          <li>Limit waktu menjawab tiap soal 30 detik</li>
          <li>Tekan tombol "Simpan Score" di kanan atas layar untuk menyimpan</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          Progress: {answeredQuestionIds.length} / {questions.length} soal dijawab
        </p>
      </CardContent>
    </Card>
  );
}