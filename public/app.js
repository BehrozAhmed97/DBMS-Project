function App() {
    return {
      
        years: [],
        semesters: [],
        classes: [],
        courses: [],

       
        selectedYear: "",
        selectedSemester: "",
        selectedClass: "",
        selectedRid: "",
        analysisData: null,

        
        async init() {
            try {
                this.years = await fetch("/api/years").then(res => res.json());
            } catch (err) {
                console.error("Error loading initial years drop-down context:", err);
            }
        },

    
        async handleYearChange(year) {
            this.selectedYear = year;
           
            this.selectedSemester = "";
            this.selectedClass = "";
            this.selectedRid = "";
            this.semesters = [];
            this.classes = [];
            this.courses = [];
            this.analysisData = null;

            if (!year) return;

            try {
                this.semesters = await fetch(`/api/semesters-by-year?year=${year}`).then(res => res.json());
            } catch (err) {
                console.error("Error reading semester list:", err);
            }
        },

        // Triggered when a semester is selected
        async handleSemesterChange(semester) {
            this.selectedSemester = semester;
            this.selectedClass = "";
            this.selectedRid = "";
            this.classes = [];
            this.courses = [];
            this.analysisData = null;

            if (!semester) return;

            try {
                this.classes = await fetch(`/api/classes-by-semester?year=${this.selectedYear}&semester=${semester}`)
                    .then(res => res.json());
            } catch (err) {
                console.error("Error reading classes list:", err);
            }
        },

        // Triggered when a class/batch is selected
        async handleClassChange(classBatch) {
            this.selectedClass = classBatch;
            this.selectedRid = "";
            this.courses = [];
            this.analysisData = null;

            if (!classBatch) return;

            try {
                this.courses = await fetch(`/api/courses-by-class?year=${this.selectedYear}&semester=${this.selectedSemester}&classBatch=${classBatch}`)
                    .then(res => res.json());
            } catch (err) {
                console.error("Error reading courses list:", err);
            }
        },

        // Triggered when a course is selected
        async handleCourseChange(rid) {
            this.selectedRid = rid;
            this.analysisData = null;

            if (!rid) return;

            try {
                this.analysisData = await fetch(`/api/recap-analysis/${rid}`).then(res => res.json());
            } catch (err) {
                console.error("Error calculating grade metrics:", err);
            }
        }
    };
}