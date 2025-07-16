import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Subtask from "../components/Subtask";
import SubtaskForm from "../components/SubtaskForm";

function Detail() {
  const { id } = useParams(); // 프로젝트 ID
  const navigate = useNavigate();
  const [project, setProject] = useState(null); // 해당 프로젝트
  const [showForm, setShowForm] = useState(false);

  // 해당 프로젝트 불러오기
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const found = projects.find((p) => String(p.id) === id);
    if (found) {
      setProject(found);
    } else {
      alert("프로젝트를 찾을 수 없습니다.");
      navigate("/home");
    }
  }, [id, navigate]);

  // 프로젝트 저장 함수
  const updateProjectInStorage = (updatedProject) => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const newProjects = projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );
    localStorage.setItem("projects", JSON.stringify(newProjects));
  };

  const handleAddSubtask = (newSubtask) => {
    const updated = {
      ...project,
      subtasks: [...(project.subtasks || []), { id: Date.now(), ...newSubtask }],
    };
    setProject(updated);
    updateProjectInStorage(updated);
    setShowForm(false);
  };

  const editSubtask = (updatedSubtask) => {
    const updated = {
      ...project,
      subtasks: project.subtasks.map((s) =>
        s.id === updatedSubtask.id ? updatedSubtask : s
      ),
    };
    setProject(updated);
    updateProjectInStorage(updated);
  };

  const deleteSubtask = (id) => {
    const updated = {
      ...project,
      subtasks: project.subtasks.filter((s) => s.id !== id),
    };
    setProject(updated);
    updateProjectInStorage(updated);
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← 뒤로가기</button>
      <h1>{project.title}</h1>
      <h2>마감일: {project.deadline}</h2>
      <h2>{project.progress}%</h2>

      {showForm && (
        <SubtaskForm
          onSubmit={handleAddSubtask}
          onClose={() => setShowForm(false)}
        />
      )}

      <ul>
        {project.subtasks?.map((subtask) => (
          <Subtask
            key={subtask.id}
            subtask={subtask}
            onDeleteSubtask={deleteSubtask}
            onEditSubtask={editSubtask}
          />
        ))}
      </ul>

      <button onClick={() => setShowForm(true)}>세부 목표 추가</button>

    </div>
  );
}

export default Detail;
