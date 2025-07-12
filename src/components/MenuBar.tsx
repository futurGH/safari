import { List, Button } from "@react95/core";
import styled from "styled-components";
import { useModalVisibility } from "../state";

export function MenuBar() {
	const [, setShowImportModal] = useModalVisibility("importRepo");

	return (
		<MenuBarList>
			<ListItem>
				File
				<List>
					<ListItem>
						<ListItemButton
							onClick={() =>
								setTimeout(() => setShowImportModal(true), 0)
							}
						>
							Import
						</ListItemButton>
					</ListItem>
					<List.Divider />
					<ListItem aria-disabled>Create Shortcut</ListItem>
					<ListItem aria-disabled>Delete</ListItem>
					<ListItem aria-disabled>Rename</ListItem>
					<ListItem aria-disabled>Properties</ListItem>
					<List.Divider />
					<ListItem aria-disabled>Close</ListItem>
				</List>
			</ListItem>
			<ListItem>
				Edit
				<List>
					<ListItem aria-disabled>Undo</ListItem>
					<ListItem aria-disabled>Redo</ListItem>
					<List.Divider />
					<ListItem aria-disabled>Cut</ListItem>
					<ListItem aria-disabled>Copy</ListItem>
					<ListItem aria-disabled>Paste</ListItem>
					<ListItem aria-disabled>Paste Shortcut</ListItem>
					<List.Divider />
					<ListItem aria-disabled>Select All</ListItem>
					<ListItem aria-disabled>Invert Selection</ListItem>
				</List>
			</ListItem>
			<ListItem>
				View
				<List>
					<ListItem aria-disabled>Zoom In</ListItem>
					<ListItem aria-disabled>Zoom Out</ListItem>
					<ListItem aria-disabled>Reset Zoom</ListItem>
				</List>
			</ListItem>
			<ListItem>
				Tools
				<List>
					<ListItem aria-disabled>Find</ListItem>
					<ListItem aria-disabled>Go to...</ListItem>
				</List>
			</ListItem>
			<ListItem>
				Help
				<List>
					<ListItem aria-disabled>Help Topics</ListItem>
					<ListItem
						onClick={() =>
							window
								.open(
									"https://github.com/futurGH/safari",
									"_blank",
								)
								?.focus()
						}
					>
						About Windows 95
					</ListItem>
				</List>
			</ListItem>
		</MenuBarList>
	);
}

const MenuBarList = styled(List)`
	width: 100%;
	display: inline-flex;
	padding: 0;
	box-shadow: unset;

	& > li:has(ul):after {
		width: 0;
	}

	& li:has(> button):hover {
		color: white;
	}

	& ul {
		top: 2rem;
		left: 0.25rem;
	}
`;

const ListItem = styled(List.Item)`
	&& {
		white-space: nowrap;
		padding-inline: 0.7rem;
	}

	&[aria-disabled] {
		color: gray;
		cursor: not-allowed;
	}
`;

// @ts-expect-error — Union type too complex to represent
const ListItemButton = styled(Button)`
	width: 100%;
	height: 100%;
	outline: none;
	box-shadow: none;
	background-color: unset;
	color: unset;
	padding: 0;
	text-align: left;

	&:hover,
	&:focus,
	&:active {
		padding: 0;
		outline: none;
		box-shadow: none;
		background-color: unset;
	}
`;
