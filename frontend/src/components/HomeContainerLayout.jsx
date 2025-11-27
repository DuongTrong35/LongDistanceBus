import "./HomeContainerLayout.css";
import logoweb from "../assets/konoha.png";

export default function HomeContainerLayout({
	headerContent,
	leftContent,
	rightContent,
	footerContent
}) {
	const defaultHeader = (
		<div className="header-wrapper">
			<div className="header-inner">
				<div className="header-left">
					<div className="lang">
						<span className="flag">🇻🇳</span>
						<span className="text">VI</span>
						<span className="arrow">▼</span>
					</div>

					<div className="app-download">
						<span className="icon">●</span>
						<span className="text">Tải ứng dụng</span>
						<span className="arrow">▼</span>
					</div>
				</div>

				<div className="header-center">
					<img src={logoweb} alt="logo" className="futa-logo" />
					<h2 className="route">Buôn Ma Thuột – TP. Hồ Chí Minh</h2>
					<p className="date">Thứ 4, 26/11</p>
				</div>

				<div className="header-right">
					<div className="profile">
						<span className="avatar">🧑</span>
						<span className="name">Long Distance Bus</span>
						<span className="arrow">▼</span>
					</div>
				</div>
			</div>
		</div>
	);

	const hasRightContent = Boolean(rightContent);
	const showHeader = headerContent !== undefined && headerContent !== null;

	return (
		<div className="HomeContainer">
			{showHeader && (headerContent || defaultHeader)}
			<div className={`HomeCenter${hasRightContent ? "" : " HomeCenter--single"}`}>
				<div className={`HomeLeft${hasRightContent ? "" : " HomeLeft--single"}`}>
					{leftContent}
				</div>
				{hasRightContent && <div className="HomeRight">{rightContent}</div>}
			</div>
			{footerContent ?? null}
		</div>
	);
}


