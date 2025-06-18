import axios from "axios";

export const summarizeArticle = async (title, content) => {
  const prompt = `Summarize the following news article:\n\nTitle: ${title}\n\nContent: ${content}\n\nSummary:`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OPENAI_KEY`, // 🔑 Replace with your actual key
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Summary failed:", error?.response?.data || error.message);
    return null;
  }
};
