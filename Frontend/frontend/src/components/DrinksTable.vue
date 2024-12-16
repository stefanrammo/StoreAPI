<script>
export default {
    name: "DrinksTable",
    props: {
        items: Array
    }
}
</script>

<template>
    <table class="table table-striped">
        <thead class="table-dark">
            <tr><th>Name</th>
            <th>Price</th>
        <th>Description</th>
    <th>Expiration Date</th></tr>
            </thead>
            <tbody>
                <tr v-for="item in items" v-bind:key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.description }}</td>
                    <td>{{ item.expiration_date }}</td>
                    <!-- Add delete button here -->
                    <td>
                        <button @click="deleteItem(item)">Delete</button>
                    </td>
                    <!-- Add edit button here -->
                    <td>
                        <button @click="editItem(item)">Edit</button>
                    </td>
                </tr>
            </tbody>
    </table>
</template>