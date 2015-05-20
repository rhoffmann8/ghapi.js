# ghapi.js
An extremely low-power JS library for a very small set of Github API's JSONP functionality, written during a 14-inning Mets/Cardinals game almost exclusively to facilitate a joke webpage to display how many new JS framework repositories appeared for the current day.

Usage:

```js
// chaining commands to set search parameters
GHApi.open('/search/repositories')
	.query('terms to search')
	.addParam('order', 'desc')
	.addFilter('language', 'javascript')
	.addFilter('created', '<2015-05-01')
	.setCallback(function(meta, data) {
		// 'this' object contains 'path' and 'params' properties from request
		console.log(this.path); // "/search/repositories"
		console.log(this.params); // "q=terms+to+search+language:javascript&order=desc"
		console.log(meta);
		console.log(data);
	})
	.submit();

// example passing params in submit
GHApi.submit('/search/repositories', {
	q: 'some other terms to search',
	order: 'desc'
},{
	created: '>2015-05-18',
}, function(meta, data) {
	// do something with data
});
```

I make no guarantees that this will work in any way other than what I use it for, nor can I say with any certainty whether I will enhance it in the future or not.