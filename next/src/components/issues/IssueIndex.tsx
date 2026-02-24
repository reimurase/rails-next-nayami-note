import IssueRow from "./IssueRow";

import type { Issue } from "@/lib/issueApi";

type Props = {
  issues: Issue[];
};

const IssueIndex = ({ issues }: Props) => {
  return (
    <div>
      <h2>問題一覧</h2>

      {issues.length === 0 ? (
        <p>まだ問題はありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {issues.map((issue) => (
            <li key={issue.id} style={{ listStyle: "none" }}>
              <IssueRow issue={issue} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IssueIndex;
