import React, { useState, useRef, useEffect } from "react";
import { Plus, Circle, Star } from "lucide-react";
import Task from "./Task";
import styles from "./TaskList.module.css";

import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export type TaskType = {
  id: number;
  title: string;
  createdAt: Date;
  content?: string;
  answer?: string;
  answeredAt?: string;
  deadline?: string;
  rating?: number;
  hoverRating?: number;
  answerImages?: string[];
  files?: { name: string; url: string }[];
  type: 'Learn' | 'Develop' | 'Blog';
};

type TaskListProps = {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const menuRefs = useRef<{ [key: number]: HTMLUListElement | null }>({});

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuOpenId !== null &&
      menuRefs.current[menuOpenId] &&
      !menuRefs.current[menuOpenId]?.contains(event.target as Node)
    ) {
      setMenuOpenId(null);
    }
  };

  const saveAllRatings = async () => {
    try {
      const ratingsToSave = tasks.filter((t) => typeof t.rating === "number");

      const savePromises = ratingsToSave.map((task) =>
        setDoc(doc(db, "ratings", task.id.toString()), {
          rating: task.rating,
          updatedAt: new Date().toISOString(),
        })
      );

      await Promise.all(savePromises);
      alert("Ratings Saved Successfully!");
    } catch (error) {
      console.error("Error while saving:", error);
      alert("Error Saving Grades");
    }
  };

  useEffect(() => {
    const fetchRatingsFromFirebase = async () => {
      try {
        const ratingsCollection = collection(db, "ratings");
        const ratingsSnapshot = await getDocs(ratingsCollection);

        const ratingsMap: { [taskId: number]: number } = {};

        ratingsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data && typeof data.rating === "number") {
            const taskIdNum = Number(doc.id);
            if (!isNaN(taskIdNum)) {
              ratingsMap[taskIdNum] = data.rating;
            }
          }
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) => ({
            ...task,
            rating: ratingsMap[task.id] ?? task.rating,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch ratings from Firebase:", error);
      }
    };

    fetchRatingsFromFirebase();
  }, [setTasks]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);



  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setMenuOpenId(null);
  };



  const rateTask = (id: number, rating: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, rating, hoverRating: undefined } : t
      )
    );
  };

  const handleMouseEnter = (id: number, r: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, hoverRating: r } : t)));
  };

  const handleMouseLeave = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, hoverRating: undefined } : t
      )
    );
  };

  const averageRating = (() => {
    const ratedTasks = tasks.filter((t) => typeof t.rating === "number");
    if (ratedTasks.length === 0) return 0;
    const total = ratedTasks.reduce((acc, t) => acc + (t.rating || 0), 0);
    return total / ratedTasks.length;
  })();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => typeof t.rating === "number" && (t.rating || 0) >= 3
  ).length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getProgressColor = () => {
    if (progress >= 80) return "#185390";
    if (progress >= 50) return "#0078d4";
    return "#34a7ffff";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.menuContainer}>
        <nav className={styles.menu}>
          <a href="#" className={`${styles.navLink} ${styles.active} ${styles.dataPlatformLink}`}>
            Practice Data
          </a>
          <span className={styles.separator}>|</span>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Products

              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Downloads
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Community
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Resources

              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Developer
              </a>
            </li>
            <li className={styles.navItem}>
              <a href="#" className={styles.navLink}>
                Partner

              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.titlebg}>
        <div className={styles.cont_title}>
          <h1 className={styles.listTitle}>React Vite Practice once</h1>
          <p className={styles.Titel_tag_p}>Choose your path and know that everything is in your hands, trust yourself, stay true to your values, and move forward with courage.</p>
        </div>

        <div className={styles.cont_reating}>
          <p className={styles.Titel_tag_p} style={{ marginRight: "1rem" }}>
            Oleksandr Doroshkevych
          </p>
          <div className={styles.cont_rating}>
            <p className={styles.Titel_tag_p} style={{ marginRight: "1rem" }}>
              Grade
            </p>
            {averageRating === 0 ? (
              <span className={styles.unratedText}>Not rated yet</span>
            ) : (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i <= averageRating ? styles.taskIcon : styles.taskIconSmall
                    }
                    fill={i <= averageRating ? "#ffffffff" : "none"}
                    strokeWidth={1.5}
                  />
                ))}
              </>
            )}
            <p className={styles.pt} style={{ marginLeft: "1rem" }}>
              <span style={{ fontWeight: 500 }}>{averageRating.toFixed(1)}</span>
            </p>
          </div>
        </div>


      </div>
      <div className={styles.cont_horizontalList}>
        <ul className={styles.horizontalList}>
          <p className={styles.psort}>Sort by</p>
          <li>Date</li>
          <li>Reviewed</li>
          <li>Overdue</li>

        </ul>
      </div>
      <div className={styles.content_conteiner}>
        <div className={styles.cont_mainuser}>
          <div className={styles.mainuser}>
            <div className={styles.cont_mainuser_title}>
              <img
                className={styles.userimg}
                src="/media/user.jpg"
                alt="User Main Avatar"
              />
              <div className={styles.cont_mainuser_title_p}>
                <p className={styles.pb}>User Name</p>
                <p className={styles.ps}>Qualification Status</p>
              </div>
            </div>
            <div className={styles.cont_mainuser_title_on}>
              <p className={styles.ps}>Online</p>
              <Circle size={15} className={styles.taskIconOnline} />
            </div>
          </div>
          <hr className={styles.divider} />
          <div className={styles.progressSection}>
            <p className={styles.ps}>Progress: {progress}%</p>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                }}
              ></div>
            </div>
          </div>
        </div>

        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              isMenuOpen={menuOpenId === task.id}
              onToggleMenu={(id) => setMenuOpenId(menuOpenId === id ? null : id)}
              onDelete={deleteTask}
              onRate={rateTask}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              menuRef={(el) => (menuRefs.current[task.id] = el)}
            />
          ))}
        </ul>

        <button
          className={styles.addButton}
          onClick={saveAllRatings}
          aria-label="Confirm sending ratings"
        >
          <p className={styles.psb}>SEND RESULTS</p>
        </button>
      </div>
    </div>
  );
};
export default TaskList;