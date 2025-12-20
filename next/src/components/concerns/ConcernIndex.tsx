import ConcernRow from "./ConcernRow";

export type Concern = {
  id: number;
  trigger_event: string;
  content: string;
};

type Props = {
  concerns: Concern[];
  onChanged?: () => void;
};

export default function ConcernIndex({ concerns, onChanged }: Props) {
  return (
    <div>
      <h2>なやみ一覧</h2>

      {concerns.length === 0 ? (
        <p>まだなやみはありません</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, padding: 0 }}>
          {concerns.map((concern) => (
            <li key={concern.id} style={{ listStyle: "none" }}>
              <ConcernRow concern={concern} onChanged={onChanged} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
