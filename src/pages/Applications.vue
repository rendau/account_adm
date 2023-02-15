<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div class="text-right">
        <q-btn unelevated icon="add" label="Add" color="positive" @click="onAddClick"/>
      </div>

      <div class="q-pt-md"/>

      <List @item-click="onItemClick"/>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import List from 'components/application/List'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  rid: {},
})

const onItemClick = item => {
  router.push({ name: 'applications-application_ce', params: { application_id: item.id } })
}

const onAddClick = () => {
  router.push({ name: 'applications-application_ce' })
}
</script>
