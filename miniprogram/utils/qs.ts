type StringifyOptions = {
	/**
	Strictly encode URI components with [`strict-uri-encode`](https://github.com/kevva/strict-uri-encode). It uses [`encodeURIComponent`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) if set to `false`. You probably [don't care](https://github.com/sindresorhus/query-string/issues/42) about this option.

	@default true
	*/
	readonly strict?: boolean;

	/**
	[URL encode](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) the keys and values.

	@default true
	*/
	readonly encode?: boolean;

	/**
	@default 'none'

	- `bracket`: Serialize arrays using bracket representation:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'bracket'});
		//=> 'foo[]=1&foo[]=2&foo[]=3'
		```

	- `index`: Serialize arrays using index representation:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'index'});
		//=> 'foo[0]=1&foo[1]=2&foo[2]=3'
		```

	- `comma`: Serialize arrays by separating elements with comma:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'comma'});
		//=> 'foo=1,2,3'

		queryString.stringify({foo: [1, null, '']}, {arrayFormat: 'comma'});
		//=> 'foo=1,,'
		// Note that typing information for null values is lost
		// and `.parse('foo=1,,')` would return `{foo: [1, '', '']}`.
		```

	- `separator`: Serialize arrays by separating elements with character:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'separator', arrayFormatSeparator: '|'});
		//=> 'foo=1|2|3'
		```

	- `bracket-separator`: Serialize arrays by explicitly post-fixing array names with brackets and separating elements with a custom character:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: []}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]'

		queryString.stringify({foo: ['']}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]='

		queryString.stringify({foo: [1]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1'

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1|2|3'

		queryString.stringify({foo: [1, '', 3, null, null, 6]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1||3|||6'

		queryString.stringify({foo: [1, '', 3, null, null, 6]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|', skipNull: true});
		//=> 'foo[]=1||3|6'

		queryString.stringify({foo: [1, 2, 3], bar: 'fluffy', baz: [4]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1|2|3&bar=fluffy&baz[]=4'
		```

	- `colon-list-separator`: Serialize arrays with parameter names that are explicitly marked with `:list`:

		```js
		import queryString from 'query-string';

		queryString.stringify({foo: ['one', 'two']}, {arrayFormat: 'colon-list-separator'});
		//=> 'foo:list=one&foo:list=two'
		```

	- `none`: Serialize arrays by using duplicate keys:

		```
		import queryString from 'query-string';

		queryString.stringify({foo: [1, 2, 3]});
		//=> 'foo=1&foo=2&foo=3'
		```
	*/
	readonly arrayFormat?: 'bracket' | 'index' | 'comma' | 'separator' | 'bracket-separator' | 'colon-list-separator' | 'none';

	/**
	The character used to separate array elements when using `{arrayFormat: 'separator'}`.

	@default ,
	*/
	readonly arrayFormatSeparator?: string;

	/**
	Supports both `Function` as a custom sorting function or `false` to disable sorting.

	If omitted, keys are sorted using `Array#sort`, which means, converting them to strings and comparing strings in Unicode code point order.

	@default true

	@example
	```
	import queryString from 'query-string';

	const order = ['c', 'a', 'b'];

	queryString.stringify({a: 1, b: 2, c: 3}, {
		sort: (itemLeft, itemRight) => order.indexOf(itemLeft) - order.indexOf(itemRight)
	});
	//=> 'c=3&a=1&b=2'
	```

	@example
	```
	import queryString from 'query-string';

	queryString.stringify({b: 1, c: 2, a: 3}, {sort: false});
	//=> 'b=1&c=2&a=3'
	```
	*/
	readonly sort?: ((itemLeft: string, itemRight: string) => number) | false;

	/**
	Skip keys with `null` as the value.

	Note that keys with `undefined` as the value are always skipped.

	@default false

	@example
	```
	import queryString from 'query-string';

	queryString.stringify({a: 1, b: undefined, c: null, d: 4}, {
		skipNull: true
	});
	//=> 'a=1&d=4'

	queryString.stringify({a: undefined, b: null}, {
		skipNull: true
	});
	//=> ''
	```
	*/
	readonly skipNull?: boolean;

	/**
	Skip keys with an empty string as the value.

	@default false

	@example
	```
	import queryString from 'query-string';

	queryString.stringify({a: 1, b: '', c: '', d: 4}, {
		skipEmptyString: true
	});
	//=> 'a=1&d=4'
	```

	@example
	```
	import queryString from 'query-string';

	queryString.stringify({a: '', b: ''}, {
		skipEmptyString: true
	});
	//=> ''
	```
	*/
	readonly skipEmptyString?: boolean;
};

