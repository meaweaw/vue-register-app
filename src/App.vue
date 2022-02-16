<template>
  <RouterView />
</template>

<style>
.image img {
  transition: all 0.5s;
}
.card:hover .image img {
  transform: scale(1.3);
}
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}
.gradient-custom {
  background-color: #8EC5FC;
  background-image: linear-gradient(300deg, #8EC5FC 0%, #E0C3FC 100%);
}
</style>
