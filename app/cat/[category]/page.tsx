import React from "react";
import Link from "next/link";
import { fetchTopNews, NewsSource } from "@/apis/NewsAggregator";
import { newsSources, NewsArticle } from "@/apis/NewsAPI";
import type { Metadata } from "next";
import TrendingCard from "@/components/TrendingCard";
import NewsCard from "@/components/NewsCard";
import FeaturedCard from "@/components/FeaturedCard";

// Define the category mapping for display names
const categoryDisplayNames: Record<string, string> = {
  technology: "Technology",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
  politics: "Politics",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const displayName = categoryDisplayNames[category] || category;

  return {
    title: `${displayName} News - Innoscripta News`,
    description: `Latest ${displayName} news from around the world. Stay updated with the most recent ${displayName} stories.`,
  };
}

async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { category } = await params;
  const displayName = categoryDisplayNames[category] || category;

  // Get source from query params or default to NewsAPI
  const sourceParam = (await searchParams).source;
  const source: NewsSource =
    sourceParam === "newsapi" ||
    sourceParam === "nytimes" ||
    sourceParam === "guardian"
      ? sourceParam
      : "newsapi";

  // Fetch news for the specific category
  let articles: NewsArticle[] = [];
  let error: string | null = null;

  try {
    const response = await fetchTopNews({
      source,
      category,
      pageSize: 20,
      page: 1,
    });
    if (response.error) {
      error =
        (response?.error?.response?.data as { message?: string })?.message ||
        "An error occurred";
    }

    articles = response.articles;
  } catch (err) {
    console.error("Error fetching category news:", err);
    error = "Failed to fetch news for this category. Please try again later.";
  }

  const featuredNews = articles.length > 0 ? articles[0] : null;
  const trendingNews = articles.length > 1 ? articles.slice(1, 5) : [];
  const latestNews = articles.length > 5 ? articles.slice(5) : [];

  return (
    <div className="">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{displayName} News</h1>
          <p className="text-gray-600 mt-2">
            Latest {displayName.toLowerCase()} news and updates from around the
            world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {!error && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Loading {displayName} news...</p>
          </div>
        )}

        {featuredNews && (
          <section className="mb-12">
            <FeaturedCard featuredNews={featuredNews} />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Latest {displayName} News
            </h3>
            {latestNews.length === 0 && (
              <div className="bg-gray-50 p-6 text-center">
                <p className="text-gray-600">
                  No news articles found for {displayName.toLowerCase()}. Please
                  try again later.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {latestNews.map((news, i: number) => (
                <NewsCard key={i} news={news} index={i} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Trending in {displayName}
              </h3>
              <div className="space-y-4">
                {trendingNews.map((news, index) => (
                  <TrendingCard key={index} news={news} index={index} />
                ))}
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold mb-4">News Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {newsSources.map((src) => (
                    <Link
                      key={src.id}
                      href={`/cat/${category}?source=${src.id}`}
                      className={`px-3 py-1 text-sm border ${
                        src.id === source
                          ? "bg-primary text-white border-primary"
                          : "text-gray-600 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {src.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CategoryPage;