/**
 * 校验 value 是否为可用于拆分数组的字符
 * @param value
 */
function validateArrayFormatSeparator(value?: string) {
	if (typeof value !== 'string' || value.length !== 1) {
		throw new TypeError('arrayFormatSeparator must be single character string');
	}
}

/**
 * 数组编码生成器
 * @param options
 * @returns
 */
function encoderForArrayFormat(options: StringifyOptions) {
	switch (options.arrayFormat) {
		case 'index': {
			return (key: string) => (result: any, value: any) => {
				const index = result.length;

				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result, [encode(key, options), '[', index, ']'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join(''),
				];
			};
		}

		case 'bracket': {
			return (key: string) => (result: any, value: any) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), '[]'].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), '[]=', encode(value, options)].join(''),
				];
			};
		}

		case 'colon-list-separator': {
			return (key: string) => (result: any, value: any) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						[encode(key, options), ':list='].join(''),
					];
				}

				return [
					...result,
					[encode(key, options), ':list=', encode(value, options)].join(''),
				];
			};
		}

		case 'comma':
		case 'separator':
		case 'bracket-separator': {
			const keyValueSep = options.arrayFormat === 'bracket-separator'
				? '[]='
				: '=';

			return (key: string) => (result: any, value: any) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				// Translate null to an empty string so that it doesn't serialize as 'null'
				value = value === null ? '' : value;

				if (result.length === 0) {
					return [[encode(key, options), keyValueSep, encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
		}

		default: {
			return (key: string) => (result: any, value: any) => {
				if (
					value === undefined
					|| (options.skipNull && value === null)
					|| (options.skipEmptyString && value === '')
				) {
					return result;
				}

				if (value === null) {
					return [
						...result,
						encode(key, options),
					];
				}

				return [
					...result,
					[encode(key, options), '=', encode(value, options)].join(''),
				];
			};
		}
	}
}

/**
 * 严格编码，符号也转为 charcode
 * @param string
 * @returns
 */
const strictUriEncode = (string: string) => encodeURIComponent(string).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

/**
 * 编码
 * @param value
 * @param options
 * @returns
 */
function encode(value: string, options: StringifyOptions) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

/**
 * 对象转 querystring
 * @param object
 * @param options
 * @returns
 */
export function stringify(object: Record<string, any>, options: StringifyOptions = {}) {
	if (!object) {
		return '';
	}

	options = {
    encode: true,
		strict: true,
		arrayFormat: 'none',
		arrayFormatSeparator: ',',
    ...options};

  // 校验配置 arrayFormatSeparator 数据是否正确
	validateArrayFormatSeparator(options.arrayFormatSeparator);

	const shouldFilter = (key: string) => (
		(options.skipNull && (object[key] === null || object[key] === undefined))
		|| (options.skipEmptyString && object[key] === '')
	);

  // 数组形式值编码生成器，用于 reduce
	const formatter = encoderForArrayFormat(options);

	const objectCopy: Record<string, any> = {};

	for (const [key, value] of Object.entries(object)) {
		if (!shouldFilter(key)) {
			objectCopy[key] = value;
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			if (value.length === 0 && options.arrayFormat === 'bracket-separator') {
				return encode(key, options) + '[]';
			}

			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
}