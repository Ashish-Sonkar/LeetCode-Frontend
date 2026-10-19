// import { useState, useEffect, useRef } from 'react'

// import { useForm } from 'react-hook-form'

// import Editor from '@monaco-editor/react'

// import { useParams } from 'react-router'

// import axiosClient from '../utils/axiosClient'

// import SubmissionHistory from '../components/SubmissionHistory'

// import ChatAi from '../components/ChatAi'

// import Editorial from '../components/Editorial'

// const languageMap = {
//     javascript: 'JavaScript',
//     java: 'Java',
//     cpp: 'C++',
// };

// const ProblemPage = () => {

//     const [problem, setProblem] = useState(null)

//     const [selectedLanguage, setSelectedLanguage] = useState('javascript')

//     const [code, setCode] = useState('')

//     const [loading, setLoading] = useState(false)

//     const [runResult, setRunResult] = useState(null)

//     const [submitResult, setSubmitResult] = useState(null)

//     const [activeLeftTab, setActiveLeftTab] = useState('description')

//     const [activeRightTab, setActiveRightTab] = useState('code')

//     const editorRef = useRef(null)

//     let { problemId } = useParams()

//     const { handleSubmit } = useForm()

//     useEffect(() => {

//         const fetchProblem = async () => {

//             setLoading(true)

//             try {

//                 const response = await axiosClient.get(`/problem/getProblemById/${problemId}`)

//                 const initialCode = response.data.startCode?.find(
//                     (sc) => sc.language === languageMap[selectedLanguage]
//                 )?.initialCode;

//                 setProblem(response.data)

//                 setCode(initialCode)

//                 setLoading(false)

//             } catch (err) {

//                 console.error('Error fetching problem:', err)

//                 setLoading(false)

//             }

//         }

//         fetchProblem()

//     }, [problemId])

//     //Update code when Language changes

//     useEffect(() => {

//         if (problem) {


//             const initialCode = problem.startCode?.find(sc => sc.language === languageMap[selectedLanguage])?.initialCode

//             setCode(initialCode)

//         }

//     }, [selectedLanguage, problem])

//     const handleEditorChange = (value) => {

//         setCode(value || '')

//     }

//     const handleEditorDidMount = (editor) => {

//         editorRef.current = editor

//     }

//     const handleLanguageChange = (language) => {

//         setSelectedLanguage(language)

//     }

//     const handleRun = async () => {

//         setLoading(true)

//         setRunResult(null)

//         try {

//             const response = await axiosClient.post(`/submission/runCode/${problemId}`, {

//                 code,

//                 language: selectedLanguage

//             })

//             setRunResult(response.data)

//             setLoading(false)

//             setActiveRightTab('testcase')

//         } catch (err) {

//             console.error('Error running code:', err)

//             setRunResult({

//                 success: false,

//                 err: err.response?.data?.message || err.message || 'Internal server error'

//             })

//             setLoading(false)

//             setActiveRightTab('testcase')

//         }

//     }

//     const handleSubmitCode = async () => {

//         setLoading(true)

//         setSubmitResult(null)

//         try {

//             const response = await axiosClient.post(`/submission/submitCode/${problemId}`, {

//                 code: code,

//                 language: selectedLanguage

//             })

//             setSubmitResult(response.data)

//             setLoading(false)

//             setActiveRightTab('result')

//         } catch (err) {

//             console.error('Error submitting code:', err)

//             setSubmitResult(null)

//             setLoading(false)

//             setActiveRightTab('result')

//         }

//     }

//     const getLanguageForMonaco = (lang) => {

//         switch (lang) {

//             case 'javascript': return 'javascript';

//             case 'java': return 'java';

//             case 'cpp': return 'cpp';

//             default: return 'javascript'

//         }

//     }

//     const getDifficultyColor = (difficulty) => {

//         switch (difficulty) {

//             case 'easy': return 'text-green-500';

//             case 'medium': return 'text-yellow-500';

//             case 'hard': return 'text-red-500';

//             default: return 'text-gray-500'

//         }

//     }

//     if (loading && !problem) {

//         return (

//             <div className='flex justify-center items-center min-h-screen' >

//                 <span className='loading loading-spinner loading-lg' ></span>

//             </div>

//         )

//     }

//     return (

//         <div className='h-screen flex bg-base-100' >

//             {/* Left Panel */}

//             <div className='w-1/2 flex flex-col border-r border-base-300' >

//                 {/* Left Tabs */}

//                 <div className='tabs tabs-bordered bg-base-200 px-4' >

//                     <button

//                         className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveLeftTab('description')}

//                     >Description

//                     </button>

//                     <button

//                         className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveLeftTab('editorial')}

//                     >Editorial

//                     </button>

//                     <button

//                         className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveLeftTab('solutions')}

//                     >Solutions

//                     </button>

//                     <button

//                         className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveLeftTab('submissions')}

//                     >Submissions

//                     </button>

//                     <button

//                         className={`tab ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveLeftTab('chatAI')}

//                     >ChatAI

//                     </button>

//                 </div>

//                 {/* Left Content */}

//                 <div className='flex-1 overflow-y-auto p-6' >

//                     {problem && (

//                         <>

//                             {activeLeftTab === 'description' && (

//                                 <div>

//                                     <div className='flex items-center gap-4 mb-6' >

//                                         <h1 className='text-2xl font-bold' >{problem.title}</h1>

//                                         <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`} >

//                                             {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}

//                                         </div>

//                                         <div className='badge badge-primary' >{problem.tags}</div>

//                                     </div>

//                                     <div className='prose max-w-none' >

//                                         <div className='whitespace-pre-wrap text-sm leading-relaxed' >

//                                             {problem.description}

//                                         </div>

//                                     </div>

//                                     <div className='mt-8' >

//                                         <h3 className='text-lg font-semibold mb-4' >Examples:</h3>

