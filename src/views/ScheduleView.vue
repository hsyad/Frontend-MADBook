<template>
    <main>
        <h1>Mentor's Schedule</h1>

        <div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Location</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="schedule in schedules" :key="schedule.id">
                        <td>{{ schedule.course_title }}</td>
                        <td>{{ schedule.date }}</td>
                        <td>{{ schedule.start_time }}</td>
                        <td>{{ schedule.end_time }}</td>
                        <td>{{ schedule.location }}</td>
                        <td>{{ schedule.notes }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            schedules: [],
        };
    },
    created() {
        this.fetchSchedules();
    },
    methods: {
        async fetchSchedules() {
            try {
                const response = await axios.get('http://mentor.test/api/scheduler');
                console.log('API response:', response.data); // Debugging: Check the API response
                this.schedules = await response.data;
            } catch (error) {
                console.error('Error fetching scheduler:', error.message);
                alert('Failed to fetch scheduler data. Please check the API and try again.');
            }
        },
    },
    mounted() {
        this.fetchSchedules();
    }
};
</script>

<style scoped>
.schedule-view {
    padding: 20px;
}

.loading {
    font-size: 18px;
    color: #999;
}

.no-schedules {
    font-size: 18px;
    color: #999;
}

.schedule-item {
    margin-bottom: 20px;
}

.schedule-item h2 {
    margin: 0;
    font-size: 24px;
}

.schedule-item p {
    margin: 5px 0;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
}
</style>
