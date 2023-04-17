<template>
  <div>
    <!-- toolbar -->
    <div class="q-pb-lg">
      <div class="row items-center q-gutter-x-md q-gutter-y-sm">
        <div>
          <q-select dense options-dense outlined map-options emit-value
                    v-model="filters.app_id"
                    :options="$u.lOpsWithEmpty('apps', 'id', 'name', null, 'All Applications')"
                    style="width: 300px"
                    @update:model-value="refresh"/>
        </div>

        <q-space/>

        <div>
          <q-btn flat round icon="add" color="primary" @click="onAddClick"/>
        </div>
      </div>
    </div>

    <!-- table -->
    <q-markup-table flat bordered wrap-cells class="relative-position">
      <thead class="dense">
      <tr class="bg-grey-2 text-grey-6">
        <th class="min-width">Application</th>

        <th class="min-width">Code</th>

        <th class="text-left">Description</th>

        <th class="min-width text-no-wrap">Is All</th>

        <th class="min-width text-no-wrap">Is System</th>

        <th class="min-width text-no-wrap">Is Fetched</th>
      </tr>
      </thead>

      <tbody>
      <ListItem v-for="item in results" :key="`item-${item.id}`"
                :data="item" @click="onItemClick(item)"/>

      <ac-tr-no-rows v-if="!loading && !results.length"/>
      </tbody>

      <ac-spinner :showing="loading"/>
    </q-markup-table>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'

import list from 'src/composables/list'
import ListItem from './ListItem'
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const store = useStore()
const router = useRouter()

const filters = ref({
  app_id: null,
})
const {loading, results, refresh} = list('perm/list', filters.value)

const onAddClick = () => {
  router.push({name: 'perms-perm_ce', query: {app_id: filters.value.app_id || undefined}})
}

const onItemClick = item => {
  router.push({name: 'perms-perm_ce', params: {perm_id: item.id}})
}

onMounted(refresh)

defineExpose({
  refresh,
})
</script>
