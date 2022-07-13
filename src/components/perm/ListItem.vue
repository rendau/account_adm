<template>
  <tr class="cursor-pointer" :class="{'text-grey-6': data.is_system}">
    <td class="text-no-wrap text-center">
      {{ data.id }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.app }}
    </td>

    <td class="text-no-wrap">
      {{ data.dsc }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.is_system ? 'Yes': '' }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
})
</script>
