<template>
  <div>
    <!-- table -->
    <q-markup-table flat bordered wrap-cells class="relative-position">
      <thead class="dense">
      <tr class="bg-grey-2 text-grey-6">
        <th class="text-left">Name</th>

        <th class="min-width text-no-wrap">Is System</th>

        <th class="min-width text-no-wrap">Remote perms</th>
      </tr>
      </thead>

      <tbody>
      <ListItem v-for="item in results.results" :key="`item-${item.id}`"
                :data="item" @click="$emit('item-click', item)"/>

      <ac-tr-no-rows v-if="!loading && !results.results?.length"/>
      </tbody>

      <ac-spinner :showing="loading"/>
    </q-markup-table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

import list from 'src/composables/list'
import ListItem from './ListItem'

const { loading, results, refresh } = list('application/list')

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
