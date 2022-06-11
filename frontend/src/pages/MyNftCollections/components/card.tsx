import styles from "./card.less";
import { CardItem } from "../type";
import { Key } from "react";

export default function SingleNftCard(props: { cardItem: CardItem }) {
  return (
    <div className={styles.cardItem}>
      <img src={props.cardItem.imgUrl} alt="icon" />

      <div className={styles.cardBox}>
        <div className={styles.cardContent}>{props.cardItem.content}</div>
        <div className={`${styles.cardNum} f-s`}>
          <div className="f-c">
            <h3>Owned</h3>
            <p>{props.cardItem.owned}</p>
          </div>
          <div className="f-c">
            <h3>Borrowed</h3>
            <p>{props.cardItem.borrowed}</p>
          </div>
        </div>
        <div className={styles.gameList}>
          <h3>Game List</h3>
          <div>
            {props.cardItem.gameList.map(
              (ele: { gameImg: string | undefined }, index: number) => (
                <img key={index} src={ele.gameImg} alt="" />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
