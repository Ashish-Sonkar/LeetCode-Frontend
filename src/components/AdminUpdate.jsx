

import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient"
import {
    Search,
    Database,
    Code2,
    SlidersHorizontal,
    Info,
    Pencil
} from "lucide-react"
import { useNavigate } from "react-router"

const AdminUpdate = () => {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        fetchProblems()
    }, [])

    const fetchProblems = async () => {
        try {
            setLoading(true)
            setError(null)

            const { data } = await axiosClient.get("/problem/getAllProblem")
            setProblems(data)
        } catch (err) {
            setError("Failed to fetch problems")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const filteredProblems = problems.filter(problem =>
        problem.title?.toLowerCase().includes(search.trim().toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    {/* Header */}
                    <div className="flex flex-col justify-between gap-5 border-b border-slate-200 px-5 py-6 sm:flex-row sm:items-center sm:px-8 sm:py-7">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Pencil size={27} strokeWidth={1.8} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
                                    Update Problems
                                </h1>
                                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                    Edit and manage your coding problems
                                </p>
                            </div>
                        </div>

                        {/* Total Problems */}
                        <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-slate-50 px-5 py-4 sm:min-w-64">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Database size={25} />
                            </div>

                            <div>
                                <p className="text-2xl font-bold text-slate-800">
                                    {String(problems.length).padStart(2, "0")}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Total Problems
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-5 pt-6 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50">
                                <Search size={21} className="shrink-0 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search problems by title..."
                                    className="h-12 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="shrink-0 text-sm text-slate-500 hover:text-slate-800"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div
                                title="Search by problem title"
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
                            >
                                <SlidersHorizontal size={20} />
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                            Showing {filteredProblems.length} of {problems.length} problems
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-8">
                            <span>{error}</span>

                            <button
                                type="button"
                                onClick={fetchProblems}
                                className="shrink-0 font-semibold underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Problems Table */}
                    <div className="px-5 pb-6 pt-4 sm:px-8 sm:pb-8">
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full min-w-[700px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <th className="w-16 px-5 py-4 font-semibold">#</th>
                                        <th className="px-5 py-4 font-semibold">Problem Details</th>
                                        <th className="w-36 px-5 py-4 font-semibold">Difficulty</th>
                                        <th className="w-36 px-5 py-4 font-semibold">Tags</th>
                                        <th className="w-36 px-5 py-4 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {filteredProblems.map((problem, index) => (
                                        <tr
                                            key={problem._id}
                                            className="transition-colors hover:bg-slate-50/80"
                                        >
                                            <td className="px-5 py-5 text-sm font-medium text-slate-600">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Code2 size={23} />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-800">
                                                            {problem.title}
                                                        </p>

                                                        <p className="mt-1 text-sm text-slate-500">
                                                            #{index + 1} · {
                                                                Array.isArray(problem.tags)
                                                                    ? problem.tags.join(", ")
                                                                    : problem.tags
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-5">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ${
                                                        problem.difficulty?.toLowerCase() === "easy"
                                                            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                                                            : problem.difficulty?.toLowerCase() === "medium"
                                                            ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200"
                                                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                                                    }`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                            </td>

                                            <td className="px-5 py-5">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                                                    {Array.isArray(problem.tags)
                                                        ? problem.tags.join(", ")
                                                        : problem.tags}
                                                </span>
                                            </td>

                                            {/* Edit Only */}
                                            <td className="px-5 py-5 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/admin/update/${problem._id}`)
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]"
                                                >
                                                    <Pencil size={17} />
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredProblems.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-16 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                                        <Search size={26} />
                                                    </div>

                                                    <p className="font-semibold text-slate-700">
                                                        No problems found
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {search
                                                            ? "Try searching with a different title."
                                                            : "There are no problems to display."}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 flex items-start gap-3 text-sm text-slate-500">
                            <Info size={19} className="mt-0.5 shrink-0 text-slate-400" />
                            <p>
                                Search for a problem and click Edit to update its details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminUpdate
