import axios, { AxiosError } from "axios";

export interface NYTimesArticle {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  print_section?: string;
  print_page?: string;
  source: string;
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    credit: string;
  }>;
  headline: {
    main: string;
    kicker?: string;
    content_kicker?: string;
    print_headline?: string;
    name?: string;
    seo?: string;
    sub?: string;
  };
  keywords: Array<{
    name: string;
    value: string;
    rank: number;
    major: string;
  }>;
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: {
    original?: string;
    person?: Array<{
      firstname: string;
      middlename?: string;
      lastname: string;
      qualifier?: string;
      title?: string;
      role?: string;
      organization?: string;
      rank: number;
    }>;
    organization?: string;
  };
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export interface NYTimesResponse {
  status: string;
  copyright: string;
  response: {
    docs: NYTimesArticle[];
    meta: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

export interface NYTimesTopStoriesArticle {
  section: string;
  subsection: string;
  title: string;
  abstract: string;
  url: string;
  uri: string;
  byline: string;
  item_type: string;
  updated_date: string;
  created_date: string;
  published_date: string;
  material_type_facet: string;
  kicker: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  multimedia: Array<{
    url: string;
    format: string;
    height: number;
    width: number;
    type: string;
    subtype: string;
    caption: string;
    copyright: string;
  }>;
  short_url: string;
}

export interface NYTimesTopStoriesResponse {
  status: string;
  copyright: string;
  section: string;
  last_updated: string;
  num_results: number;
  results: NYTimesTopStoriesArticle[];
}

const API_KEY =
  process.env.NEXT_PUBLIC_NYTIMES_API_KEY || process.env.NYTIMES_KEY;
const API_BASE_URL = "https://api.nytimes.com/svc";

const NYBaseAPI = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchNYTimesTopStories = async (section: string = "home") => {
  try {
    const response = await NYBaseAPI.get<NYTimesTopStoriesResponse>(
      `/topstories/v2/${section}.json`,
      {
        params: {
          "api-key": API_KEY,
        },
      }
    );
    return response.data;
  } catch (error: Error | unknown | AxiosError) {
    console.error("Error fetching NYTimes top stories:", error);
    console.log((error as AxiosError).response?.data);
    throw error;
  }
};

export const searchNYTimes = async (params: {
  q: string;
  page?: number;
  sort?: string;
  begin_date?: string;
  end_date?: string;
  category?: string;

}) => {
  try {
    const response = await NYBaseAPI.get<NYTimesResponse>(
      "/search/v2/articlesearch.json",
      {
        params: {
          "api-key": API_KEY,
          q: params.q,
          page: params.page || 0,
          sort: params.sort || "newest",
          begin_date: params.begin_date?.replaceAll(/-/g, ""),
          end_date: params.end_date?.replaceAll(/-/g, ""),
          category: params.category,
        },
      }
    );

    if (!response.data || !response.data.response) {
      console.error("Invalid NY Times API response format:", response.data);
      return {
        status: "error",
        copyright: "",
        response: {
          docs: [],
          meta: {
            hits: 0,
            offset: 0,
            time: 0,
          },
        },
      };
    }

    return response.data;
  } catch (error: Error | unknown | AxiosError) {
    console.error("Error searching NYTimes articles:", error);
    return {
      status: "error",
      copyright: "",
      response: {
        docs: [],
        meta: {
          hits: 0,
          offset: 0,
          time: 0,
        },
      },
    };
  }
};

export const convertNYTimesArticleToCommon = (article: NYTimesArticle) => {
  const imageUrl =
    article.multimedia.length > 0
      ? `https://www.nytimes.com/${article.multimedia[0].url}`
      : null;

  return {
    source: {
      id: "nytimes",
      name: "The New York Times",
    },
    author: article.byline.original || null,
    title: article.headline.main,
    description: article.abstract || article.snippet,
    url: article.web_url,
    urlToImage: imageUrl,
    publishedAt: article.pub_date,
    content: article.lead_paragraph,
  };
};

export const convertNYTimesTopStoryToCommon = (
  article: NYTimesTopStoriesArticle
) => {
  const imageUrl =
    article?.multimedia?.length > 0 ? article.multimedia[0].url : null;

  return {
    source: {
      id: "nytimes",
      name: "The New York Times",
    },
    author: article.byline || null,
    title: article.title,
    description: article.abstract,
    url: article.url,
    urlToImage: imageUrl,
    publishedAt: article.published_date,
    content: article.abstract,
  };
};
