import styles from "./loading-state.module.css"

export default function LoadingState() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading weather data...</p>
    </div>
  )
}
