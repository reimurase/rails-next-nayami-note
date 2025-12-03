import ConcernEdit from "@/components/concerns/ConcernEdit";

type Props = {
  params: { id: string };
};

export default function ConcernDetailPage({ params }: Props) {
  const id = Number(params.id);

  return <ConcernEdit id={id} />;
}
