<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div class="text-right">
        <q-btn unelevated icon="add" label="Add" color="positive" @click="onAddClick"/>
      </div>

      <div class="q-pt-md"/>

      <List @item-click="onItemClick" ref="listComponent"/>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import List from 'components/perm/List'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  rid: {},
})

const listComponent = ref()

const onItemClick = item => {
  router.push({ name: 'perms-perm_ce', params: { perm_id: item.id } })
}

const onAddClick = () => {
  router.push({ name: 'perms-perm_ce' })
}

watch(() => route.meta.rid, () => {
  if (props.rid === route.meta.rid) {
    listComponent.value.refresh()
  }
})
</script>
