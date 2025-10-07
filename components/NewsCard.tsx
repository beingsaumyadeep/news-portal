import { formatRelativeTime } from "@/apis/NewsAPI";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { NewsArticle } from "../apis/NewsAPI";

type Props = {
  news: NewsArticle;
  index: number;
};

function NewsCard({ news, index }: Props) {
  return (
    <Link
      key={index}
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
    >
      <div className="sm:w-48 h-32 flex-shrink-0 overflow-hidden relative">
        <Image
          src={
            news.urlToImage ||
            // "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop"
            "https://www.tgsin.in/images/joomlart/demo/default.jpg"
          }
          alt={news.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-semibold text-primary uppercase">
            {news.source?.name || "News"}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(news.publishedAt)}
          </span>
        </div>
        <h4 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
          {news.title}
        </h4>
        <p className="text-gray-600 text-sm mb-2">{news.description}</p>
        <p className="text-sm text-gray-500">
          By {news.author || "Unknown Author"}
        </p>
      </div>
    </Link>
  );
}

export default NewsCard;
