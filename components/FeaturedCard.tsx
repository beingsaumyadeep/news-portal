import Link from "next/link";
import React from "react";
import {
  formatRelativeTime,
  NewsArticle,
} from "../apis/NewsAPI";
import Image from "next/image";

type Props = {
  featuredNews: NewsArticle;
};

function FeaturedCard({ featuredNews }: Props) {
  return (
    <Link
      key={featuredNews.url}
      href={featuredNews.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-[500px] overflow-hidden group cursor-pointer block"
    >
      <Image
        src={
          featuredNews.urlToImage ||
          "https://www.tgsin.in/images/joomlart/demo/default.jpg"
        }
        alt={featuredNews.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <span className="inline-block px-3 py-1 bg-primary text-sm rounded-full font-semibold mb-4">
          {featuredNews.source?.name || "News"}
        </span>
        <h2 className="lg:text-4xl text-2xl font-bold mb-4 leading-tight line-clamp-3 ">
          {featuredNews.title}
        </h2>
        <p className="text-lg mb-4 text-gray-200 max-w-3xl">
          {featuredNews.description}
        </p>
        <div className="flex items-center space-x-3 text-sm text-gray-300">
          <span>{featuredNews.author || "Unknown Author"}</span>
          <span>•</span>
          <span>{formatRelativeTime(featuredNews.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedCard;
