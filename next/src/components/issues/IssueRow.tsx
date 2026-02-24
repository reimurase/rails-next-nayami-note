import type { Issue } from "@/lib/issueApi";

type Props = {
  issue: Issue;
  onOpenDetail?: () => void;
};

const IssueRow = ({ issue, onOpenDetail }: Props) => {
  return (
    <div onClick={onOpenDetail} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <span>{issue.title}</span>
      <span>{issue.content}</span>
    </div>
  );
};

export default IssueRow;
