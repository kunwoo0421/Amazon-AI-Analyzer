"use client";

import { useState, useEffect } from "react";
import { glossaryTerms } from "../../data/glossary";
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";

export default function CodingTestPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        generateQuestions();
    }, []);

    const generateQuestions = () => {
        // Shuffle and pick 5 terms
        const shuffled = [...glossaryTerms].sort(() => 0.5 - Math.random());
        const selectedTerms = shuffled.slice(0, 5);

        const newQuestions = selectedTerms.map((term) => {
            // Create 3 wrong answers
            const wrongAnswers = shuffled
                .filter((t) => t.term !== term.term)
                .slice(0, 3)
                .map((t) => t.definition);

            const options = [...wrongAnswers, term.definition].sort(
                () => 0.5 - Math.random()
            );

            return {
                term: term.term,
                correctAnswer: term.definition,
                options,
            };
        });

        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
    };

    const handleAnswerClick = (option: string) => {
        if (selectedAnswer) return; // Prevent changing answer
        setSelectedAnswer(option);

        if (option === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    if (questions.length === 0) return <div className="p-10 text-center">Loading Quiz...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Amazon Seller Quiz</h1>
                <p className="text-slate-500">Test your knowledge of Amazon terminology.</p>
            </div>

            {!showResult ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </span>
                        <span className="text-slate-400 text-sm">Score: {score}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        What is the definition of <span className="text-blue-600">"{questions[currentQuestionIndex].term}"</span>?
                    </h2>

                    <div className="space-y-3">
                        {questions[currentQuestionIndex].options.map((option: string, index: number) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = option === questions[currentQuestionIndex].correctAnswer;

                            let buttonStyle = "border-slate-200 hover:border-blue-400 hover:bg-slate-50";

                            if (selectedAnswer) {
                                if (isSelected && isCorrect) buttonStyle = "border-green-500 bg-green-50 text-green-700";
                                else if (isSelected && !isCorrect) buttonStyle = "border-red-500 bg-red-50 text-red-700";
                                else if (!isSelected && isCorrect) buttonStyle = "border-green-500 bg-green-50 text-green-700"; // Show correct answer
                                else buttonStyle = "border-slate-100 text-slate-400"; // Fade others
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(option)}
                                    disabled={!!selectedAnswer}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
                                >
                                    <span>{option}</span>
                                    {selectedAnswer && isCorrect && <CheckCircle size={20} className="text-green-600" />}
                                    {selectedAnswer && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                                </button>
                            );
                        })}
                    </div>

                    {selectedAnswer && (
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                    <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>

                    <button
                        onClick={generateQuestions}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors mx-auto"
                    >
                        <RefreshCw size={20} />
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
