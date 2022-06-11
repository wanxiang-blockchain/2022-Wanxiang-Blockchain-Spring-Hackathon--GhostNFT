import classNames from "classnames";
import styles from "./index.less";
import logoSrc from "@/assets/images/logo-big.svg";
import twiterSrc from "@/assets/images/twiter.svg";
import githubSrc from "@/assets/images/github.svg";
import facebook from "@/assets/images/facebook.svg";

export default function FooterPage() {
  return (
    <footer className={classNames(styles.footer, "f-m")}>
      <div className={classNames(styles["footer-content"], "f-v")}>
        <div className={styles["footer-left"]}>
          <img className={styles.logo} src={logoSrc} alt="logo" />
          <div className={styles["footer-left-text"]}>
            <h2>Bring SAFETY and EFFICIENCY to NFTs Lending.</h2>
            <h3>
              A decentralized marketplace enabling *COLLATERAL-FREE*,
              <br />
              *NON-OWNERSHIP-TRANSFER* NFT rentals.
            </h3>
          </div>
          <div className={classNames(styles["icon-box"], "f-v")}>
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
        <div className={classNames(styles["footer-right"], "f-m")}>
          <div className={styles["footer-list"]}>
            <h2>SUPPORT</h2>
            <ul>
              <li>Tutorials</li>
              <li>Documentation</li>
              <li>Discord</li>
              <li>Forum</li>
            </ul>
          </div>
          <div className={styles["footer-list"]}>
            <h2>PROTOCOL</h2>
            <ul>
              <li>Vote</li>
              <li>Create a Pair</li>
              <li>Register for Onsen</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
