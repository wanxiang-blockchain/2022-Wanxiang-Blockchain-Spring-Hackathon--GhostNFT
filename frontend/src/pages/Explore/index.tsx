import styles from "./index.less";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import { Tabs } from "antd";
import Card from "./components/card";
import { CardItem } from "./type";
import { Link } from "umi";

const { TabPane } = Tabs;

const cardList: CardItem[] = [
  {
    imgUrl: require("@/assets/images/02-1.png"),
    gameName: "Mxnsters",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-2.png"),
    gameName: "Mxnsters",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-3.png"),
    gameName: "Bryan Norman",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-4.png"),
    gameName: "Bryan Norman",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-5.png"),
    gameName: "Bryan Norman",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-6.png"),
    gameName: "Bryan Norman",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
  {
    imgUrl: require("@/assets/images/02-7.png"),
    gameName: "Bryan Norman",
    userName: "GxngYangNFT",
    description:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.",
  },
];

export default function ExplorePage() {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className={styles["my-explore"]}>
      <Link to="/home">
        <HeaderSearch bgColor="#1C1C1C"></HeaderSearch>
      </Link>
      <div className="explore-page">
        <div className={styles.nftsTitle}>
          <p>Explore</p>&nbsp;&nbsp;<span>Collections</span>
        </div>
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="Trending" key="1">
            <div className={styles.cardWrap}>
              {cardList.map((item, index) => (
                <Card key={index} cardItem={item}></Card>
              ))}
            </div>
          </TabPane>
          <TabPane tab="Top" key="2"></TabPane>
          <TabPane tab="Art" key="3"></TabPane>
          <TabPane tab="Collectibles" key="4"></TabPane>
          <TabPane tab="Domain Names" key="5"></TabPane>
          <TabPane tab="Music" key="6"></TabPane>
          <TabPane tab="Photography" key="7"></TabPane>
          <TabPane tab="Sports" key="8"></TabPane>
          <TabPane tab="Trading Cards" key="9"></TabPane>
        </Tabs>
      </div>
      <Footer></Footer>
    </div>
  );
}
