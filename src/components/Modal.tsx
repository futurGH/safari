import { Modal as _Modal, TitleBar } from "@react95/core";
import type { OptionReturnType } from "@react95/core/TitleBar";
import styled from "styled-components";
import type { IStyledComponentBase } from "styled-components/dist/types";

// @ts-expect-error — React 19 forwardRef type mismatch
export const Modal: IStyledComponentBase = styled(_Modal)`
	& > .draggable {
		height: 1.75rem;
		padding-inline: 0.25rem;
		padding-block: 0.25rem;
		display: flex;
		gap: 0.25rem;
		align-items: center;

		& svg {
			width: 1.25rem;
			height: 1.25rem;
			margin-inline-end: 0.25rem;
		}
	}
`;
Modal.Content = styled(_Modal.Content)`
	margin: 0;
	padding: 0;
`;

const [ModalMinimize, ModalMaximize, ModalClose] = [
	_Modal.Minimize,
	TitleBar.Maximize,
	TitleBar.Close,
].map<OptionReturnType>(
	(btn) => styled(btn)`
		width: 1.5rem;
		height: 1.25rem;
		& > img {
			width: 0.65rem;
			height: 0.65rem;
		}
	`,
);

Modal.Minimize = ModalMinimize;
Modal.Maximize = ModalMaximize;
Modal.Close = ModalClose;
