import { useEffect, useRef } from "react";
import { DataSet } from "vis-data";
import { Network } from "vis-network";
import { enterFullscreen } from "../lib/fullscreen.ts";
import { MdFullscreen } from "react-icons/md";
import { useTranslation } from "react-i18next";

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

function extractNodes(ontology: Ontology): Node[] {
  const { relationships, betweenness_centrality } = ontology;
  return [
    ...new Set(relationships.flatMap((r) => [r["source"], r["target"]])),
  ].map((node: string, index: number) => {
    const centrality = betweenness_centrality[node];
    const color =
      centrality > 0
        ? {
            color: "#ff0000",
            font: { color: "#ffffff" },
          }
        : {
            color: "#0084d7",
            font: { color: "#ffffff" },
          };
    return { id: index, label: node, ...color };
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
  const { t } = useTranslation();

  const networkRef = useRef<HTMLDivElement>(null);

  function handleEnterFullscreen() {
    const current = networkRef.current;
    if (current) {
      enterFullscreen(current);
    }
  }

  useEffect(() => {
    const nodeList = extractNodes(ontology);
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
      nodes: { shape: "box" },
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
    setTimeout(() => {
      network.moveTo({
        scale: 1.0, // Set the initial zoom factor to 0.5 (50% zoom)
        animation: true, // Disable animation for initial zoom
      });
      network.setOptions({ ...options, physics: { enabled: false } });
    }, 1000);
  }, [ontology]);

  return (
    <div>
      <MdFullscreen
        onClick={handleEnterFullscreen}
        className={`${ontologyOpen ? "block" : "hidden"} ml-auto h-8 w-8`}
        title={t("Full screen mode")}
      />
      <div
        ref={networkRef}
        className={`${ontologyOpen ? "h-[60vh]" : "h-[0vh]"} fullscreen-component`}
        style={{ transition: "height 0.5s ease-out" }}
      />
    </div>
  );
}
