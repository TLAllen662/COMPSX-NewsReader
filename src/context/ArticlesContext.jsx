import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext();

const getArticlesForUser = (articlesByUser, username) => (
  Object.prototype.hasOwnProperty.call(articlesByUser, username)
    ? articlesByUser[username]
    : []
);

export function ArticlesProvider({ children }) {
  const [savedArticlesByUser, setSavedArticlesByUser] = useState({});
  const { user } = useAuth();

  const saveArticle = (article) => {
    if (!user) {
      return;
    }

    setSavedArticlesByUser(previous => {
      const userArticles = getArticlesForUser(previous, user.username);
      if (userArticles.some(savedArticle => savedArticle.url === article.url)) {
        return previous;
      }

      return {
        ...previous,
        [user.username]: [...userArticles, article],
      };
    });
  };

  const removeArticle = (url) => {
    if (!user) {
      return;
    }

    setSavedArticlesByUser(previous => ({
      ...previous,
      [user.username]: getArticlesForUser(previous, user.username)
        .filter(article => article.url !== url),
    }));
  };

  const isArticleSaved = (url) => {
    return getUserSavedArticles().some(article => article.url === url);
  };

  const getUserSavedArticles = () => {
    return user ? getArticlesForUser(savedArticlesByUser, user.username) : [];
  };

  const getAllUserArticles = () => savedArticlesByUser;

  return (
    <ArticlesContext.Provider 
      value={{ 
        getUserSavedArticles,
        getAllUserArticles,
        saveArticle, 
        removeArticle, 
        isArticleSaved 
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};

// Keep the hook alongside its provider; this export is intentionally not a component.
// eslint-disable-next-line react-refresh/only-export-components
export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};