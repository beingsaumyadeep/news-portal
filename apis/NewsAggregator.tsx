import { NewsArticle, fetchTopHeadlines, searchNews } from "./NewsAPI";
import {
  fetchNYTimesTopStories,
  searchNYTimes,
  convertNYTimesTopStoryToCommon,
  convertNYTimesArticleToCommon,
} from "./NYTimesAPI";
import {
  fetchGuardianTopNews,
  searchGuardian,
  convertGuardianArticleToCommon,
} from "./GuardianAPI";
import { AxiosError } from "axios";

export type NewsSource = "newsapi" | "nytimes" | "guardian";

export interface AggregatedNewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  source: NewsSource;
  error?: AxiosError
}

export const fetchTopNews = async (params: {
  source?: NewsSource;
  category?: string;
  pageSize?: number;
  page?: number;
  country?: string;
  
}): Promise<AggregatedNewsResponse> => {
  const source = params.source || "guardian";
  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  try {
    switch (source) {
      case "newsapi":
        try {
          const newsApiResponse = await fetchTopHeadlines({
            country: params.country || "us",
            category: params.category,
            pageSize,
            page,
          });

          if (!newsApiResponse || !newsApiResponse.articles) {
            console.error(
              "Invalid NewsAPI response structure:",
              newsApiResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "newsapi",
            };
          }

          return {
            articles: newsApiResponse.articles,
            totalResults:
              newsApiResponse.totalResults || newsApiResponse.articles.length,
            source: "newsapi",
          };
        } catch (newsApiError) {
          console.error("Error with NewsAPI top headlines:", newsApiError);
          // Return empty results instead of throwing to prevent the entire fetch from failing
          return {
            articles: [],
            totalResults: 0,
            source: "newsapi",
            error: newsApiError as AxiosError,
          };
        }

      case "nytimes":
        try {
          // Map category to NYTimes section
          let section = "home";
          if (params.category) {
            const categoryToSection: Record<string, string> = {
              business: "business",
              entertainment: "arts",
              health: "health",
              science: "science",
              sports: "sports",
              technology: "technology",
              politics: "politics",
            };
            section =
              categoryToSection[params.category.toLowerCase()] || "home";
          }

          const nyTimesResponse = await fetchNYTimesTopStories(section);

          if (!nyTimesResponse || !nyTimesResponse.results) {
            console.error(
              "Invalid NY Times API response structure:",
              nyTimesResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "nytimes",
            };
          }

          const nyTimesArticles = nyTimesResponse.results
            .map(convertNYTimesTopStoryToCommon)
            .slice((page - 1) * pageSize, page * pageSize);

          return {
            articles: nyTimesArticles,
            totalResults:
              nyTimesResponse.num_results || nyTimesResponse.results.length,
            source: "nytimes",
          };
        } catch (nyTimesError) {
          console.error("Error with NY Times top stories API:", nyTimesError);
          // Return empty results instead of throwing
          return {
            articles: [],
            totalResults: 0,
            source: "nytimes",
            error: nyTimesError as AxiosError,
          };
        }

      case "guardian":
        try {
          let guardianSection;
          if (params.category) {
            const categoryToSection: Record<string, string> = {
              business: "business",
              entertainment: "culture",
              health: "society",
              science: "science",
              sports: "sport",
              technology: "technology",
              politics: "politics",
            };
            guardianSection = categoryToSection[params.category.toLowerCase()];
          }

          const guardianResponse = await fetchGuardianTopNews({
            section: guardianSection,
            pageSize,
            page,
          });

          if (
            !guardianResponse ||
            !guardianResponse.response ||
            !guardianResponse.response.results
          ) {
            console.error(
              "Invalid Guardian API response structure:",
              guardianResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "guardian",
            };
          }

          const guardianArticles = guardianResponse.response.results.map(
            convertGuardianArticleToCommon
          );

          return {
            articles: guardianArticles,
            totalResults:
              guardianResponse.response.total || guardianArticles.length,
            source: "guardian",
          };
        } catch (guardianError) {
          console.error("Error with Guardian top news API:", guardianError);
          // Return empty results instead of throwing
          return {
            articles: [],
            totalResults: 0,
            source: "guardian",
            error: guardianError as AxiosError,
          };
        }

      default:
        throw new Error(`Unsupported news source: ${source}`);
    }
  } catch (error) {
    console.error(`Error fetching top news from ${source}:`, error);
    throw error;
  }
};

