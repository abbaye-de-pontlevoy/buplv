"use client";

import { useContext, useEffect, useState } from "react";
import ArticleGestionnary from "../components/Article/ArticleGestionnary/ArticleGestionnary";
import Menu from "../components/Menu/Menu";
import BasketGestionnary from "../components/BasketGestionnary/BasketGestionnary";
import ArticleScanner from "../components/ArticleScanner/ArticleScanner";
import { getUserID } from "../helpers/getUserID";
import { getArticleList } from "../components/Article/ArticleGestionnary/removeArticleAction";
import "./styles.css";
import Header from "../components/Header/Header";

const Dashboard = () => {

  const [userID, setUserID] = useState("");
  const [articleList, setArticleList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // Effect to fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Fetch user ID and article list
      setIsLoading(true);
      const newUserID = await getUserID();
      const newArticleList = await getArticleList(newUserID);
      setUserID(newUserID);
      setArticleList(newArticleList);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header hasConnectedToken={true} displayAccountButton={true} />
      <Menu current="/dashboard" />
      <div className="bandeau-rangement">
        <div className="mainContainer" id="dashboardMainContainer">
          <h1 className="formTitle">Liste des articles enregistrés</h1>
          <ArticleGestionnary
            articleList={articleList}
            setArticleList={setArticleList}
            userID={userID}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
