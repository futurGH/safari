// @ts-expect-error — don't know why this errors
import "@react95/core/GlobalStyle";
import "@react95/core/themes/win95.css";
import "@react95/icons/icons.css";
import { Explorer } from "./components/Explorer";
import { TaskBar } from "@react95/core";
import { useLayoutEffect, useState } from "react";
import { repoNameState, useModalVisibility } from "./state";
import { ImportRepoModal } from "./components/ImportRepoModal";
import { useAtom } from "jotai";

function App() {
	const [repoName] = useAtom(repoNameState);

	const title = `Exploring - ${repoName ?? "the ATmosphere"}`;

	const [showExplorer, setShowExplorer] = useModalVisibility("explorer");
	const [showImportRepo, setShowImportRepo] =
		useModalVisibility("importRepo");

	useLayoutEffect(() => {
		setShowExplorer(true);
		setShowImportRepo(true);
	}, []);

	const [screenDimensions, setScreenDimensions] = useState({
		width: 100,
		height: 100,
	});

	useLayoutEffect(() => {
		const handleResize = () => {
			setScreenDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<>
			{showExplorer && (
				<Explorer
					title={title}
					setVisible={setShowExplorer}
					screenDimensions={screenDimensions}
				/>
			)}
			{showImportRepo && <ImportRepoModal setShow={setShowImportRepo} />}
			<TaskBar />
		</>
	);
}

export default App;
