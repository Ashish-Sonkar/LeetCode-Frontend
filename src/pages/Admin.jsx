

import React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Video,
  ShieldCheck,
  ArrowUpRight,
  Code2,
  LayoutDashboard,
} from "lucide-react";
import { NavLink } from "react-router";

function Admin() {
  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description:
        "Add new coding challenges, test cases, and problem details to your platform.",
      icon: Plus,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "hover:border-success/50",
      iconBg: "bg-success/15",
      route: "/admin/create",
      number: "01",
    },
    {
      id: "update",
      title: "Update Problem",
      description:
        "Edit existing coding problems, descriptions, difficulty levels, and solutions.",
      icon: Edit,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "hover:border-warning/50",
      iconBg: "bg-warning/15",
      route: "/admin/update",
      number: "02",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description:
        "Remove outdated or unwanted coding problems from your platform.",
      icon: Trash2,
      color: "text-error",
      bgColor: "bg-error/10",
      borderColor: "hover:border-error/50",
      iconBg: "bg-error/15",
      route: "/admin/delete",
      number: "03",
    },
    {
      id: "video",
      title: "Video Problem",
      description:
        "Manage problem explanation videos by uploading or removing video content.",
      icon: Video,
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "hover:border-info/50",
      iconBg: "bg-info/15",
      route: "/admin/video",
      number: "04",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Header */}
        <header className="relative mb-10 overflow-hidden rounded-3xl border border-base-300 bg-base-100 px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-info/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-16 sm:w-16">
                <LayoutDashboard size={30} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck size={14} />
                  Administrator Access
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight text-base-content sm:text-3xl lg:text-4xl">
                  Admin Panel
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                  Manage your coding platform, maintain problems, and organize
                  learning resources from one place.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-base-300 bg-base-200/70 px-4 py-3">
              <Code2 size={19} className="text-primary" />
              <div>
                <p className="text-sm font-bold text-base-content">
                  Problem Manager
                </p>
                <p className="text-xs text-base-content/50">
                  Admin workspace
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Section Heading */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-base-content sm:text-2xl">
              Manage Problems
            </h2>
            <p className="mt-1 text-sm text-base-content/60">
              Choose an action to manage your coding platform.
            </p>
          </div>

          <span className="w-fit rounded-full border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-medium text-base-content/60">
            {adminOptions.length} available actions
          </span>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;

            return (
              <article
                key={option.id}
                className={`group flex min-w-0 flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6 ${option.borderColor}`}
              >
                {/* Card Top */}
                <div className="mb-5 flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${option.iconBg} ${option.color}`}
                  >
                    <IconComponent size={27} strokeWidth={1.8} />
                  </div>

                  <span className="rounded-lg bg-base-200 px-2.5 py-1 text-xs font-bold tracking-wider text-base-content/40">
                    {option.number}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold leading-snug text-base-content">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-base-content/60">
                    {option.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 border-t border-base-300 pt-4">
                  <NavLink
                    to={option.route}
                    className={`group/button flex w-full items-center justify-between gap-3 rounded-xl border border-base-300 px-4 py-3 text-sm font-semibold text-base-content transition-all duration-200 hover:border-transparent ${option.bgColor} ${option.borderColor}`}
                  >
                    <span>{option.title}</span>

                    <ArrowUpRight
                      size={18}
                      className={`shrink-0 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5 ${option.color}`}
                    />
                  </NavLink>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-100/80 p-4 sm:items-center sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-base-content">
              Manage your platform carefully
            </h3>
            <p className="mt-1 text-xs leading-5 text-base-content/60 sm:text-sm">
              Review problem details before updating or deleting content to
              maintain a consistent learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
