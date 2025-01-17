<template>
    <div class="column">
        <div class="left-col">
            <!-- LEFT COLUMN - LIVE PREVIEW -->
        </div>

        <div class="do-form">
            <!-- RIGHT COLUMN - INPUT FORM -->
            <form @submit.prevent="" generateDocument>
                <!-- deliveryOrder number and logo -->
                <div class="form-header">
                    <label for="doNo">
                        DO No.: <span class="auto-generate">#{{ doNo }}</span>
                    </label>
                    <div class="form-row">
                        <button type="button" class="add-logo-btn">Add your logo</button>
                        <div>
                            <label for="issueDate">Issue Date:</label>
                        </div>
                        <div class="date">
                            <input type="date" v-model="issueDate" name="issueDate" id="issueDate">
                        </div>
                    </div>
                </div>

                <!-- from and bill to -->
                <div class="label-row">
                    <label for="from">From:</label>
                    <label for="billTo">Bill To:</label>
                </div>
                <div class="form-row">
                    <textarea placeholder="Enter your business details..." v-model="from" name="from" id="from"
                        cols="10" rows="5"></textarea>
                    <textarea placeholder="Enter your customer details..." v-model="billTo" name="billTo" id="billTo"
                        cols="10" rows="5"></textarea>
                </div>

                <!-- issue date and valid until -->
                <div class="label-row">
                    <label for="issueDate">Issue Date:</label>
                    <label for="validUntil">Valid Until:</label>
                </div>
                <div class="form-row">
                    <input type="date" v-model="issueDate" name="issueDate" id="issueDate">
                    <input type="date" v-model="validUntil" name="validUntil" id="validUntil">
                </div>

                <!-- items table -->
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Items</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in items" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td><input type="text" v-model="item.name" /></td>
                            <td><input type="number" v-model="item.quantity"></td>
                            <td><input type="number" v-model="item.price"></td>
                            <td>{{ (item.quantity * item.price) || 0 }}</td>
                            <td><button type="button" @click="removeItem(index)" class="icon-btn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="button" class="add-item-btn icon-btn" @click="addItem">
                    <i class="fas fa-plus"></i> Add Item
                </button>

                <!-- Notes -->
                <textarea placeholder="Enter notes here..." v-model="notes" name="notes" id="notes" cols="30"
                    rows="10"></textarea>

                <!-- Total -->
                <div class="total">
                    <span>Total: RM {{ total }}</span>
                </div>

                <!-- Generate Document -->
                <button type="submit" class="generate-btn">Generate Document</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            doNo: "",
            from: "",
            billTo: "",
            issueDate: "",
            validUntil: "",
            items: [
                { name: "", price: 0, quantity: 0 },
            ],
            notes: "",
        };
    },
    computed: {
        total() {
            return this.items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
        },
    },
    methods: {
        generatedDoNo() {
            const timestamp = Date.now();
            const randomNumber = Math.floor(Math.random() * 10);
            this.doNo = `${timestamp}-${randomNumber}`;
        },
        addItem() {
            this.items.push({ name: "", price: 0, quantity: 0 });
        },
        removeItem(index) {
            this.items.splice(index, 1);
        },
        generateDocument() {
            alert("Document generated successfully!");
        },
    },
    mounted() {
        this.generatedDoNo();
    },
};
</script>

<style lang="scss" scoped>
.do-form {
    max-width: 800px;
    padding: 20px;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 2rem;
    background-color: rgb(255, 255, 255);

    .font-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .auto-generate {
            font-weight: bold;
            color: #00a000;
        }

    }

    .add-logo-btn {
        background-color: #fff;
        border: 1px dashed #00a000;
        padding: 5px 10px;
        cursor: pointer;
        color: #00a000;
        margin-bottom: 10px;
        margin-top: 30px;
    }

    .form-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        textarea,
        input {
            width: 48%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 7px;
        }
    }

    .label-row {
        display: flex;
        gap: 330px;
        margin-bottom: 15px;
    }

    .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;

        th,
        td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }

        th {
            background-color: #172554;
        }

        td button {
            background: none;
            border: none;
            color: red;
            cursor: pointer;
        }
    }

    .add-item-btn {
        display: block;
        background-color: #00a000;
        color: #fff;
        padding: 5px 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px 0;
    }

    textarea {
        width: 100%;
        height: 80px;
        resize: none;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 7px;
    }

    .total {
        font-size: 18px;
        text-align: right;
        margin-bottom: 20px;
        font-weight: bold;
    }

    .generate-btn {
        width: 100%;
        background-color: #00a000;
        color: #fff;
        padding: 10px 0;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }
}

.date {
    width: 100px;
}
</style>
