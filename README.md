# Innoscripta News Aggregator

News aggregator built with Next.js that pulls articles from multiple sources including `NewsAPI.org`, `The Guardian`, and `The New York Times`. Features include personalized news preferences, search functionality, and category filtering.

## Quick Start

Clone the repository:

```bash
git clone https://github.com/beingsaumyadeep/news-portal.git

cd news-portal
```

__Note:__ Create `.env` file from `.env.example` and add your news portal's API keys.

-------

### Method 1: Using Docker

The easiest way to get started is with Docker:

```bash
# Build the Docker image (will automatically include your .env file)
docker build -t news-portal .

# Run the container with port mapping
docker run -p 3000:3000 news-portal
```

### Method 2: Without Docker

If you prefer to run without Docker:

```bash
# Install dependencies
npm install
# Run the development server
npm run dev
```

Then visit http://localhost:3000 in your browser.


## Features

- Multi-source news aggregation
- User preference settings (saved in cookies)
- Country and category filtering
- Responsive design
- Server-side rendering for better SEO & Cookies based user preferences

## API Keys

API keys can be obtained from:
- [NewsAPI](https://newsapi.org)
- [The Guardian](https://open-platform.theguardian.com)
- [The NYTimes](https://developer.nytimes.com)
