import Link from "next/link";
import styles from "./Card.module.css";

type CardProps = {
  title: string;
  description: string;
  href: string;
  cta?: string;
};

export default function Card({
  title,
  description,
  href,
  cta = "Open →",
}: CardProps) {
  return (
    <Link href={href} className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      <p className={styles.description}>{description}</p>

      <div className={styles.button}>{cta}</div>
    </Link>
  );
}