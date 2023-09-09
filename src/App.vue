<script setup>
import SelectMetric from "./components/SelectMetric.vue";
import ShowAlerts from "./components/ShowAlerts.vue";
</script>

<template>
  <h1 class="header">Monitoring Tool for MongoDB</h1>
  <div class="wrapper">
    <div class="alerts">
      <!-- <div class="show-alerts">Show alerts</div> -->
      <ShowAlerts></ShowAlerts>
      <div class="show-actions">Show appropriate actions</div>
    </div>
    <div class="metrics">
      <SelectMetric></SelectMetric>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  font-size: 50px;
}
.wrapper {
  display: flex;
  height: 80vh;
}

.alerts,
.metrics {
  border: 3px solid black;
  flex: 1;
  padding: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
}

.choose-metrics,
.show-metrics,
.show-alerts,
.show-actions {
  border: 2px solid blue;
  margin: 1rem;
}

.choose-metrics {
  flex: 1;
}
.show-metrics {
  flex: 4;
}

.show-alerts,
.show-actions {
  flex: 1;
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
