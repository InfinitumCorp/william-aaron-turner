import { createFileRoute } from "@tanstack/react-router";
import { TurnerSite } from "@/components/site/turner-site";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TurnerSite />;
}
