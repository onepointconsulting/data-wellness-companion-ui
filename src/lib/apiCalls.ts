import { DeepResearchOutputs } from "../model/deep-research";
import { Ontology } from "../model/ontology";
import { SessionCompletedDataList } from "../model/session";

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
        outputs: [],
      };
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching deep research: " + error);
    return {
      outputs: [],
    };
  }
}

async function fetchSessionsCompleted(
  sessionIds: string[],
  reportUrl: string,
): Promise<SessionCompletedDataList> {
  const res = await fetch(
    `${reportUrl}/session/completed?session_ids=${sessionIds.join(",")}`,
  );
  if (!res.ok) {
    console.error("Network response was not ok " + res.statusText);
    return {
      sessions: [],
    };
  }
  return await res.json();
}

export { fetchDeepResearch, fetchOntology, fetchSessionsCompleted };
