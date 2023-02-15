<template>
  <div>
    <!-- filters -->
    <div class="q-pb-md">
      <div class="row items-center q-gutter-x-lg q-gutter-y-md">
        <!-- type -->
        <q-space/>

        <!-- text-search -->
        <div class="col-auto">
          <q-input dense outlined clearable
                   placeholder="search"
                   :model-value="filter.search"
                   :debounce="1000"
                   style="width: 270px"
                   @update:model-value="onSearchInput">
            <template #append>
              <q-icon name="search" size=".9rem" color="grey-5"/>
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- table -->
    <q-markup-table flat bordered wrap-cells class="relative-position">
      <thead class="dense">
      <tr class="bg-grey-2 text-grey-6">
        <th class="min-width text-center">Phone</th>

        <th class="text-left">Name</th>
      </tr>
      </thead>

      <tbody>
      <ListItem v-for="item in results" :key="`item-${item.id}`"
                :data="item" @click="$emit('item-click', item)"/>

      <ac-tr-no-rows v-if="!loading && !results.length"/>
      </tbody>

      <ac-spinner :showing="loading"/>
    </q-markup-table>

    <!-- Footer -->
    <ac-table-tools :std-params="paginationParams" :data="data" class="q-mt-md" @page="onPage"/>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import paginated_list from 'src/composables/paginated_list'
import ListItem from './ListItem'

const store = useStore()

const filter = ref({
  search: '',
})

const { loading, paginationParams, data, results, refresh, onPage } = paginated_list('user/list', filter)

const onSearchInput = v => {
  filter.value.search = v
  refresh(true)
}

onMounted(() => refresh(true))

defineExpose({
  refresh,
})
</script>
