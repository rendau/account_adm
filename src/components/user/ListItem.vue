<template>
  <tr class="cursor-pointer">
    <td class="text-no-wrap text-center">
      {{ $u.fmtPhone(data.phone) }}
    </td>

    <td class="text-no-wrap">
      {{ data.name }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
})
</script>
