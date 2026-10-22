
import React from "react";
import { Link } from "react-router";
import {
  Code2,
  Rocket,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  Cloud,
  Clock3,
  BrainCircuit,
  Bot,
  ChartNoAxesCombined,
  Play,
  Check,
  ChevronDown,
  Terminal,
  Sparkles,
  Menu,
  Trophy,
  Target,
  GitBranch,
  Layers,
  Braces,
} from "lucide-react";

const problems = [
  { name: "Two Sum", level: "Easy", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Reverse Linked List", level: "Medium", color: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Valid Parentheses", level: "Easy", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { name: "Merge Two Sorted Lists", level: "Medium", color: "text-amber-400", bg: "bg-amber-400/10" },
  { name: "Binary Search", level: "Easy", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const features = [
  {
    title: "DSA Practice",
    description:
      "From arrays to graphs, master all core DSA topics with curated problems.",
    icon: BrainCircuit,
    color: "text-violet-300",
    glow: "bg-violet-500/20",
  },
  {
    title: "Code & Submit",
    description:
      "Write, run and test your solutions with our powerful online editor.",
    icon: Code2,
    color: "text-sky-300",
    glow: "bg-sky-500/20",
  },
  {
    title: "AI Assistant",
    description:
      "Get hints, explanations and help to understand problems better.",
    icon: Bot,
    color: "text-fuchsia-300",
    glow: "bg-fuchsia-500/20",
  },
  {
    title: "Track Progress",
    description:
      "Monitor your performance, solve more and level up your skills.",
    icon: ChartNoAxesCombined,
    color: "text-emerald-300",
    glow: "bg-emerald-500/20",
  },
];

const topics = [
  { name: "Arrays", icon: Layers, color: "text-yellow-300" },
  { name: "Linked List", icon: GitBranch, color: "text-violet-300" },
  { name: "Stack & Queue", icon: Braces, color: "text-orange-300" },
  { name: "Tree", icon: GitBranch, color: "text-fuchsia-300" },
  { name: "Graph", icon: Target, color: "text-pink-300" },
  { name: "Dynamic Programming", icon: BrainCircuit, color: "text-emerald-300" },
  { name: "Binary Search", icon: Code2, color: "text-blue-300" },
  { name: "Backtracking", icon: Sparkles, color: "text-cyan-300" },
];

const codeLines = [
  { no: 1, code: <><span className="text-purple-300">function</span> <span className="text-yellow-200">twoSum</span>(nums, target) {"{"}</> },
  { no: 2, code: <>&nbsp;&nbsp;<span className="text-purple-300">const</span> map = <span className="text-purple-300">new</span> <span className="text-sky-300">Map</span>();</> },
  { no: 3, code: <>&nbsp;</> },
  { no: 4, code: <>&nbsp;&nbsp;<span className="text-purple-300">for</span> (<span className="text-purple-300">let</span> i = <span className="text-orange-300">0</span>; i {"<"} nums.length; i++) {"{"}</> },
  { no: 5, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">const</span> complement = target - nums[i];</> },
  { no: 6, code: <>&nbsp;</> },
  { no: 7, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">if</span> (map.<span className="text-sky-300">has</span>(complement)) {"{"}</> },
  { no: 8, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">return</span> [map.<span className="text-sky-300">get</span>(complement), i];</> },
  { no: 9, code: <>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</> },
  { no: 10, code: <>&nbsp;&nbsp;&nbsp;&nbsp;map.<span className="text-sky-300">set</span>(nums[i], i);</> },
  { no: 11, code: <>&nbsp;&nbsp;{"}"}</> },
  { no: 12, code: <>&nbsp;</> },
  { no: 13, code: <>&nbsp;&nbsp;<span className="text-purple-300">return</span> [];</> },
  { no: 14, code: <>{"}"}</> },
];

function CodeEditorPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      <div className="absolute -inset-5 rounded-[35px] bg-blue-600/10 blur-3xl" />

      <div className="absolute -right-2 top-12 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-[#071226]/95 shadow-[0_0_70px_rgba(59,70,220,0.14)]">
        {/* Window header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Code2 size={14} className="text-indigo-300" />
            CodeCrag IDE
          </div>
          <span className="hidden text-[10px] text-slate-500 sm:block">
            ONLINE EDITOR
          </span>
        </div>

        <div className="grid min-h-[340px] grid-cols-1 md:grid-cols-[150px_minmax(0,1fr)] lg:grid-cols-[150px_minmax(0,1fr)_155px]">
          {/* Problems sidebar */}
          <aside className="border-b border-white/[0.07] bg-[#0a1730]/80 p-3 md:border-b-0 md:border-r">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Code2 size={15} className="text-indigo-400" />
              Problems
            </div>

            <div className="space-y-1.5">
              {problems.map((problem, index) => (
                <div
                  key={problem.name}
                  className={`rounded-lg px-2 py-2 ${
                    index === 0
                      ? "border border-indigo-400/20 bg-indigo-500/15"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <p className="text-[10px] leading-4 text-slate-300">
                    {problem.name}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[9px] ${problem.color} ${problem.bg}`}
                    >
                      {problem.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Code area */}
          <section className="min-w-0">
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-white/[0.02] px-3 py-2.5">
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <Code2 size={13} className="text-indigo-300" />
                twoSum.js
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#101e35] px-2 py-1 text-[10px] text-slate-300">
                <Braces size={12} />
                JavaScript
                <ChevronDown size={11} />
              </div>
            </div>

            <div className="overflow-x-auto px-2 py-4 sm:px-3">
              <div className="min-w-[310px] space-y-1 font-mono text-[10px] leading-[1.7] sm:text-[11px]">
                {codeLines.map((line) => (
                  <div key={line.no} className="flex">
                    <span className="w-7 shrink-0 select-none pr-2 text-right text-slate-600">
                      {line.no}
                    </span>
                    <span className="whitespace-pre text-slate-300">
                      {line.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] px-3 py-3">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-[10px] font-medium text-blue-200"
              >
                <Play size={12} />
                Run
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-2 text-[10px] font-semibold text-white shadow-lg shadow-indigo-500/20"
              >
                <Check size={12} />
                Submit
              </button>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1.5 text-[10px] text-emerald-300">
                <Check size={11} />
                Accepted
              </span>
            </div>
          </section>

          {/* Test cases */}
          <aside className="hidden border-l border-white/[0.07] bg-[#081328]/70 p-3 lg:block">
            <p className="mb-4 text-xs font-medium text-slate-200">
              Test Cases
            </p>

            <div className="mb-4 flex rounded-lg bg-white/[0.04] p-1 text-[10px]">
              <span className="flex-1 rounded-md bg-indigo-500/20 px-2 py-1.5 text-center text-indigo-200">
                Test
              </span>
              <span className="flex-1 px-2 py-1.5 text-center text-slate-500">
                Result
              </span>
            </div>

            {[1, 2, 3].map((test) => (
              <div
                key={test}
                className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.025] p-2"
              >
                <p className="mb-2 text-[10px] text-slate-300">
                  Test Case {test}
                </p>
                <p className="flex items-center gap-1 text-[9px] text-emerald-400">
                  <Check size={10} />
                  Passed
                </p>
              </div>
            ))}
          </aside>
        </div>
      </div>

      <div className="absolute -bottom-5 -right-2 hidden rotate-[-4deg] items-center gap-2 rounded-xl border border-indigo-400/20 bg-[#111b42]/95 px-4 py-3 text-xs text-indigo-100 shadow-xl sm:flex">
        <Rocket size={15} className="text-violet-300" />
        Solve. Learn. Grow.
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#040b1a] font-sans text-white selection:bg-indigo-500/30">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-64 h-96 w-96 rounded-full bg-indigo-700/10 blur-[120px]" />
        <div className="absolute right-0 top-20 h-[480px] w-[480px] rounded-full bg-blue-700/10 blur-[140px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/[0.04]">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/30">
              <Code2 size={25} strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              CodeCrag
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#problems" className="transition hover:text-white">
              Problems
            </a>
            <a href="#about" className="transition hover:text-white">
              About
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/login"
              className="rounded-xl border border-indigo-400/50 px-4 py-2.5 text-sm font-medium transition hover:bg-indigo-500/10 sm:min-w-[105px] sm:px-6 sm:text-center"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2.5 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-indigo-500/30 sm:min-w-[120px] sm:px-6 sm:text-center"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-[1] mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-12 lg:pb-24 lg:pt-16">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-500/[0.10] px-4 py-2.5 text-xs text-blue-200 sm:text-sm">
            <Rocket size={15} className="text-blue-300" />
            Your DSA Journey Starts Here
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[54px] xl:text-[60px]">
            Master DSA.
            <span className="mt-1 block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Crack Every Challenge.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Practice coding problems, improve your logic, track your progress
            and become interview-ready with{" "}
            <span className="font-semibold text-sky-300">CodeCrag.</span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 py-4 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:shadow-indigo-500/40 sm:text-base"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-indigo-400/50 bg-[#071126]/70 px-7 py-4 text-sm font-semibold transition hover:bg-indigo-500/10 sm:text-base"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4 text-xs text-slate-300 sm:text-sm">
            <span className="flex items-center gap-2">
              <Zap size={17} className="text-orange-300" />
              Free to start
            </span>
            <span className="flex items-center gap-2">
              <Cloud size={18} className="text-blue-300" />
              No installation
            </span>
            <span className="flex items-center gap-2">
              <Clock3 size={17} className="text-indigo-300" />
              Practice at your own pace
            </span>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5 border-t border-white/[0.07] pt-6">
            <div>
              <p className="text-2xl font-bold text-white">DSA</p>
              <p className="mt-1 text-xs text-slate-500">Build your logic</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">Code</p>
              <p className="mt-1 text-xs text-slate-500">Practice daily</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">Grow</p>
              <p className="mt-1 text-xs text-slate-500">Become interview-ready</p>
            </div>
          </div>
        </div>

        <div className="min-w-0 pt-2 lg:pt-0">
          <CodeEditorPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-[1] border-t border-white/[0.05] bg-[#060e20]/70">
        <div className="mx-auto grid max-w-[1400px] gap-5 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-blue-400/15 bg-[#071226]/65 p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/35 hover:bg-[#0a1630]"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 ${feature.glow} ${feature.color}`}
                >
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h2 className="text-lg font-bold text-slate-100">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-4 flex justify-end text-blue-400 transition-transform group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Popular topics */}
      <section id="problems" className="relative z-[1] mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Code2 size={31} className="text-indigo-400" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Popular DSA{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                  Topics
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Explore a wide range of topics and practice with handpicked
              problems.
            </p>
          </div>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 px-4 py-2 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/10"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.name}
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-400/10 bg-[#09162b] px-4 py-3 text-xs text-slate-200 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 sm:text-sm"
              >
                <Icon size={15} className={topic.color} />
                {topic.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="relative z-[1] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
        <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-[#101a43] via-[#0b1530] to-[#071226] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/15 text-indigo-200">
              <Trophy size={27} />
            </span>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Your next challenge awaits
            </p>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Think Better.
              <span className="mt-1 block bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                Code Smarter.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Every problem you solve takes you one step closer to your goals.
              Start your DSA journey with CodeCrag today.
            </p>

            <Link
              to="/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-7 py-4 text-sm font-semibold shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 sm:text-base"
            >
              Start Practicing
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-[1] border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:flex-row sm:px-8 sm:text-left lg:px-12">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500">
              <Code2 size={19} />
            </span>
            <span className="font-bold text-slate-200">CodeCrag</span>
          </Link>

          <p className="text-xs text-slate-500">
            Build logic. Solve problems. Shape your future.
          </p>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CodeCrag
          </p>
        </div>
      </footer>
    </main>
  );
}




