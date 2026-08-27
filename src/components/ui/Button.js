"use client";

import Link from "next/link";
import styles from "./Button.module.css";

export default function Button({
  as,
  href,
  variant = "primary",
  size,
  block,
  className = "",
  children,
  ...rest
}) {
  const classes = [
    styles.btn,
    styles[variant],
    size ? styles[size] : "",
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const Component = as || "button";
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
