import { ChapterPage } from "./pages/ChapterPage";
import { HQ } from "./pages/HQ";
import { JournalPage } from "./pages/Journal";
import { Companion, Continuing, DataPage, Record, Roadmap } from "./pages/Other";
import { StoreProvider } from "./store";
import { Atmosphere } from "./ui/Atmosphere";
import { useDerived } from "./ui/derived";
import { Feed } from "./ui/Feed";
import { useRoute } from "./ui/router";
import { Shell } from "./ui/Shell";

function Routed() {
  const route = useRoute();
  const d = useDerived();
  const [top] = route.path;
  let page;
  switch (top) {
    case "roadmap": page = <Roadmap />; break;
    case "chapter": page = <ChapterPage route={route} />; break;
    case "journal": page = <JournalPage route={route} />; break;
    case "companion": page = <Companion />; break;
    case "record": page = <Record />; break;
    case "continuing": page = <Continuing />; break;
    case "data": page = <DataPage />; break;
    default: page = <HQ />;
  }
  return (
    <>
      <Atmosphere level={d.rank.index} />
      <Shell route={route}>{page}</Shell>
      <Feed />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Routed />
    </StoreProvider>
  );
}
