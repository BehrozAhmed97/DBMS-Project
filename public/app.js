function App() {
  return {
    courses: [],
    async getCourses() {
      const response = await fetch("/api/courses").then((res) => res.json());
      this.courses = response;
      console.log(this.courses);
    },
  };
}