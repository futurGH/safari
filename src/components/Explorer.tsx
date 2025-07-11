import { Button, Frame, TitleBar, Tree } from "@react95/core";
import {
	Desktop,
	Explorer100,
	Explorer101,
	RecycleEmpty,
} from "@react95/icons";
import styled from "styled-components";
import { MenuBar } from "./MenuBar";
import type { TreeProps } from "@react95/core/Tree";
import { useAtom } from "jotai";
import { repoDidState, repoRecordsState, repoSizeState } from "../state";

export function Explorer() {
	const [repoDid] = useAtom(repoDidState);
	const title = repoDid ? `Exploring ${repoDid}` : "Exploring the ATmosphere";

	return (
		<Center>
			<Frame
				display="flex"
				flexDirection="column"
				bgColor="$material"
				boxShadow="$out"
				w={{ mobile: "90%", tablet: "640px", desktop: "900px" }}
				h={{ mobile: "90%", tablet: "480px", desktop: "720px" }}
			>
				<StyledTitleBar
					active
					icon={<Explorer101 variant="16x16_4" />}
					title={title}
					alignItems="center"
					paddingBlock="$12"
				>
					<TitleBar.OptionsBox
						h="100%"
						display="flex"
						alignItems="center"
					>
						<TitleBarMinimize />
						<TitleBarMaximize />
						<TitleBarClose />
					</TitleBar.OptionsBox>
				</StyledTitleBar>
				<MenuBar />
				<Frame
					w="100%"
					h="100%"
					display="flex"
					flexDirection="column"
					paddingInline="$4"
					boxShadow="none"
				>
					<Frame
						display={{ mobile: "block", tablet: "flex" }}
						w="100%"
						h="auto"
						flexGrow={1}
						gap="$6"
					>
						<DirectoryListing />
						<FileListing />
					</Frame>
					<InfoBar />
				</Frame>
			</Frame>
		</Center>
	);
}

function DirectoryListing() {
	const rootNode = {
		id: 0,
		label: "Desktop",
		icon: <Desktop variant="16x16_4" />,
	};

	const nodes: TreeProps["data"] = [
		{
			id: 0,
			label: "The ATmosphere",
			icon: <Explorer100 variant="16x16_4" />,
		},
		{
			id: 1,
			label: "Recycle Bin",
			icon: <RecycleEmpty variant="16x16_4" />,
		},
	];

	return (
		<Frame
			w={{ mobile: "100%", tablet: "30%" }}
			h="auto"
			display="flex"
			flexDirection="column"
			gap="$4"
		>
			<Frame
				w="100%"
				boxShadow="$in"
				paddingBlock="$2"
				paddingInline="$6"
			>
				All Folders
			</Frame>
			<Frame w="100%" h="100%" padding="$1" boxShadow="$in">
				<Frame
					w="100%"
					h="100%"
					bgColor="#FCFCFC"
					boxShadow="$in"
					overflow="scroll"
				>
					<Tree w="110%" h="110%" root={rootNode} data={nodes} />
				</Frame>
			</Frame>
		</Frame>
	);
}

function FileListing() {
	const [repoDid] = useAtom(repoDidState);

	return (
		<Frame
			w={{ mobile: "100%", tablet: "70%" }}
			h="auto"
			display="flex"
			flexDirection="column"
			gap="$4"
		>
			<Frame
				w="100%"
				boxShadow="$in"
				paddingBlock="$2"
				paddingInline="$6"
			>
				Contents of{repoDid ? ` ${repoDid}` : "..."}
			</Frame>
			<Frame w="100%" h="100%" padding="$1" boxShadow="$in">
				<Frame
					w="100%"
					h="100%"
					bgColor="#FCFCFC"
					boxShadow="$in"
					overflow="scroll"
				>
					<FilesList />
				</Frame>
			</Frame>
		</Frame>
	);
}

function FilesList() {
	return (
		<FilesTable>
			<FilesTHead>
				<FilesTR>
					<FilesTH>
						<FilesHeaderButton>Name</FilesHeaderButton>
					</FilesTH>
					<FilesTH>
						<FilesHeaderButton style={{ textAlign: "right" }}>
							Size
						</FilesHeaderButton>
					</FilesTH>
					<FilesTH>
						<FilesHeaderButton>Type</FilesHeaderButton>
					</FilesTH>
					<FilesTH>
						<FilesHeaderButton>Modified</FilesHeaderButton>
					</FilesTH>
				</FilesTR>
			</FilesTHead>
			<FilesTBody>
				<FilesTR>
					<FilesTD>rkeyabcd234</FilesTD>
					<FilesTD style={{ textAlign: "right" }}>100KB</FilesTD>
					<FilesTD>Post Record</FilesTD>
					<FilesTD>2025-01-01T00:00:00Z</FilesTD>
				</FilesTR>
				<FilesTR>
					<FilesTD>rkeyabcd234</FilesTD>
					<FilesTD style={{ textAlign: "right" }}>200KB</FilesTD>
					<FilesTD>Post Record</FilesTD>
					<FilesTD>2025-01-02T00:00:00Z</FilesTD>
				</FilesTR>
			</FilesTBody>
		</FilesTable>
	);
}

function InfoBar() {
	const [records] = useAtom(repoRecordsState);
	const [repoSize] = useAtom(repoSizeState);

	return (
		<Frame
			w="100%"
			h="auto"
			display="flex"
			flexDirection="row"
			paddingBlock="$4"
			gap="$4"
			boxShadow="none"
		>
			<Frame
				w="min-content"
				whiteSpace="nowrap"
				boxShadow="$in"
				paddingBlock="$2"
				paddingInline="$6"
			>
				{records.length} object(s)
			</Frame>
			<Frame
				w="100%"
				boxShadow="$in"
				paddingBlock="$2"
				paddingInline="$6"
			>
				{repoSize ?? 0}MB (Disk free space: 8192MB)
			</Frame>
		</Frame>
	);
}

const Center = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

// @ts-expect-error — React 19 forwardRef type mismatch
const StyledTitleBar = styled(TitleBar)`
	height: 1.75rem;
	padding-inline: 0.25rem;
	padding-block: 0.25rem;
`;

const [TitleBarMinimize, TitleBarMaximize, TitleBarClose] = [
	TitleBar.Minimize,
	TitleBar.Maximize,
	TitleBar.Close,
].map(
	// @ts-expect-error — Union type too complex to represent
	(btn) => styled(btn)`
		width: 1.5rem;
		height: 1.25rem;
		& > img {
			width: 0.65rem;
			height: 0.65rem;
		}
	`,
);

const FilesTable = styled.table`
	width: 100%;
	height: 100%;
	display: grid;
	grid-template-columns: repeat(4, minmax(min-content, 40%));
	grid-auto-rows: min-content;
`;

const FilesTHead = styled.thead`
	display: contents;
`;
const FilesTBody = styled.tbody`
	display: contents;
`;
const FilesTR = styled.tr`
	display: contents;
`;
const FilesTH = styled.th`
	display: contents;
`;
const FilesTD = styled.td`
	height: min-content;
	white-space: nowrap;
	padding-inline: 0.5rem;
`;
const FilesHeaderButton = styled(Button)`
	height: min-content;
	text-align: left;
	padding-inline: 0.5rem;
	padding-block: 0.1rem;

	&:active {
		padding-inline: 0.5rem;
		padding-block: 0.1rem;
	}
`;