//                                         <div className='space-y-4' >

//                                             {(problem.visibleTestCases || []).map((example, index) => (

//                                                 <div key={index} className='bg-base-200 p-4 rounded-lg' >

//                                                     <h4 className='font-semibold mb-2' >Example {index + 1}:</h4>

//                                                     <div className='space-y-2 text-sm font-mono' >

//                                                         <div><strong>Input:</strong>{example.input}</div>

//                                                         <div><strong>Output:</strong>{example.output}</div>

//                                                         <div><strong>Explanation:</strong>{example.explanation}</div>

//                                                     </div>

//                                                 </div>

//                                             ))}

//                                         </div>

//                                     </div>

//                                 </div>

//                             )}

//                             {activeLeftTab === 'editorial' && (

//                                 <div className='prose max-w-none'>

//                                     <h2 className='text-xl font-bold mb-4' >Editorial</h2>

//                                     <div className='whitespace-pre-wrap text-sm leading-relaxed' >

//                                         <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />

//                                     </div>

//                                 </div>

//                             )}

//                             {activeLeftTab === 'solutions' && (

//                                 <div>

//                                     <h2 className='text-xl font-bold mb-4' >Solutions</h2>

//                                     <div className='space-y-6' >

//                                         {problem.referenceSolution?.map((solution, index) => (

//                                             <div key={index} className='border border-base-300 rounded-lg' >

//                                                 <div className='bg-base-200 px-4 py-2 rounded-t-lg' >

//                                                     <h3 className='font-semibold' >{problem?.title} - {solution?.language}</h3>

//                                                 </div>

//                                                 <div className='p-4' >

//                                                     <pre className='bg-base-300 p-4 rounded text-sm overflow-x-auto' >

//                                                         <code>{solution?.completeCode}</code>

//                                                     </pre>

//                                                 </div>

//                                             </div>

//                                         )) || <p className='text-gray-500' >Solutions will be available after you solve the problem</p>}

//                                     </div>

//                                 </div>

//                             )}

//                             {activeLeftTab === 'submissions' && (

//                                 <div>

//                                     <h2 className='text-xl font-bold mb-4' >My Submissions</h2>

//                                     <div className='text-gray-500' >

//                                         <SubmissionHistory problemId={problemId} />

//                                     </div>

//                                 </div>

//                             )}

//                             {activeLeftTab === 'chatAI' && (

//                                 <div className='prose max-w-none'>

//                                     <h2 className='text-xl font-bold mb-4' >CHAT with AI</h2>

//                                     <div className='whitespace-pre-wrap text-sm leading-relaxed' >

//                                         <ChatAi problem={problem} />

//                                     </div>

//                                 </div>

//                             )}


//                         </>

//                     )}

//                 </div>

//             </div>

//             {/* Right Panel */}

//             <div className='w-1/2 flex flex-col' >

//                 {/* Right Tabs */}

//                 <div className='tabs tabs-bordered bg-base-200 px-4' >

//                     <button

//                         className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveRightTab('code')}

//                     >Code

//                     </button>

//                     <button

//                         className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveRightTab('testcase')}

//                     >Testcase

//                     </button>

//                     <button

//                         className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}

//                         onClick={() => setActiveRightTab('result')}

//                     >Result

//                     </button>

//                 </div>

//                 {/* Right Content */}

//                 <div className='flex-1 flex flex-col' >

//                     {activeRightTab === 'code' && (

//                         <div className='flex-1 flex flex-col' >

//                             {/* Language Selector */}

//                             <div className='flex justify-between items-center p-4 border-b border-base-300' >

//                                 <div className='flex gap-2' >

//                                     {['javascript', 'java', 'cpp'].map((lang) => (

//                                         <button

//                                             key={lang}

//                                             className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}

//                                             onClick={() => handleLanguageChange(lang)}

//                                         >

//                                             {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}

//                                         </button>

//                                     ))}

//                                 </div>

//                             </div>

//                             {/* Monaco Editor */}

//                             <div className="flex-1">

//                                 <Editor

//                                     height="100%"

//                                     language={getLanguageForMonaco(selectedLanguage)}

//                                     value={code}

//                                     onChange={handleEditorChange}

//                                     onMount={handleEditorDidMount}

//                                     theme="vs-dark"

//                                     options={{

//                                         fontSize: 14,

//                                         minimap: { enabled: false },

//                                         scrollBeyondLastLine: false,

//                                         automaticLayout: true,

//                                         tabSize: 2,

//                                         insertSpaces: true,

//                                         wordWrap: 'on',

//                                         lineNumbers: 'on',

//                                         glyphMargin: false,

//                                         folding: true,

//                                         lineDecorationsWidth: 10,

//                                         lineNumbersMinChars: 3,

//                                         renderLineHighlight: 'line',

//                                         selectOnLineNumbers: true,

//                                         roundedSelection: false,

//                                         readOnly: false,

//                                         cursorStyle: 'line',

//                                         mouseWheelZoom: true,

//                                     }}

//                                 />

//                             </div>

//                             {/* Action Buttons */}

//                             <div className='p-4 border-t border-base-300 flex justify-between' >

//                                 <div className='flex gap-2' >

//                                     <button

//                                         className='btn btn-ghost btn-sm'

//                                         onClick={() => setActiveRightTab('testcase')}

//                                     >

//                                         Console

//                                     </button>

//                                 </div>

//                                 <div className='flex gap-2' >

//                                     <button

//                                         className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}

//                                         onClick={handleRun}

//                                         disabled={loading}

//                                     >Run

//                                     </button>

//                                     <button

//                                         className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}

//                                         onClick={handleSubmitCode}

//                                         disabled={loading}

//                                     >Submit

//                                     </button>

//                                 </div>

//                             </div>

//                         </div>

//                     )}

//                     {activeRightTab === 'testcase' && (

//                         <div className='flex-1 p-4 overflow-y-auto' >

