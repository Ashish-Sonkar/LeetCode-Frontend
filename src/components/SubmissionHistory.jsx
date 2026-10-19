

import { useState, useEffect } from "react";
import {
    Code2,
    CheckCircle2,
    XCircle,
    Clock3,
    MemoryStick,
    CalendarDays,
    Copy,
    Check,
    X,
    History,
    AlertCircle,
    RefreshCw,
    FileCode2,
    Trophy
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [copied, setCopied] = useState(false);

    const fetchSubmissions = async () => {
        if (!problemId) {
            setSubmissions([]);
            setError("Problem ID is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axiosClient.get(
                `/problem/submittedProblem/${problemId}`
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setSubmissions(data);
            } else if (Array.isArray(data?.submissions)) {
                setSubmissions(data.submissions);
            } else if (
                typeof data === "string" &&
                data.toLowerCase().includes("no submission")
            ) {
                setSubmissions([]);
            } else {
                setSubmissions([]);
            }
        } catch (err) {
            console.error("Submission history error:", err);
            setError("Unable to load submissions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [problemId]);

    useEffect(() => {
        setCopied(false);
    }, [selectedSubmission]);

    useEffect(() => {
        if (!selectedSubmission) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedSubmission(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [selectedSubmission]);

    const normalizeStatus = (status) => {
        const value = String(status ?? "unknown")
            .toLowerCase()
            .replace(/[_-]/g, " ")
            .trim();

        if (["accepted", "success", "solved"].includes(value)) {
            return "accepted";
        }

        if (
            ["wrong", "wrong answer", "wronganswer"].includes(value)
        ) {
            return "wrong";
        }

        if (
            ["pending", "processing", "queued", "in queue"].includes(value)
        ) {
            return "pending";
        }

        if (
            ["error", "runtime error", "compilation error"].includes(value)
        ) {
            return "error";
        }

        return value || "unknown";
    };

    const getStatusInfo = (status) => {
        const normalized = normalizeStatus(status);

        if (normalized === "accepted") {
            return {
                label: "Accepted",
                className:
                    "border-success/30 bg-success/10 text-success",
                Icon: CheckCircle2
            };
        }

        if (normalized === "wrong") {
            return {
                label: "Wrong Answer",
                className:
                    "border-error/30 bg-error/10 text-error",
                Icon: XCircle
            };
        }

        if (normalized === "pending") {
            return {
                label: "Pending",
                className:
                    "border-info/30 bg-info/10 text-info",
                Icon: Clock3
            };
        }

        if (normalized === "error") {
            return {
                label: "Error",
                className:
                    "border-warning/30 bg-warning/10 text-warning",
                Icon: AlertCircle
            };
        }

        return {
            label: String(status ?? "Unknown")
                .replace(/[_-]/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
            className:
                "border-base-content/15 bg-base-200 text-base-content/70",
            Icon: FileCode2
        };
    };

    const formatMemory = (memory) => {
        if (memory == null || memory === "" || !Number.isFinite(Number(memory))) {
            return "—";
        }

        const value = Number(memory);

        if (value < 0) return "—";
        if (value < 1024) return `${value} KB`;

        return `${(value / 1024).toFixed(2)} MB`;
    };

    const formatRuntime = (runtime) => {
        if (
            runtime == null ||
            runtime === "" ||
            !Number.isFinite(Number(runtime))
        ) {
            return "—";
        }

        return `${Number(runtime)} sec`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) return "—";

        return date.toLocaleString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getPassedCount = (submission) => {
        const passed = Number(submission?.testCasesPassed);
        const total = Number(submission?.testCasesTotal);

        if (!Number.isFinite(passed) || !Number.isFinite(total)) {
            return "—";
        }

        return `${passed}/${total}`;
    };

    const acceptedCount = submissions.filter(
        (sub) => normalizeStatus(sub.status) === "accepted"
    ).length;

    const successRate = submissions.length
        ? Math.round((acceptedCount / submissions.length) * 100)
        : 0;

    const copyCode = async () => {
        const code = selectedSubmission?.code;

        if (typeof code !== "string") return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch (err) {
            console.error("Unable to copy code:", err);
        }
    };

    const closeModal = () => setSelectedSubmission(null);

    if (loading) {
        return (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" />
                <p className="text-sm text-base-content/60">
                    Loading submission history...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl rounded-2xl border border-error/20 bg-base-100 p-8 text-center">
                <AlertCircle className="mx-auto mb-3 text-error" size={36} />
                <h3 className="text-lg font-bold">Something went wrong</h3>
                <p className="mt-2 text-sm text-base-content/60">{error}</p>

                <button
                    type="button"
                    onClick={fetchSubmissions}
                    className="btn btn-primary btn-sm mt-5 gap-2"
                >
                    <RefreshCw size={15} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-3 sm:p-5 lg:p-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-primary">
                        <History size={20} />
                        <span className="text-xs font-bold uppercase tracking-[0.18em]">
                            Your Activity
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Submission History
                    </h2>

                    <p className="mt-2 text-sm text-base-content/60">
                        Track your attempts and review your submitted code.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchSubmissions}
                    className="btn btn-outline btn-sm self-start gap-2 sm:self-center"
                >
                    <RefreshCw size={15} />
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-base-content/60">
                            Total Submissions
                        </span>
                        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                            <Code2 size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-3xl font-bold tabular-nums">
                        {submissions.length}
                    </p>
                    <p className="mt-1 text-xs text-base-content/50">
                        Attempts for this problem
                    </p>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-base-content/60">
                            Accepted
                        </span>
                        <div className="rounded-xl bg-success/10 p-2.5 text-success">
                            <Trophy size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-3xl font-bold tabular-nums">
                        {acceptedCount}
                    </p>
                    <p className="mt-1 text-xs text-base-content/50">
                        Successful submissions
                    </p>
                </div>

                <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-base-content/60">
                            Acceptance Rate
                        </span>
                        <div className="rounded-xl bg-info/10 p-2.5 text-info">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>

                    <p className="mt-3 text-3xl font-bold tabular-nums">
                        {successRate}%
                    </p>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-300">
                        <div
                            className="h-full rounded-full bg-info transition-all duration-500"
                            style={{ width: `${successRate}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Submission Table */}
            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
                <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
                    <div>
                        <h3 className="font-bold">All Submissions</h3>
                        <p className="mt-1 text-xs text-base-content/50">
                            Review the status and details of each attempt.
                        </p>
                    </div>

                    <span className="badge badge-outline">
                        {submissions.length} total
                    </span>
                </div>

                {submissions.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-base-content/50">
                            <FileCode2 size={30} />
                        </div>

                        <h3 className="text-lg font-semibold">
                            No submissions yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm text-base-content/60">
                            Your attempts will appear here after you submit
                            your solution.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr className="text-xs uppercase tracking-wider text-base-content/60">
                                    <th>#</th>
                                    <th>Status</th>
                                    <th>Language</th>
                                    <th>Runtime</th>
                                    <th>Memory</th>
                                    <th>Test Cases</th>
                                    <th>Submitted</th>
                                    <th>Code</th>
                                </tr>
                            </thead>

                            <tbody>
                                {submissions.map((sub, index) => {
                                    const statusInfo = getStatusInfo(sub.status);
                                    const StatusIcon = statusInfo.Icon;

                                    return (
                                        <tr key={sub._id ?? `${index}-${sub.createdAt}`}>
                                            <td className="font-mono text-xs text-base-content/50">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <span
                                                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
                                                >
                                                    <StatusIcon size={13} />
                                                    {statusInfo.label}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="inline-flex items-center gap-2 font-mono text-sm">
                                                    <Code2 size={15} className="text-base-content/40" />
                                                    {sub.language ?? "—"}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap font-mono text-sm">
                                                {formatRuntime(sub.runtime)}
                                            </td>

                                            <td className="whitespace-nowrap font-mono text-sm">
                                                {formatMemory(sub.memory)}
                                            </td>

                                            <td className="font-mono text-sm">
                                                {getPassedCount(sub)}
                                            </td>

                                            <td className="whitespace-nowrap text-xs text-base-content/60">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays size={14} />
                                                    {formatDate(sub.createdAt)}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSubmission(sub)}
                                                    className="btn btn-sm btn-outline gap-1.5"
                                                >
                                                    <Code2 size={15} />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {submissions.length > 0 && (
                    <div className="border-t border-base-300 px-5 py-3">
                        <p className="text-xs text-base-content/50">
                            Showing {submissions.length} submissions
                        </p>
                    </div>
                )}
            </div>

            {/* Code Modal */}
            {selectedSubmission && (
                <div
                    className="modal modal-open"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Submission details"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div className="modal-box flex max-h-[90vh] w-11/12 max-w-5xl flex-col overflow-hidden border border-base-300 bg-base-100 p-0 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-base-300 px-5 py-4 sm:px-6">
                            <div className="min-w-0">
                                <div className="mb-2 flex items-center gap-2 text-primary">
                                    <Code2 size={18} />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        Source Code
                                    </span>
                                </div>

                                <h3 className="truncate text-lg font-bold sm:text-xl">
                                    {selectedSubmission.language ?? "Unknown language"}
                                </h3>

                                <p className="mt-1 text-xs text-base-content/50">
                                    Submitted on {formatDate(selectedSubmission.createdAt)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn btn-circle btn-ghost btn-sm"
                                aria-label="Close modal"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        {/* Submission Metadata */}
                        <div className="flex flex-wrap gap-2 border-b border-base-300 px-5 py-4 sm:px-6">
                            {(() => {
                                const info = getStatusInfo(selectedSubmission.status);
                                const Icon = info.Icon;

                                return (
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${info.className}`}>
                                        <Icon size={14} />
                                        {info.label}
                                    </span>
                                );
                            })()}

                            <span className="badge badge-outline gap-1.5 py-3">
                                <Clock3 size={13} />
                                {formatRuntime(selectedSubmission.runtime)}
                            </span>

                            <span className="badge badge-outline gap-1.5 py-3">
                                <MemoryStick size={13} />
                                {formatMemory(selectedSubmission.memory)}
                            </span>

                            <span className="badge badge-outline gap-1.5 py-3">
                                <CheckCircle2 size={13} />
                                {getPassedCount(selectedSubmission)} tests
                            </span>
                        </div>

                        {selectedSubmission.errorMessage && (
                            <div className="mx-5 mt-4 flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 p-4 sm:mx-6">
                                <AlertCircle className="mt-0.5 shrink-0 text-error" size={19} />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-error">
                                        Submission Error
                                    </p>
                                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-base-content/80">
                                        {selectedSubmission.errorMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Code */}
                        <div className="min-h-0 flex-1 px-5 py-4 sm:px-6">
                            <div className="flex items-center justify-between rounded-t-xl border border-base-300 bg-base-200 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                                    <span className="ml-2 text-xs font-medium text-base-content/60">
                                        {selectedSubmission.language ?? "Code"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={copyCode}
                                    disabled={typeof selectedSubmission.code !== "string"}
                                    className="btn btn-ghost btn-xs gap-1.5"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied!" : "Copy code"}
                                </button>
                            </div>

                            <pre className="max-h-[45vh] min-h-40 overflow-auto rounded-b-xl border-x border-b border-base-300 bg-[#111318] p-4 text-sm leading-6 text-slate-100 sm:p-5">
                                <code>{selectedSubmission.code ?? "No source code available."}</code>
                            </pre>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end border-t border-base-300 px-5 py-4 sm:px-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="btn btn-primary btn-sm px-6"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionHistory;
