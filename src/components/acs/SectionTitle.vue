<template>
  <div class="text-body2 text-grey-6" :class="{'q-pb-sm q-pt-xs': !noPadding}">
    <slot/>
  </div>
</template>

<script setup>
defineProps({
  noPadding: { type: Boolean },
})
</script>
