import "@react95/core/GlobalStyle";
import "@react95/core/themes/win95.css";
import "@react95/icons/icons.css";
import { Explorer } from "./components/Explorer";
import { List, TaskBar } from "@react95/core";
import { Explorer101 } from "@react95/icons";
import { useLayoutEffect, useState } from "react";

function App() {
	const title = "Exploring - the ATmosphere";

	const [showExplorer, setShowExplorer] = useState(false);

	useLayoutEffect(() => setShowExplorer(true), []);

	return (
		<>
			{showExplorer && (
				<Explorer title={title} setVisible={setShowExplorer} />
			)}
			<TaskBar
				list={
					<List>
						<List.Item
							icon={<Explorer101 variant="16x16_4" />}
							onClick={() => setShowExplorer(!showExplorer)}
						>
							{title}
						</List.Item>
					</List>
				}
			/>
		</>
	);
}

export default App;
