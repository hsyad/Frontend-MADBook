<template>
    <main>
        <div class="container">
            <h1>Upload Reference Documents</h1>
            <input class="uploadFile" type="file" @change="handleFileUpload" />
            <select v-model="selectedCategory">
                <option disabled value="">Select Course Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.title }}
                </option>
            </select>
            <button class="styled-btn" @click="uploadFile">Upload</button>
        </div>

        <div class="resources_table">
            <h1 class="m-6">Uploaded Files</h1>
            <input type="text" v-model="searchQuery" placeholder="Search files..." />
            <select v-model="filterCategory">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.title }}
                </option>
            </select>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Course ID</th>
                            <th>Course Title</th>
                            <th>File Name</th>
                            <th>File Type</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="resource in resources" :key="resource.id">
                            <td>{{ resource.course_id }}</td>
                            <td>{{ resource.course_title }}</td>
                            <td>{{ resource.name }}</td>
                            <td>{{ resource.type }}</td>
                            <td style="color: blue"><a :href="resource.link" target="_blank">Download</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            resources: [],
            selectedFile: null,
            selectedCategory: '',
            uploadedFiles: [],
            categories: [],
            searchQuery: '',
            filterCategory: '',
        };
    },
    created() {
        this.fetchResources();
        this.fetchCategories();
        this.fetchUploadedFiles();
    },
    methods: {
        async fetchResources() {
            try {
                const response = await axios.get('http://mentor.test/api/resources');
                console.log('API response:', response.data); // Debugging: Check the API response
                this.resources = await response.data;
            } catch (error) {
                console.error('Error fetching courses:', error.message);
                alert('Failed to fetch courses data. Please check the API and try again.');
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get('http://mentor.test/api/courses');
                this.categories = response.data;
            } catch (error) {
                console.error('Error fetching categories:', error.message);
                alert('Failed to fetch categories data. Please check the API and try again.');
            }
        },
        async fetchUploadedFiles() {
            try {
                const response = await axios.get('http://mentor.test/api/resources');
                this.uploadedFiles = response.data;
            } catch (error) {
                console.error('Error fetching uploaded file:', error.message);
                alert('Failed to fetch upload file data. Please check the API and try again.');
            }
        },
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadFile() {
            if (this.selectedFile && this.selectedCategory) {
                const formData = new FormData();
                formData.append('course_id', this.selectedCategory);
                formData.append('file', this.selectedFile.name);
                formData.append('type', this.selectedFile.type);
                formData.append('link', URL.createObjectURL(this.selectedFile));

                axios.post('http://mentor.test/api/resources', formData)
                    .then(response => {
                        alert(response.data.message); // Display success message
                        this.selectedFile = null;
                        this.selectedCategory = '';
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error.message);
                        alert('Failed to upload file. Please check the API and try again.');
                    });
            } else {
                alert('Please select a file and category to upload.');
            }
        }
    },
    computed: {
        filteredFiles() {
            return this.uploadedFiles.filter(file => {
                const matchesCategory = this.filterCategory ? file.course_title === parseInt(this.filterCategory.filterCategory) : true;
                const matchesSearch = file.name.toLowerCase().includes(this.searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
h1 {
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 20px;
}

.styled-btn {
    background-color: rgb(50, 148, 50);
    width: 100%;
    padding: 10px 20px;
    margin-top: 1fr;
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

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem;
    box-sizing: border-box;
    background-color: white;
    border-radius: 5px;
}

.uploadFile {
    margin-bottom: 1rem;
}

select {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
}

input[type="text"] {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
}
</style>
