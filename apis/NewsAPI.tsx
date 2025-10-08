import axios, { AxiosError } from 'axios';
import { NewsSource } from './NewsAggregator';

// Define types for NewsAPI responses
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || process.env.NEWSAPI_API;
const API_BASE_URL = 'https://newsapi.org/v2';

const baseAPI = axios.create({
  baseURL: API_BASE_URL,
  params: {
    apiKey: API_KEY
  }
});

export const fetchTopHeadlines = async (params: {
  country?: string;
  category?: string;
  pageSize?: number;
  page?: number;
} = {}) => {
  try {
    const response = await baseAPI.get<NewsResponse>('/top-headlines', {
      params: {
        country: params.country || 'us',
        category: params.category,
        pageSize: params.pageSize || 10,
        page: params.page || 1
      }
    });
    return response.data;
  } catch (error) {
    console.log((error as AxiosError).response?.data);
    throw error;
  }
};

export const searchNews = async (params: {
  q: string;
  language?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize?: number;
  page?: number;
  from?: string;
  to?: string;
  category?: string;
}) => {
  try {
    const response = await baseAPI.get<NewsResponse>('/everything', {
      params: {
        q: params.q,
        language: params.language || 'en',
        sortBy: params.sortBy || 'publishedAt',
        pageSize: params.pageSize || 10,
        page: params.page || 1,
        from: params.from,
        to: params.to,
      }
    });
    return response.data;
  } catch (error: Error | unknown | AxiosError) {
    console.log((error as AxiosError).response?.data);
    throw error;
  }
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};


export const calculateReadTime = (content: string | null): string => {
  if (!content) return '1 min read';
  
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 150));
  
  return `${minutes} min read`;
};

export const newsSources = [
  { id: "newsapi" as NewsSource, name: "NewsAPI" },
  { id: "nytimes" as NewsSource, name: "New York Times" },
  { id: "guardian" as NewsSource, name: "The Guardian" },
];