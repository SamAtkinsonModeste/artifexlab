import React from "react";
import styles from "../styles/Avatar.module.css";
import uniStyles from "../styles/UniversalDesign.module.css";

const Avatar = ({ src, height = 45, text }) => {
  const defaultAvatar =
    "https://res.cloudinary.com/dpnxbddic/image/upload/v1/media/../default_profile_us7dxw_phmfan.jpg";

  return (
    <div className={`${styles.AvatarWrapper} ${uniStyles.bgMainGradient}`}>
      <span>
        <img
          className={styles.Avatar}
          src={src || defaultAvatar}
          height={height}
          width={height}
          alt="avatar"
        />
        {text}
      </span>
    </div>
  );
};

export default Avatar;
