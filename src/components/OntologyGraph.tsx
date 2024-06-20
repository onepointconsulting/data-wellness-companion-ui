import {useEffect, useRef, useState} from "react";
import {DataSet} from "vis-data";
import {Network} from "vis-network";
import {enterFullscreen} from "../lib/fullscreen.ts";
import {MdFullscreen} from "react-icons/md";
import {useTranslation} from "react-i18next";
import {Input} from "./form/Input.tsx";
import {IoIosSearch} from "react-icons/io";

export type Ontology = {
  relationships: Relationship[];
  betweenness_centrality: { [key: string]: number };
};

export type Relationship = {
  source: string;
  target: string;
  relationship: string;
};

type Node = {
  id: number;
  label: string;
};

type Edge = {
  id: number;
  from: number;
  to: number;
  label: string;
};

function softmax(arr: { [key: string]: number }): { [key: string]: number } {
  // Step 1: Compute the exponential of each element
  const expDict =
    Object.entries(arr).map(x => ({key: x[0], val: x[1] === 0 ? 0 : Math.exp(x[1])}));

  // Step 2: Compute the sum of the exponentials
  const sumExp = expDict.reduce((a, b) => a + b.val, 0);

  // Step 3: Normalize the exponentials
  return expDict.map(x => ({[x.key]: x.val / sumExp}))
    .reduce((a, b) => ({...a, ...b}), {})
}

function extractNodes(ontology: Ontology, nodeSearch: string): Node[] {
  const lowerCaseNodeSearch = nodeSearch.toLowerCase();
  const {relationships, betweenness_centrality,} = ontology;
  const softmaxedCentrality = softmax(betweenness_centrality);
  const filter = nodeSearch.length > 2 ? (rel: Relationship) => {
    return rel.source.toLowerCase().includes(lowerCaseNodeSearch) || rel.target.toLowerCase().includes(lowerCaseNodeSearch)
  } : () => true;
  return [
    ...new Set(relationships.filter(filter).flatMap((r) => [r["source"], r["target"]])),
  ]
    .map((node: string, index: number) => {
      const centrality = betweenness_centrality[node];
      const softmaxValue = softmaxedCentrality[node];
      const redChannel = Math.min(Math.round(softmaxValue * 255) + 150, 255);
      console.log('redChannel', node, redChannel)
      console.log('centrality', centrality)
      const color =
        centrality > 0
          ? {
            color: `rgb(${redChannel}, 0, 0)`,
            font: {color: "#ffffff"},
          }
          : {
            color: "#0084d7",
            font: {color: "#ffffff"},
          };
      return {id: index, label: node, ...color};
    });
}

function extractEdges(relationships: Relationship[], nodes: Node[]): Edge[] {
  return relationships
    .map((r: Relationship) => {
      const sourceId = nodes.find((n) => n.label === r["source"])?.id;
      const targetId = nodes.find((n) => n.label === r["target"])?.id;
      const relationship = r["relationship"];
      return [sourceId, targetId, relationship];
    })
    .filter((e) => e[0] !== undefined && e[1] !== undefined)
    .map((e, index) => {
      return {
        id: index,
        from: e[0] as number,
        to: e[1] as number,
        label: e[2] as string,
        arrows: "to",
      };
    });
}

export default function OntologyGraph({
                                        ontology,
                                        ontologyOpen,
                                      }: {
  ontology: Ontology;
  ontologyOpen: boolean;
}) {
  const {t} = useTranslation();

  const networkRef = useRef<HTMLDivElement>(null);
  const [nodeSearch, setNodeSearch] = useState<string>("");

  function handleEnterFullscreen() {
    const current = networkRef.current;
    if (current) {
      enterFullscreen(current);
    }
  }

  useEffect(() => {
    const nodeList = extractNodes(ontology, nodeSearch);
    // Define nodes and edges
    const nodes = new DataSet(nodeList);

    const edges = new DataSet(extractEdges(ontology.relationships, nodeList));

    // Define data
    const data = {
      nodes: nodes,
      edges: edges,
    };

    // Define options
    const options = {
      nodes: {shape: "box"},
      physics: {
        enabled: true,
      },
    };

    // Create a network
    const container = networkRef.current;
    if (!container) {
      return;
    }

    const network = new Network(container, data, options);
    network.on('doubleClick', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeLabel = nodeList.find((node) => node.id === nodeId)?.label;
        if (nodeLabel) {
          setNodeSearch(nodeLabel);
        }
      }
    });

    setTimeout(() => {
      network.moveTo({
        scale: 1.0, // Set the initial zoom factor to 0.5 (50% zoom)
        animation: true, // Disable animation for initial zoom
      });
      network.setOptions({...options, physics: {enabled: false}})
    }, 1000);
  }, [ontology, nodeSearch]);

  return (
    <div>
      <div className={`flex flex-row justify-between ${ontologyOpen ? "block" : "hidden"}`}>
        <div className="flex flex-row relative">
          <IoIosSearch className="h-8 w-8 absolute left-[6px] top-[5px]" title={t("Search")}/>
          <Input type="search" value={nodeSearch} onChange={(e) => setNodeSearch(e.target.value)}
                 className="w-4/5 md:!w-[250px] lg:!w-[350px] pl-10" placeholder={t("Search")}></Input>
        </div>
        <MdFullscreen
          onClick={handleEnterFullscreen}
          className={`h-8 w-8`}
          title={t("Full screen mode")}
        />
      </div>
      <div
        ref={networkRef}
        className={`${ontologyOpen ? "h-[60vh]" : "h-[0vh]"} fullscreen-component`}
        style={{transition: "height 0.5s ease-out"}}
      />
    </div>
  );
}
