import styles from "./index.less";
import HeaderSearch from "@/components/HeaderSearch";
import Footer from "@/components/Footer";
import Card from "./components/card";
import { CardItem } from "./type";

const cardList: CardItem[] = [
  {
    imgUrl: require("@/assets/images/03-2.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-3.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-4.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-5.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-6.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-7.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
  {
    imgUrl: require("@/assets/images/03-8.png"),
    content:
      "Mxnsters, a collection from GHXSTS. The Mxnster Cards allow you to secure 1s from the uocomina cal.,",
    owned: "10",
    borrowed: "2",
    gameList: [
      {
        gameImg: require("@/assets/images/game-list-1.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-2.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-3.png"),
      },
      {
        gameImg: require("@/assets/images/game-list-4.png"),
      },
    ],
  },
];

export default function MyNftCollectionsPage() {
  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className={styles["my-collections"]}>
      <HeaderSearch bgColor="#1C1C1C"></HeaderSearch>
      <div className="collections-page">
        <div className={styles["nfts-title"]}>
          <p>My NFT</p>&nbsp;&nbsp;<span> Collections</span>
        </div>
        <div className={styles.cardWrap}>
          {cardList.map((item, index) => (
            <Card key={index} cardItem={item}></Card>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
