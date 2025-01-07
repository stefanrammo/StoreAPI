    <template>
        <table class="table table-striped table-hover">
        <thead class="table-dark text-center">
            <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Expiration Date</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td class="text-center">{{ item.price }}</td>
            <td>{{ item.description || 'N/A' }}</td>
            <td class="text-end">{{ item.expiration_date || 'N/A' }}</td>
            <td class="row d-flex justify-content-center m-0">
                <!-- Check if isAdmin is true and show buttons -->
                <button 
                v-if="isAdmin" 
                class="btn btn-danger btn-sm col-sm-5 m-1" 
                @click="$emit('delete-item', item.id)"
                >
                Delete
                </button>
                <button 
                v-if="isAdmin" 
                class="btn btn-primary btn-sm col-sm-5 m-1" 
                @click="$emit('edit-item', item)"
                >
                Edit
                </button>
            </td>
            </tr>
        </tbody>
        </table>
    </template>
    
    <script>
    export default {
        name: 'DrinksTable',
        props: {
        items: Array,
        isAdmin: Boolean, // Receiving the isAdmin prop
        }
    }
    </script>
    