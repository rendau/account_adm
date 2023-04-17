<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <List ref="listComponent"/>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import List from 'components/perm/List'
import {useRoute} from 'vue-router'
import {ref, watch} from 'vue'

const route = useRoute()

const props = defineProps({
  rid: {},
})

const listComponent = ref()

watch(() => route.meta.rid, () => {
  if (props.rid === route.meta.rid) {
    listComponent.value.refresh()
  }
})
</script>
