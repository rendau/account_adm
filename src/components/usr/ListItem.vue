<template>
  <tr class="cursor-pointer">
    <td class="text-no-wrap text-center">
      {{ data.id }}
    </td>

    <td class="text-no-wrap text-center">
      {{ $u.fmtDatetimeMini(data.created_at) }}
    </td>

    <td class="text-no-wrap text-center">
      {{ $u.lGetAttr('order_types', data.tp) }}
    </td>

    <td class="text-no-wrap text-center">
      {{ $u.lGetAttr('order_statuses', data.status) }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.iin }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.shop_receipt_request_id }}
    </td>

    <td class="text-no-wrap">
      {{ $u.lGetAttr('subdivisions', data.subdivision_id) }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
})
</script>
