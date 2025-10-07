import axios from "axios";

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  fields?: {
    headline?: string;
    trailText?: string;
    byline?: string;
    shortUrl?: string;
    thumbnail?: string;
    body?: string;
    standfirst?: string;
  };
}

export interface GuardianResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy: string;
    results: GuardianArticle[];
  };
}

const API_KEY =
  process.env.NEXT_PUBLIC_GUARDIAN_API_KEY || process.env.THE_GUARDIAN_KEY;
const API_BASE_URL = "https://content.guardianapis.com";

const guardianBaseAPI = axios.create({
  baseURL: API_BASE_URL,
  params: {
    "api-key": API_KEY,
  },
});

export const fetchGuardianTopNews = async (
  params: {
    section?: string;
    pageSize?: number;
    page?: number;
    orderBy?: string;
    country?: string;
  } = {}
) => {
  try {
    const response = await guardianBaseAPI.get<GuardianResponse>("/search", {
      params: {
        section: params.section,
        "page-size": params.pageSize || 10,
        page: params.page || 1,
        "order-by": params.orderBy || "newest",
        "show-fields":
          "headline,trailText,byline,shortUrl,thumbnail,body,standfirst",
        tag: params.country,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Guardian top news:", error);
    throw error;
  }
};

export const searchGuardian = async (params: {
  q: string;
  pageSize?: number;
  page?: number;
  orderBy?: string;
  fromDate?: string;
  toDate?: string;
  section?: string;
  country?: string;
}) => {
  try {
    const response = await guardianBaseAPI.get<GuardianResponse>("/search", {
      params: {
        q: params.q,
        "page-size": params.pageSize || 10,
        page: params.page || 1,
        "order-by": params.orderBy || "relevance",
        "from-date": params.fromDate,
        "to-date": params.toDate,
        section: params.section,
        "show-fields":
          "headline,trailText,byline,shortUrl,thumbnail,body,standfirst",
        tag: params.country,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching Guardian articles:", error);
    throw error;
  }
};

export const convertGuardianArticleToCommon = (article: GuardianArticle) => {
  return {
    source: {
      id: "guardian",
      name: "The Guardian",
    },
    author: article.fields?.byline || null,
    title: article.webTitle,
    description:
      article.fields?.trailText || article.fields?.standfirst || null,
    url: article.webUrl,
    urlToImage: article.fields?.thumbnail || null,
    publishedAt: article.webPublicationDate,
    content: article.fields?.body || null,
  };
};
