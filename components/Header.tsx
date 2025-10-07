import React from "react";
import Preference from "./Preference";
import { MenuIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

type Props = {
  searchParams: Record<string, string | string[]>;
};
// Categories
const categories = {
  technology: "Technology",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  science: "Science",
  health: "Health",
  politics: "Politics",
};

async function Header({ searchParams }: Props) {
  const cookieStore = await cookies();
  const preference = cookieStore.get("preference");
  const { category, country, source } = JSON.parse(preference?.value || "{}");
  console.log(category, country, source);
  const handleSetPreferenceCookie = async ({
    category,
    country,
    source,
  }: {
    category?: string | undefined;
    country?: string | undefined;
    source?: string | undefined;
  }) => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set(
      "preference",
      JSON.stringify({
        category,
        country,
        source,
      })
    );
    return;
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow border-gray-200">
      <Preference
        handleSetPreferenceCookie={handleSetPreferenceCookie}
        preference={{ category, country, source }}
      />
      <div className="max-w-7xl mx-auto px-3 ">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Innoscripta News
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <form className="flex" method="get" action="/search">
                <input
                  type="text"
                  name="query"
                  placeholder="Search news..."
                  defaultValue={searchParams?.query || ""}
                  className="w-64 px-4 text-sm py-2 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary text-foreground placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 hover:bg-primary/80 transition-colors"
                >
                  <SearchIcon className="w-6 h-6" />
                </button>
              </form>
            </div>
            <button className="md:hidden p-2 hover:bg-gray-100">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <section className="bg-zinc-50 border-t">
        <div className="flex flex-col space-y-4 max-w-7xl mx-auto px-3">
          <div className="flex space-x-2 overflow-x-auto py-1 scrollbar-hide gap-5">
            {Object.keys(categories).map((category) => (
              <Link
                key={category}
                href={`/cat/${category}`}
                className={`px-0 py-2 text-xs font-medium transition-colors  ${
                  ""
                  // category ===
                  //   ? "bg-blue-600 text-white"
                  //   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categories[category as keyof typeof categories]}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </header>
  );
}

export default Header;
