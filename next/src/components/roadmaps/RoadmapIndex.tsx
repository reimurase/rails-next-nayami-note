import RoadmapRow from "./RoadmapRow";

import type { Roadmap } from "@/lib/roadmapApi";

type Props = {
  roadmaps: Roadmap[];
};

const RoadmapIndex = ({ roadmaps }: Props) => {
  return (
    <div>
      <h2>ロードマップ一覧</h2>

      {roadmaps.length === 0 ? (
        <p>まだロードマップはありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {roadmaps.map((roadmap) => (
            <li key={roadmap.id} style={{ listStyle: "none" }}>
              <RoadmapRow roadmap={roadmap} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoadmapIndex;
