import { Route, Routes } from "react-router-dom";
import { pages } from "../../pages";

/**
 * A router component for page navigation.
 *
 * @returns A router component.
 */
export default function Router() {
  const handlePage = (page) => {
    if (page.path && page.content) {
      return <Route key={page.key} path={page.path} element={page.content} />;
    } else {
      return null;
    }
  };

  return <Routes>{pages.map(handlePage)}</Routes>;
}
