import type { Issue } from "@/lib/issueApi";

type Props = {
  issue: Issue;
};

const IssueRow = ({ issue }: Props) => {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
        <span>{issue.title}</span>
        <span>{issue.content}</span>
      </div>
    </div>
  );
};

export default IssueRow;
