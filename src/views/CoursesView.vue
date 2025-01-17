<template>
    <main>
        <div>
            <h1>Courses Management</h1>

            <div class="mt-10 ml-10">
                <form @submit.prevent="addCourse">
                    <h3>Create new course</h3>
                    <div class="mb-4">
                        <label for="title">Course Title</label>
                        <input type="text" name="title" id="title" v-model="newCourse.title"
                            placeholder="Enter the course title here.." required />
                    </div>
                    <div class="mb-4">
                        <label for="desc">Course Description</label>
                        <textarea id="desc" name="desc" rows="3" cols="33" v-model="newCourse.description"
                            placeholder="Enter the course description.." required></textarea>
                    </div>
                    <div class="container">
                        <div class="input-group">
                            <label for="date" class="mb-1 test-gray-700 font-medium">Date</label>
                            <input type="date" id="date"
                                class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                v-model="selectedDate">
                        </div>
                        <div class="input-group">
                            <label for="time" class="mb-1 test-gray-700 font-medium">Time</label>
                            <input type="time" id="time"
                                class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                v-model="selectedTime">
                        </div>
                    </div>
                    <div class="container">
                        <div class="input-group">
                            <label for="number" class="mb-1 test-gray-700 font-medium">No. Participants</label>
                            <input type="number" id="number"
                                class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                v-model="newCourse.max_participants" placeholder="Enter the number of participants" />
                        </div>
                        <div class="input-group">
                            <label for="file" class="mb-1 test-gray-700 font-medium">Resources</label>
                            <input id="file" name="file" class="uploadFile" type="file" @change="handleFileUpload" />
                        </div>

                    </div>
                    <div class="container">

                        <div class="input-group">
                            <label for="collabMentor" class="mb-1 test-gray-700 font-medium">Collaborating
                                Mentors</label>
                            <input id="collabMentor" name="collabMentor" type="text" v-model="searchQuery"
                                placeholder="Search mentor..." />
                            <select v-model="mentorList">
                                <option value="">Mentors</option>
                                <option v-for="mentor in mentors" :key="mentor.id" :value="mentor.id">
                                    {{ mentor.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <button class="green-btn" type="submit">Create Course</button>
                </form>
            </div>
        </div>

        <div class="mt-10">
            <h3>All Courses</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <!-- <th>Mentors</th> -->
                        <th>Time</th>
                        <th>Date</th>
                        <th>Max Participants</th>
                        <th>Resources</th>
                        <th>Collaborating Mentors</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in courses" :key="course.id">
                        <td style="text-align: left;">{{ course.title }}</td>
                        <td style="text-align: left;">{{ course.description }}</td>
                        <!-- <td>{{ course.mentor_id }}</td> -->
                        <td>{{ course.time }}</td>
                        <td>{{ course.date }}</td>
                        <td>{{ course.max_participants }}</td>
                        <td>{{ course.resources }}</td>
                        <td>{{ course.collaborating_mentors }}</td>
                        <td>
                            <button @click="setEditing(course.id)" class="green-btn">Edit</button>
                            <button @click="deleteCourse(course.id)" class="red-btn">Delete</button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
    setup() {
        const selectedDate = ref('');
        const selectedTime = ref('');

        return {
            selectedDate,
            selectedTime
        };
    },
    data() {
        return {
            courses: [],
            newCourse: {
                title: "",
                description: "",
                mentor_id: "",
                time: "",
                date: "",
                max_participants: "",
                resources: "",
                collaborating_mentors: ""
            },
            editingCourseId: null, // Track the course ID being edited
            mentors: [],
            mentorList: [],
            searchQuery: '',
        };
    },
    created() {
        this.fetchCourses();
    },
    methods: {
        async fetchCourses() {
            try {
                const response = await axios.get('http://mentor.test/api/courses');
                console.log('API response:', response.data); // Debugging: Check the API response
                this.courses = await response.data;
            } catch (error) {
                console.error('Error fetching courses:', error.message);
                alert('Failed to fetch courses data. Please check the API and try again.');
            }
        },
        async addCourse() {
            try {
                const response = await axios.post('http://mentor.test/api/courses', this.newCourse);
                this.courses.push(response.data);
                // Reset the form
                this.newCourse = {
                    title: "",
                    description: "",
                    mentor_id: "",
                    time: "",
                    date: "",
                    max_participants: "",
                    resources: "",
                    collaborating_mentors: ""
                };
            } catch (error) {
                console.error('Error adding course:', error.message);
                alert('Failed to add course. Please check the API and try again.');
            }
        },
        setEditing(courseId) {
            this.editingCourseId = courseId;
        },
        async updateCourse(course) {
            try {
                await axios.put(`/courses/${course.id}`, {
                    title: course.title,
                    description: course.description,
                    mentor_id: course.mentor_id,
                    time: course.time,
                    date: course.date,
                    max_participants: course.max_participants,
                    resources: course.resources,
                    collaborating_mentors: course.collaborating_mentors
                });
            } catch (error) {
                console.error('Error updating course:', error.message);
                alert('Failed to update course. Please check the API and try again.');
            }
        },
        async deleteCourse(courseId) {
            try {
                await axios.delete(`/courses/${courseId}`);
                this.courses = this.courses.filter((course) => course.id !== courseId);
            } catch (error) {
                console.error('Error deleting course:', error.message);
                alert('Failed to delete course. Please check the API and try again.');
            }
        },
    },
    mounted() {
        this.fetchCourses();
    }
};
</script>

<style lang="scss" scoped>
table {
    width: 150%;
    border-collapse: collapse;
    margin-top: 20px;
}

button {
    margin: 0 5px;
}

h1 {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 20px;
}

h3 {
    color: var(--light);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

form {
    width: 150%;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .flex {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;

        label {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #444;
        }

        input[type="text"] {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            width: 100%;
            box-sizing: border-box;

            &:focus {
                border-color: #32a852;
                outline: none;
            }
        }

        textarea {
            width: 100%;
            padding: 0.75rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #e5eaef23;
            box-shadow: inset 0 0px 3px rgba(0, 0, 0, 0.1);
            transition: border 0.3s ease;

            &:focus {
                border-color: #32a852;
                outline: none;
            }
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }
    }
}

.divider {
    height: 0.5px; // thin line
    background-color: black;
    margin-bottom: 2rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    width: 150%;
    margin-bottom: 1rem;
}

.container {
    display: flex;
    align-items: center;
    gap: 16px;
    width: auto;
    /* Adjust the spacing between inputs */
}

.green-btn {
    background-color: rgb(50, 148, 50);
    width: 100%;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 600;

    &:hover {
        background-color: rgb(58, 120, 58);
        color: white;
    }
}

.red-btn {
    background-color: rgb(183, 37, 37);
    width: 100%;
    padding: 10px 20px;
    margin-top: 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 600;

    &:hover {
        background-color: rgb(137, 27, 27);
        color: white;
    }
}

//

@media (min-width: 768px) {
    .main {
        flex-direction: row;
        /* Align items in a row on larger screens */
    }
}
</style>
