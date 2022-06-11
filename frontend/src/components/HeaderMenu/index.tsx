import styles from "./index.less";
import { Link } from "umi";
import classNames from "classnames";
import logoSrc from "@/assets/images/logo-small.svg";
import twiterSrc from "@/assets/images/twiter.svg";
import githubSrc from "@/assets/images/github.svg";
import facebook from "@/assets/images/facebook.svg";

export default function HeaderMenu() {
  return (
    <header className={classNames(styles["header-menu"], "f-c")}>
      <div className={classNames(styles["header-content"], "f-c")}>
        <img className={styles.logo} src={logoSrc} alt="logo" />
        <ul className={styles.list}>
          <li>
            <Link to="/home">HOME</Link>
          </li>
          <li>
            <Link to="/home">ABOUT</Link>
          </li>
          <li>
            <Link to="/home">ROADMAP</Link>
          </li>
          <li>
            <Link to="/home">TOKENOMICS</Link>
          </li>
          <li>
            <Link to="/home">NEWS</Link>
          </li>
        </ul>
        <div className={classNames(styles["icon-box"], "f-c")}>
          <a>
            <img src={twiterSrc} alt="icon" />
          </a>
          <a>
            <img src={githubSrc} alt="icon" />
          </a>
          <a>
            <img src={facebook} alt="icon" />
          </a>
        </div>
      </div>
    </header>
  );
}
