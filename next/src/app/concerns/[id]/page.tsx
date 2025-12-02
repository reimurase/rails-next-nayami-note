import ConcernShow from "@/components/concerns/ConcernShow";

type Props = {
  params: { id: string };
};

export default function ConcernDetailPage({ params }: Props) {
  const id = Number(params.id);

  return <ConcernShow id={id} />;
}
