import React from "react";
import styles from "./NavBar.module.css";
import ThemeChanger from "../ThemeChanger/ThemeChanger";

const NavBar = () => {
  return (
    <nav className={styles.nav}>
      <h2 className={styles.title}>Note-It</h2>
      <ThemeChanger />
    </nav>
  );
};

export default NavBar;
