"use client";

import { NewsSource } from "@/apis/NewsAggregator";
import { newsSources } from "@/apis/NewsAPI";
import Link from "next/link";
import { useState } from "react";

const sort = {
  newsapi: {
    relevancy: "Relevancy",
    popularity: "Popularity",
    publishedAt: "Published At",
  },
  nytimes: {
    best: "Best",
    newest: "Newest",
    oldest: "Oldest",
    relevance: "Relevance",
  },
  guardian: {
    newest: "Newest",
    oldest: "Oldest",
    relevance: "Relevance",
  },
};

export default function SearchForm({
  query,
  source,
  from,
  to,
  sortBy,
  category,
}: {
  query: string;
  source: NewsSource;
  from?: string | undefined;
  to?: string | undefined;
  sortBy?: string | undefined;
  category?: string | undefined;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // const query = formData.get("query")?.toString() || "";
    const source = formData.get("source")?.toString() || "newsapi";
    const from = formData.get("from")?.toString();
    const to = formData.get("to")?.toString();
    const sortBy = formData.get("sortBy")?.toString();
    const category = formData.get("category")?.toString();

    const params = new URLSearchParams();

    params.set("query", query);
    params.set("source", source);

    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (sortBy) params.set("sortBy", sortBy);
    if (category && category !== "All") params.set("category", category);

    window.location.href = `/search?${params.toString()}`;
  };
  const [_source, setSource] = useState<string>(source);

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="from"
              defaultValue={from}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="to"
              defaultValue={to}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              name="sortBy"
              defaultValue={sortBy}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sort By</option>
              {Object.entries(sort[_source as keyof typeof sort]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category - {category}
            </label>
            <select
              name="category"
              defaultValue={category}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              //   onChange={(e) => setPageSize(parseInt(e.target.value))}
            >
              <option>All</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="science">Science</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              name="source"
              defaultValue={_source}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSource(e.target.value)}
            >
              {newsSources.map((src) => (
                <option key={src.id} value={src.id}>
                  {src.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-5 items-center col-span-2">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 hover:bg-primary/80 transition-colors"
            >
              Apply Filter
            </button>
            <Link className="" href={`/search?query=${query}`}>
              Clear Filters
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
