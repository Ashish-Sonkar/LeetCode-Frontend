
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import {
    Code2,
    Home,
    ListTodo,
    Trophy,
    Send,
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Circle,
    BarChart3,
    Plus,
    Play,
    Tag,
    Zap,
    Target,
    Menu,
    X,
    LogOut,
    ShieldCheck,
    RefreshCw,
    Flame
} from "lucide-react";

function Homepage() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const [problems, setProblems] = useState([]);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [mobileMenu, setMobileMenu] = useState(false);

    const [filters, setFilters] = useState({
        difficulty: "all",
        tag: "all",
        status: "all",
    });

    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            setLoading(true);

            try {
                const [problemResult, solvedResult] = await Promise.allSettled([
                    axiosClient.get("/problem/getAllProblem"),
                    user
                        ? axiosClient.get("/problem/problemSolvedByUser")
                        : Promise.resolve({ data: [] }),
                ]);

                if (!active) return;

                if (problemResult.status === "fulfilled") {
                    const data = problemResult.value.data;
                    setProblems(Array.isArray(data) ? data : []);
                } else {
                    console.error(
                        "Error fetching problems:",
                        problemResult.reason
                    );
                }

                if (solvedResult.status === "fulfilled") {
                    const data = solvedResult.value.data;
                    setSolvedProblems(Array.isArray(data) ? data : []);
                } else {
                    setSolvedProblems([]);
                    console.error(
                        "Error fetching solved problems:",
                        solvedResult.reason
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [user]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setSolvedProblems([]);
    };

    const solvedIds = useMemo(
        () => new Set(solvedProblems.map((problem) => problem._id)),
        [solvedProblems]
    );

    const solvedCount = problems.filter((problem) =>
        solvedIds.has(problem._id)
    ).length;

    const easyCount = problems.filter(
        (problem) => problem.difficulty?.toLowerCase() === "easy"
    ).length;

    const mediumCount = problems.filter(
        (problem) => problem.difficulty?.toLowerCase() === "medium"
    ).length;

    const hardCount = problems.filter(
        (problem) => problem.difficulty?.toLowerCase() === "hard"
    ).length;

    const solvedEasy = problems.filter(
        (problem) =>
            problem.difficulty?.toLowerCase() === "easy" &&
            solvedIds.has(problem._id)
    ).length;

    const solvedMedium = problems.filter(
        (problem) =>
            problem.difficulty?.toLowerCase() === "medium" &&
            solvedIds.has(problem._id)
    ).length;

    const solvedHard = problems.filter(
        (problem) =>
            problem.difficulty?.toLowerCase() === "hard" &&
            solvedIds.has(problem._id)
    ).length;

    const progress = problems.length
        ? Math.round((solvedCount / problems.length) * 100)
        : 0;

    const availableTags = useMemo(
        () => [...new Set(problems.map((problem) => problem.tags).filter(Boolean))],
        [problems]
    );

    const filteredProblems = problems.filter((problem) => {
        const difficultyMatch =
            filters.difficulty === "all" ||
            problem.difficulty?.toLowerCase() === filters.difficulty;

        const problemTag = Array.isArray(problem.tags)
            ? problem.tags
            : [problem.tags];

        const tagMatch =
            filters.tag === "all" ||
            problemTag.some(
                (tag) => tag?.toLowerCase() === filters.tag.toLowerCase()
            );

        const statusMatch =
            filters.status === "all" ||
            (filters.status === "solved" && solvedIds.has(problem._id)) ||
            (filters.status === "unsolved" && !solvedIds.has(problem._id));

        const searchMatch = problem.title
            ?.toLowerCase()
            .includes(search.toLowerCase());

        return (
            difficultyMatch &&
            tagMatch &&
            statusMatch &&
            searchMatch
        );
    });

    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
            case "medium":
                return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
            case "hard":
                return "bg-rose-50 text-rose-700 ring-1 ring-rose-100";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const resetFilters = () => {
        setFilters({
            difficulty: "all",
            tag: "all",
            status: "all",
        });
        setSearch("");
    };

    const firstName = user?.firstName || "Coder";

    return (
        <div className="min-h-screen bg-[#f3f7fd] text-slate-800">
            {/* NAVBAR */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c172b] text-white shadow-lg">
                <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <NavLink to="/" className="flex shrink-0 items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/20">
                            <Code2 size={24} strokeWidth={2.5} />
                        </div>
                        <span className="hidden text-lg font-bold tracking-tight sm:block">
                            CodeCrag
                        </span>
                    </NavLink>

                    <nav className="hidden items-center gap-1 lg:flex">
                        <NavLink
                            to="/"
                            className="flex items-center gap-2 rounded-xl bg-blue-500/20 px-4 py-2.5 text-sm font-semibold text-blue-300"
                        >
                            <Home size={17} /> Home
                        </NavLink>

                        <a
                            href="#problems"
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <ListTodo size={17} /> Problems
                        </a>

                        <a
                            href="#progress"
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <Trophy size={17} /> Progress
                        </a>

                        <a
                            href="#problems"
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <Send size={16} /> Practice
                        </a>
                    </nav>

                    <div className="hidden min-w-0 max-w-xs flex-1 md:block lg:max-w-sm">
                        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5 transition focus-within:border-blue-400">
                            <Search size={18} className="shrink-0 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                            />
                            <span className="hidden shrink-0 rounded bg-white/10 px-2 py-1 text-[10px] text-slate-400 xl:block">
                                Search
                            </span>
                        </label>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                        <div className="hidden text-slate-400 sm:block">
                            <Bell size={19} />
                        </div>

                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="flex cursor-pointer items-center gap-2 rounded-xl p-1.5 transition hover:bg-white/10"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-sm font-bold text-white">
                                    {firstName.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden max-w-24 truncate text-sm font-medium sm:block">
                                    {firstName}
                                </span>
                                <ChevronDown size={15} className="text-slate-400" />
                            </div>

                            <ul
                                tabIndex={0}
                                className="menu dropdown-content z-50 mt-3 w-48 rounded-xl border border-slate-100 bg-white p-2 text-slate-700 shadow-xl"
                            >
                                {isAuthenticated && user?.role === "admin" && (
                                    <li>
                                        <NavLink to="/admin">
                                            <ShieldCheck size={16} /> Admin Panel
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <button onClick={handleLogout}>
                                        <LogOut size={16} /> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
                            aria-label="Toggle navigation"
                        >
                            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </div>

                

                {mobileMenu && (
                    <div className="border-t border-white/10 bg-[#101f37] p-3 lg:hidden">
                        <a
                            href="#problems"
                            onClick={() => setMobileMenu(false)}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                        >
                            <ListTodo size={17} /> Problems
                        </a>
                        <a
                            href="#progress"
                            onClick={() => setMobileMenu(false)}
                            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                        >
                            <BarChart3 size={17} /> Your Progress
                        </a>
                        {isAuthenticated && user?.role === "admin" && (
                            <NavLink
                                to="/admin"
                                onClick={() => setMobileMenu(false)}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
                            >
                                <ShieldCheck size={17} /> Admin Panel
                            </NavLink>
                        )}
                    </div>
                )}
            </header>

            {/* MAIN */}
            <main className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
                {/* WELCOME BANNER */}
                <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-[#112943] via-[#202d62] to-[#3730a3] px-5 py-6 text-white shadow-lg shadow-indigo-900/10 sm:px-8 sm:py-7 lg:px-10">
                    <div className="pointer-events-none absolute -right-12 -top-32 h-72 w-72 rounded-full border-[35px] border-white/[0.04]" />
                    <div className="pointer-events-none absolute right-36 top-10 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl" />

                    <div className="relative z-10 max-w-4xl">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👋</span>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                Hello, {firstName}!
                            </h1>
                        </div>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                            Sharpen your coding skills, solve problems, and build your dream.
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-5 lg:max-w-3xl">
                            <div className="flex items-center gap-3 border-white/15 sm:border-r sm:pr-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-400/20 text-blue-300">
                                    <Code2 size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100 sm:text-sm">Total Problems</p>
                                    <p className="mt-0.5 text-xl font-bold">{problems.length}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:border-r sm:border-white/15 sm:pr-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                                    <CheckCircle2 size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100 sm:text-sm">Solved</p>
                                    <p className="mt-0.5 text-xl font-bold">{solvedCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:border-r sm:border-white/15 sm:pr-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                                    <Zap size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100 sm:text-sm">Easy</p>
                                    <p className="mt-0.5 text-xl font-bold">{solvedEasy}/{easyCount}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:border-r sm:border-white/15 sm:pr-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
                                    <Target size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100 sm:text-sm">Medium</p>
                                    <p className="mt-0.5 text-xl font-bold">
                                        {solvedMedium}/{mediumCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-400/20 text-rose-500">
                                    <Flame size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-blue-100 sm:text-sm">Hard</p>
                                    <p className="mt-0.5 text-xl font-bold">
                                        {solvedHard}/{hardCount}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-1/4 items-end justify-center opacity-20 lg:flex">
                        <Code2 size={150} strokeWidth={0.8} />
                    </div>
                </section>

                {/* MOBILE SEARCH */}
                <div className="mb-5 md:hidden">
                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent text-sm outline-none"
                        />
                    </label>
                </div>

                {/* DASHBOARD GRID */}
                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,0.9fr)]">
                    {/* PROBLEM LIST */}
                    <section
                        id="problems"
                        className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                    >
                        <div className="border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <ListTodo size={23} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            All Problems
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Solve problems, improve your skills, and track your progress.
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                    {filteredProblems.length} problems
                                </span>
                            </div>

                            {/* FILTERS */}
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                {["all", "easy", "medium", "hard"].map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() =>
                                            setFilters({ ...filters, difficulty })
                                        }
                                        className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition sm:text-sm ${filters.difficulty === difficulty
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                            }`}
                                    >
                                        {difficulty === "all" ? "All" : difficulty}
                                    </button>
                                ))}

                                <div className="ml-auto flex flex-wrap gap-2">
                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                        <Tag size={15} className="text-slate-400" />
                                        <select
                                            aria-label="Filter by tag"
                                            value={filters.tag}
                                            onChange={(e) =>
                                                setFilters({ ...filters, tag: e.target.value })
                                            }
                                            className="max-w-28 bg-transparent text-xs outline-none sm:max-w-36 sm:text-sm"
                                        >
                                            <option value="all">All Tags</option>
                                            {availableTags.map((tag) => (
                                                <option key={tag} value={tag}>
                                                    {Array.isArray(tag) ? tag.join(", ") : tag}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                                        <CheckCircle2 size={15} className="text-slate-400" />
                                        <select
                                            aria-label="Filter by status"
                                            value={filters.status}
                                            onChange={(e) =>
                                                setFilters({ ...filters, status: e.target.value })
                                            }
                                            className="max-w-28 bg-transparent text-xs outline-none sm:text-sm"
                                        >
                                            <option value="all">All Status</option>
                                            <option value="solved">Solved</option>
                                            <option value="unsolved">Unsolved</option>
                                        </select>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* TABLE HEADER */}
                        <div className="hidden grid-cols-[minmax(0,1fr)_100px_90px_32px] items-center gap-3 bg-slate-50/80 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:grid">
                            <span>Problem</span>
                            <span>Difficulty</span>
                            <span>Status</span>
                            <span />
                        </div>

                        {/* PROBLEMS */}
                        <div>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <span className="loading loading-spinner loading-lg text-blue-600" />
                                    <p className="mt-3 text-sm text-slate-500">
                                        Loading problems...
                                    </p>
                                </div>
                            ) : filteredProblems.length === 0 ? (
                                <div className="flex flex-col items-center px-5 py-14 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <Search size={25} />
                                    </div>
                                    <h3 className="mt-4 font-semibold text-slate-800">
                                        No problems found
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or filters.
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                                    >
                                        <RefreshCw size={15} /> Reset filters
                                    </button>
                                </div>
                            ) : (
                                filteredProblems.map((problem, index) => {
                                    const isSolved = solvedIds.has(problem._id);
                                    const tags = Array.isArray(problem.tags)
                                        ? problem.tags
                                        : [problem.tags].filter(Boolean);

                                    return (
                                        <NavLink
                                            key={problem._id}
                                            to={`/problem/${problem._id}`}
                                            className="group grid grid-cols-1 items-center gap-3 border-b border-slate-100 px-5 py-4 transition last:border-b-0 hover:bg-blue-50/50 sm:grid-cols-[minmax(0,1fr)_100px_90px_32px] sm:gap-3 sm:px-6"
                                        >
                                            <div className="flex min-w-0 items-start gap-3">
                                                <span className="mt-0.5 w-5 shrink-0 text-xs font-medium text-slate-400">
                                                    {index + 1}.
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-blue-700 sm:text-[15px]">
                                                        {problem.title}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {tags.map((tag, tagIndex) => (
                                                            <span
                                                                key={`${tag}-${tagIndex}`}
                                                                className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pl-8 sm:pl-0">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getDifficultyClass(
                                                        problem.difficulty
                                                    )}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 pl-8 text-xs sm:pl-0">
                                                {isSolved ? (
                                                    <>
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-emerald-500"
                                                        />
                                                        <span className="font-medium text-emerald-700">
                                                            Solved
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Circle size={15} className="text-slate-300" />
                                                        <span className="text-slate-400">Unsolved</span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="hidden justify-end text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 sm:flex">
                                                <ChevronRight size={19} />
                                            </div>
                                        </NavLink>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* RIGHT SIDEBAR */}
                    <aside className="flex flex-col gap-5">
                        {/* PROGRESS */}
                        <section
                            id="progress"
                            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                                    <BarChart3 size={20} className="text-blue-600" />
                                    Your Progress
                                </h2>
                                <a
                                    href="#problems"
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </a>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
                                <div
                                    className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: `conic-gradient(#3b82f6 ${progress}%, #e8eff9 ${progress}% 100%)`,
                                    }}
                                >
                                    <div className="flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-white">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {progress}%
                                        </span>
                                        <span className="text-[10px] text-slate-400">Completed</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {solvedCount}
                                        <span className="text-slate-400"> / {problems.length}</span>
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Problems solved
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {[
                                    {
                                        name: "Easy",
                                        solved: solvedEasy,
                                        total: easyCount,
                                        color: "bg-emerald-500",
                                        track: "bg-emerald-100",
                                    },
                                    {
                                        name: "Medium",
                                        solved: solvedMedium,
                                        total: mediumCount,
                                        color: "bg-amber-500",
                                        track: "bg-amber-100",
                                    },
                                    {
                                        name: "Hard",
                                        solved: solvedHard,
                                        total: hardCount,
                                        color: "bg-rose-500",
                                        track: "bg-rose-100",
                                    },
                                ].map((item) => (
                                    <div key={item.name}>
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-600">
                                                {item.name}
                                            </span>
                                            <span className="text-slate-500">
                                                {item.solved} / {item.total}
                                            </span>
                                        </div>
                                        <div className={`h-2 overflow-hidden rounded-full ${item.track}`}>
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                                                style={{
                                                    width: `${item.total
                                                            ? (item.solved / item.total) * 100
                                                            : 0
                                                        }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* QUICK ACTIONS */}
                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                                <Zap size={19} className="text-blue-600" />
                                Quick Actions
                            </h2>

                            <div className="mt-4 flex flex-col gap-2.5">
                                {isAuthenticated && user?.role === "admin" && (
                                    <NavLink
                                        to="/admin"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                    >
                                        <Plus size={18} /> Admin Panel
                                    </NavLink>
                                )}

                                <a
                                    href="#problems"
                                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Play size={17} /> Browse Problems
                                </a>
                            </div>
                        </section>

                        {/* POPULAR TAGS */}
                        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                            <h2 className="flex items-center gap-2.5 text-base font-bold text-slate-900">
                                <Tag size={19} className="text-blue-600" />
                                Popular Tags
                            </h2>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {availableTags.length > 0 ? (
                                    availableTags.slice(0, 12).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setFilters({ ...filters, tag })}
                                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${filters.tag === tag
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                                }`}
                                        >
                                            {Array.isArray(tag) ? tag.join(", ") : tag}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400">
                                        Tags will appear when problems are available.
                                    </p>
                                )}
                            </div>

                            <div className="mt-5 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                    <Target size={22} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-blue-900">
                                        Keep coding!
                                    </h3>
                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        Small steps every day lead to big results.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* FOOTER */}
                <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <NavLink to="/" className="font-semibold text-slate-600">
                            CodeCrag
                        </NavLink>
                        <span>•</span>
                        <a href="#problems" className="hover:text-blue-600">
                            Practice
                        </a>
                        <span>•</span>
                        <a href="#progress" className="hover:text-blue-600">
                            Improve
                        </a>
                        <span>•</span>
                        <span>Grow</span>
                    </div>

                    <p>
                        Built with <span className="text-rose-500">♥</span> for developers
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default Homepage;