//                             <h3 className='font-semibold mb-4' >Test Results</h3>

//                             {runResult ? (

//                                 <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`} >

//                                     <div>

//                                         {runResult.success ? (

//                                             <div>

//                                                 <h4 className='font-bold' >✅ All test cases passed!</h4>

//                                                 <p className='text-sm mt-2' >Runtime:{runResult.runtime + " sec"}</p>

//                                                 <p className='text-sm' >Memory:{runResult.memory + " KB"}</p>

//                                                 <div className='mt-4 space-y-2' >

//                                                     {(runResult.testCases || []).map((tc, i) => (

//                                                         <div key={i} className='bg-base-100 p-3 rounded text-xs'>

//                                                             <div className='font-mono' >

//                                                                 <div><strong>Input:</strong>{tc.stdin}</div>

//                                                                 <div><strong>Expected:</strong>{tc.expected_output}</div>

//                                                                 <div><strong>Output:</strong>{tc.stdout}</div>

//                                                                 <div className={'text-green-600'} >

//                                                                     {'Passed'}

//                                                                 </div>

//                                                             </div>

//                                                         </div>

//                                                     ))}

//                                                 </div>

//                                             </div>

//                                         ) : (

//                                             <div>

//                                                 <h4 className="font-bold">❌ Error</h4>

//                                                 <div className="mt-4 space-y-2">

//                                                     {(runResult.testCases || []).map((tc, i) => (

//                                                         <div key={i} className="bg-base-100 p-3 rounded text-xs">

//                                                             <div className="font-mono">

//                                                                 <div>

//                                                                     <strong>Input:</strong> {tc.stdin}

//                                                                 </div>

//                                                                 <div>

//                                                                     <strong>Expected:</strong> {tc.expected_output}

//                                                                 </div>

//                                                                 <div>

//                                                                     <strong>Output:</strong> {tc.stdout}

//                                                                 </div>

//                                                                 <div

//                                                                     className={

//                                                                         tc.status_id == 3

//                                                                             ? 'text-green-600'

//                                                                             : 'text-red-600'

//                                                                     }

//                                                                 >

//                                                                     {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}

//                                                                 </div>

//                                                             </div>

//                                                         </div>

//                                                     ))}

//                                                 </div>

//                                             </div>

//                                         )}

//                                     </div>

//                                 </div>

//                             ) : (

//                                 <div className='text-gray-500' >

//                                     Click "Run" to test your code with the example test cases.

//                                 </div>

//                             )}

//                         </div>

//                     )}

//                     {activeRightTab === 'result' && (

//                         <div className="flex-1 p-4 overflow-y-auto">

//                             <h3 className="font-semibold mb-4">Submission Result</h3>

//                             {submitResult ? (

//                                 <div

//                                     className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'

//                                         }`}

//                                 >

//                                     <div>

//                                         {submitResult.accepted ? (

//                                             <div>

//                                                 <h4 className="font-bold text-lg">🎉 Accepted</h4>

//                                                 <div className="mt-4 space-y-2">

//                                                     <p>

//                                                         Test Cases Passed: {submitResult.passedTestCases}/

//                                                         {submitResult.totalTestCases}

//                                                     </p>

//                                                     <p>

//                                                         Runtime: {submitResult.runtime + " sec"}

//                                                     </p>

//                                                     <p>

//                                                         Memory: {submitResult.memory + " KB"}

//                                                     </p>

//                                                 </div>

//                                             </div>

//                                         ) : (

//                                             <div>

//                                                 <h4 className="font-bold text-lg">

//                                                     ❌ {submitResult.error}

//                                                 </h4>

//                                                 <div className="mt-4 space-y-2">

//                                                     <p>

//                                                         Test Cases Passed: {submitResult.passedTestCases}/

//                                                         {submitResult.totalTestCases}

//                                                     </p>

//                                                 </div>

//                                             </div>

//                                         )}

//                                     </div>

//                                 </div>

//                             ) : (

//                                 <div className="text-gray-500">

//                                     Click "Submit" to submit your solution for evaluation.

//                                 </div>

//                             )}

//                         </div>

//                     )}

//                 </div>

//             </div>

//         </div>

//     )

// }

// export default ProblemPage



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
                                            className="max-w-28 cursor-pointer bg-transparent outline-none sm:max-w-none"
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
                                        <ChevronDown size={13} className="text-slate-400" />
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
                                                                    {runResult.runtime} sec
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
                                                        {submitResult.runtime ?? "--"}
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


// import { useState, useEffect, useRef } from 'react'
// import { useParams } from 'react-router'
// import Editor from '@monaco-editor/react'
// import { useForm } from 'react-hook-form'
// import {
//     FileText,
//     BookOpen,
//     Code2,
//     Sparkles,
//     ListChecks,
//     CheckCircle2,
//     Copy,
//     Terminal,
//     Play,
//     Send,
//     Clock,
//     MemoryStick,
//     AlertCircle,
//     Lightbulb,
//     Tag,
//     ArrowUpRight
// } from 'lucide-react'

// import axiosClient from '../utils/axiosClient'
// import SubmissionHistory from '../components/SubmissionHistory'
// import ChatAi from '../components/ChatAi'
// import Editorial from '../components/Editorial'

// const languageMap = {
//     javascript: 'JavaScript',
//     java: 'Java',
//     cpp: 'C++',
// }

// const languageAliases = {
//     javascript: ['javascript', 'Javascript', 'JavaScript', 'js'],
//     java: ['java', 'Java'],
//     cpp: ['cpp', 'C++', 'c++'],
// }

// const getStarterCode = (startCode, language) => {
//     const aliases = languageAliases[language] || [language]

//     const starter = startCode?.find((item) =>
//         aliases.includes(item.language)
//     )

//     return starter?.initialCode || ''
// }

