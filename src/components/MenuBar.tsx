import { List } from "@react95/core";
import styled from "styled-components";

export function MenuBar() {
	return (
		<MenuBarList width="100%" paddingBlock="$4" display="inline-flex">
			<ListItem>File</ListItem>
			<ListItem>Edit</ListItem>
			<ListItem>View</ListItem>
			<ListItem>Tools</ListItem>
			<ListItem>Help</ListItem>
		</MenuBarList>
	);
}

const MenuBarList = styled(List)`
	box-shadow: unset;
`;

const ListItem = styled(List.Item)`
	&& {
		padding-inline: 0.65rem;
	}
`;
