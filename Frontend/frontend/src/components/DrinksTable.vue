<template>
    <table class="table table-striped">
        <thead class="table-dark">
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Expiration Date</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.description || 'N/A' }}</td>
                <td>{{ item.expiration_date || 'N/A' }}</td>
                <td>
                    <button @click="$emit('delete-item', item.id)">Delete</button>
                    <button @click="$emit('edit-item', item)">Edit</button> <!-- Add Edit button -->
                </td>
            </tr>
        </tbody>
    </table>
  </template>
  
  <script>
  export default {
    name: 'DrinksTable',
    props: {
      items: Array
    }
  }
  </script>
  