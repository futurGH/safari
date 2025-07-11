import { Fragment, type MouseEventHandler } from "react";
import { Button, Frame, Tree } from "@react95/core";
import {
	Desktop,
	Explorer100,
	Explorer101,
	Folder,
	RecycleEmpty,
	Bat,
} from "@react95/icons";
import styled from "styled-components";
import { MenuBar } from "./MenuBar";
import type { TreeProps } from "@react95/core/Tree";
import { useAtom } from "jotai";
import {
	repoNameState,
	repoRecordsState,
	repoSizeState,
	selectedPathState,
	type FileStructure,
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
	const [, setSelectedPath] = useAtom(selectedPathState);

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
			children: fileStructureToDirectoryTree(records, setSelectedPath, 2),
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
			<Frame
				w="100%"
				h="100%"
				flex="1 1 0"
				minHeight="0"
				padding="$1"
				boxShadow="$in"
				overflow="auto"
			>
				<DirectoryListingContainer
					w="100%"
					h="100%"
					bgColor="#FCFCFC"
					boxShadow="$in"
					overflow="scroll"
				>
					<Tree
						w="min-content"
						h="110%"
						root={rootNode}
						data={nodes}
					/>
				</DirectoryListingContainer>
			</Frame>
		</Frame>
	);
}

function FileListing() {
	const [repoName] = useAtom(repoNameState);
	const [selectedPath] = useAtom(selectedPathState);
	const dirname = selectedPath.at(-1) ?? repoName;

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
				whiteSpace="nowrap"
			>
				<span
					style={{
						display: "block",
						overflow: "hidden",
						textOverflow: "ellipsis",
					}}
				>
					Contents of{dirname ? ` '${dirname}'` : "..."}
				</span>
			</Frame>
			<Frame
				w="100%"
				flex="1 1 0"
				minHeight="0"
				padding="$1"
				boxShadow="$in"
				overflow="auto"
			>
				<Frame w="100%" h="100%" bgColor="#FCFCFC" boxShadow="$in">
					<FilesList />
				</Frame>
			</Frame>
		</Frame>
	);
}

function FilesList() {
	const [selectedPath, setSelectedPath] = useAtom(selectedPathState);
	const [fileStructure] = useAtom(repoRecordsState);

	const files = getFilesForPath(fileStructure, selectedPath);

	return (
		<FilesContainer>
			<FilesHeaderCell>
				<FilesHeaderButton>Name</FilesHeaderButton>
			</FilesHeaderCell>
			<FilesHeaderCell>
				<FilesHeaderButton style={{ textAlign: "right" }}>
					Size
				</FilesHeaderButton>
			</FilesHeaderCell>
			<FilesHeaderCell>
				<FilesHeaderButton>Type</FilesHeaderButton>
			</FilesHeaderCell>
			<FilesHeaderCell>
				<FilesHeaderButton>Modified</FilesHeaderButton>
			</FilesHeaderCell>
			{files.map((file) => {
				const Icon = file.type === "file" ? FileIcon : FolderIcon;

				const size =
					file.size < 1024
						? `${file.size}B`
						: `${(file.size / 1024).toFixed(0)}KB`;

				let type: string;
				if (file.type === "file") {
					const lastSegment = file.collection.split(".").pop()!;
					type =
						lastSegment[0].toUpperCase() +
						lastSegment.slice(1) +
						" Record";
				} else {
					type = "Folder";
				}

				const createdAt =
					file.type === "file" && file.createdAt
						? new Date(file.createdAt).toLocaleString()
						: "";

				const onDoubleClick: MouseEventHandler | undefined =
					file.type === "file"
						? undefined
						: () => setSelectedPath([...selectedPath, file.label]);

				return (
					<Fragment key={file.label}>
						<FileNameCell
							as="label"
							tabIndex={0}
							onDoubleClick={onDoubleClick}
						>
							<Icon variant="16x16_4" /> {file.label}
						</FileNameCell>
						<FilesCell style={{ justifyContent: "flex-end" }}>
							{size}
						</FilesCell>
						<FilesCell>{type}</FilesCell>
						<FilesCell>{createdAt}</FilesCell>
					</Fragment>
				);
			})}
		</FilesContainer>
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

const getFilesForPath = (
	files: FileStructure,
	path: string[],
): FileStructure => {
	let current = files;
	for (const part of path) {
		const next = current.find((file) => file.label === part);
		if (!next) return [];
		if (next.type === "file") return [next];
		current = next.children;
	}
	return current;
};

const fileStructureToDirectoryTree = (
	files: FileStructure,
	onClick: (path: string[]) => void,
	id = 0,
	path: string[] = [],
) => {
	const directoryTree: TreeProps["data"] = [];

	for (const file of files) {
		const { label, type } = file;
		const filePath = [...path, label];

		if (type === "file") {
			directoryTree.push({
				id: id++,
				label,
			});
		} else {
			const children = fileStructureToDirectoryTree(
				file.children,
				onClick,
				id,
				filePath,
			);
			directoryTree.push({
				id: id++,
				label,
				onClick: () => onClick(filePath),
				children,
			});
		}
	}

	return directoryTree;
};

const DirectoryListingContainer = styled(Frame)`
	user-select: none;

	& label {
		white-space: nowrap;
		&:focus {
			background-color: var(--r95-color-anchor);
			color: white;
		}
	}

	& svg {
		width: 1.5rem;
		height: 1.5rem;
		aspect-ratio: 1;
		margin-right: 0.25rem;
	}
`;

const FilesContainer = styled.div`
	user-select: none;

	width: 100%;
	height: 100%;
	min-height: 16rem;
	display: grid;
	grid-template-columns: repeat(4, minmax(min-content, 40%));
	grid-template-rows: repeat(auto-fit, minmax(1.5rem, min-content));
	overflow-y: auto;
`;

const FilesHeaderCell = styled.div`
	display: flex;
	width: 100%;
	height: min-content;
	position: sticky;
	top: 0;
	z-index: 1;
	& > button {
		width: 100%;
		align-self: start;
	}
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

const FilesCell = styled.div`
	display: inline-flex;
	align-items: center;
	height: min-content;
	white-space: nowrap;
	padding-inline: 0.5rem;
`;

const FileNameCell = styled(FilesCell)`
	height: 1.67rem;
	box-sizing: border-box;

	&:focus {
		background-color: var(--r95-color-anchor);
		color: white;
		border-width: 2px;
		border-style: dotted;
	}
`;

const FileIcon = styled(Bat)`
	width: 1.25rem;
	height: 1.25rem;
	aspect-ratio: 1;
	margin-right: 0.25rem;
`;
const FolderIcon = styled(Folder)`
	width: 1.25rem;
	height: 1.25rem;
	aspect-ratio: 1;
	margin-right: 0.25rem;
`;
