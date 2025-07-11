import { Wab321010, Wmsui323911 } from "@react95/icons";
import { Modal } from "./Modal";
import { Button, Frame, Input } from "@react95/core";
import { useCallback, useState } from "react";
import styled from "styled-components";
import { RepoReader } from "@atcute/car/v4";
import { useAtom } from "jotai";
import {
	repoNameState,
	repoRecordsState,
	repoSizeState,
	type RecordData,
} from "../state";
import {
	CompositeDidDocumentResolver,
	CompositeHandleResolver,
	DohJsonHandleResolver,
	PlcDidDocumentResolver,
	WebDidDocumentResolver,
	WellKnownHandleResolver,
} from "@atcute/identity-resolver";
import { Client, simpleFetchHandler } from "@atcute/client";
import type {} from "@atcute/atproto";

const didResolver = new CompositeDidDocumentResolver({
	methods: {
		plc: new PlcDidDocumentResolver(),
		web: new WebDidDocumentResolver(),
	},
});
const handleResolver = new CompositeHandleResolver({
	methods: {
		dns: new DohJsonHandleResolver({
			dohUrl: "https://cloudflare-dns.com/dns-query",
		}),
		http: new WellKnownHandleResolver(),
	},
});

type Status =
	| "Parsing repository..."
	| "Downloading repository..."
	| "Please enter a DID or handle or select a file."
	| "Invalid DID or handle."
	| "Failed to download repository."
	| null;

export function ImportRepoModal({
	setShow,
}: {
	setShow: (show: boolean) => void;
}) {
	const [input, setInput] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<Status | null>(null);

	const [, setRepoName] = useAtom(repoNameState);
	const [, setRepoRecords] = useAtom(repoRecordsState);
	const [, setRepoSize] = useAtom(repoSizeState);

	const loadRepo = useCallback(
		async (bytes: Uint8Array) => {
			if (!bytes) return;
			const repo = RepoReader.fromUint8Array(bytes);

			let size = 0;
			const records: Array<RecordData> = [];
			for await (const entry of repo) {
				size += entry.bytes.byteLength;
				let createdAt = undefined;
				if (
					entry.record &&
					typeof entry.record === "object" &&
					"createdAt" in entry.record
				) {
					const date = new Date(
						entry.record.createdAt as never,
					).getTime();
					if (!isNaN(date)) createdAt = date;
				}
				records.push({
					rkey: entry.rkey,
					collection: entry.collection,
					size: entry.bytes.byteLength,
					createdAt,
					record: entry.record,
				});
			}
			setRepoRecords(records);
			setRepoSize(size);
			setShow(false);
		},
		[setRepoRecords, setRepoSize, setShow],
	);

	const fetchRepo = useCallback(async () => {
		if (!input) return;
		let did: `did:plc:${string}`;
		if (input.startsWith("did:")) {
			did = input as `did:plc:${string}`;
		} else {
			did = (await handleResolver.resolve(
				input as `${string}.${string}`,
			)) as `did:plc:${string}`;
		}

		const { service } = await didResolver.resolve(did);
		if (!Array.isArray(service)) {
			setStatus("Invalid DID or handle.");
			return;
		}

		const pdsService = service.find((s) => s.id === "#atproto_pds");
		if (
			!pdsService?.serviceEndpoint ||
			typeof pdsService.serviceEndpoint !== "string"
		) {
			setStatus("Invalid DID or handle.");
			return;
		}

		const xrpc = new Client({
			handler: simpleFetchHandler({
				service: pdsService.serviceEndpoint,
			}),
		});

		const { data, ok } = await xrpc.get("com.atproto.sync.getRepo", {
			params: { did },
			as: "bytes",
		});

		if (!ok) {
			setStatus("Failed to download repository.");
			return;
		}

		await loadRepo(data);
	}, [input, loadRepo]);

	return (
		<Modal
			icon={<Wab321010 variant="32x32_4" />}
			title="Import Repository"
			titleBarOptions={[
				<Modal.Minimize key="minimize" />,
				<Modal.Close key="close" onClick={() => setShow(false)} />,
			]}
			buttons={[
				{
					value: file ? "Load File" : "Import",
					onClick: () => {
						if (file) {
							setRepoName(file.name);
							setStatus("Parsing repository...");
							file.arrayBuffer().then((bytes) => {
								loadRepo(new Uint8Array(bytes));
							});
						} else if (input) {
							setRepoName(input);
							setStatus("Downloading repository...");
							fetchRepo().catch(() => {
								setStatus(`Failed to download repository.`);
							});
						} else {
							setStatus(
								"Please enter a DID or handle or select a file.",
							);
						}
					},
				},
				{
					value: "Cancel",
					onClick: () => setShow(false),
				},
			]}
		>
			<ModalContent
				bgColor="$material"
				w={{ mobile: "90vw", tablet: "640px" }}
				paddingInline={{ mobile: "1rem", tablet: "2rem" }}
				paddingBlock={{ mobile: "0.75rem", tablet: "1.5rem" }}
			>
				<Wmsui323911 width="3rem" height="3rem" variant="32x32_4" />
				<Frame display="flex" flexDirection="column" gap="1rem">
					<Prompt>
						Enter the DID or handle of the repository you want to
						import. Or, import a CAR file.
					</Prompt>
					<Input
						type="text"
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							if (
								status ===
								"Please enter a DID or handle or select a file."
							) {
								setStatus(null);
							}
						}}
					/>
					<FileInput
						id="car-input"
						type="file"
						accept=".car"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) {
								setFile(file);
								if (
									status ===
									"Please enter a DID or handle or select a file."
								) {
									setStatus(null);
								}
							}
						}}
					/>
					<Frame
						display="flex"
						flexDirection="row"
						alignItems="center"
						gap="1rem"
						overflow="hidden"
					>
						<Button
							as="label"
							htmlFor="car-input"
							w="fit-content"
							whiteSpace="nowrap"
						>
							Import CAR
						</Button>
						<span>{file ? file.name : "No file selected"}</span>
					</Frame>
					{status && <span>{status}</span>}
				</Frame>
			</ModalContent>
		</Modal>
	);
}

const ModalContent = styled(Modal.Content)`
	display: flex;
	flex-direction: row;
	gap: 1rem;
	padding-inline: 1rem;
	padding-block: 0.75rem;

	@media (min-width: 768px) {
		padding-inline: 2rem;
		padding-block: 1.5rem;
	}
`;

const Prompt = styled.p`
	margin-top: 0;
	margin-bottom: 1rem;
	font-size: 1rem;
	line-height: 1.25;
`;

const FileInput = styled.input`
	display: none;
`;
