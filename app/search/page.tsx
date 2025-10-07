import React from "react";
import Link from "next/link";
import {
  NewsArticle,
  newsSources,
} from "@/apis/NewsAPI";
import { searchAllNews, NewsSource } from "@/apis/NewsAggregator";
import SearchForm from "./SearchForm";
import NewsCard from "@/components/NewsCard";

type SearchParams = {
  query?: string;
  source?: string;
  page?: string;
  pageSize?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  category?: string;
};

async function Search({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // const { query, source, page, pageSize, from, to, sortBy, category } = await searchParams;
  const search = await searchParams;

  const query = search.query || "";
  const source = search.source || "newsapi";
  const page = search.page ? parseInt(search.page) : 1;
  const pageSize = search.pageSize ? parseInt(search.pageSize) : 10;
  const from = search.from || undefined;
  const to = search.to || undefined;
  const sortBy = search.sortBy || "publishedAt";
  const category = search.category || undefined;

  let articles: NewsArticle[] = [];
  let totalResults = 0;
  let error: string | null = null;

  if (query) {
    try {
      const response = await searchAllNews({
        source: source as NewsSource,
        q: query,
        page,
        pageSize,
        from: from ? from : undefined,
        to: to ? to : undefined,
        sortBy,
        category: category === "All" ? undefined : category,
      });

      articles = response.articles;
      totalResults = response.totalResults;
    } catch (err: Error | unknown) {
      error = err instanceof Error ? err.message : "Failed to search news";
    }
  }

  const totalPages = Math.ceil(totalResults / pageSize);
  const showPagination = totalPages > 1;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const createPageUrl = ({ pageNum }: { pageNum: number }) => {
    const params = new URLSearchParams();
    params.set("query", query);
    if (source) params.set("source", source);
    if (page) params.set("page", pageNum.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    if (from && from.length > 0) params.set("from", from);
    if (to && to.length > 0) params.set("to", to);
    if (sortBy) params.set("sortBy", sortBy);
    if (category) params.set("category", category);
    return `/search?${params.toString()}`;
  };

  return (
    <div>
      <div className="bg-zinc-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="">
            <h1 className="text-3xl font-bold mb-5">
              {query ? `Search Results for "${query}"` : "Search News"}
            </h1>

            <SearchForm
              query={query}
              source={source as NewsSource}
              from={from}
              to={to}
              sortBy={sortBy}
              category={category}
            />
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {query && !error && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {totalResults > 0
                  ? `Found ${totalResults} results`
                  : "No results found"}
              </p>
              {source && (
                <p className="text-sm text-gray-500">
                  Source:{" "}
                  {newsSources.find((src) => src.id === source)?.name || source}
                </p>
              )}
            </div>

            {articles.length > 0 ? (
              <div>
                {articles.map((article) => (
                  <NewsCard key={article.url} news={article} index={0} />
                  // <Link
                  //   href={article.url}
                  //   key={article.url}
                  //   className="flex flex-col sm:flex-row gap-4 p-4 border-y border-x-0 hover:bg-gray-50 transition-colors cursor-pointer group border border-gray-100"
                  // >
                  //   {article.urlToImage && (
                  //     <div className="sm:w-48 h-32 flex-shrink-0 overflow-hidden relative">
                  //       <Image
                  //         src={article.urlToImage}
                  //         alt={article.title}
                  //         fill
                  //         className="object-cover group-hover:scale-105 transition-transform duration-300"
                  //         unoptimized
                  //       />
                  //     </div>
                  //   )}
                  //   <div className="flex-1">
                  //     <div className="flex items-center space-x-2 mb-2">
                  //       <span className="text-xs font-semibold uppercase">
                  //         {article.source?.name || "News"}
                  //       </span>
                  //       <span className="text-xs text-gray-500">•</span>
                  //       <span className="text-xs text-gray-500">
                  //         {formatRelativeTime(article.publishedAt)}
                  //       </span>
                  //     </div>
                  //     <h2 className="text-xl font-bold mb-2 text-foreground transition-colors">
                  //       {article.title}
                  //     </h2>
                  //     <p className="text-gray-600 text-sm mb-2">
                  //       {article.description}
                  //     </p>
                  //     <div className="flex justify-between items-center">
                  //       <p className="text-sm text-gray-500">
                  //         {article.author ? (
                  //           <span>
                  //             By{" "}
                  //             <span className="font-bold font-primary  ">
                  //               {article.author}
                  //             </span>
                  //           </span>
                  //         ) : (
                  //           ""
                  //         )}
                  //       </p>
                  //       <span className="text-xs text-gray-500">
                  //         {calculateReadTime(article.content)}
                  //       </span>
                  //     </div>
                  //   </div>
                  // </Link>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 text-center">
                <p className="text-gray-600">
                  No news articles found. Try a different search term or
                  filters.
                </p>
              </div>
            )}

            {showPagination && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {hasPrev && (
                    <Link
                      href={createPageUrl({ pageNum: page - 1 })}
                      className="px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Previous
                    </Link>
                  )}

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around the current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={createPageUrl({ pageNum })}
                        className={`px-3 py-1 ${
                          page === pageNum
                            ? "bg-primary text-white"
                            : "border border-gray-300 hover:bg-gray-100 transition-colors"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {hasNext && (
                    <Link
                      href={createPageUrl({ pageNum: page + 1 })}
                      className="px-3 py-1 border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="bg-gray-50 p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Search for News</h2>
            <p className="text-gray-600 mb-4">
              Enter a search term above to find news articles from various
              sources.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;
