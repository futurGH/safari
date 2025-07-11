import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export type RecordData = {
	rkey: string;
	collection: string;
	size: number;
	createdAt?: number;
	record: unknown;
};

export const repoRecordsState = atom<Array<RecordData>>([]);

export const repoSizeState = atom<number | null>(null);

export const repoNameState = atom<string | null>(null);

export const selectedDirectoryState = atom<string | null>(null);

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
