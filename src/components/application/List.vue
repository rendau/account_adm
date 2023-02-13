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
      <ListItem v-for="item in results" :key="`item-${item.id}`"
                :data="item" @click="$emit('item-click', item)"/>

      <ac-tr-no-rows v-if="!results.length"/>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ListItem from './ListItem'
import { useStore } from 'vuex'

const store = useStore()

const results = computed(() => store.state.dic.apps)
</script>
