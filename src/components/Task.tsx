import React, { useState } from "react";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import Rating from "./Rating";
import styles from "./Task.module.css";
import type { TaskType } from "./TaskList";

type FileType = {
  name: string;
  url: string;
};

type TaskProps = {
  task: TaskType & { files?: FileType[] };
  isMenuOpen: boolean;
  onToggleMenu: (id: number) => void;
  onDelete: (id: number) => void;
  onRate: (id: number, rating: number) => void;
  onHover: (id: number, rating: number) => void;
  onLeave: (id: number) => void;
  menuRef: (el: HTMLUListElement | null) => void;
};

const Task: React.FC<TaskProps> = ({
  task,
  isMenuOpen,
  onToggleMenu,
  onDelete,
  onRate,
  onHover,
  onLeave,
  menuRef,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnswerExpanded, setIsAnswerExpanded] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const openImageModal = (src: string) => {
    setModalImage(src);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  const headerBgClass = () => {
    switch (task.type) {
      case 'Learn':
        return styles.learnHeaderBg;
      case 'Develop':
        return styles.developHeaderBg;
      case 'Blog':
        return styles.blogHeaderBg;
      default:
        return ''; 
    }
  };

  return (
    <li className={styles.taskItem}>
      <div className={`${styles.taskHeaderTop} ${headerBgClass()}`}> 
 <div className={styles.cont_IconDel}>
        <div className={styles.taskTypeIndicator}>
          {task.type === 'Learn' && <span className={styles.learnType}>Learn</span>}
          {task.type === 'Develop' && <span className={styles.developType}>Develop</span>}
          {task.type === 'Blog' && <span className={styles.blogType}>Blog</span>}
        </div>
           <button
            className={styles.menuButton}
            onClick={() => onToggleMenu(task.id)}
            aria-label="Open menu"
          >
            <MoreVertical size={20} />
          </button>
         </div>
          <div className={styles.leftWithIcon}>
            <img
              src="src/media/word.png"
              alt="Task Icon"
              className={styles.docimg}
            />
            <div className={styles.cont_task_title}>
              <span className={styles.taskTitle}>{task.title}</span>
              <div className={styles.taskHeaderBottom}>
                <div className={styles.taskDate}>
                  {task.createdAt ? formatDate(task.createdAt.toString()) : "No creation date"}
                </div>
              </div>
            </div>
          </div>

       
      

        {isMenuOpen && (
          <ul className={styles.dropdownMenu} ref={menuRef}>
            <li
              onClick={() => onDelete(task.id)}
              className={styles.dropdownItem}
              role="menuitem"
            >
              Delete
            </li>
          </ul>
        )}
      </div>

      <hr className={styles.divider} />

      <div
        className={`${styles.taskContent} ${!isExpanded ? styles.collapsed : ""}`}
        id={`task-content-${task.id}`}
      >
        {task.content || "No description provided"}
      </div>

      {task.content && (
        <div className={styles.toggleButtonLes}>
          <button
            className={styles.toggleButton}
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls={`task-content-${task.id}`}
          >
            {isExpanded ? (
              <ChevronUp style={{ stroke: "#216088" }} size={35} />
            ) : (
              <ChevronDown style={{ stroke: "#216088" }} size={35} />
            )}
          </button>
        </div>
      )}

     

      <div className={styles.cont_Answer}>
        <div className={styles.cont_status}><p className={styles.psb}>Status</p><span className={styles.separator}>|</span><p className={styles.psl}> Completed by John Doe</p></div>
        {task.answer && (
          <button
            className={styles.toggleButton}
            onClick={() => setIsAnswerExpanded((prev) => !prev)}
            aria-expanded={isAnswerExpanded}
            aria-controls={`task-answer-${task.id}`}
          >
            {isAnswerExpanded ? "Hide" : "Show Answer"}
          </button>
        )}
      </div>

      {task.answer && isAnswerExpanded && (
        <>
        
          <div
            className={styles.answerSection}
            id={`task-answer-${task.id}`}
            aria-live="polite"
          >
            <div className={styles.leftWithIcon}>
              <img
                src="src/media/user.jpg"
                alt="User Icon"
                className={styles.userimg}
              />
              <div className={styles.cont_task_title}>
                <span className={styles.taskTitleAnswer}>John Doe</span>
                <div className={styles.taskHeaderBottom}>
                  <div className={styles.taskDateAnswer}>
                    {task.answeredAt ? formatDate(task.answeredAt) : "No answer date"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.taskContent}>{task.answer}</div>

            <div className={styles.answerExtras}>
              <div className={styles.screenshotsSection}>
                <p className={styles.pab}>Screenshots</p>
                <div className={styles.screensGrid}>
                  {task.answerImages && task.answerImages.length > 0 ? (
                    task.answerImages.map((src, i) => (
                      <div
                        key={i}
                        className={styles.screenshotBox}
                        onClick={() => openImageModal(src)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open screenshot ${i + 1}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            openImageModal(src);
                          }
                        }}
                      >
                        <img
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          className={styles.screenshotImg}
                        />
                        <div className={styles.overlayPlus}>+</div>
                      </div>
                    ))
                  ) : (
                    <p>No screenshots available</p>
                  )}
                 
                </div>
              </div>

              <div className={styles.filesSection}>
                <p className={styles.pab}>Files</p>
                <ul className={styles.fileList}>
                  {task.files && task.files.length > 0 ? (
                    task.files.map((file, idx) => (
                      <li key={idx} className={styles.fileItem}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li>No files attached</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

   

      <div className={`${styles.cont_task_rating}`} >
       <Rating
  rating={task.rating || 0}
  setRating={(r) => onRate(task.id, r)} 
/>
        <p className={styles.pbs}>
          Please Complete Before: {task.deadline ? formatDate(task.deadline) : "No deadline set"}
        </p>
      </div>

      {modalImage && (
        <div
          className={styles.imageModal}
          onClick={closeImageModal}
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot preview"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeImageModal();
          }}
        >
          <img src={modalImage} alt="Screenshot preview" className={styles.modalImage} />
        </div>
      )}
    </li>
  );
};

export default Task;