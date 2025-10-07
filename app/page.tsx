import Link from "next/link";
import { fetchTopNews, NewsSource } from "../apis/NewsAggregator";
import { NewsArticle } from "../apis/NewsAPI";
import FeaturedCard from "@/components/FeaturedCard";
import NewsCard from "@/components/NewsCard";
import TrendingCard from "@/components/TrendingCard";
import { cookies } from "next/headers";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const sourceParam = (await searchParams).source;
  const _source: NewsSource = sourceParam as NewsSource;
  
  let articles: NewsArticle[] = [];
  let error: string | null = null;
  
  const cookieStore = await cookies();
  const preference = cookieStore.get("preference");
  const { category, country, source } = JSON.parse(preference?.value || "{}");
  try {
    const response = await fetchTopNews({
      source: _source ? _source : source,
      pageSize: 20,
      page: 1,
      country: country,
      category: category,
    });
    
    articles = response.articles;
  } catch (err) {
    console.error("Error fetching news:", err);
    error = "Failed to fetch news. Please try again later.";
  }
  
  const featuredNews = articles.length > 0 ? articles[0] : null;
  const trendingNews = articles.length > 1 ? articles.slice(1, 5) : [];
  const latestNews = articles.length > 5 ? articles.slice(5) : [];

  return (
    <div>
      <main className="max-w-7xl mx-auto px-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {featuredNews && (
          <section className="mb-12">
            <FeaturedCard featuredNews={featuredNews} />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Latest News
            </h3>
            {latestNews.length === 0 && (
              <div className="bg-gray-50 p-6 text-center">
                <p className="text-gray-600">
                  No news articles found. Try again later.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {latestNews.map((news, i) => (
                <NewsCard key={i} news={news} index={i} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                Trending Now
              </h3>
              <div className="space-y-4">
                {trendingNews.map((news, index) => (
                  <TrendingCard key={index} news={news} index={index} />
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold mb-4">News Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {["newsapi", "nytimes", "guardian"].map((src) => (
                    <Link
                      key={src}
                      href={`/?source=${src}`}
                      className={`px-3 py-1 text-sm border ${src === _source
                        ? "bg-primary text-white border-primary"
                        : "text-gray-600 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {src === "newsapi" ? "NewsAPI" : 
                       src === "nytimes" ? "NY Times" : "Guardian"}
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
