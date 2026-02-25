export const SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
export const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || "5", 10);
export const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || "3", 10);

export async function fetchQuestions() {
  if (!SCRIPT_URL || SCRIPT_URL.includes('AKfycbzxxxx')) {
    console.warn("Using mock data because GAS URL is not configured.");
    return Array.from({length: QUESTION_COUNT}).map((_, i) => ({
      id: i + 1,
      question: `这是用于测试的范例题目 ${i + 1} 吗？`,
      A: "选项 A",
      B: "选项 B",
      C: "选项 C",
      D: "选项 D",
      answer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)]
    }));
  }

  const res = await fetch(`${SCRIPT_URL}?action=getQuestions&count=${QUESTION_COUNT}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return await res.json();
}

export async function submitScore(payload) {
  /**
   * payload structure:
   * {
   *   userId: string,
   *   score: number,
   *   passed: boolean,
   *   totalQuestions: number
   * }
   */
  if (!SCRIPT_URL || SCRIPT_URL.includes('AKfycbzxxxx')) {
    console.warn("Mock score submission", payload);
    return { success: true };
  }

  // Use POST to send data to App Script
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8", // text/plain to avoid preflight CORS
    },
    body: JSON.stringify({
      action: "submitScore",
      ...payload,
      timestamp: new Date().toISOString()
    })
  });
  
  if (!res.ok) throw new Error("Network error submitting score");
  return await res.json();
}
