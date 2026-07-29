import "../../css/home.css";

function Home() {
	const features = [
		{
			icon: "👤",
			title: "회원 및 인증",
			description: "회원가입부터 JWT 로그인, 사용자 권한 관리까지 구현했습니다.",
			items: [
				"회원가입 및 로그인",
				"JWT Access Token 인증",
				"USER / ADMIN 권한 분리",
				"회원 권한 변경 및 탈퇴"
			]
		},
		{
			icon: "📋",
			title: "게시판",
			description: "사내 공지와 커뮤니케이션을 위한 게시판 기능을 구현했습니다.",
			items: [
				"게시글 작성·조회·수정·삭제",
				"댓글 작성 및 삭제",
				"답글형 게시판",
				"조회수 및 관리자 게시글 관리"
			]
		},
		{
			icon: "⏰",
			title: "근태 관리",
			description: "직원의 출퇴근 기록과 관리자용 근태 조회 기능을 구현했습니다.",
			items: [
				"출근 및 퇴근 처리",
				"오늘의 근무 상태 확인",
				"개인 근태 이력 조회",
				"날짜별 관리자 근태 조회"
			]
		},
		{
			icon: "🌴",
			title: "휴가 관리",
			description: "휴가 신청부터 승인과 잔여 연차 계산까지 처리합니다.",
			items: [
				"연차·반차·병가·기타 휴가",
				"휴가 중복 신청 검사",
				"관리자 승인 및 반려",
				"사용 연차와 잔여 연차 계산"
			]
		}
	];

	const troubles = [
		{
			number: "01",
			title: "Oracle SQL을 MySQL로 전환",
			description:
				"기존 Oracle 중심으로 작성된 MyBatis SQL을 MySQL 환경에 맞게 수정했습니다. 날짜 함수, 페이징, 시퀀스와 데이터 타입 차이를 확인하며 Mapper XML을 재구성했습니다.",
			tags: ["MySQL", "MyBatis", "SQL Migration"]
		},
		{
			number: "02",
			title: "JWT 인증과 Spring Security 적용",
			description:
				"로그인 성공 시 발급한 토큰을 프론트엔드에서 보관하고 요청 헤더에 전달하도록 구성했습니다. 인증 필터와 권한별 접근 제어를 적용하며 401 오류를 해결했습니다.",
			tags: ["JWT", "Spring Security", "Authorization"]
		},
		{
			number: "03",
			title: "React와 Spring Boot 통신 오류 해결",
			description:
				"프론트엔드와 백엔드의 실행 포트가 달라 발생한 CORS 문제와 잘못된 API 경로, Authorization 헤더 누락 문제를 점검하고 수정했습니다.",
			tags: ["React", "Axios", "CORS"]
		},
		{
			number: "04",
			title: "Docker와 WSL2 개발환경 구축",
			description:
				"Windows에서 WSL2 Ubuntu와 Docker Desktop을 연동하고, Maven으로 빌드한 Spring Boot 애플리케이션을 Docker 이미지와 컨테이너로 실행했습니다.",
			tags: ["Docker", "WSL2", "Maven"]
		},
		{
			number: "05",
			title: "MyBatis 매핑 오류 해결",
			description:
				"DTO 필드명과 SQL 별칭, resultType 및 resultMap의 불일치로 발생한 오류를 점검했습니다. DAO 메서드와 Mapper id, 파라미터 타입도 함께 정리했습니다.",
			tags: ["ResultMap", "DTO", "Mapper XML"]
		},
		{
			number: "06",
			title: "그룹웨어 UI 전체 리뉴얼",
			description:
				"기존 기능과 API 로직을 유지하면서 로그인, 회원가입, 게시판, 관리자, 내비게이션과 푸터를 흰색·파란색 기반의 SaaS 스타일로 개선했습니다.",
			tags: ["React UI", "Responsive", "CSS"]
		}
	];

	const progress = [
		{ label: "회원가입 및 JWT 로그인", status: "완료" },
		{ label: "게시판·댓글·답글 기능", status: "완료" },
		{ label: "출퇴근 및 근태 이력", status: "완료" },
		{ label: "휴가 신청·승인·반려", status: "완료" },
		{ label: "관리자 통합 관리 기능", status: "완료" },
		{ label: "Docker 개발환경 구축", status: "완료" },
		{ label: "클라우드 운영환경 개선", status: "진행 중" }
	];

	const techGroups = [
		{
			category: "FRONTEND",
			technologies: ["React 18", "React Router", "Axios", "Context API", "HTML5", "CSS3"]
		},
		{
			category: "BACKEND",
			technologies: [
				"Java",
				"Spring Boot",
				"Spring Security",
				"JWT",
				"MyBatis",
				"Maven"
			]
		},
		{
			category: "DATABASE",
			technologies: ["MySQL", "Railway Database", "MyBatis Mapper XML"]
		},
		{
			category: "DEVOPS",
			technologies: [
				"Git",
				"GitHub",
				"Docker",
				"WSL2 Ubuntu",
				"Render",
				"Railway"
			]
		}
	];

	return (
		<main className="project-home">
			<section className="project-hero">
				<div className="project-hero__glow project-hero__glow--one" />
				<div className="project-hero__glow project-hero__glow--two" />

				<div className="project-container project-hero__content">
					<div className="project-hero__text">
						<p className="project-eyebrow">
							PERSONAL FULL-STACK PROJECT
						</p>

						<h1>
							사내 업무를 하나로 연결하는
							<strong> OFFICEFLOW</strong>
						</h1>

						<p className="project-hero__description">
							Spring Boot와 React를 기반으로 개발한 사내 그룹웨어
							프로젝트입니다. 회원과 권한, 게시판, 근태, 휴가 및
							관리자 기능을 하나의 서비스로 구현했습니다.
						</p>

						<div className="project-hero__badges">
							<span>Spring Boot</span>
							<span>React</span>
							<span>MySQL</span>
							<span>Docker</span>
						</div>
					</div>

					<div className="project-hero__panel">
						<div className="project-hero__panel-header">
							<span />
							<span />
							<span />
						</div>

						<div className="project-hero__panel-body">
							<p>PROJECT OVERVIEW</p>
							<h2>OFFICEFLOW</h2>

							<div className="project-hero__stats">
								<div>
									<strong>4</strong>
									<span>핵심 업무 영역</span>
								</div>
								<div>
									<strong>Full</strong>
									<span>Frontend · Backend</span>
								</div>
								<div>
									<strong>JWT</strong>
									<span>인증 및 권한 관리</span>
								</div>
								<div>
									<strong>Docker</strong>
									<span>컨테이너 환경</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="project-section">
				<div className="project-container">
					<div className="project-section-heading">
						<p>ABOUT THE PROJECT</p>
						<h2>프로젝트 소개</h2>
						<span>
                            단순한 게시판 프로젝트에서 시작해 실제 사내 업무
                            흐름을 관리할 수 있는 그룹웨어로 확장했습니다.
                        </span>
					</div>

					<div className="project-about">
						<article className="project-about__main">
                            <span className="project-card-label">
                                WHY OFFICEFLOW?
                            </span>

							<h3>
								실제 회사에서 사용할 수 있는 업무 관리 서비스를
								목표로 개발했습니다.
							</h3>

							<p>
								직원은 출퇴근 기록, 휴가 신청, 게시판 이용을 할 수
								있으며 관리자는 회원, 게시글, 근태와 휴가를
								통합적으로 관리할 수 있습니다.
							</p>

							<p>
								프론트엔드와 백엔드를 직접 연결하고 인증, 데이터베이스,
								Docker 환경까지 구성하면서 서비스 전체의 동작 구조를
								경험했습니다.
							</p>
						</article>

						<aside className="project-about__side">
							<div>
								<span>PROJECT TYPE</span>
								<strong>개인 풀스택 프로젝트</strong>
							</div>
							<div>
								<span>ARCHITECTURE</span>
								<strong>React + REST API</strong>
							</div>
							<div>
								<span>DESIGN THEME</span>
								<strong>White &amp; Blue SaaS</strong>
							</div>
							<div>
								<span>DEPLOYMENT</span>
								<strong>Docker · Render · Railway</strong>
							</div>
						</aside>
					</div>
				</div>
			</section>

			<section className="project-section project-section--soft">
				<div className="project-container">
					<div className="project-section-heading">
						<p>CORE FEATURES</p>
						<h2>구현 기능</h2>
						<span>
                            사용자 업무 기능과 관리자 기능을 영역별로 나누어
                            구현했습니다.
                        </span>
					</div>

					<div className="project-feature-grid">
						{features.map((feature) => (
							<article
								className="project-feature-card"
								key={feature.title}
							>
								<div className="project-feature-card__top">
                                    <span className="project-feature-card__icon">
                                        {feature.icon}
                                    </span>
									<div>
										<h3>{feature.title}</h3>
										<p>{feature.description}</p>
									</div>
								</div>

								<ul>
									{feature.items.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="project-section">
				<div className="project-container">
					<div className="project-section-heading">
						<p>TECH STACK</p>
						<h2>사용 기술</h2>
						<span>
                            화면 구현부터 서버, 데이터베이스와 배포 환경까지 직접
                            구성했습니다.
                        </span>
					</div>

					<div className="project-tech-grid">
						{techGroups.map((group) => (
							<article
								className="project-tech-card"
								key={group.category}
							>
								<h3>{group.category}</h3>

								<div className="project-tech-card__list">
									{group.technologies.map((technology) => (
										<span key={technology}>{technology}</span>
									))}
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="project-section project-section--dark">
				<div className="project-container">
					<div className="project-section-heading project-section-heading--light">
						<p>TROUBLESHOOTING</p>
						<h2>개발 과정에서 해결한 문제</h2>
						<span>
                            오류를 단순히 우회하지 않고 원인을 확인하며 프로젝트의
                            구조를 개선했습니다.
                        </span>
					</div>

					<div className="project-trouble-list">
						{troubles.map((trouble) => (
							<article
								className="project-trouble-card"
								key={trouble.number}
							>
                                <span className="project-trouble-card__number">
                                    {trouble.number}
                                </span>

								<div className="project-trouble-card__content">
									<h3>{trouble.title}</h3>
									<p>{trouble.description}</p>

									<div className="project-trouble-card__tags">
										{trouble.tags.map((tag) => (
											<span key={tag}>{tag}</span>
										))}
									</div>
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="project-section">
				<div className="project-container">
					<div className="project-section-heading">
						<p>PROJECT STRUCTURE</p>
						<h2>프로젝트 구조</h2>
						<span>
                            역할과 책임을 분리해 기능을 수정하거나 확장하기 쉽게
                            구성했습니다.
                        </span>
					</div>

					<div className="project-structure">
						<article>
							<span>01</span>
							<h3>Frontend</h3>
							<p>
								React 컴포넌트와 Router를 기반으로 화면을 구성하고
								Axios를 통해 백엔드 API와 통신합니다.
							</p>
							<small>Component · Router · Context · CSS</small>
						</article>

						<div className="project-structure__line">
							<span>REST API</span>
						</div>

						<article>
							<span>02</span>
							<h3>Backend</h3>
							<p>
								Controller, Service, DAO 계층을 분리하고 Spring
								Security와 JWT로 인증을 처리합니다.
							</p>
							<small>
								Controller · Service · DAO · DTO · Security
							</small>
						</article>

						<div className="project-structure__line">
							<span>MyBatis</span>
						</div>

						<article>
							<span>03</span>
							<h3>Database</h3>
							<p>
								MySQL에 회원, 게시판, 댓글, 근태와 휴가 데이터를
								저장하고 Mapper XML로 SQL을 관리합니다.
							</p>
							<small>MySQL · Mapper XML · Railway</small>
						</article>
					</div>
				</div>
			</section>

			<section className="project-section project-section--soft">
				<div className="project-container">
					<div className="project-section-heading">
						<p>DEVELOPMENT STATUS</p>
						<h2>프로젝트 진행 현황</h2>
						<span>
                            주요 그룹웨어 기능을 구현했으며 운영 환경을 계속
                            개선하고 있습니다.
                        </span>
					</div>

					<div className="project-progress">
						{progress.map((item) => (
							<div
								className="project-progress__item"
								key={item.label}
							>
								<div>
                                    <span className="project-progress__check">
                                        {item.status === "완료" ? "✓" : "↗"}
                                    </span>
									<strong>{item.label}</strong>
								</div>

								<span
									className={
										item.status === "완료"
											? "project-progress__status"
											: "project-progress__status project-progress__status--working"
									}
								>
                                    {item.status}
                                </span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="project-closing">
				<div className="project-container">
					<p>WHAT I LEARNED</p>
					<h2>
						기능 구현을 넘어
						<br />
						서비스 전체가 연결되는 과정을 경험했습니다.
					</h2>
					<span>
                        인증, API, 데이터베이스, UI와 배포 과정에서 발생한 문제를
                        직접 해결하며 풀스택 프로젝트의 전체 흐름을 이해했습니다.
                    </span>
				</div>
			</section>
		</main>
	);
}

export default Home;