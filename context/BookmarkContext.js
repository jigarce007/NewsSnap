import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const data = await AsyncStorage.getItem("bookmarks");
    if (data) setBookmarks(JSON.parse(data));
  };

  const saveBookmarks = async (updated) => {
    setBookmarks(updated);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const addBookmark = (article) => {
    const updated = [...bookmarks, article];
    saveBookmarks(updated);
  };

  const removeBookmark = (url) => {
    const updated = bookmarks.filter((item) => item.url !== url);
    saveBookmarks(updated);
  };

  const clearBookmarks = async () => {
    setBookmarks([]);
    await AsyncStorage.removeItem("bookmarks");
  };

  const isBookmarked = (url) => bookmarks.some((item) => item.url === url);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        clearBookmarks, // ✅ add this!
        isBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
