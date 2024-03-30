import { ArticleDisplay } from "./ArticleDisplay";

const ArticleList = ({ articleList, callAfterDelete }) => {
  return (
    <table id="articleTable">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Marque</th>
          <th>Taille</th>
          <th>État</th>
          <th>Prix</th>
          <th id="thDelete">Supprimer</th>
        </tr>
      </thead>
      <tbody>
        {articleList.map((article) => (
          <ArticleDisplay
            key={article.id}
            article={article}
            callAfterDelete={callAfterDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ArticleList;
