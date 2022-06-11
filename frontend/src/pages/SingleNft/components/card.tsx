import styles from "./card.less";
import { CardItem } from "../type";
import { Link } from "umi";

export default function SingleNftCard(props: { cardItem: CardItem }) {
  return (
    <div className={styles.cardItem}>
      <Link
        to={{ pathname: "/rentpage", state: { tokenid: props.cardItem.id } }}
      >
        <img src={props.cardItem.imgUrl} alt="icon" />
      </Link>
      <div className={styles.cardContent}>
        <div>
          <h3>TokenID</h3>
          <p>{props.cardItem.id}</p>
        </div>
        <div>
          <h3>Expiration</h3>
          <p>{props.cardItem.expiration}</p>
        </div>
        <div>
          <h3>Countdown</h3>
          <p>{props.cardItem.countdown}</p>
        </div>
        <div>
          <h3>Rent</h3>
          <p>{props.cardItem.rent}</p>
        </div>
        <div>
          <h3>Owner</h3>
          <p>{props.cardItem.owner}</p>
        </div>
      </div>
    </div>
  );
}