export const searchAllNews = async (params: {
  source?: NewsSource;
  q: string;
  pageSize?: number;
  page?: number;
  from?: string;
  to?: string;
  sortBy?: string;
  category?: string;
}): Promise<AggregatedNewsResponse> => {
  const source = params.source || "nytimes";
  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  try {
    switch (source) {
      case "newsapi":
        try {
          const newsApiResponse = await searchNews({
            q: params.q,
            pageSize,
            page,
            sortBy: params.sortBy as "relevancy" | "popularity" | "publishedAt",
            from: params.from,
            to: params.to,
            category: params.category,
          });

          // Validate the response structure before accessing properties
          if (!newsApiResponse || !newsApiResponse.articles) {
            console.error(
              "Invalid NewsAPI response structure:",
              newsApiResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "newsapi",
            };
          }

          return {
            articles: newsApiResponse.articles,
            totalResults:
              newsApiResponse.totalResults || newsApiResponse.articles.length,
            source: "newsapi",
          };
        } catch (newsApiError) {
          console.error("Error with NewsAPI search:", newsApiError);
          // Return empty results instead of throwing to prevent the entire search from failing
          return {
            articles: [],
            totalResults: 0,
            source: "newsapi",
            error: newsApiError as AxiosError,
          };
        }

      case "nytimes":
        try {
          const nyTimesResponse = await searchNYTimes({
            q: params.q,
            page: page - 1,
            sort: params.sortBy,
            begin_date: params.from,
            end_date: params.to,
            category: params.category,
          });

          if (!nyTimesResponse.response || !nyTimesResponse.response.docs) {
            console.error(
              "Invalid NY Times API response structure:",
              nyTimesResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "nytimes",
            };
          }

          const nyTimesArticles = nyTimesResponse.response.docs.map(
            convertNYTimesArticleToCommon
          );

          const totalResults =
            nyTimesResponse.response.meta?.hits || nyTimesArticles.length;

          return {
            articles: nyTimesArticles,
            totalResults,
            source: "nytimes",
            
          };
        } catch (nyTimesError) {
          console.error("Error with NY Times search API:", nyTimesError);
          return {
            articles: [],
            totalResults: 0,
            source: "nytimes",
            error: nyTimesError as AxiosError,
          };
        }

      case "guardian":
        try {
          let guardianSection;
          if (params.category) {
            const categoryToSection: Record<string, string> = {
              business: "business",
              entertainment: "culture",
              health: "society",
              science: "science",
              sports: "sport",
              technology: "technology",
              politics: "politics",
            };
            guardianSection = categoryToSection[params.category.toLowerCase()];
          }

          const guardianResponse = await searchGuardian({
            q: params.q,
            pageSize,
            page,
            fromDate: params.from,
            toDate: params.to,
            orderBy: params.sortBy || "relevance",
            section: guardianSection,
          });

          if (
            !guardianResponse.response ||
            !guardianResponse.response.results
          ) {
            console.error(
              "Invalid Guardian API response structure:",
              guardianResponse
            );
            return {
              articles: [],
              totalResults: 0,
              source: "guardian",
            };
          }

          const guardianArticles = guardianResponse.response.results.map(
            convertGuardianArticleToCommon
          );

          const totalResults =
            guardianResponse.response.total || guardianArticles.length;

          return {
            articles: guardianArticles,
            totalResults,
            source: "guardian",
          };
        } catch (guardianError) {
          console.error("Error with Guardian search API:", guardianError);
          return {
            articles: [],
            totalResults: 0,
            source: "guardian",
            error: guardianError as AxiosError,
          };
        }

      default:
        throw new Error(`Unsupported news source: ${source}`);
    }
  } catch (error) {
    console.error(`Error searching news from ${source}:`, error);
    throw error;
  }
};
