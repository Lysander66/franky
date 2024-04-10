<svelte:head>
	<title>DevTools</title>
</svelte:head>

<div class="container2">
	<div class="wrapper">
		<div class="one item">One</div>
		<div class="two item">Two</div>
		<div class="three item">Three</div>
		<div class="four item">Four</div>
		<div class="five item">Five</div>
		<div class="six item">Six</div>
	</div>
</div>

<style>
	.container2 {
		display: flex;
		justify-content: center;
		margin-top: 5rem;
	}

	.wrapper {
		width: 52%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 20px;
		grid-auto-rows: minmax(100px, auto);
	}
	.one {
		grid-column: 1 / 2;
		grid-row: 1;
		background: #19caad;
	}
	.two {
		grid-column: 2 / 4;
		grid-row: 1 / 3;
		background: #8cc7b5;
	}
	.three {
		grid-row: 2 / 5;
		grid-column: 1;
		background: #d1ba74;
	}
	.four {
		grid-column: 3;
		grid-row: 3;
		background: #bee7e9;
	}
	.five {
		grid-column: 2;
		grid-row: 3/5;
		background: #e6ceac;
	}
	.six {
		grid-column: 3;
		grid-row: 4;
		background: #ecad9e;
	}
	.item {
		text-align: center;
		font-size: 200%;
		color: #fff;
	}
</style>
