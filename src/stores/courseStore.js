import { createStore } from 'vuex';

const courseStore = createStore({
    state: {
        courses: []
    },
    mutations: {
        setCourses(state, courses) {
            state.courses = courses;
        },
        addCourse(state, course) {
            state.courses.push(course);
        },
        removeCourse(state, courseId) {
            state.courses = state.courses.filter(course => course.id !== courseId);
        }
    },
    actions: {
        fetchCourses({ commit }) {
            // Fetch courses from an API or other source
            const courses = [
                { id: 1, name: 'Course 1' },
                { id: 2, name: 'Course 2' }
            ];
            commit('setCourses', courses);
        },
        createCourse({ commit }, course) {
            // Add course to the state
            commit('addCourse', course);
        },
        deleteCourse({ commit }, courseId) {
            // Remove course from the state
            commit('removeCourse', courseId);
        }
    },
    getters: {
        allCourses: state => state.courses,
        courseById: state => id => state.courses.find(course => course.id === id)
    }
});

export default courseStore;
