export const KEY = 'godot-battle-lab.v1';
export function emptyState() {
  return {version:1, last:null, active:{}, responses:{}, completed:[]};
}
export function readProgress(raw, lessons) {
  const state = emptyState();
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1) return state;
    for (const lesson of lessons) {
      const id = lesson.id;
      const keys = [...lesson.steps.map(step => step.id), 'quiz'];
      if (data.last === id) state.last = id;
      if (keys.includes(data.active?.[id])) state.active[id] = data.active[id];
      const answers = {};
      for (const key of keys) {
        const value = data.responses?.[id]?.[key];
        if (key === 'quiz' ? Number.isInteger(value) && value >= 0 && value < lesson.options.length : value === true) answers[key] = value;
      }
      for (const step of lesson.steps.filter(s => s.host)) {
        for (const role of ['host','guest']) {
          const key = step.id+'-'+role;
          const value = data.responses?.[id]?.[key];
          if (typeof value === 'boolean') answers[key] = value;
        }
      }
      state.responses[id] = answers;
      if (Array.isArray(data.completed) && data.completed.includes(id) && ready(lesson,answers)) state.completed.push(id);
    }
  } catch {}
  return state;
}
export function ready(lesson, answers = {}) {
  return lesson.steps.every(step => answers[step.id] === true) && answers.quiz === lesson.answer;
}
