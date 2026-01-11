import { DeepResearchOutputs } from "../model/deep-research";
import { Ontology } from "../model/ontology";

async function fetchOntology(
    sessionId: string,
    reportUrl: string,
  ): Promise<Ontology> {
    const res = await fetch(`${reportUrl}/ontology/${sessionId}`);
    if (!res.ok) {
      console.error("Network response was not ok " + res.statusText);
      return {
        relationships: [],
        betweenness_centrality: {},
        connected_component_importance_dict: {},
      };
    }
    return await res.json();
  }

async function fetchDeepResearch(
    sessionId: string,
    reportUrl: string,
): Promise<DeepResearchOutputs> {
    try {
        const res = await fetch(`${reportUrl}/deep_research/output/${sessionId}`);
        if (!res.ok) {
            console.error("Network response was not ok " + res.statusText);
            return {
                outputs: []
            };
        }
        return await res.json();
    } catch (error) {
        console.error("Error fetching deep research: " + error);
        return {
            outputs: []
        };
    }
}

export { fetchDeepResearch, fetchOntology };