// const normalizeLanguage = (language) => {
//     const value = String(language || '').toLowerCase()

//     if (['javascript', 'js'].includes(value)) return 'javascript'
//     if (value === 'java') return 'java'
//     if (['c++', 'cpp', 'c'].includes(value)) return 'cpp'

//     return language
// }

// const ProblemPage = () => {
//     const [problem, setProblem] = useState(null)
//     const [selectedLanguage, setSelectedLanguage] = useState('javascript')
//     const [code, setCode] = useState('')
//     const [codeByLanguage, setCodeByLanguage] = useState({})
//     const [loading, setLoading] = useState(false)
//     const [runResult, setRunResult] = useState(null)
//     const [submitResult, setSubmitResult] = useState(null)
//     const [activeLeftTab, setActiveLeftTab] = useState('description')
//     const [activeRightTab, setActiveRightTab] = useState('code')
//     const [copiedIndex, setCopiedIndex] = useState(null)

//     const editorRef = useRef(null)
//     const { problemId } = useParams()
//     const { handleSubmit } = useForm()

//     // Fetch problem and initialize starter code for each language.
//     useEffect(() => {
//         let cancelled = false

//         const fetchProblem = async () => {
//             setLoading(true)

//             try {
//                 const response = await axiosClient.get(
//                     `/problem/getProblemById/${problemId}`
//                 )

//                 if (cancelled) return

//                 const fetchedProblem = response.data
//                 const initialCodes = {}

//                 Object.keys(languageMap).forEach((language) => {
//                     initialCodes[language] = getStarterCode(
//                         fetchedProblem.startCode,
//                         language
//                     )
//                 })

//                 setProblem(fetchedProblem)
//                 setCodeByLanguage(initialCodes)
//                 setCode(initialCodes.javascript || '')
//                 setSelectedLanguage('javascript')
//                 setRunResult(null)
//                 setSubmitResult(null)
//             } catch (err) {
//                 if (!cancelled) {
//                     console.error('Error fetching problem:', err)
//                 }
//             } finally {
//                 if (!cancelled) {
//                     setLoading(false)
//                 }
//             }
//         }

//         fetchProblem()

//         return () => {
//             cancelled = true
//         }
//     }, [problemId])

//     // Save edits to the currently selected language.
//     const handleEditorChange = (value) => {
//         const updatedCode = value ?? ''

//         setCode(updatedCode)

//         setCodeByLanguage((previous) => ({
//             ...previous,
//             [selectedLanguage]: updatedCode,
//         }))
//     }

//     const handleEditorDidMount = (editor) => {
//         editorRef.current = editor
//     }

//     // Restore the saved draft for the selected language.
//     const handleLanguageChange = (language) => {
//         if (language === selectedLanguage) return

//         // Save the current editor content before switching.
//         setCodeByLanguage((previous) => ({
//             ...previous,
//             [selectedLanguage]: code,
//         }))

//         const savedCode = codeByLanguage[language]

//         setCode(
//             savedCode !== undefined
//                 ? savedCode
//                 : getStarterCode(problem?.startCode, language)
//         )

//         setSelectedLanguage(language)
//     }

//     const handleRun = async () => {
//         setLoading(true)
//         setRunResult(null)

//         try {
//             const response = await axiosClient.post(
//                 `/submission/runCode/${problemId}`,
//                 {
//                     code,
//                     language: selectedLanguage,
//                 }
//             )

//             setRunResult(response.data)
//         } catch (err) {
//             console.error('Error running code:', err)

//             setRunResult({
//                 success: false,
//                 err:
//                     err.response?.data?.message ||
//                     err.message ||
//                     'Internal server error',
//             })
//         } finally {
//             setLoading(false)
//             setActiveRightTab('testcase')
//         }
//     }

//     const handleSubmitCode = async () => {
//         setLoading(true)
//         setSubmitResult(null)

//         try {
//             const response = await axiosClient.post(
//                 `/submission/submitCode/${problemId}`,
//                 {
//                     code,
//                     language: selectedLanguage,
//                 }
//             )

//             setSubmitResult(response.data)
//         } catch (err) {
//             console.error('Error submitting code:', err)

//             setSubmitResult({
//                 accepted: false,
//                 error:
//                     err.response?.data?.message ||
//                     err.message ||
//                     'Submission failed',
//             })
//         } finally {
//             setLoading(false)
//             setActiveRightTab('result')
//         }
//     }

//     const getLanguageForMonaco = (language) => {
//         const normalized = normalizeLanguage(language)

//         if (normalized === 'java') return 'java'
//         if (normalized === 'cpp') return 'cpp'

//         return 'javascript'
//     }

//     const getDifficultyStyle = (difficulty) => {
//         switch (String(difficulty || '').toLowerCase()) {
//             case 'easy':
//                 return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
//             case 'medium':
//                 return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
//             case 'hard':
//                 return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
//             default:
//                 return 'bg-base-200 text-base-content border-base-300'
//         }
//     }

//     const copySolution = async (text, index) => {
//         try {
//             await navigator.clipboard.writeText(text || '')
//             setCopiedIndex(index)

//             setTimeout(() => {
//                 setCopiedIndex(null)
//             }, 1500)
//         } catch (err) {
//             console.error('Unable to copy solution:', err)
//         }
//     }

//     const renderResultValue = (value) => {
//         if (value === undefined || value === null || value === '') {
//             return 'N/A'
//         }

//         return String(value)
//     }

//     if (loading && !problem) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-base-100">
//                 <div className="flex flex-col items-center gap-3">
//                     <span className="loading loading-spinner loading-lg text-primary" />
//                     <p className="text-sm text-base-content/60">
//                         Loading problem...
//                     </p>
//                 </div>
//             </div>
//         )
//     }

//     if (!problem) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-base-100">
//                 <AlertCircle size={36} className="text-error" />
//                 <h2 className="text-xl font-semibold">Problem not found</h2>
//                 <p className="text-sm text-base-content/60">
//                     Unable to load this problem. Please try again.
//                 </p>
//             </div>
//         )
//     }

