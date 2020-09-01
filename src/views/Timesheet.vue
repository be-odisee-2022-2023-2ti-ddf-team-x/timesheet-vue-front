<template>
  <div id="timesheet">

    <img alt="Time puncher" src="../assets/punch-in-cc-by-Tom-Blackwell.jpg" style="float: right" />

    <MainForm />

  </div>
</template>

<script>
// @ is an alias to /src
import MainForm from '@/components/MainForm.vue'

export default {
  name: 'Timesheet',
  components: {
    MainForm
  }
}
</script>
