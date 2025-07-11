import { atom } from "jotai";

export const repoRecordsState = atom([]);

export const repoSizeState = atom<number | null>(null);

export const repoDidState = atom<string | null>(null);

export const selectedDirectoryState = atom<string | null>(null);
