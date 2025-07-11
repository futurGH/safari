import { Button, Frame, Tree } from "@react95/core";
import {
	Desktop,
	Explorer100,
	Explorer101,
	Folder,
	RecycleEmpty,
} from "@react95/icons";
import styled from "styled-components";
import { MenuBar } from "./MenuBar";
import type { TreeProps } from "@react95/core/Tree";
import { useAtom } from "jotai";
import {
	repoNameState,
	repoRecordsState,
	repoSizeState,
	selectedDirectoryState,
	type RecordData,
} from "../state";
import { Modal } from "./Modal";

export function Explorer({
	title,
	setVisible,
	screenDimensions,
}: {
	title: string;
	setVisible: (visible: boolean) => void;
	screenDimensions: { width: number; height: number };
}) {
	return (
		<Modal
			icon={<Explorer101 variant="16x16_4" />}
			title={title}
			titleBarOptions={[
				<Modal.Minimize key="minimize" />,
				<Modal.Maximize key="maximize" />,
				<Modal.Close key="close" onClick={() => setVisible(false)} />,
			]}
			dragOptions={{
				defaultPosition: {
					x: screenDimensions.width / 2 - 300,
					y: screenDimensions.height / 2 - 300,
				},
			}}
		>
			<Modal.Content
				display="flex"
				flexDirection="column"
				bgColor="$material"
				boxShadow="$out"
				w={{ mobile: "90vw", tablet: "720px", desktop: "900px" }}
				h={{ mobile: "75vh", tablet: "720px" }}
			>
				<MenuBar />
				<Frame
					flex={1}
					w="100%"
					display="flex"
					flexDirection="column"
					paddingInline="$4"
					boxShadow="none"
				>
					<Frame
						display="flex"
						flexDirection={{ mobile: "column", tablet: "row" }}
						w="100%"
						flex={1}
						gap={{ mobile: "$20", tablet: "$6" }}
					>
						<DirectoryListing />
						<FileListing />
					</Frame>
					<InfoBar />
				</Frame>
			</Modal.Content>
		</Modal>
	);
}

function DirectoryListing() {
	const [repoName] = useAtom(repoNameState);
	const [records] = useAtom(repoRecordsState);
	const [, setSelectedDirectory] = useAtom(selectedDirectoryState);

	const rootNode = {
		id: 0,
		label: "Desktop",
		icon: <Desktop variant="16x16_4" />,
	};

	const nodes: TreeProps["data"] = [
		{
			id: 0,
			label: repoName ?? "The ATmosphere",
			icon: <Explorer100 variant="16x16_4" />,
			children: recordsToDirectoryStructure(
				records,
				(parts) => setSelectedDirectory(parts.join(".")),
				2,
			),
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
					<DirectoryListingTree
						w="110%"
						h="110%"
						root={rootNode}
						data={nodes}
					/>
				</Frame>
			</Frame>
		</Frame>
	);
}

function FileListing() {
	const [repoName] = useAtom(repoNameState);

	return (
		<Frame
			w={{ mobile: "100%", tablet: "70%" }}
			flex={1}
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
				Contents of{repoName ? ` ${repoName}` : "..."}
			</Frame>
			<Frame
				w="100%"
				flex="1 1 0"
				minHeight="0"
				padding="$1"
				boxShadow="$in"
				overflow="auto"
			>
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
	const [selectedDirectory] = useAtom(selectedDirectoryState);
	const [records] = useAtom(repoRecordsState);

	const files = selectedDirectory
		? records.filter((record) =>
				record.collection.startsWith(selectedDirectory),
			)
		: [];

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
				{files.map((file) => {
					const collectionType = file.collection.split(".").pop()!;
					const type =
						collectionType[0].toUpperCase() +
						collectionType.slice(1);
					const createdAt = file.createdAt
						? new Date(file.createdAt).toLocaleString()
						: "N/A";
					const size =
						file.size < 1024
							? `${file.size}B`
							: `${(file.size / 1024).toFixed(0)}KB`;
					return (
						<FilesTR key={file.rkey}>
							<FilesTD>{file.rkey}</FilesTD>
							<FilesTD style={{ textAlign: "right" }}>
								{size}
							</FilesTD>
							<FilesTD>{type} Record</FilesTD>
							<FilesTD>{createdAt}</FilesTD>
						</FilesTR>
					);
				})}
			</FilesTBody>
		</FilesTable>
	);
}

function InfoBar() {
	const [records] = useAtom(repoRecordsState);
	const [repoSize] = useAtom(repoSizeState);

	const repoSizeMb = (repoSize ?? 0) / (1024 * 1024);
	const freeSpaceMb = 8192 - repoSizeMb;

	return (
		<Frame
			w="100%"
			h="2.5rem"
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
				{repoSizeMb.toFixed(2)}MB (Disk free space:{" "}
				{freeSpaceMb.toFixed(2)}MB)
			</Frame>
		</Frame>
	);
}

function recordsToDirectoryStructure(
	records: RecordData[],
	onClick: (path: string[]) => void,
	startingId = 0,
) {
	let id = startingId;
	return records.reduce<TreeProps["data"]>((acc, record) => {
		const { collection } = record;
		const [nsid1, nsid2, ..._nsidParts] = collection.split(".");
		const nsidParts = [`${nsid1}.${nsid2}`, ..._nsidParts];
		let currentLevel = acc;
		const currentPath: string[] = [];

		for (let i = 0; i < nsidParts.length; i++) {
			const part = nsidParts[i];
			currentPath.push(part);

			let existingDir = currentLevel.find((dir) => dir.label === part);

			if (!existingDir) {
				existingDir = {
					id: id++,
					label: part,
					children: [],
					onClick: () => onClick([...currentPath]),
				};

				// qdd folder icon for the last level
				if (i === nsidParts.length - 1) {
					existingDir.icon = <Folder variant="16x16_4" />;
				}

				currentLevel.push(existingDir);
			}

			if (i < nsidParts.length - 1) {
				currentLevel = existingDir.children!;
			}
		}

		return acc;
	}, []);
}

const DirectoryListingTree = styled(Tree)`
	& label:focus {
		background-color: var(--r95-color-anchor);
		color: white;
	}
`;

const FilesTable = styled.table`
	width: 100%;
	height: 100%;
	min-height: 16rem;
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
