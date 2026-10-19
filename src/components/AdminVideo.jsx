


import { useEffect, useMemo, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";
import {
  Search,
  Video,
  Trash2,
  Upload,
  Code2,
  Database,
  CircleAlert,
  X,
  RefreshCw,
} from "lucide-react";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axiosClient.get(
        "/problem/getAllProblem"
      );

      setProblems(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to fetch problems. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return problems;

    return problems.filter((problem) => {
      const title = problem.title?.toLowerCase() || "";
      const difficulty = problem.difficulty?.toLowerCase() || "";
      const tags = Array.isArray(problem.tags)
        ? problem.tags.join(" ").toLowerCase()
        : String(problem.tags || "").toLowerCase();

      return (
        title.includes(query) ||
        difficulty.includes(query) ||
        tags.includes(query)
      );
    });
  }, [problems, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video's problem?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError(null);

      await axiosClient.delete(`/video/delete/${id}`);

      setProblems((prev) =>
        prev.filter((problem) => problem._id !== id)
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to delete. Please try again."
      );
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "medium":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "hard":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-gray-50">
        <span className="loading loading-spinner loading-lg text-blue-600" />
        <p className="text-sm text-gray-500">
          Loading problems...
        </p>
      </div>
    );
  }

  if (error && problems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <CircleAlert className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>
          <button
            onClick={fetchProblems}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
              <Video size={27} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Video Upload And Delete
              </h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage video solutions for your coding problems
              </p>
            </div>
          </div>

          {/* Total problems */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Database size={22} />
            </div>

            <div>
              <p className="text-2xl font-bold leading-none text-gray-900">
                {String(problems.length).padStart(2, "0")}
              </p>
              <p className="mt-1.5 text-xs font-medium text-gray-500">
                Total Problems
              </p>
            </div>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Search bar */}
          <div className="border-b border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by problem title, difficulty or tag..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3 pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div className="shrink-0 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600 ring-1 ring-gray-200">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProblems.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {problems.length}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Problems table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/90 text-xs uppercase tracking-wider text-gray-500">
                  <th className="w-16 px-5 py-4 font-semibold sm:px-6">
                    #
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Problem Details
                  </th>
                  <th className="w-36 px-5 py-4 font-semibold">
                    Difficulty
                  </th>
                  <th className="w-36 px-5 py-4 font-semibold">
                    Tags
                  </th>
                  <th className="w-52 px-5 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProblems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="transition-colors hover:bg-blue-50/30"
                  >
                    <td className="px-5 py-5 text-sm font-medium text-gray-500 sm:px-6">
                      {problems.findIndex(
                        (item) => item._id === problem._id
                      ) + 1}
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Code2 size={21} />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800">
                            {problem.title}
                          </p>
                          
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getDifficultyStyle(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {(Array.isArray(problem.tags)
                          ? problem.tags
                          : [problem.tags || "General"]
                        ).map((tag, index) => (
                          <span
                            key={`${tag}-${index}`}
                            className="inline-flex rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <NavLink
                          to={`/admin/upload/${problem._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        >
                          <Upload size={15} />
                          Upload
                        </NavLink>

                        <button
                          type="button"
                          onClick={() => handleDelete(problem._id)}
                          disabled={deletingId === problem._id}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === problem._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                        <Search size={25} />
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-800">
                        No problems found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {search
                          ? "Try another title, difficulty or tag."
                          : "There are no problems to display."}
                      </p>

                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Showing {filteredProblems.length} of {problems.length} problems
            </p>
            <p className="flex items-center gap-1.5">
              <Video size={14} />
              Upload or manage video solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;
