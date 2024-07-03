import {useContext, useEffect, useState} from "react";
import {AppContext} from "../../context/AppContext.tsx";
import {useTranslation} from "react-i18next";


export default function ImportantTopics({nodeSearch, setNodeSearch}: {nodeSearch: string, setNodeSearch: (node: string) => void}) {
  const [importantTopic, setImportantTopic] = useState<string>("");
  const {ontology} =
    useContext(AppContext);
  const [importantTopics, setImportantTopics] = useState<string[]>([]);
  const {t} = useTranslation();

  useEffect(() => {
    const {betweenness_centrality} = ontology;
    setImportantTopics(Object.entries(betweenness_centrality)
      .sort((a, b) => b[1] - a[1])
      .filter((e) => e[1] > 0.0)
      .map((e) => e[0]).slice(0, 20));
  }, [ontology]);

  useEffect(() => {
    console.info('nodeSearch', nodeSearch)
    if(!nodeSearch) {
      setImportantTopic("");
    }
  }, [nodeSearch, setImportantTopic])

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedTopic = event.target.value;
    if(!!selectedTopic) {
      setNodeSearch(selectedTopic);
      setImportantTopic(selectedTopic)
    }
  }

  return (
    <div className="md:flex flex-row py-2 place-items-center hidden">
      <div className="text-base mx-1 ">{t("Important Topics")}</div>
      <select className="list-decimal text-base" onChange={onChange} value={importantTopic}>
        <option value="">{t("Select topic")}</option>
        {importantTopics.map((topic, index) => (
          <option key={`important_topics_${index}`} value={topic}>{index + 1}. {topic}</option>
        ))}
      </select>
    </div>
  )
}