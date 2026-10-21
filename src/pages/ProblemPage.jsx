

import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";
import {
    Code2,
    FileText,
    BookOpen,
    History,
    MessageCircle,
    Play,
    Send,
    RotateCcw,
    ChevronDown,
    CheckCircle2,
    XCircle,
    Terminal,
    Clock,
    MemoryStick,
    Sparkles,
    ListChecks,
    PanelLeftClose,
    PanelRightClose,
    Check,
    Copy
} from "lucide-react";

const languageMap = {
    javascript: "JavaScript",
    java: "Java",
    cpp: "C++",
};

const ProblemPage = () => {
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [problemLoading, setProblemLoading] = useState(true);
    const [runResult, setRunResult] = useState(null);
    const [submitResult, setSubmitResult] = useState(null);
    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");
    const [leftCollapsed, setLeftCollapsed] = useState(false);
    const [rightCollapsed, setRightCollapsed] = useState(false);
    const editorRef = useRef(null);
    const { problemId } = useParams();
    const [codeByLanguage, setCodeByLanguage] = useState({});
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        let active = true;

        const fetchProblem = async () => {
            setProblemLoading(true);

            try {
                const response = await axiosClient.get(
                    `/problem/getProblemById/${problemId}`
                );

                if (!active) return;

                const data = response.data;
                setProblem(data);

                const initialCodes = {};

                data.startCode?.forEach((item) => {
                    const languageKey = Object.keys(languageMap).find(
                        (key) => languageMap[key] === item.language
                    );

                    if (languageKey) {
                        initialCodes[languageKey] = item.initialCode || "";
                    }
                });

                setCodeByLanguage(initialCodes);

                setCode(initialCodes[selectedLanguage] || "");
            } catch (err) {
                console.error("Error fetching problem:", err);
            } finally {
                if (active) setProblemLoading(false);
            }
        };

        fetchProblem();

        return () => {
            active = false;
        };
    }, [problemId]);

    // useEffect(() => {
    //     if (!problem) return;

    //     const initialCode = problem.startCode?.find(
    //         (item) => item.language === languageMap[selectedLanguage]
    //     )?.initialCode;

    //     setCode(initialCode || "");
    // }, [selectedLanguage, problem]);

    const handleEditorChange = (value) => {
        const updatedCode = value || "";

        setCode(updatedCode);

        setCodeByLanguage((prev) => ({
            ...prev,
            [selectedLanguage]: updatedCode,
        }));
    };

    const handleLanguageChange = (newLanguage) => {
        // Current language ka code save rahega
        setCodeByLanguage((prev) => ({
            ...prev,
            [selectedLanguage]: code,
        }));

        // Selected language ka saved code load hoga.
        // Agar pehli baar select ki hai, starter code load hoga.
        const savedCode = codeByLanguage[newLanguage];

        const starterCode = problem?.startCode?.find(
            (item) => item.language === languageMap[newLanguage]
        )?.initialCode;

        setCode(
            savedCode !== undefined
                ? savedCode
                : starterCode || ""
        );

        setSelectedLanguage(newLanguage);
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleRun = async () => {
        setLoading(true);
        setRunResult(null);

        try {
            const response = await axiosClient.post(
                `/submission/runCode/${problemId}`,
                {
                    code,
                    language: selectedLanguage,
                }
            );

            setRunResult(response.data);
            setActiveRightTab("testcase");
        } catch (err) {
            console.error("Error running code:", err);

            setRunResult({
                success: false,
                err:
                    err.response?.data?.message ||
                    err.message ||
                    "Internal server error",
                testCases: [],
            });

            setActiveRightTab("testcase");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        setLoading(true);
        setSubmitResult(null);

        try {
            const response = await axiosClient.post(
                `/submission/submitCode/${problemId}`,
                {
                    code,
                    language: selectedLanguage,
                }
            );

            setSubmitResult(response.data);
            setActiveRightTab("result");
        } catch (err) {
            console.error("Error submitting code:", err);

            setSubmitResult({
                accepted: false,
                error:
                    err.response?.data?.message ||
                    err.message ||
                    "Submission failed",
            });

            setActiveRightTab("result");
        } finally {
            setLoading(false);
        }
    };

    const getLanguageForMonaco = (language) => {
        switch (language) {
            case "javascript":
                return "javascript";
            case "java":
                return "java";
            case "cpp":
                return "cpp";
            default:
                return "javascript";
        }
    };

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "medium":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "hard":
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    if (problemLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f4f7fb]">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-blue-600" />
                    <p className="text-sm text-slate-500">Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f4f7fb] p-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <XCircle className="mx-auto text-rose-500" size={40} />
                    <h2 className="mt-4 text-xl font-bold text-slate-800">
                        Problem not found
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Unable to load this problem. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    const leftTabs = [
        { id: "description", label: "Description", icon: FileText },
        { id: "editorial", label: "Editorial", icon: BookOpen },
        { id: "solutions", label: "Solutions", icon: Code2 },
        { id: "submissions", label: "Submissions", icon: History },
        { id: "chatAI", label: "AI Assistant", icon: MessageCircle },
    ];

    const rightTabs = [
        { id: "code", label: "Code", icon: Code2 },
        { id: "testcase", label: "Testcase", icon: Terminal },
        { id: "result", label: "Result", icon: ListChecks },
    ];

    const tags = Array.isArray(problem.tags)
        ? problem.tags
        : [problem.tags].filter(Boolean);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#f3f6fb] text-slate-800">
            <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                        <Code2 size={21} />
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">
                            CodeCrag
                        </p>
                        <p className="text-[10px] text-slate-400">Coding workspace</p>
                    </div>

                    <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
                            Problem Workspace
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="hidden items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 md:flex">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Ready to code
                    </span>

                    <button
                        onClick={() => setLeftCollapsed(!leftCollapsed)}
                        className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 lg:block"
                        title={leftCollapsed ? "Show description" : "Hide description"}
                    >
                        <PanelLeftClose size={17} />
                    </button>

                    <button
                        onClick={() => setRightCollapsed(!rightCollapsed)}
                        className="hidden rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 lg:block"
                        title={rightCollapsed ? "Show editor" : "Hide editor"}
                    >
                        <PanelRightClose size={17} />
                    </button>
                </div>
            </header>

            <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-2 sm:p-3 lg:flex-row">
                {!leftCollapsed && (
                    <section

                        className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${rightCollapsed ? "lg:flex-1" : "lg:w-1/2 lg:flex-1"
                            }`}

                    >
                        <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 sm:px-3">
                            {leftTabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveLeftTab(id)}
                                    className={`relative flex shrink-0 items-center gap-1.5 px-2.5 py-3.5 text-xs font-semibold transition sm:px-3 sm:text-sm ${activeLeftTab === id
                                        ? "text-blue-700"
                                        : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <Icon size={15} />
                                    {label}
                                    {activeLeftTab === id && (
                                        <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                            {activeLeftTab === "description" && (
                                <div>
                                    <div className="mb-5">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                                {problem.title}
                                            </h1>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getDifficultyStyle(
                                                    problem.difficulty
                                                )}`}
                                            >
                                                {problem.difficulty}
                                            </span>

                                            {tags.map((tag, index) => (
                                                <span
                                                    key={`${tag}-${index}`}
                                                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <BookOpen size={14} />
                                                Problem Description
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Sparkles size={14} className="text-amber-500" />
                                                Practice and learn
                                            </span>
                                        </div>
                                    </div>

                                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                        {problem.description}
                                    </div>

                                    <div className="mt-8">
                                        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <ListChecks size={16} />
                                            </span>
                                            Examples
                                        </h2>

                                        <div className="space-y-4">
                                            {(problem.visibleTestCases || []).map(
                                                (example, index) => (
                                                    <div
                                                        key={index}
                                                        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                                                    >
                                                        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                            <h3 className="text-sm font-semibold text-slate-800">
                                                                Example {index + 1}
                                                            </h3>
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                                Sample
                                                            </span>
                                                        </div>

                                                        <div className="space-y-3 p-4 text-sm">
                                                            <div>
                                                                <p className="mb-1 text-xs font-semibold text-slate-500">
                                                                    Input
                                                                </p>
                                                                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-800">
                                                                    {example.input}
                                                                </pre>
                                                            </div>

                                                            <div>
                                                                <p className="mb-1 text-xs font-semibold text-slate-500">
                                                                    Output
                                                                </p>
                                                                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-emerald-50 p-3 font-mono text-xs leading-5 text-emerald-800">
                                                                    {example.output}
                                                                </pre>
                                                            </div>

                                                            {example.explanation && (
                                                                <div>
                                                                    <p className="mb-1 text-xs font-semibold text-slate-500">
                                                                        Explanation
                                                                    </p>
                                                                    <p className="text-xs leading-6 text-slate-600">
                                                                        {example.explanation}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeLeftTab === "editorial" && (
                                <div>
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <BookOpen className="text-blue-600" size={22} />
                                        Editorial
                                    </h2>
                                    <Editorial
                                        secureUrl={problem.secureUrl}
                                        thumbnailUrl={problem.thumbnailUrl}
                                        duration={problem.duration}
                                    />
                                </div>
                            )}


                            {activeLeftTab === "solutions" && (
                                <div className="space-y-5">
                                    {/* Solutions heading */}
                                    <div className="border-b border-slate-100 pb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                <Code2 size={21} />
                                            </div>

                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">
                                                    Reference Solutions
                                                </h2>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {problem.title} · Available language implementations
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {problem.referenceSolution?.length > 0 ? (
                                        <div className="space-y-5">
                                            {problem.referenceSolution.map((solution, index) => (
                                                <div
                                                    key={`${solution.language}-${index}`}
                                                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                                                >
                                                    {/* Solution header */}
                                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600">
                                                                <Code2 size={17} />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-sm font-semibold text-slate-800">
                                                                    {solution.language} Solution
                                                                </h3>

                                                                <p className="mt-0.5 text-[11px] text-slate-400">
                                                                    Reference implementation
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                                            {solution.language}
                                                        </span>
                                                    </div>

                                                    {/* Code block */}
                                                    <div className="relative bg-[#111827]">
                                                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                                                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                                            </div>


                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await navigator.clipboard.writeText(
                                                                            solution.completeCode || ""
                                                                        );

                                                                        setCopiedIndex(index);

                                                                        setTimeout(() => {
                                                                            setCopiedIndex(null);
                                                                        }, 2000);
                                                                    } catch (error) {
                                                                        console.error("Failed to copy code:", error);
                                                                    }
                                                                }}
                                                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${copiedIndex === index
                                                                    ? "bg-success/15 text-success"
                                                                    : "bg-slate-800 text-white hover:bg-slate-700"
                                                                    }`}
                                                            >
                                                                {copiedIndex === index ? (
                                                                    <>
                                                                        <Check size={14} />
                                                                        Copied!
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={14} />
                                                                        Copy Code
                                                                    </>
                                                                )}
                                                            </button>

                                                        </div>

                                                        <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-6 text-slate-100 sm:p-5">
                                                            <code>{solution.completeCode}</code>
                                                        </pre>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-5 py-12 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                                                <Code2 size={25} />
                                            </div>

                                            <h3 className="mt-4 text-sm font-bold text-slate-800">
                                                No reference solutions yet
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                                                Reference implementations for this problem will appear here when available.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}


                            {activeLeftTab === "submissions" && (
                                <div>
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <History className="text-blue-600" size={22} />
                                        My Submissions
                                    </h2>
                                    <SubmissionHistory problemId={problemId} />
                                </div>
                            )}

                            {activeLeftTab === "chatAI" && (
                                <div>
                                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                                        <MessageCircle className="text-blue-600" size={22} />
                                        AI Coding Assistant
                                    </h2>
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                                        <ChatAi problem={problem} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {!rightCollapsed && (
                    <section

                        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${leftCollapsed ? "lg:flex-1" : "lg:w-1/2"
                            }`}

                    >
                        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-5">
                            <div className="flex items-center gap-1">
                                {rightTabs.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveRightTab(id)}
                                        className={`relative flex items-center gap-1.5 px-3 py-4 text-xs font-semibold transition sm:px-4 sm:text-sm ${activeRightTab === id
                                            ? "text-blue-700"
                                            : "text-slate-500 hover:text-slate-800"
                                            }`}
                                    >
                                        <Icon size={15} />
                                        {label}
                                        {activeRightTab === id && (
                                            <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Workspace
                            </span>
                        </div>

                        {activeRightTab === "code" && (
                            <div className="flex min-h-0 flex-1 flex-col bg-[#111827]">
                                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#172033] px-3 py-3 sm:px-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                                            <Code2 size={17} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-100">
                                                Code Editor
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Edit your solution
                                            </p>
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#222d41] px-3 py-2 text-xs text-slate-200">
                                        <Code2 size={14} className="text-blue-300" />
                                        <select
                                            value={selectedLanguage}
                                            onChange={(event) =>
                                                handleLanguageChange(event.target.value)
                                            }
                                            className="max-w-28  cursor-pointer bg-transparent outline-none  sm:max-w-none"
                                        >
                                            <option className="bg-[#172033]" value="javascript">
                                                JavaScript
                                            </option>
                                            <option className="bg-[#172033]" value="java">
                                                Java
                                            </option>
                                            <option className="bg-[#172033]" value="cpp">
                                                C++
                                            </option>
                                        </select>

                                    </label>
                                </div>

                                <div className="min-h-0 flex-1">
                                    <Editor
                                        height="100%"
                                        language={getLanguageForMonaco(selectedLanguage)}
                                        value={code}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorDidMount}
                                        theme="vs-dark"
                                        options={{
                                            fontSize: 14,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            tabSize: 2,
                                            insertSpaces: true,
                                            wordWrap: "on",
                                            lineNumbers: "on",
                                            glyphMargin: false,
                                            folding: true,
                                            lineDecorationsWidth: 10,
                                            lineNumbersMinChars: 3,
                                            renderLineHighlight: "line",
                                            roundedSelection: false,
                                            readOnly: false,
                                            cursorStyle: "line",
                                            mouseWheelZoom: true,
                                            padding: { top: 18, bottom: 18 },
                                            suggestOnTriggerCharacters: true,
                                            bracketPairColorization: { enabled: true },
                                        }}
                                    />
                                </div>

                                <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#172033] px-3 py-3 sm:px-5">
                                    <button
                                        onClick={() => setCode("")}
                                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                                    >
                                        <RotateCcw size={14} />
                                        Clear code
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleRun}
                                            disabled={loading}
                                            className="flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                        >
                                            {loading ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <Play size={15} />
                                            )}
                                            Run
                                        </button>

                                        <button
                                            onClick={handleSubmitCode}
                                            disabled={loading}
                                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                                        >
                                            {loading ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <Send size={15} />
                                            )}
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeRightTab === "testcase" && (
                            <div className="flex min-h-0 flex-1 flex-col bg-white">
                                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                            <Terminal size={17} className="text-blue-600" />
                                            Test Results
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Output from your latest run
                                        </p>
                                    </div>

                                    {runResult && (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${runResult.success
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-rose-50 text-rose-700"
                                                }`}
                                        >
                                            {runResult.success ? "Completed" : "Failed"}
                                        </span>
                                    )}
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                                    {loading ? (
                                        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                                            <span className="loading loading-spinner loading-sm" />
                                            Running your code...
                                        </div>
                                    ) : runResult ? (
                                        <div>
                                            <div
                                                className={`rounded-xl border p-4 ${runResult.success
                                                    ? "border-emerald-200 bg-emerald-50"
                                                    : "border-rose-200 bg-rose-50"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {runResult.success ? (
                                                        <CheckCircle2
                                                            className="mt-0.5 shrink-0 text-emerald-600"
                                                            size={22}
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="mt-0.5 shrink-0 text-rose-600"
                                                            size={22}
                                                        />
                                                    )}

                                                    <div>
                                                        <h3
                                                            className={`text-sm font-bold ${runResult.success
                                                                ? "text-emerald-800"
                                                                : "text-rose-800"
                                                                }`}
                                                        >
                                                            {runResult.success
                                                                ? "Execution completed"
                                                                : "Execution failed"}
                                                        </h3>

                                                        {runResult.err && (
                                                            <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-rose-700">
                                                                {runResult.err}
                                                            </p>
                                                        )}

                                                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                                                            {runResult.runtime != null && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <Clock size={14} />
                                                                    {Number(runResult.runtime).toFixed(12)} sec
                                                                </span>
                                                            )}
                                                            {runResult.memory != null && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <MemoryStick size={14} />
                                                                    {runResult.memory} KB
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {(runResult.testCases || []).map((testCase, index) => (
                                                <div
                                                    key={index}
                                                    className="mt-4 overflow-hidden rounded-xl border border-slate-200"
                                                >
                                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                        <span className="text-xs font-bold text-slate-700">
                                                            Test Case {index + 1}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-semibold ${testCase.status_id == 3
                                                                ? "text-emerald-600"
                                                                : "text-rose-600"
                                                                }`}
                                                        >
                                                            {testCase.status_id == 3 ? "✓ Passed" : "✕ Failed"}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-3 p-4 text-xs">
                                                        <div>
                                                            <p className="mb-1 font-semibold text-slate-500">
                                                                Input
                                                            </p>
                                                            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-slate-800">
                                                                {testCase.stdin}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 font-semibold text-slate-500">
                                                                Expected Output
                                                            </p>
                                                            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-slate-800">
                                                                {testCase.expected_output}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 font-semibold text-slate-500">
                                                                Your Output
                                                            </p>
                                                            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-mono text-slate-800">
                                                                {testCase.stdout || testCase.stderr || "No output"}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                                <Terminal size={27} />
                                            </div>
                                            <h3 className="mt-4 text-sm font-bold text-slate-800">
                                                Ready to test?
                                            </h3>
                                            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                                                Run your code to see execution results and test case
                                                details here.
                                            </p>
                                            <button
                                                onClick={() => setActiveRightTab("code")}
                                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                Back to editor
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeRightTab === "result" && (
                            <div className="flex min-h-0 flex-1 flex-col bg-white">
                                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                                            <ListChecks size={17} className="text-blue-600" />
                                            Submission Result
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Evaluation of your solution
                                        </p>
                                    </div>
                                </div>

                                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                                    {loading ? (
                                        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                                            <span className="loading loading-spinner loading-sm" />
                                            Submitting your solution...
                                        </div>
                                    ) : submitResult ? (
                                        <div
                                            className={`rounded-2xl border p-5 sm:p-7 ${submitResult.accepted
                                                ? "border-emerald-200 bg-emerald-50"
                                                : "border-rose-200 bg-rose-50"
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${submitResult.accepted
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-rose-100 text-rose-700"
                                                        }`}
                                                >
                                                    {submitResult.accepted ? (
                                                        <CheckCircle2 size={27} />
                                                    ) : (
                                                        <XCircle size={27} />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3
                                                        className={`text-xl font-bold ${submitResult.accepted
                                                            ? "text-emerald-800"
                                                            : "text-rose-800"
                                                            }`}
                                                    >
                                                        {submitResult.accepted
                                                            ? "Accepted!"
                                                            : submitResult.error || "Not Accepted"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {submitResult.accepted
                                                            ? "Your solution passed the evaluation."
                                                            : "Your solution did not pass the evaluation."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <div className="rounded-xl border border-white/80 bg-white/80 p-4">
                                                    <p className="text-xs text-slate-500">Test Cases</p>
                                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                                        {submitResult.passedTestCases ?? 0}
                                                        <span className="text-sm font-medium text-slate-400">
                                                            {" "}
                                                            / {submitResult.totalTestCases ?? 0}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/80 bg-white/80 p-4">
                                                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <Clock size={14} /> Runtime
                                                    </p>
                                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                                        {submitResult.runtime != null
                                                            ? Number(submitResult.runtime).toFixed(12)
                                                            : "--"}
                                                        <span className="ml-1 text-xs font-medium text-slate-400">
                                                            sec
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/80 bg-white/80 p-4">
                                                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <MemoryStick size={14} /> Memory
                                                    </p>
                                                    <p className="mt-2 text-lg font-bold text-slate-900">
                                                        {submitResult.memory ?? "--"}
                                                        <span className="ml-1 text-xs font-medium text-slate-400">
                                                            KB
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setActiveRightTab("code")}
                                                className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                                            >
                                                <Code2 size={15} />
                                                Back to code
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                                <Send size={26} />
                                            </div>
                                            <h3 className="mt-4 text-sm font-bold text-slate-800">
                                                Ready to submit?
                                            </h3>
                                            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                                                Submit your solution to evaluate it against the
                                                problem's test cases.
                                            </p>
                                            <button
                                                onClick={() => setActiveRightTab("code")}
                                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                            >
                                                Back to editor
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default ProblemPage;
