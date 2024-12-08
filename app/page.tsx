"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "../hooks/useDarkMode";
import { Moon, Sun, Send, AlertCircle } from "lucide-react";

interface WordAnalysis {
  word: string;
  irab: string;
}

interface ApiResponse {
  success: boolean;
  output?: WordAnalysis[];
  error?: string;
}

export default function Home() {
  const [sentence, setSentence] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);

    try {
      // TODO: Replace with actual API call
      const response = await new Promise<ApiResponse>((resolve) =>
        setTimeout(() => {
          if (sentence.match(/^[\u0600-\u06FF\s]+$/)) {
            resolve({
              success: true,
              output: [
                {
                  word: sentence.split(" ")[0],
                  irab: "فعل ماضٍ مبني على الفتح",
                },
                {
                  word: sentence.split(" ")[1],
                  irab: "فاعل مرفوع وعلامة رفعه الضمة الظاهرة",
                },
              ],
            });
          } else {
            resolve({
              success: false,
              error: "Input contains non-Arabic characters.",
            });
          }
        }, 1000)
      );

      setApiResponse(response);
    } catch (error) {
      setApiResponse({
        success: false,
        error: "An error occurred while processing your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen min-w-full bg-white dark:bg-gray-900 ${
        isDarkMode ? "dark" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-8 transition-colors bg-white dark:bg-gray-900 duration-300 min-h-screen">
        <nav className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-right text-gray-800 dark:text-white">
            محلل الجمل العربية
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {isDarkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </button>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-end">
            <label
              htmlFor="sentence"
              className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200 self-end"
            >
              :أدخل جملتك هنا
            </label>
            <textarea
              id="sentence"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={4}
              dir="rtl"
              placeholder="اكتب جملتك هنا..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading || sentence.trim() === ""}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50 disabled:hover:bg-blue-500"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-t-2 border-white rounded-full"
                />
              ) : (
                <>
                  تحليل <Send className="mr-2" size={18} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <AnimatePresence>
          {apiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 ${
                apiResponse.success ? "border-green-500" : "border-red-500"
              } border-2`}
            >
              {apiResponse.success ? (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-right text-green-500 dark:text-green-400">
                    نتيجة التحليل
                  </h2>
                  <div className="space-y-4">
                    {apiResponse.output?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <p className="text-lg font-semibold text-right mb-2 dark:text-white">
                          {item.word}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-right">
                          {item.irab}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-end text-red-500 dark:text-red-400">
                  <p className="text-lg font-semibold ml-2">
                    {apiResponse.error}
                  </p>
                  <AlertCircle size={24} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-gray-600 dark:text-gray-400"
        >
          <p>هذا التطبيق يحلل الجمل العربية التي تكتبها ويعرض إعرابها</p>
          <p>تأكد من إدخال نص عربي صحيح للحصول على أفضل النتائج</p>
        </motion.div>
      </div>
    </div>
  );
}
