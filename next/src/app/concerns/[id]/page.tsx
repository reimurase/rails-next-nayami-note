import ConcernDetail from "@/components/concerns/ConcernDetail";

type Props = {
  params: { id: string };
};

export default function ConcernDetailPage({ params }: Props) {
  const id = Number(params.id);

  return <ConcernDetail id={id} />;
}
