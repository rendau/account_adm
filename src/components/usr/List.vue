<template>
  <div>
    <!-- filters -->
    <div class="q-pb-md">
      <div class="row items-center q-gutter-x-lg q-gutter-y-md">
        <!-- text-search -->
        <div class="col-auto">
          <q-input dense outlined clearable
                   placeholder="search"
                   :model-value="filter.search"
                   :debounce="1000"
                   style="width: 340px"
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
        <th class="min-width">ID</th>

        <th class="min-width">Дата</th>

        <th class="min-width">Тип</th>

        <th class="min-width">Статус</th>

        <th class="min-width">ИИН</th>

        <th class="min-width text-no-wrap">Чек заявка</th>

        <th class="text-left">Подразделение</th>
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
import paginated_list from 'src/composables/paginated_list'
import ListItem from './ListItem'
import { cns } from 'boot/cns'
import { util } from 'boot/util'
import { useStore } from 'vuex'

const store = useStore()

const filter = ref({
  search: '',
})

const tpOps = [
  { value: null, label: 'Все' },
  ...util.lOps('order_types'),
]

const { loading, paginationParams, data, results, refresh, onPage } = paginated_list('ord/list', filter)

const onTpInput = v => {
  filter.value.tp = v
  switch (v) {
    case cns.OrderTypeOnline:
      filter.value.subdivision_id = null
      break
    case cns.OrderTypeOffline:
      filter.value.city_site_code = null
      break
  }
  refresh(true)
}

const onSearchInput = (v) => {
  filter.value.search = v
  refresh(true)
}

const onOfrPrvInput = (v) => {
  filter.value.ofr_prv_id = v
  refresh(true)
}

const onOfrStatusInput = (v) => {
  filter.value.ofr_status = v
  refresh(true)
}

const onSubdivisionInput = (v) => {
  filter.value.subdivision_id = v
  filter.value.city_site_code = null
  refresh(true)
}

const onSiteCityInput = (v) => {
  filter.value.city_site_code = v
  filter.value.subdivision_id = null
  refresh(true)
}

onMounted(() => refresh(true))
</script>
