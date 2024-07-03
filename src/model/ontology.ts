export type Ontology = {
  relationships: Relationship[];
  betweenness_centrality: { [key: string]: number };
  connected_component_importance_dict: { [key: string]: number };
};
export type Relationship = {
  source: string;
  target: string;
  relationship: string;
};
export type Node = {
  id: number;
  label: string;
};
export type Edge = {
  id: number;
  from: number;
  to: number;
  label: string;
};
