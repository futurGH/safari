import { Frame, TitleBar } from "@react95/core";
import { Explorer101 } from "@react95/icons";
import styled from "styled-components";

export function Explorer() {
	return (
		<Center>
			<Frame
				bgColor="$material"
				boxShadow="$out"
				w={{ mobile: "90%", tablet: "640px", desktop: "800px" }}
				h={{ mobile: "90%", tablet: "480px", desktop: "600px" }}
			>
				{/* @ts-expect-error — type mismatch with react 19 */}
				<TitleBar
					active
					icon={<Explorer101 variant="16x16_4" />}
					title="Exploring"
					width="100%"
				>
					<TitleBar.OptionsBox>
						<TitleBar.Help />
						<TitleBar.Maximize />
						<TitleBar.Minimize />
						<TitleBar.Restore />
						<TitleBar.Close />
					</TitleBar.OptionsBox>
				</TitleBar>
				<p>hello world</p>
			</Frame>
		</Center>
	);
}

const Center = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
