<template>
  <div
    v-if="loading"
    class="sk-cube-grid"
  >
    <div class="sk-cube sk-cube1 float-left bg-main-500" />
    <div class="sk-cube sk-cube2 float-left bg-main-500" />
    <div class="sk-cube sk-cube3 float-left bg-main-500" />
    <div class="sk-cube sk-cube4 float-left bg-main-500" />
    <div class="sk-cube sk-cube5 float-left bg-main-500" />
    <div class="sk-cube sk-cube6 float-left bg-main-500" />
    <div class="sk-cube sk-cube7 float-left bg-main-500" />
    <div class="sk-cube sk-cube8 float-left bg-main-500" />
    <div class="sk-cube sk-cube9 float-left bg-main-500" />
  </div>
  <slot v-if="!loading" />
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="css">
.sk-cube-grid {
  width: 40px;
  height: 40px;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}

.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}

.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>
