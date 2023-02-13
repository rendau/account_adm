<template>
  <tr class="cursor-pointer" :class="{'text-grey-6': data.is_account_app}">
    <td class="text-no-wrap">
      {{ data.name }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.is_account_app ? 'Yes': '' }}
    </td>

    <td class="text-no-wrap text-center">
      {{ !!data.perm_url ? 'Yes': '' }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
})
</script>
