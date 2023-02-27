<template>
  <div>
    <div :class="{'hidden': $route.meta.rid !== rid}">
      <div>
        <ac-page-toolbar>
          <ac-page-title>
            Configurations
          </ac-page-title>
        </ac-page-toolbar>

        <div class="relative-position" style="min-height: 50px">
          <div v-if="data" class="row">
            <div class="col-12">
              <div class="row items-start q-col-gutter-md">
                <!-- access_token_dur_seconds -->
                <q-input outlined type="tel" mask="##########" unmasked-value
                         label="Access Token Duration"
                         suffix="sec"
                         v-model.number="data.access_token_dur_seconds"/>

                <!-- refresh_token_dur_seconds -->
                <q-input outlined type="tel" mask="##########" unmasked-value
                         label="Refresh Token Duration"
                         suffix="sec"
                         v-model.number="data.refresh_token_dur_seconds"/>
              </div>
            </div>
          </div>

          <div class="q-pt-lg q-pb-md"/>

          <div class="row items-center q-gutter-x-md">
            <div>
              <q-btn unelevated label="Save" color="positive" @click="onSubmitClick"/>
            </div>
          </div>

          <div class="q-pt-lg"/>

          <ac-spinner :showing="loading"/>
        </div>
      </div>
    </div>

    <router-view/>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n/index'

const route = useRoute()
const router = useRouter()
const store = useStore()
const $q = useQuasar()
const { t } = useI18n()

const props = defineProps({
  rid: {},
})

const loading = ref(false)
const data = ref({
  access_token_dur_seconds: 0,
  refresh_token_dur_seconds: 0,
})

const fetch = () => {
  _.assign(data.value, store.state.config)
}

const onSubmitClick = () => {
  loading.value = true
  store.dispatch('config/set', data.value).then(() => {
    fetch()
    $q.notify({ type: 'positive', message: t('success_perform_msg') })
  }, err => {
    $q.notify({ type: 'negative', message: err.data.desc })
  }).then(() => {
    loading.value = false
  })
}

onMounted(fetch)
</script>