//     const tags = Array.isArray(problem.tags)
//         ? problem.tags
//         : problem.tags
//             ? [problem.tags]
//             : []

//     const examples = problem.visibleTestCases || []
//     const solutions = problem.referenceSolution || []

//     return (
//         <div className="h-screen flex flex-col lg:flex-row bg-base-100 text-base-content overflow-hidden">

//             {/* LEFT PANEL */}
//             <section className="w-full lg:w-1/2 min-h-0 flex flex-col border-r border-base-300">

//                 {/* Left navigation */}
//                 <div className="flex items-center gap-1 overflow-x-auto px-3 border-b border-base-300 bg-base-200/70 shrink-0">
//                     {[
//                         { id: 'description', label: 'Description', icon: FileText },
//                         { id: 'editorial', label: 'Editorial', icon: BookOpen },
//                         { id: 'solutions', label: 'Solutions', icon: Code2 },
//                         { id: 'submissions', label: 'Submissions', icon: ListChecks },
//                         { id: 'chatAI', label: 'AI Assistant', icon: Sparkles },
//                     ].map(({ id, label, icon: Icon }) => (
//                         <button
//                             key={id}
//                             onClick={() => setActiveLeftTab(id)}
//                             className={`flex items-center gap-2 whitespace-nowrap px-3 py-4 text-sm border-b-2 transition-colors ${
//                                 activeLeftTab === id
//                                     ? 'border-primary text-primary font-semibold'
//                                     : 'border-transparent text-base-content/60 hover:text-base-content'
//                             }`}
//                         >
//                             <Icon size={16} />
//                             {label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Left content */}
//                 <div className="flex-1 overflow-y-auto p-4 sm:p-6">

//                     {/* DESCRIPTION */}
//                     {activeLeftTab === 'description' && (
//                         <div className="max-w-4xl mx-auto space-y-7">

//                             <div className="pb-5 border-b border-base-300">
//                                 <div className="flex items-start gap-3">
//                                     <div className="p-3 rounded-xl bg-primary/10 text-primary">
//                                         <FileText size={24} />
//                                     </div>

//                                     <div className="flex-1 min-w-0">
//                                         <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">
//                                             {problem.title}
//                                         </h1>

//                                         <div className="flex flex-wrap items-center gap-2 mt-3">
//                                             <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyle(problem.difficulty)}`}>
//                                                 {problem.difficulty
//                                                     ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)
//                                                     : 'Unknown'}
//                                             </span>

