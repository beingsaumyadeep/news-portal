import Link from "next/link";
import React from "react";
import { formatRelativeTime, NewsArticle } from "../apis/NewsAPI";

type Props = {
  news: NewsArticle;
  index: number;
};

function TrendingCard({ news, index }: Props) {
  return (
    <Link
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 p-3  hover:bg-gray-200 transition-colors cursor-pointer group"
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-primary uppercase block mb-1">
          {news.source?.name || "News"}
        </span>
        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {news.title}
        </h4>
        <span className="text-xs text-gray-500">
          {formatRelativeTime(news.publishedAt)}
        </span>
      </div>
    </Link>
  );
}

export default TrendingCard;
