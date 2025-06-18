const NEWS_API_KEY = "7a00c64484ac464493dcf06b012701f4"; // 🔒 Store in .env for production

export const TECHCRUNCH_URL = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${NEWS_API_KEY}`;
export const TECHCRUNCH_ALL_URL = `https://newsapi.org/v2/everything?sources=techcrunch&apiKey=${NEWS_API_KEY}`;

export const CRYPTONEWS_URL = `https://cryptopanic.com/api/v1/posts/?auth_token=YOUR_CRYPTOPANIC_TOKEN&currencies=BTC,ETH`;
