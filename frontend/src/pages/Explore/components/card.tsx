import styles from "./card.less";
import { CardItem } from "../type";
import { Link } from "umi";

export default function ExploreCard(props: { cardItem: CardItem }) {
  return (
    <Link to="/SingleNft">
      <div className={styles.cardItem}>
        <img src={props.cardItem.imgUrl} alt="icon" />
        <div className={styles.cardContent}>
          <div className={styles.nameBox}>
            <p>{props.cardItem.gameName}</p>
            <span>
              by <em>{props.cardItem.userName}</em>
            </span>
          </div>
          <div>{props.cardItem.description}</div>
        </div>
      </div>
    </Link>
  );
}
