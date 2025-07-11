import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export type FileStructure = Array<
	{ type: "folder"; label: string; size: number; children: FileStructure } | {
		type: "file";
		label: string;
		collection: string;
		size: number;
		createdAt?: number;
	}
>;

export const repoRecordsState = atom<FileStructure>([]);

export const repoSizeState = atom<number | null>(null);

export const repoNameState = atom<string | null>(null);

export const selectedPathState = atom<string[]>([]);

export const visibleModalsState = atom<string[]>([]);

export function useModalVisibility(modalId: string) {
	const [visibleModals, setVisibleModals] = useAtom(visibleModalsState);

	const visibility = useMemo(() => visibleModals.includes(modalId), [visibleModals, modalId]);

	const setVisibility = useCallback((show: boolean) => {
		if (visibleModals.includes(modalId) && !show) {
			setVisibleModals((m) => m.filter((modal) => modal !== modalId));
		}
		if (!visibleModals.includes(modalId) && show) {
			setVisibleModals((m) => [...m, modalId]);
		}
	}, [visibleModals, modalId, setVisibleModals]);

	return [visibility, setVisibility] as const;
}
