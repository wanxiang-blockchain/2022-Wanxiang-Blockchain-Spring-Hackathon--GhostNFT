import classNames from "classnames";
import styles from "./index.less";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import { Link } from "umi";

export default function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.banner}>
        <HeaderMenu></HeaderMenu>
        <div className={styles["banner-content"]}>
          <h1>
            Bring <span>SAFETY</span> and <span>EFFICIENTY</span>
            <br /> to NFTs Lending.
          </h1>
          <h2>
            A decentralized marketplace enabling *COLLATERAL-FREE*,
            <br />
            *NON-OWNERSHIP-TRANSFER* NFT rentals.
          </h2>
          <div>
            <Link to="/Explore">
              <button className={classNames(styles["btn-one"], "fill-button")}>
                Enter App
              </button>
            </Link>
            <button className={classNames(styles["btn-two"], "no-fill-button")}>
              Learn More
            </button>
          </div>
        </div>
        <div className={classNames(styles["banner-bottom"], "f-c")}>
          <div
            className={classNames(
              styles["rect-one"],
              styles["no-fill-button-rect"],
              "f-c"
            )}
          >
            <div>
              <h2>$1.12</h2>
              <p>$GSTN Price</p>
            </div>
          </div>
          <div
            className={classNames(
              styles["rect-one"],
              styles["no-fill-button-rect"],
              "f-c"
            )}
          >
            <div>
              <h2>128</h2>
              <p>Collections Integrated</p>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
