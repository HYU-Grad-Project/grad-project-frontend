<script setup>
import SelectMetric from "./components/SelectMetric.vue";
import ShowAlerts from "./components/ShowAlerts.vue";
</script>

<template>
  <!-- <h1
    class="flex justify-center m-4 text-4xl leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
  > -->
  <h1
    class="flex justify-center p-4 text-4xl leading-none tracking-tight bg-sky-50 text-blue-900 md:text-5xl lg:text-6xl dark:text-white"
  >
    Monitoring Tool for MongoDB
  </h1>
  <hr class="border-blue-200" />
  <div class="wrapper">
    <div class="alerts">
      <ShowAlerts></ShowAlerts>
    </div>
    <div class="w-[1px] h-[90vh] bg-blue-200"></div>
    <div class="metrics">
      <SelectMetric></SelectMetric>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 80vh;
}

.alerts,
.metrics {
  flex: 1;
  padding: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
}
</style>

<!-- <script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style> -->