//                                             <span className="inline-flex items-center gap-1.5 text-xs text-base-content/50">
//                                                 <BookOpen size={14} />
//                                                 Problem Statement
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {tags.length > 0 && (
//                                     <div className="flex flex-wrap gap-2 mt-5">
//                                         {tags.map((tag, index) => (
//                                             <span
//                                                 key={`${tag}-${index}`}
//                                                 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-200 border border-base-300 text-xs font-medium"
//                                             >
//                                                 <Tag size={12} className="text-primary" />
//                                                 {tag}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="space-y-3">
//                                 <h2 className="text-lg font-bold flex items-center gap-2">
//                                     <span className="w-1 h-5 rounded-full bg-primary" />
//                                     Problem Statement
//                                 </h2>

//                                 <div className="text-sm sm:text-base leading-7 text-base-content/80 whitespace-pre-wrap break-words">
//                                     {problem.description || 'No description available.'}
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between gap-3">
//                                     <h2 className="text-lg font-bold flex items-center gap-2">
//                                         <span className="w-1 h-5 rounded-full bg-primary" />
//                                         Examples
//                                     </h2>

//                                     <span className="text-xs text-base-content/50">
//                                         {examples.length} example{examples.length !== 1 ? 's' : ''}
//                                     </span>
//                                 </div>

//                                 {examples.length > 0 ? (
//                                     <div className="space-y-4">
//                                         {examples.map((example, index) => (
//                                             <article
//                                                 key={index}
//                                                 className="rounded-xl border border-base-300 overflow-hidden bg-base-100"
//                                             >
//                                                 <div className="flex items-center justify-between px-4 py-3 bg-base-200/70 border-b border-base-300">
//                                                     <h3 className="font-semibold text-sm">
//                                                         Example {index + 1}
//                                                     </h3>

//                                                     <span className="text-xs text-base-content/50">
//                                                         Input / Output
//                                                     </span>
//                                                 </div>

//                                                 <div className="p-4 space-y-4">
//                                                     <div>
//                                                         <p className="text-xs font-semibold text-base-content/60 mb-2">
//                                                             Input
//                                                         </p>
//                                                         <pre className="whitespace-pre-wrap break-words rounded-lg bg-base-200 p-3 text-sm font-mono overflow-x-auto">
//                                                             {example.input ?? 'N/A'}
//                                                         </pre>
//                                                     </div>

//                                                     <div>
//                                                         <p className="text-xs font-semibold text-base-content/60 mb-2">
//                                                             Expected Output
//                                                         </p>
//                                                         <pre className="whitespace-pre-wrap break-words rounded-lg bg-base-200 p-3 text-sm font-mono overflow-x-auto">
//                                                             {example.output ?? 'N/A'}
//                                                         </pre>
//                                                     </div>

//                                                     {example.explanation && (
//                                                         <div>
//                                                             <p className="text-xs font-semibold text-base-content/60 mb-2">
//                                                                 Explanation
//                                                             </p>
//                                                             <p className="text-sm leading-6 text-base-content/75 whitespace-pre-wrap">
//                                                                 {example.explanation}
//                                                             </p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </article>
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="rounded-xl border border-dashed border-base-300 p-6 text-center text-sm text-base-content/50">
//                                         No visible examples available.
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3">
//                                 <Lightbulb size={20} className="text-primary shrink-0 mt-0.5" />
//                                 <div>
//                                     <h3 className="font-semibold text-sm">Tip</h3>
//                                     <p className="text-sm text-base-content/65 mt-1 leading-6">
//                                         Understand the input and expected output before writing your solution. Try to consider edge cases too.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* EDITORIAL */}
//                     {activeLeftTab === 'editorial' && (
//                         <div className="max-w-4xl mx-auto">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
//                                     <BookOpen size={23} />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl font-bold">Editorial</h2>
//                                     <p className="text-sm text-base-content/55 mt-1">
//                                         Explanation and walkthrough
//                                     </p>
//                                 </div>
//                             </div>

//                             <Editorial
//                                 secureUrl={problem.secureUrl}
//                                 thumbnailUrl={problem.thumbnailUrl}
//                                 duration={problem.duration}
//                             />
//                         </div>
//                     )}

//                     {/* SOLUTIONS */}
//                     {activeLeftTab === 'solutions' && (
//                         <div className="max-w-4xl mx-auto space-y-6">
//                             <div className="flex items-center gap-3 pb-5 border-b border-base-300">
//                                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
//                                     <Code2 size={24} />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold">Solutions</h2>
//                                     <p className="text-sm text-base-content/55 mt-1">
//                                         Reference implementations for this problem
//                                     </p>
//                                 </div>
//                             </div>

//                             {solutions.length > 0 ? (
//                                 <div className="space-y-5">
//                                     {solutions.map((solution, index) => (
//                                         <article
//                                             key={`${solution.language}-${index}`}
//                                             className="rounded-xl overflow-hidden border border-base-300 bg-base-100 shadow-sm"
//                                         >
//                                             <div className="flex items-center justify-between gap-3 px-4 py-3 bg-base-200/80 border-b border-base-300">
//                                                 <div className="flex items-center gap-3 min-w-0">
//                                                     <div className="p-2 rounded-lg bg-primary/10 text-primary">
//                                                         <Code2 size={18} />
//                                                     </div>

//                                                     <div className="min-w-0">
//                                                         <h3 className="font-semibold text-sm">
//                                                             {solution.language || 'Solution'}
//                                                         </h3>
//                                                         <p className="text-xs text-base-content/50 mt-1 truncate">
//                                                             {problem.title}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 <button
//                                                     type="button"
//                                                     onClick={() => copySolution(solution.completeCode, index)}
//                                                     className="flex items-center gap-2 px-3 py-2 rounded-lg border border-base-300 hover:bg-base-300 transition-colors text-xs font-medium shrink-0"
//                                                 >
//                                                     {copiedIndex === index ? (
//                                                         <>
//                                                             <CheckCircle2 size={14} className="text-success" />
//                                                             Copied
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <Copy size={14} />
//                                                             Copy code
//                                                         </>
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             <div className="bg-[#0d1117] overflow-x-auto">
//                                                 <pre className="p-4 sm:p-5 text-sm leading-6 font-mono text-slate-200 whitespace-pre">
//                                                     <code>{solution.completeCode || '// No code available'}</code>
//                                                 </pre>
//                                             </div>
//                                         </article>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
//                                     <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center">
//                                         <Code2 size={24} className="text-base-content/50" />
//                                     </div>
//                                     <h3 className="font-semibold">No solutions available</h3>
//                                     <p className="text-sm text-base-content/55 mt-2">
//                                         Reference solutions have not been added for this problem yet.
//                                     </p>
//                                 </div>
//                             )}
//                         </div>
//                     )}

//                     {/* SUBMISSIONS */}
//                     {activeLeftTab === 'submissions' && (
//                         <div className="max-w-4xl mx-auto">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
//                                     <ListChecks size={23} />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl font-bold">My Submissions</h2>
//                                     <p className="text-sm text-base-content/55 mt-1">
//                                         Review your previous attempts
//                                     </p>
//                                 </div>
//                             </div>

//                             <SubmissionHistory problemId={problemId} />
//                         </div>
//                     )}

//                     {/* AI ASSISTANT */}
//                     {activeLeftTab === 'chatAI' && (
//                         <div className="max-w-4xl mx-auto">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="p-3 rounded-xl bg-primary/10 text-primary">
//                                     <Sparkles size={23} />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-xl font-bold">AI Assistant</h2>
//                                     <p className="text-sm text-base-content/55 mt-1">
//                                         Ask questions about this problem
//                                     </p>
//                                 </div>
//                             </div>

//                             <ChatAi problem={problem} />
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {/* RIGHT PANEL */}
//             <section className="w-full lg:w-1/2 min-h-0 flex flex-col">

//                 {/* Right navigation */}
//                 <div className="flex items-center gap-1 px-3 bg-base-200/70 border-b border-base-300 shrink-0">
//                     {[
//                         { id: 'code', label: 'Code', icon: Code2 },
//                         { id: 'testcase', label: 'Testcase', icon: Terminal },
//                         { id: 'result', label: 'Result', icon: CheckCircle2 },
//                     ].map(({ id, label, icon: Icon }) => (
//                         <button
//                             key={id}
//                             onClick={() => setActiveRightTab(id)}
//                             className={`flex items-center gap-2 px-4 py-4 text-sm border-b-2 transition-colors ${
//                                 activeRightTab === id
//                                     ? 'border-primary text-primary font-semibold'
//                                     : 'border-transparent text-base-content/60 hover:text-base-content'
//                             }`}
//                         >
//                             <Icon size={16} />
//                             {label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Editor */}
//                 {activeRightTab === 'code' && (
//                     <div className="flex-1 min-h-0 flex flex-col">

//                         <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-base-300 bg-base-100">
//                             <div className="flex items-center gap-2">
//                                 <Code2 size={17} className="text-primary" />
//                                 <span className="text-sm font-semibold">Code Editor</span>
//                             </div>

//                             <div className="flex items-center gap-1.5 p-1 rounded-xl bg-base-200">
//                                 {[
//                                     { id: 'javascript', label: 'JavaScript' },
//                                     { id: 'java', label: 'Java' },
//                                     { id: 'cpp', label: 'C++' },
//                                 ].map(({ id, label }) => (
//                                     <button
//                                         key={id}
//                                         type="button"
//                                         onClick={() => handleLanguageChange(id)}
//                                         className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
//                                             selectedLanguage === id
//                                                 ? 'bg-primary text-primary-content shadow-sm'
//                                                 : 'text-base-content/65 hover:text-base-content hover:bg-base-300'
//                                         }`}
//                                     >
//                                         {label}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="flex-1 min-h-0">
//                             <Editor
//                                 height="100%"
//                                 language={getLanguageForMonaco(selectedLanguage)}
//                                 value={code}
//                                 onChange={handleEditorChange}
//                                 onMount={handleEditorDidMount}
//                                 theme="vs-dark"
//                                 options={{
//                                     fontSize: 14,
//                                     minimap: { enabled: false },
//                                     scrollBeyondLastLine: false,
//                                     automaticLayout: true,
//                                     tabSize: 2,
//                                     insertSpaces: true,
//                                     wordWrap: 'on',
//                                     lineNumbers: 'on',
//                                     glyphMargin: false,
//                                     folding: true,
//                                     lineDecorationsWidth: 10,
//                                     lineNumbersMinChars: 3,
//                                     renderLineHighlight: 'line',
//                                     readOnly: false,
//                                     cursorStyle: 'line',
//                                     mouseWheelZoom: true,
//                                     padding: { top: 16, bottom: 16 },
//                                 }}
//                             />
//                         </div>

//                         <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-base-300 bg-base-200/60">
//                             <button
//                                 type="button"
//                                 onClick={() => setActiveRightTab('testcase')}
//                                 className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-base-300 transition-colors"
//                             >
//                                 <Terminal size={16} />
//                                 Console
//                             </button>

//                             <div className="flex items-center gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={handleRun}
//                                     disabled={loading}
//                                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-base-300 text-sm font-semibold hover:bg-base-300 disabled:opacity-50 transition-colors"
//                                 >
//                                     {loading ? (
//                                         <span className="loading loading-spinner loading-xs" />
//                                     ) : (
//                                         <Play size={15} />
//                                     )}
//                                     Run
//                                 </button>

//                                 <button
//                                     type="button"
//                                     onClick={handleSubmitCode}
//                                     disabled={loading}
//                                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-content text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
//                                 >
//                                     {loading ? (
//                                         <span className="loading loading-spinner loading-xs" />
//                                     ) : (
//                                         <Send size={15} />
//                                     )}
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* TESTCASE / RUN RESULT */}
//                 {activeRightTab === 'testcase' && (
//                     <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
//                         <div className="flex items-center gap-3 mb-5">
//                             <div className="p-2 rounded-lg bg-primary/10 text-primary">
//                                 <Terminal size={20} />
//                             </div>
//                             <div>
//                                 <h2 className="font-bold text-lg">Test Results</h2>
//                                 <p className="text-xs text-base-content/55 mt-1">
//                                     Output from your latest run
//                                 </p>
//                             </div>
//                         </div>

//                         {loading && (
//                             <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
//                                 <span className="loading loading-spinner loading-sm" />
//                                 Running your code...
//                             </div>
//                         )}

//                         {runResult ? (
//                             <div className="space-y-4">
//                                 <div className={`rounded-xl border p-4 ${
//                                     runResult.success
//                                         ? 'border-success/30 bg-success/5'
//                                         : 'border-error/30 bg-error/5'
//                                 }`}>
//                                     <div className="flex items-center gap-3">
//                                         {runResult.success ? (
//                                             <CheckCircle2 size={23} className="text-success" />
//                                         ) : (
//                                             <AlertCircle size={23} className="text-error" />
//                                         )}

//                                         <div>
//                                             <h3 className="font-bold">
//                                                 {runResult.success
//                                                     ? 'Execution completed'
//                                                     : 'Execution failed'}
//                                             </h3>
//                                             <p className="text-sm text-base-content/60 mt-1">
//                                                 {runResult.success
//                                                     ? 'Review the test case output below.'
//                                                     : runResult.err || runResult.message || 'An error occurred while running your code.'}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {runResult.success && (
//                                         <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-base-300">
//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Clock size={15} className="text-primary" />
//                                                 <span className="text-base-content/60">Runtime:</span>
//                                                 <strong>{renderResultValue(runResult.runtime)} sec</strong>
//                                             </div>
//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <MemoryStick size={15} className="text-primary" />
//                                                 <span className="text-base-content/60">Memory:</span>
//                                                 <strong>{renderResultValue(runResult.memory)} KB</strong>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {(runResult.testCases || []).map((testCase, index) => (
//                                     <div key={index} className="rounded-xl border border-base-300 overflow-hidden">
//                                         <div className="flex items-center justify-between px-4 py-3 bg-base-200/70 border-b border-base-300">
//                                             <span className="font-semibold text-sm">
//                                                 Test Case {index + 1}
//                                             </span>
//                                             <span className={`text-xs font-semibold ${
//                                                 testCase.status_id === 3 || testCase.status_id === '3'
//                                                     ? 'text-success'
//                                                     : 'text-error'
//                                             }`}>
//                                                 {testCase.status_id === 3 || testCase.status_id === '3'
//                                                     ? 'Passed'
//                                                     : runResult.success ? 'Completed' : 'Failed'}
//                                             </span>
//                                         </div>

//                                         <div className="p-4 space-y-3 text-sm">
//                                             <div>
//                                                 <p className="text-xs text-base-content/55 mb-1">Input</p>
//                                                 <pre className="p-3 rounded-lg bg-base-200 font-mono whitespace-pre-wrap break-words">
//                                                     {renderResultValue(testCase.stdin)}
//                                                 </pre>
//                                             </div>

//                                             <div>
//                                                 <p className="text-xs text-base-content/55 mb-1">Expected Output</p>
//                                                 <pre className="p-3 rounded-lg bg-base-200 font-mono whitespace-pre-wrap break-words">
//                                                     {renderResultValue(testCase.expected_output)}
//                                                 </pre>
//                                             </div>

//                                             <div>
//                                                 <p className="text-xs text-base-content/55 mb-1">Your Output</p>
//                                                 <pre className="p-3 rounded-lg bg-base-200 font-mono whitespace-pre-wrap break-words">
//                                                     {renderResultValue(testCase.stdout)}
//                                                 </pre>
//                                             </div>

//                                             {testCase.stderr && (
//                                                 <div>
//                                                     <p className="text-xs text-error mb-1">Error Output</p>
//                                                     <pre className="p-3 rounded-lg bg-error/5 text-error font-mono whitespace-pre-wrap break-words">
//                                                         {testCase.stderr}
//                                                     </pre>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             !loading && (
//                                 <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
//                                     <Terminal size={30} className="mx-auto text-base-content/40 mb-3" />
//                                     <h3 className="font-semibold">No test results yet</h3>
//                                     <p className="text-sm text-base-content/55 mt-2">
//                                         Click Run to execute your code against the visible test cases.
//                                     </p>
//                                     <button
//                                         type="button"
//                                         onClick={() => setActiveRightTab('code')}
//                                         className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-content text-sm font-semibold"
//                                     >
//                                         <Code2 size={15} />
//                                         Go to Editor
//                                     </button>
//                                 </div>
//                             )
//                         )}
//                     </div>
//                 )}

//                 {/* SUBMISSION RESULT */}
//                 {activeRightTab === 'result' && (
//                     <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
//                         <div className="flex items-center gap-3 mb-5">
//                             <div className="p-2 rounded-lg bg-primary/10 text-primary">
//                                 <CheckCircle2 size={20} />
//                             </div>
//                             <div>
//                                 <h2 className="font-bold text-lg">Submission Result</h2>
//                                 <p className="text-xs text-base-content/55 mt-1">
//                                     Result of your submitted solution
//                                 </p>
//                             </div>
//                         </div>

//                         {loading && (
//                             <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
//                                 <span className="loading loading-spinner loading-sm" />
//                                 Evaluating submission...
//                             </div>
//                         )}

//                         {submitResult ? (
//                             <div className={`rounded-xl border p-5 ${
//                                 submitResult.accepted
//                                     ? 'border-success/30 bg-success/5'
//                                     : 'border-error/30 bg-error/5'
//                             }`}>
//                                 <div className="flex items-center gap-3">
//                                     {submitResult.accepted ? (
//                                         <CheckCircle2 size={30} className="text-success" />
//                                     ) : (
//                                         <AlertCircle size={30} className="text-error" />
//                                     )}

//                                     <div>
//                                         <h3 className={`text-xl font-bold ${
//                                             submitResult.accepted ? 'text-success' : 'text-error'
//                                         }`}>
//                                             {submitResult.accepted
//                                                 ? 'Accepted!'
//                                                 : submitResult.error || 'Submission unsuccessful'}
//                                         </h3>
//                                         <p className="text-sm text-base-content/60 mt-1">
//                                             {submitResult.accepted
//                                                 ? 'Your solution passed the evaluation.'
//                                                 : 'Review your code and try again.'}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
//                                     <div className="rounded-lg bg-base-200 p-4">
//                                         <p className="text-xs text-base-content/55">
//                                             Test Cases Passed
//                                         </p>
//                                         <p className="text-lg font-bold mt-1">
//                                             {renderResultValue(submitResult.passedTestCases)}
//                                             {' / '}
//                                             {renderResultValue(submitResult.totalTestCases)}
//                                         </p>
//                                     </div>

//                                     <div className="rounded-lg bg-base-200 p-4">
//                                         <p className="text-xs text-base-content/55">Runtime</p>
//                                         <p className="text-lg font-bold mt-1">
//                                             {renderResultValue(submitResult.runtime)} sec
//                                         </p>
//                                     </div>

//                                     <div className="rounded-lg bg-base-200 p-4">
//                                         <p className="text-xs text-base-content/55">Memory</p>
//                                         <p className="text-lg font-bold mt-1">
//                                             {renderResultValue(submitResult.memory)} KB
//                                         </p>
//                                     </div>

//                                     <div className="rounded-lg bg-base-200 p-4">
//                                         <p className="text-xs text-base-content/55">Language</p>
//                                         <p className="text-lg font-bold mt-1">
//                                             {languageMap[selectedLanguage]}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <button
//                                     type="button"
//                                     onClick={() => setActiveRightTab('code')}
//                                     className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg border border-base-300 hover:bg-base-200 text-sm font-semibold"
//                                 >
//                                     Back to Code
//                                     <ArrowUpRight size={15} />
//                                 </button>
//                             </div>
//                         ) : (
//                             !loading && (
//                                 <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
//                                     <CheckCircle2 size={30} className="mx-auto text-base-content/40 mb-3" />
//                                     <h3 className="font-semibold">No submission yet</h3>
//                                     <p className="text-sm text-base-content/55 mt-2">
//                                         Submit your solution to see the evaluation result here.
//                                     </p>
//                                     <button
//                                         type="button"
//                                         onClick={() => setActiveRightTab('code')}
//                                         className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-content text-sm font-semibold"
//                                     >
//                                         <Code2 size={15} />
//                                         Go to Editor
//                                     </button>
//                                 </div>
//                             )
//                         )}
//                     </div>
//                 )}
//             </section>
//         </div>
//     )
// }

// export default ProblemPage

