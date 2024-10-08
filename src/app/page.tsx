import DomainStoryCardList from "@/components/DomainStoryCardList";
import DqualizerBanner from "@/components/DqualizerBanner";
import { Suspense } from "react";
import { readAllDAMs } from "./fetch";

export default async function Home() {
  try {
    const data = await readAllDAMs();

    return (
      <main className="flex items-center justify-center h-screen flex-col">
        <DqualizerBanner />

        <Suspense fallback={<p>Trying to fetch...</p>}>
          <DomainStoryCardList dams={data} />
        </Suspense>
      </main>
    );
  } catch (_) {
    return <p>Seems like there is no connection to the backend...</p>;
  }
}
