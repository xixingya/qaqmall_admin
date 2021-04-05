<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app'
}
</script>

<style>
#app {

		min-width: 60rem;
		font-size: 12px;
		color: #000000;
		font-family: Arial, sans-serif;
		line-height: 1.5;
		box-sizing: border-box;
		line-height: 1.5;

	}

	a {
		text-decoration: none;
		color: #000000;
	}

	a:hover {
		color: #ff3399;
	}

	body,
	div,
	dl,
	dt,
	dd,
	ul,
	ol,
	li,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	pre,
	code,
	form,
	fieldset,
	legend,
	input,
	button,
	textarea,
	p,
	blockquote,
	th,
	td {
		margin: 0;
		padding: 0;
	}
</style>
