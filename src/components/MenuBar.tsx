import { List } from "@react95/core";
import styled from "styled-components";

export function MenuBar() {
	return (
		<MenuBarList width="100%" paddingBlock="$4" display="inline-flex">
			<ListItem>
				File
				<List>
					<ListItem>New</ListItem>
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
					<ListItem>About Windows 95</ListItem>
				</List>
			</ListItem>
		</MenuBarList>
	);
}

const MenuBarList = styled(List)`
	box-shadow: unset;

	& > li:has(ul):after {
		width: 0;
	}

	& ul {
		top: 2rem;
		left: 0.25rem;
	}
`;

const ListItem = styled(List.Item)`
	&& {
		white-space: nowrap;
		padding-inline: 0.65rem;
	}

	&[aria-disabled] {
		color: gray;
		cursor: not-allowed;
	}
`;
