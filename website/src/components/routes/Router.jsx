import { Route, Routes } from 'react-router-dom';
import { pages } from '../../pages';

export default function Router() {
	return (
		<Routes>
			{pages.map((page) => {
				if (!page.isDivider) {
					return <Route path={page.path} element={page.content} />;
				}
			})}
		</Routes>
	);
}
