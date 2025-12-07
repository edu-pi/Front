import styles from "../Visualization.module.css";
import leftStyles from "../components/LeftSection/LeftSection.module.css";
import headerStyles from "../../components/LoggedInHeader.module.css";
import controlStyles from "../components/RightSection/RightSection.module.css";
import consoleStyles from "../components/LeftSection/components/Console.module.css";
import Split from "react-split";
import "@/pages/Visualization/gutter.css";
const StaticVisualization = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Mock Header */}
      <header
        className={headerStyles["bg-blue"]}
        style={{
          height: "68px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #e0e0e0",
          justifyContent: "space-between",
        }}
      >
        <div className={headerStyles["header-menu"]}>
          <div className={headerStyles["header-logo"]}>
            <img src="/image/img_logo.png" alt="로고" style={{ height: "32px" }} />
          </div>
        </div>
        <div className="login-header" style={{ display: "flex" }}>
          <div>
            <a href="/login" className={headerStyles["login-btn"]}>
              로그인
            </a>
            <a href="/signup" className={headerStyles["join-btn"]}>
              회원가입
            </a>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <Split
            sizes={[30, 70]}
            minSize={100}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
            style={{ display: "flex", width: "100%", height: "100%" }}
          >
            {/* Left Section */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div className={leftStyles["top-bar"]}>
                <p className={leftStyles["view-section-title"]}>코드 작성</p>
                <div className="flex items-center gap-4">
                  <div className="tutorial-button">
                    {/* Dropdown Mock */}
                    <div className={leftStyles["select-box"]}>
                      <div className={leftStyles["default-option"]}>
                        <button style={{ color: "#181818" }}>커리큘럼</button>
                        <img src="/image/icon_down_arrow.svg" alt="arrow" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Split
                sizes={[60, 40]}
                gutterSize={30}
                gutterAlign="center"
                dragInterval={1}
                direction="vertical"
                cursor="row-resize"
                style={{ display: "flex", flexDirection: "column", height: "94%", flex: 1, overflow: "hidden" }}
              >
                {/* Editor Mock */}
                <div
                  style={{ width: "100%", height: "100%", overflow: "hidden", padding: "10px", display: "flex" }}
                ></div>
                {/* Console Mock */}
                <div className={consoleStyles["console-wrapper"]}>
                  <div className={consoleStyles["view-section1-2"]}>
                    <p className={consoleStyles["view-section-title"]}>콘솔</p>
                    <textarea
                      className={consoleStyles["input-area"]}
                      placeholder="input()을 사용하는 경우 입력해주세요."
                      readOnly
                    />
                  </div>
                </div>
              </Split>
            </div>

            {/* Right Section */}
            <div style={{ display: "flex", flexDirection: "column", flex: "1" }}>
              <div className={controlStyles["top-bar"]}>
                <p className={controlStyles["view-section-title"]}>시각화</p>
                <div className={controlStyles["play-wrap"]}>
                  <div>
                    <button className={controlStyles["view-btn"]}>
                      <img src="/image/icon_play_w.svg" alt="" />
                      시각화
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <button className={controlStyles["playcode-btn"]}>
                        <img src="/image/icon_play_w.svg" alt="" />
                        결과보기
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="controller tutorial-button">
                      <button>
                        <img src="/image/icon_play_back.svg" alt="뒤로" />
                      </button>
                      <button className="ml8">
                        <img src="/image/icon_play.svg" alt="재생" />
                      </button>
                      <button className="ml8">
                        <img src="/image/icon_play_next.svg" alt="다음" />
                      </button>
                    </div>
                    <p className="ml14 fz14">(0/0)</p>
                    <div className="controller tutorial-button">
                      <p className="ml24 fz14">Play Speed</p>
                      <select className="s__select ml14" defaultValue="1x">
                        <option value="1x">1X</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <Split
                sizes={[50, 50]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                style={{ display: "flex", flexDirection: "row", height: "100%", flex: 1, overflow: "hidden" }}
              >
                <div id="split-2-1" className="view-section2-1">
                  <div className="view-data">
                    <p className="data-name">코드흐름</p>
                    <div style={{ width: "600px", display: "flex", flexDirection: "column", flex: 1 }}></div>
                  </div>
                </div>
                <div id="split-2-2" className="view-section2-2">
                  <div className="view-data">
                    <p className="data-name">콜스택</p>
                    <ul className="var-list"></ul>
                  </div>
                </div>
              </Split>
            </div>
          </Split>
        </div>
      </main>
    </div>
  );
};

export default StaticVisualization;
