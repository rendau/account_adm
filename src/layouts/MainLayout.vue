<template>
  <q-layout view="HHH Lpr lFf" class="app-bg-color relative-position">
    <Header/>

    <Drawer/>

    <q-page-container class="fit">
      <q-page class="fit q-pt-md q-pl-lg q-pr-md q-pb-lg">
        <router-view/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from './Header'
import Drawer from './Drawer'</script>
