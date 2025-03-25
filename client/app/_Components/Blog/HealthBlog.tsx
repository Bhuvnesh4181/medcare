"use client"; 

import React, { useEffect, useState } from "react";
import styles from "./HealthBlog.module.css";
import Link from "next/link";

const blogs = [
  {
    title: "10 Tips for a Healthy Lifestyle",
    description: "Simple steps to improve your overall well-being and stay fit.",
    link: "https://www.healthline.com/nutrition/10-healthy-lifestyle-tips",
  },
  {
    title: "The Importance of Mental Health",
    description: "Why taking care of your mind is just as important as your body.",
    link: "https://www.verywellmind.com/importance-of-mental-health-5092459",
  },
  {
    title: "Best Superfoods for Immunity Boost",
    description: "A guide to the top foods that help strengthen your immune system.",
    link: "https://www.medicalnewstoday.com/articles/322412",
  },
  {
    title: "Exercise Routines for All Ages",
    description: "Workout plans tailored for different age groups and fitness levels.",
    link: "https://www.self.com/story/best-workouts-for-every-age",
  },
];

const HealthBlog = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Health Blog</h1>
      <p className={styles.subtext}>Stay informed with the latest health tips and insights.</p>
      <div className={styles.blogList}>
        {blogs.map((blog, index) => (
          <div key={index} className={styles.card}>
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
            <Link href={blog.link} target="_blank" className={styles.link}>
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;