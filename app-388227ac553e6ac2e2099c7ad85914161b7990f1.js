(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.l.ah === region.t.ah)
	{
		return 'on line ' + region.l.ah;
	}
	return 'on lines ' + region.l.ah + ' through ' + region.t.ah;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ca,
		impl.cz,
		impl.cv,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		S: func(record.S),
		aL: record.aL,
		aI: record.aI
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.S;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.aL;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aI) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ca,
		impl.cz,
		impl.cv,
		function(sendToApp, initialModel) {
			var view = impl.cA;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.ca,
		impl.cz,
		impl.cv,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.aK && impl.aK(sendToApp)
			var view = impl.cA;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bZ);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cx) && (_VirtualDom_doc.title = title = doc.cx);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.ck;
	var onUrlRequest = impl.cl;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		aK: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bo === next.bo
							&& curr.a7 === next.a7
							&& curr.bl.a === next.bl.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		ca: function(flags)
		{
			return A3(impl.ca, flags, _Browser_getUrl(), key);
		},
		cA: impl.cA,
		cz: impl.cz,
		cv: impl.cv
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { b7: 'hidden', b$: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { b7: 'mozHidden', b$: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { b7: 'msHidden', b$: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { b7: 'webkitHidden', b$: 'webkitvisibilitychange' }
		: { b7: 'hidden', b$: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		bx: _Browser_getScene(),
		bS: {
			bU: _Browser_window.pageXOffset,
			bV: _Browser_window.pageYOffset,
			bT: _Browser_doc.documentElement.clientWidth,
			a5: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		bT: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		a5: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			bx: {
				bT: node.scrollWidth,
				a5: node.scrollHeight
			},
			bS: {
				bU: node.scrollLeft,
				bV: node.scrollTop,
				bT: node.clientWidth,
				a5: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			bx: _Browser_getScene(),
			bS: {
				bU: x,
				bV: y,
				bT: _Browser_doc.documentElement.clientWidth,
				a5: _Browser_doc.documentElement.clientHeight
			},
			b3: {
				bU: x + rect.left,
				bV: y + rect.top,
				bT: rect.width,
				a5: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.b4.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.b4.b, xhr)); });
		$elm$core$Maybe$isJust(request.cy) && _Http_track(router, xhr, request.cy.a);

		try {
			xhr.open(request.ch, request.V, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.V));
		}

		_Http_configureRequest(xhr, request);

		request.bZ.a && xhr.setRequestHeader('Content-Type', request.bZ.a);
		xhr.send(request.bZ.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.b6; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.cw.a || 0;
	xhr.responseType = request.b4.d;
	xhr.withCredentials = request.bX;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		V: xhr.responseURL,
		ct: xhr.status,
		cu: xhr.statusText,
		b6: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			cs: event.loaded,
			bz: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			cp: event.loaded,
			bz: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.ci) { flags += 'm'; }
	if (options.b_) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.o) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.s),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.s);
		} else {
			var treeLen = builder.o * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.v) : builder.v;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.o);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.s) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.s);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{v: nodeList, o: (len / $elm$core$Array$branchFactor) | 0, s: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {a2: fragment, a7: host, bj: path, bl: port_, bo: protocol, bp: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$AonTool$defaultAonUrl = 'https://2e.aonprd.com';
var $author$project$AonTool$defaultElasticsearchUrl = 'https://elasticsearch.aonprd.com/aon';
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$AonTool$defaultFlags = {ai: $elm$core$Dict$empty};
var $author$project$AonTool$emptySelection = {t: 0, l: 0, c: ''};
var $author$project$AonTool$GotDataResult = function (a) {
	return {$: 15, a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$AonTool$dataSize = 10000;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm_community$maybe_extra$Maybe$Extra$cons = F2(
	function (item, list) {
		if (!item.$) {
			var v = item.a;
			return A2($elm$core$List$cons, v, list);
		} else {
			return list;
		}
	});
var $elm_community$maybe_extra$Maybe$Extra$values = A2($elm$core$List$foldr, $elm_community$maybe_extra$Maybe$Extra$cons, _List_Nil);
var $author$project$AonTool$encodeObjectMaybe = function (list) {
	return $elm$json$Json$Encode$object(
		$elm_community$maybe_extra$Maybe$Extra$values(list));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$AonTool$buildDataBody = F2(
	function (model, searchAfter) {
		return $author$project$AonTool$encodeObjectMaybe(
			_List_fromArray(
				[
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'query',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'bool',
									$elm$json$Json$Encode$object(
										_List_fromArray(
											[
												_Utils_Tuple2(
												'must_not',
												A2(
													$elm$json$Json$Encode$list,
													$elm$json$Json$Encode$object,
													_List_fromArray(
														[
															_List_fromArray(
															[
																_Utils_Tuple2(
																'term',
																$elm$json$Json$Encode$object(
																	_List_fromArray(
																		[
																			_Utils_Tuple2(
																			'exclude_from_search',
																			$elm$json$Json$Encode$bool(true))
																		])))
															])
														]))),
												_Utils_Tuple2(
												'should',
												A2(
													$elm$json$Json$Encode$list,
													$elm$json$Json$Encode$object,
													_List_fromArray(
														[
															_List_fromArray(
															[
																_Utils_Tuple2(
																'query_string',
																$elm$json$Json$Encode$object(
																	_List_fromArray(
																		[
																			_Utils_Tuple2(
																			'query',
																			$elm$json$Json$Encode$string('!category:(category-page OR class-feature OR sidebar) !remaster_id:*')),
																			_Utils_Tuple2(
																			'default_operator',
																			$elm$json$Json$Encode$string('AND'))
																		])))
															])
														])))
											])))
								])))),
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'size',
						$elm$json$Json$Encode$int($author$project$AonTool$dataSize))),
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'sort',
						A2(
							$elm$json$Json$Encode$list,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									$elm$json$Json$Encode$string('_score'),
									$elm$json$Json$Encode$string('_doc')
								])))),
					A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$pair('search_after'),
					searchAfter),
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'_source',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'includes',
									A2(
										$elm$json$Json$Encode$list,
										$elm$json$Json$Encode$string,
										_List_fromArray(
											['category', 'name', 'url'])))
								]))))
				]));
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $webbhuset$elm_json_decode$Json$Decode$Field$require = F3(
	function (fieldName, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$field, fieldName, valueDecoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $webbhuset$elm_json_decode$Json$Decode$Field$requireAt = F3(
	function (path, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			A2($elm$json$Json$Decode$at, path, valueDecoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$AonTool$documentDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'_id',
	$elm$json$Json$Decode$string,
	function (id) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
			_List_fromArray(
				['_source', 'category']),
			$elm$json$Json$Decode$string,
			function (category) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
					_List_fromArray(
						['_source', 'name']),
					$elm$json$Json$Decode$string,
					function (name) {
						return A3(
							$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
							_List_fromArray(
								['_source', 'url']),
							$elm$json$Json$Decode$string,
							function (url) {
								return $elm$json$Json$Decode$succeed(
									{M: category, y: id, g: name, V: url});
							});
					});
			});
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm_community$list_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$AonTool$esResultDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
	_List_fromArray(
		['hits', 'hits']),
	$elm$json$Json$Decode$list($author$project$AonTool$documentDecoder),
	function (documents) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
			_List_fromArray(
				['hits', 'hits']),
			$elm$json$Json$Decode$list(
				A2($elm$json$Json$Decode$field, 'sort', $elm$json$Json$Decode$value)),
			function (sorts) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$requireAt,
					_List_fromArray(
						['hits', 'total', 'value']),
					$elm$json$Json$Decode$int,
					function (total) {
						return $elm$json$Json$Decode$succeed(
							{
								x: documents,
								aJ: A2(
									$elm$core$Maybe$withDefault,
									$elm$json$Json$Encode$null,
									$elm_community$list_extra$List$Extra$last(sorts)),
								bN: total
							});
					});
			});
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.ct));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {bt: reqs, bE: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.cy;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.bt));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.bE)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					bX: r.bX,
					bZ: r.bZ,
					b4: A2(_Http_mapExpect, func, r.b4),
					b6: r.b6,
					ch: r.ch,
					cw: r.cw,
					cy: r.cy,
					V: r.V
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{bX: false, bZ: r.bZ, b4: r.b4, b6: r.b6, ch: r.ch, cw: r.cw, cy: r.cy, V: r.V}));
};
var $author$project$AonTool$fetchData = F2(
	function (searchAfter, _v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						cmd,
						$elm$http$Http$request(
						{
							bZ: $elm$http$Http$jsonBody(
								A2($author$project$AonTool$buildDataBody, model, searchAfter)),
							b4: A2($elm$http$Http$expectJson, $author$project$AonTool$GotDataResult, $author$project$AonTool$esResultDecoder),
							b6: _List_Nil,
							ch: 'POST',
							cw: $elm$core$Maybe$Just(10000),
							cy: $elm$core$Maybe$Nothing,
							V: model.aa + '/_search?track_total_hits=true'
						})
					])));
	});
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $webbhuset$elm_json_decode$Json$Decode$Field$attempt = F3(
	function (fieldName, valueDecoder, continuation) {
		return A2(
			$elm$json$Json$Decode$andThen,
			continuation,
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, fieldName, valueDecoder)));
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$AonTool$flagsDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$attempt,
	'localStorage',
	$elm$json$Json$Decode$dict($elm$json$Json$Decode$string),
	function (localStorage) {
		return $elm$json$Json$Decode$succeed(
			{
				ai: A2($elm$core$Maybe$withDefault, $author$project$AonTool$defaultFlags.ai, localStorage)
			});
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$AonTool$escapeRegex = function (string) {
	return A3(
		$elm$core$String$replace,
		'}',
		'\\}',
		A3(
			$elm$core$String$replace,
			'{',
			'\\{',
			A3(
				$elm$core$String$replace,
				']',
				'\\]',
				A3(
					$elm$core$String$replace,
					'[',
					'\\[',
					A3(
						$elm$core$String$replace,
						')',
						'\\)',
						A3(
							$elm$core$String$replace,
							'(',
							'\\(',
							A3(
								$elm$core$String$replace,
								'+',
								'\\+',
								A3(
									$elm$core$String$replace,
									'*',
									'\\*',
									A3(
										$elm$core$String$replace,
										'?',
										'\\?',
										A3(
											$elm$core$String$replace,
											'|',
											'\\|',
											A3(
												$elm$core$String$replace,
												'.',
												'\\.',
												A3(
													$elm$core$String$replace,
													'$',
													'\\$',
													A3(
														$elm$core$String$replace,
														'^',
														'\\^',
														A3($elm$core$String$replace, '\\', '\\\\', string))))))))))))));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {i: index, cg: match, cj: number, bD: submatches};
	});
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Basics$not = _Basics_not;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$never = _Regex_never;
var $author$project$AonTool$regexFromString = function (string) {
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		A2(
			$elm$regex$Regex$fromStringWith,
			{b_: true, ci: true},
			string));
};
var $elm$core$List$sortWith = _List_sortWith;
var $elm$core$String$toLower = _String_toLower;
var $author$project$AonTool$updateCandidates = function (_v0) {
	var model = _v0.a;
	var cmd = _v0.b;
	var candidates = A2(
		$elm$core$List$sortWith,
		F2(
			function (a, b) {
				var _v1 = A2($elm$core$Basics$compare, a.i, b.i);
				switch (_v1) {
					case 0:
						return 0;
					case 1:
						return A2(
							$elm$core$Basics$compare,
							$elm$core$String$length(b.r.g),
							$elm$core$String$length(a.r.g));
					default:
						return 2;
				}
			}),
		A2(
			$elm$core$List$filter,
			function (candidate) {
				return (model.d.c !== '') ? ((_Utils_cmp(candidate.i, model.d.l) > -1) && (_Utils_cmp(candidate.i, model.d.t) < 0)) : true;
			},
			A2(
				$elm$core$List$concatMap,
				function (document) {
					return A2(
						$elm$core$List$map,
						function (match) {
							return {r: document, i: match.i};
						},
						A2(
							$elm$regex$Regex$find,
							$author$project$AonTool$regexFromString(
								'(?<![a-zA-Z%])' + ($author$project$AonTool$escapeRegex(document.g) + '(?![a-zA-Z%])')),
							model.c));
				},
				A2(
					$elm$core$List$filter,
					function (document) {
						return A2(
							$elm$core$String$contains,
							$elm$core$String$toLower(document.g),
							$elm$core$String$toLower(model.c)) && ((!A2(
							$elm$core$List$member,
							document.y,
							_List_fromArray(
								['action-1167', 'creature-1969', 'rules-33', 'rules-90', 'rules-2040', 'rules-2882', 'rules-2586', 'rules-2559', 'rules-165', 'rules-2271', 'rules-2188', 'rules-2624']))) && (!((document.M === 'rules') && A2(
							$elm$core$List$member,
							document.g,
							_List_fromArray(
								['Attack', 'Bulk', 'Checks', 'Critical Failure', 'Critical Success', 'Damage', 'Effect', 'Effects', 'Example', 'Feat', 'Group', 'Hands', 'Hit Points', 'Level', 'Round', 'Saving Throw', 'Saving Throws', 'Senses', 'Size', 'Skill', 'Skills', 'Speed', 'Spell', 'Spells', 'Trait', 'Traits', 'Turn', 'Weapons'])))));
					},
					model.x))));
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{ar: candidates, O: $elm$core$Maybe$Nothing}),
		cmd);
};
var $author$project$AonTool$updateModelFromLocalStorage = F2(
	function (_v0, model) {
		var key = _v0.a;
		var value = _v0.b;
		switch (key) {
			case 'aon-url':
				return $elm$core$String$isEmpty(value) ? model : _Utils_update(
					model,
					{J: value});
			case 'data':
				var _v2 = A2(
					$elm$json$Json$Decode$decodeString,
					$elm$json$Json$Decode$list($author$project$AonTool$documentDecoder),
					value);
				if (!_v2.$) {
					var documents = _v2.a;
					return _Utils_update(
						model,
						{x: documents});
				} else {
					return model;
				}
			case 'elasticsearch-url':
				return $elm$core$String$isEmpty(value) ? model : _Utils_update(
					model,
					{aa: value});
			default:
				return model;
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$AonTool$init = function (flagsValue) {
	var flags = A2(
		$elm$core$Result$withDefault,
		$author$project$AonTool$defaultFlags,
		A2($elm$json$Json$Decode$decodeValue, $author$project$AonTool$flagsDecoder, flagsValue));
	return function (_v0) {
		var model = _v0.a;
		var cmd = _v0.b;
		return $elm$core$List$isEmpty(model.x) ? A2(
			$author$project$AonTool$fetchData,
			$elm$core$Maybe$Nothing,
			_Utils_Tuple2(model, cmd)) : $author$project$AonTool$updateCandidates(
			_Utils_Tuple2(model, cmd));
	}(
		_Utils_Tuple2(
			function (model) {
				return A3(
					$elm$core$List$foldl,
					$author$project$AonTool$updateModelFromLocalStorage,
					model,
					$elm$core$Dict$toList(flags.ai));
			}(
				{_: false, J: $author$project$AonTool$defaultAonUrl, ar: _List_Nil, O: $elm$core$Maybe$Nothing, P: $elm$core$Maybe$Nothing, Q: $elm$core$Maybe$Nothing, F: 0, x: _List_Nil, aa: $author$project$AonTool$defaultElasticsearchUrl, ag: false, A: '', ak: false, d: $author$project$AonTool$emptySelection, k: $elm$core$Dict$empty, c: '', aM: false, q: $elm$core$Maybe$Nothing}),
			$elm$core$Platform$Cmd$none));
};
var $author$project$AonTool$GotClipboardContents = function (a) {
	return {$: 14, a: a};
};
var $author$project$AonTool$SelectionChanged = function (a) {
	return {$: 28, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$AonTool$clipboard_receive = _Platform_incomingPort('clipboard_receive', $elm$json$Json$Decode$string);
var $author$project$AonTool$KeyPressed = function (a) {
	return {$: 16, a: a};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$AonTool$keyEventDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'ctrlKey',
	$elm$json$Json$Decode$bool,
	function (ctrl) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'key',
			$elm$json$Json$Decode$string,
			function (key) {
				return A2(
					$elm$json$Json$Decode$map,
					$author$project$AonTool$KeyPressed,
					$elm$json$Json$Decode$succeed(
						{N: ctrl, R: key}));
			});
	});
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {bk: pids, bE: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aZ: event, R: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.bk,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.R;
		var event = _v0.aZ;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.bE);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$AonTool$selection_changed = _Platform_incomingPort('selection_changed', $elm$json$Json$Decode$value);
var $author$project$AonTool$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$AonTool$clipboard_receive($author$project$AonTool$GotClipboardContents),
				$author$project$AonTool$selection_changed($author$project$AonTool$SelectionChanged),
				$elm$browser$Browser$Events$onKeyDown($author$project$AonTool$keyEventDecoder)
			]));
};
var $author$project$AonTool$AddBrPressed = {$: 0};
var $author$project$AonTool$DebouncePassed = function (a) {
	return {$: 10, a: a};
};
var $author$project$AonTool$FixNewlinesPressed = {$: 12};
var $author$project$AonTool$UndoPressed = {$: 33};
var $author$project$AonTool$WrapWithPressed = F2(
	function (a, b) {
		return {$: 34, a: a, b: b};
	});
var $author$project$AonTool$actionIdFromString = function (value) {
	switch (value) {
		case '[one-action]':
			return '2';
		case '[two-actions]':
			return '3';
		case '[three-actions]':
			return '4';
		case '[reaction]':
			return '5';
		case '[free-action]':
			return '6';
		default:
			return 'NULL';
	}
};
var $author$project$AonTool$getDocumentLinkCode = function (document) {
	var _v0 = document.M;
	switch (_v0) {
		case 'action':
			return 'ACTIONS';
		case 'ancestry':
			return 'ANCESTRIES';
		case 'animal-companion':
			return 'COMPANIONS';
		case 'animal-companion-advanced':
			return 'ANIMAL.COMPANIONS.ADVANCED';
		case 'animal-companion-specialization':
			return 'ANIMAL.COMPANIONS.SPECIALIZED';
		case 'animal-companion-unique':
			return 'ANIMAL.COMPANIONS.UNIQUE';
		case 'arcane-school':
			return 'CLASS.ARCANE.SCHOOLS';
		case 'arcane-thesis':
			return 'CLASS.ARCANE.THESIS';
		case 'archetype':
			return 'ARCHETYPES';
		case 'armor':
			return 'ARMOR';
		case 'armor-specialization':
			return 'ARMOR.GROUPS';
		case 'article':
			return 'ARTICLES';
		case 'background':
			return 'BACKGROUNDS';
		case 'bloodline':
			return 'CLASS.BLOODLINES';
		case 'campsite-meal':
			return 'CAMPSITE.MEALS';
		case 'cause':
			return 'CLASS.CHAMPION.CAUSES';
		case 'class':
			return 'CLASSES';
		case 'condition':
			return 'CONDITIONS';
		case 'conscious-mind':
			return 'CLASS.CONSCIOUS.MINDS';
		case 'creature':
			return 'MONSTERS';
		case 'creature-ability':
			return 'UMR';
		case 'creature-adjustment':
			return 'TEMPLATES';
		case 'creature-family':
			return 'MON.FAMILY';
		case 'creature-theme-template':
			return '';
		case 'curse':
			return 'CURSES';
		case 'deity':
			return 'DEITIES';
		case 'deity-category':
			return 'DEITY.CATEGORIES';
		case 'deviant-ability-classification':
			return 'FEATS.DEVIANT';
		case 'disease':
			return 'DISEASES';
		case 'doctrine':
			return 'CLASS.DOCTRINES';
		case 'domain':
			return 'DOMAINS';
		case 'druidic-order':
			return 'CLASS.DRUID.ORDERS';
		case 'eidolon':
			return 'EIDOLONS';
		case 'element':
			return 'CLASS.ELEMENTS';
		case 'equipment':
			return 'EQUIPMENT';
		case 'familiar-ability':
			return 'FAMILIAR.ABILITIES';
		case 'familiar-specific':
			return 'FAMILIARS.SPECIFIC';
		case 'feat':
			return 'FEATS';
		case 'hazard':
			return 'HAZARDS';
		case 'hellknight-order':
			return '';
		case 'heritage':
			return 'HERITAGES';
		case 'hunters-edge':
			return 'CLASS.HUNTERS.EDGES';
		case 'hybrid-study':
			return 'CLASS.HYBRID.STUDIES';
		case 'implement':
			return 'CLASS.IMPLEMENTS';
		case 'innovation':
			return 'CLASS.INNOVATIONS';
		case 'instinct':
			return 'CLASS.INSTINCTS';
		case 'kingdom-event':
			return 'KINGDOM.EVENTS';
		case 'kingdom-structure':
			return 'KINGDOM.STRUCTURES';
		case 'language':
			return 'LANGUAGES';
		case 'lesson':
			return 'CLASS.WITCH.LESSONS';
		case 'methodology':
			return 'CLASS.METHODOLOGIES';
		case 'muse':
			return 'CLASS.MUSES';
		case 'mystery':
			return 'CLASS.MYSTERIES';
		case 'patron':
			return 'CLASS.WITCH.PATRONS';
		case 'plane':
			return 'PLANES';
		case 'racket':
			return 'CLASS.RACKETS';
		case 'relic':
			return 'RELIC.GIFTS';
		case 'research-field':
			return 'CLASS.RESEARCH.FIELDS';
		case 'ritual':
			return 'RITUALS';
		case 'rules':
			return 'RULES';
		case 'set-relic':
			return '';
		case 'shield':
			return 'SHIELDS';
		case 'siege-weapon':
			return 'SIEGE.WEAPONS';
		case 'skill':
			return 'SKILLS';
		case 'skill-general-action':
			return 'SKILLS.GENERAL';
		case 'source':
			return 'SOURCES';
		case 'spell':
			return 'SPELLS';
		case 'style':
			return 'CLASS.SWASH.STYLES';
		case 'subconscious-mind':
			return 'CLASS.SUBCONSCIOUS.MINDS';
		case 'tenet':
			return 'CLASS.TENETS';
		case 'tradition':
			return 'TRADITIONS';
		case 'trait':
			return 'TRAITS';
		case 'vehicle':
			return 'VEHICLES';
		case 'warfare-army':
			return '';
		case 'warfare-tactic':
			return 'WARFARE.TACTICS';
		case 'way':
			return 'CLASS.WAYS';
		case 'weapon-group':
			return 'WEAPON.GROUPS';
		case 'weapon':
			return 'WEAPONS';
		case 'weather-hazard':
			return 'HAZARDS.WEATHER';
		default:
			return '';
	}
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$maybe_extra$Maybe$Extra$join = function (mx) {
	if (!mx.$) {
		var x = mx.a;
		return x;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$AonTool$getDocumentLinkId = function (document) {
	return A2(
		$elm$core$Maybe$withDefault,
		document.y,
		$elm_community$maybe_extra$Maybe$Extra$join(
			A2(
				$elm$core$Maybe$andThen,
				$elm$core$List$head,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.bD;
					},
					$elm$core$List$head(
						A2(
							$elm$regex$Regex$find,
							$author$project$AonTool$regexFromString('.*?-([0-9]+)'),
							document.y))))));
};
var $author$project$AonTool$getDocumentLink = function (document) {
	return '<%' + ($author$project$AonTool$getDocumentLinkCode(document) + ('%' + ($author$project$AonTool$getDocumentLinkId(document) + '%%>')));
};
var $author$project$AonTool$addLinkTag = F2(
	function (document, string) {
		return (document.M === 'spell') ? ($author$project$AonTool$getDocumentLink(document) + ('<i>' + (string + '</i><%END>'))) : ($author$project$AonTool$getDocumentLink(document) + (string + '<%END>'));
	});
var $elm_community$string_extra$String$Extra$replaceSlice = F4(
	function (substitution, start, end, string) {
		return _Utils_ap(
			A3($elm$core$String$slice, 0, start, string),
			_Utils_ap(
				substitution,
				A3(
					$elm$core$String$slice,
					end,
					$elm$core$String$length(string),
					string)));
	});
var $author$project$AonTool$applyCandidate = F2(
	function (candidate, text) {
		var endIndex = candidate.i + $elm$core$String$length(candidate.r.g);
		return A4(
			$elm_community$string_extra$String$Extra$replaceSlice,
			A2(
				$author$project$AonTool$addLinkTag,
				candidate.r,
				A3($elm$core$String$slice, candidate.i, endIndex, text)),
			candidate.i,
			endIndex,
			text);
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{b_: false, ci: false},
		string);
};
var $elm_community$string_extra$String$Extra$regexFromString = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$fromString,
	$elm$core$Maybe$withDefault($elm$regex$Regex$never));
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm$core$String$trim = _String_trim;
var $elm_community$string_extra$String$Extra$clean = function (string) {
	return $elm$core$String$trim(
		A3(
			$elm$regex$Regex$replace,
			$elm_community$string_extra$String$Extra$regexFromString('\\s\\s+'),
			$elm$core$Basics$always(' '),
			string));
};
var $author$project$AonTool$clipboard_get = _Platform_outgoingPort(
	'clipboard_get',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$AonTool$clipboard_set = _Platform_outgoingPort('clipboard_set', $elm$json$Json$Encode$string);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $author$project$AonTool$actionsColumns = _List_fromArray(
	['ActionsID', 'Name', 'NameDisplay', 'TitleName', 'SourcesID', 'Page', 'TableName', 'ObjectID', 'ActionTypesID', 'Description', 'ProficienciesID', 'BasicAction', 'SpecialBasicAction', 'Prerequisites', 'Trigger', 'Requirements', 'Frequency', 'Cost', 'CriticalEffectsID', 'ActivateAction', 'ActivateSource', 'LegacyID']);
var $author$project$AonTool$animalCompanionsColumns = _List_fromArray(
	['Size', 'STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'HitPoints', 'SkillsID', 'SkillOther', 'Senses', 'Speed', 'Special', 'SupportBenefit', 'AdvancedManeuver']);
var $author$project$AonTool$criticalEffectsColumns = _List_fromArray(
	['CritSuccess', 'Success', 'Failure', 'CritFailure']);
var $author$project$AonTool$featsColumns = _List_fromArray(
	['Prerequisites', 'Access', 'Requirements', 'Special', 'SpecialBreak', 'Frequency', 'Trigger', 'Duration', 'Cost']);
var $author$project$AonTool$ritualsColumns = _List_fromArray(
	['Access', 'Cast', 'Cost', 'SecondaryCasters', 'PrimaryChecks', 'SecondaryChecks', 'Requirements', 'Range', 'Area', 'Targets', 'Duration']);
var $author$project$AonTool$spellsColumns = _List_fromArray(
	['CastString', 'Cost', 'CostString', 'Requirements', 'Trigger', 'Range', 'Area', 'Targets', 'SavingThrow', 'Duration', 'Defense']);
var $author$project$AonTool$treasureColumns = _List_fromArray(
	['Price', 'PriceAdded', 'PriceExtra', 'Ammunition', 'Hands', 'Onset', 'Usage', 'Bulk', 'BulkOther', 'Duration', 'MiscHeader', 'ActivateActionID', 'ActivateActionTypesID', 'ActivateOther', 'Description', 'Destruction', 'CritEffects', 'CraftRequirements', 'Access']);
var $author$project$AonTool$currentTableColumns = function (model) {
	var _v0 = model.P;
	if (!_v0.$) {
		switch (_v0.a) {
			case 0:
				var _v1 = _v0.a;
				return $author$project$AonTool$actionsColumns;
			case 1:
				var _v2 = _v0.a;
				return $author$project$AonTool$animalCompanionsColumns;
			case 2:
				var _v3 = _v0.a;
				return $author$project$AonTool$criticalEffectsColumns;
			case 3:
				var _v4 = _v0.a;
				return $author$project$AonTool$featsColumns;
			case 4:
				var _v5 = _v0.a;
				return $author$project$AonTool$ritualsColumns;
			case 5:
				var _v6 = _v0.a;
				return $author$project$AonTool$spellsColumns;
			default:
				var _v7 = _v0.a;
				return $author$project$AonTool$treasureColumns;
		}
	} else {
		return _List_Nil;
	}
};
var $author$project$AonTool$document_scrollTo = _Platform_outgoingPort('document_scrollTo', $elm$json$Json$Encode$string);
var $author$project$AonTool$encodeDocument = function (document) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'_id',
				$elm$json$Json$Encode$string(document.y)),
				_Utils_Tuple2(
				'_source',
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'category',
							$elm$json$Json$Encode$string(document.M)),
							_Utils_Tuple2(
							'name',
							$elm$json$Json$Encode$string(document.g)),
							_Utils_Tuple2(
							'url',
							$elm$json$Json$Encode$string(document.V))
						])))
			]));
};
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$AonTool$explodePersistentDamage = function (document) {
	return ((document.g === 'Persistent Damage') && (document.M === 'condition')) ? A2(
		$elm$core$List$cons,
		document,
		A2(
			$elm$core$List$map,
			function (damageType) {
				return _Utils_update(
					document,
					{y: document.y + ('-' + damageType), g: 'Persistent ' + (damageType + ' Damage')});
			},
			_List_fromArray(
				['Acid', 'Area', 'Bleed', 'Bludgeoning', 'Chaotic', 'Cold', 'Electricity', 'Evil', 'Fire', 'Force', 'Good', 'Holy', 'Lawful', 'Mental', 'Negative', 'Piercing', 'Poison', 'Positive', 'Slashing', 'Sonic', 'Spirit', 'Splashing', 'Unholy']))) : _List_fromArray(
		[document]);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $author$project$AonTool$getSubmatch = F3(
	function (index, _default, match) {
		return A2(
			$elm$core$Maybe$withDefault,
			_default,
			$elm_community$maybe_extra$Maybe$Extra$join(
				A2($elm_community$list_extra$List$Extra$getAt, index, match.bD)));
	});
var $elm_community$list_extra$List$Extra$groupWhile = F2(
	function (isSameGroup, items) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					if (!acc.b) {
						return _List_fromArray(
							[
								_Utils_Tuple2(x, _List_Nil)
							]);
					} else {
						var _v1 = acc.a;
						var y = _v1.a;
						var restOfGroup = _v1.b;
						var groups = acc.b;
						return A2(isSameGroup, x, y) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								x,
								A2($elm$core$List$cons, y, restOfGroup)),
							groups) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(x, _List_Nil),
							acc);
					}
				}),
			_List_Nil,
			items);
	});
var $author$project$AonTool$headersRegex = function (headers) {
	return function (s) {
		return $author$project$AonTool$regexFromString('^.*?' + (s + '$'));
	}(
		A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				function (header) {
					return '(?:' + (header + ' (.*?))?;? ?');
				},
				headers)));
};
var $elm_community$string_extra$String$Extra$insertAt = F3(
	function (insert, pos, string) {
		return A4($elm_community$string_extra$String$Extra$replaceSlice, insert, pos, pos, string);
	});
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $elm_community$string_extra$String$Extra$firstResultHelp = F2(
	function (_default, list) {
		firstResultHelp:
		while (true) {
			if (!list.b) {
				return _default;
			} else {
				if (!list.a.$) {
					var a = list.a.a;
					return a;
				} else {
					var _v1 = list.a;
					var rest = list.b;
					var $temp$default = _default,
						$temp$list = rest;
					_default = $temp$default;
					list = $temp$list;
					continue firstResultHelp;
				}
			}
		}
	});
var $elm_community$string_extra$String$Extra$firstResult = function (list) {
	return A2($elm_community$string_extra$String$Extra$firstResultHelp, '', list);
};
var $elm_community$string_extra$String$Extra$regexEscape = A2(
	$elm$regex$Regex$replace,
	$elm_community$string_extra$String$Extra$regexFromString('[-/\\^$*+?.()|[\\]{}]'),
	function (_v0) {
		var match = _v0.cg;
		return '\\' + match;
	});
var $elm_community$string_extra$String$Extra$leftOf = F2(
	function (pattern, string) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.bD;
					},
					$elm_community$string_extra$String$Extra$firstResult),
				A3(
					$elm$regex$Regex$findAtMost,
					1,
					$elm_community$string_extra$String$Extra$regexFromString(
						'^(.*?)' + $elm_community$string_extra$String$Extra$regexEscape(pattern)),
					string)));
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm_community$string_extra$String$Extra$nonEmpty = function (string) {
	return $elm$core$String$isEmpty(string) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(string);
};
var $elm_community$maybe_extra$Maybe$Extra$orList = function (maybes) {
	orList:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (maybes.a.$ === 1) {
				var _v1 = maybes.a;
				var rest = maybes.b;
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue orList;
			} else {
				var answer = maybes.a.a;
				return $elm$core$Maybe$Just(answer);
			}
		}
	}
};
var $elm$core$String$filter = _String_filter;
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$AonTool$parsePrice = function (str) {
	var value = A2(
		$elm$core$Maybe$withDefault,
		0,
		$elm$core$String$toInt(
			A2($elm$core$String$filter, $elm$core$Char$isDigit, str)));
	return A2($elm$core$String$contains, ' gp', str) ? $elm$core$String$fromInt(value * 10) : (A2($elm$core$String$contains, ' sp', str) ? $elm$core$String$fromInt(value) : (A2($elm$core$String$contains, ' cp', str) ? $elm$core$String$fromFloat(value * 0.1) : str));
};
var $author$project$AonTool$localStorage_set = _Platform_outgoingPort('localStorage_set', $elm$core$Basics$identity);
var $author$project$AonTool$saveToLocalStorage = F2(
	function (key, value) {
		return $author$project$AonTool$localStorage_set(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'key',
						$elm$json$Json$Encode$string(key)),
						_Utils_Tuple2(
						'value',
						$elm$json$Json$Encode$string(value))
					])));
	});
var $elm_community$list_extra$List$Extra$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				if (!list.b) {
					return $elm$core$List$reverse(memo);
				} else {
					var x = list.a;
					var xs = list.b;
					if (predicate(x)) {
						var $temp$memo = A2($elm$core$List$cons, x, memo),
							$temp$list = xs;
						memo = $temp$memo;
						list = $temp$list;
						continue takeWhileMemo;
					} else {
						return $elm$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(_List_Nil);
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$AonTool$selectionDecoder = A3(
	$webbhuset$elm_json_decode$Json$Decode$Field$require,
	'text',
	$elm$json$Json$Decode$string,
	function (text) {
		return A3(
			$webbhuset$elm_json_decode$Json$Decode$Field$require,
			'start',
			$elm$json$Json$Decode$int,
			function (start) {
				return A3(
					$webbhuset$elm_json_decode$Json$Decode$Field$require,
					'end',
					$elm$json$Json$Decode$int,
					function (end) {
						return $elm$json$Json$Decode$succeed(
							{
								t: end - $elm$core$List$length(
									A2(
										$elm_community$list_extra$List$Extra$takeWhile,
										$elm$core$Basics$eq(' '),
										$elm$core$List$reverse(
											$elm$core$String$toList(text)))),
								l: start + $elm$core$List$length(
									A2(
										$elm_community$list_extra$List$Extra$takeWhile,
										$elm$core$Basics$eq(' '),
										$elm$core$String$toList(text))),
								c: $elm$core$String$trim(text)
							});
					});
			});
	});
var $author$project$AonTool$selection_set = _Platform_outgoingPort('selection_set', $elm$core$Basics$identity);
var $author$project$AonTool$setSelection = F2(
	function (start, end) {
		return $author$project$AonTool$selection_set(
			$elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'start',
						$elm$json$Json$Encode$int(start)),
						_Utils_Tuple2(
						'end',
						$elm$json$Json$Encode$int(end))
					])));
	});
var $elm$core$Process$sleep = _Process_sleep;
var $elm$core$List$sortBy = _List_sortBy;
var $elm$regex$Regex$split = _Regex_splitAtMost(_Regex_infinity);
var $author$project$AonTool$undoFromModel = function (model) {
	return {d: model.d, k: model.k, c: model.c};
};
var $elm_community$list_extra$List$Extra$zip = $elm$core$List$map2($elm$core$Tuple$pair);
var $author$project$AonTool$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 0:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									c: A3($elm_community$string_extra$String$Extra$insertAt, '<br />', model.d.l, model.c),
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							_Utils_eq(model.d.l, model.d.t) ? A2($author$project$AonTool$setSelection, model.d.l + 6, model.d.l + 6) : A2($author$project$AonTool$setSelection, model.d.l, model.d.t + 6)));
				case 1:
					var value = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{_: value}),
						$elm$core$Platform$Cmd$none);
				case 2:
					var value = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{J: value}),
						A2($author$project$AonTool$saveToLocalStorage, 'aon-url', value));
				case 3:
					var candidate = msg.a;
					var text = A2($author$project$AonTool$applyCandidate, candidate, model.c);
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v1 = model.Q;
										if (!_v1.$) {
											var column = _v1.a;
											return A3($elm$core$Dict$insert, column, text, model.k);
										} else {
											return model.k;
										}
									}(),
									c: text,
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 4:
					var candidate = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								O: $elm$core$Maybe$Just(candidate)
							}),
						$author$project$AonTool$document_scrollTo('current-candidate'));
				case 5:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								c: A3(
									$elm$core$String$replace,
									'[free-action]',
									'<%ACTION.TYPES#6%%>',
									A3(
										$elm$core$String$replace,
										'[reaction]',
										'<%ACTION.TYPES#5%%>',
										A3(
											$elm$core$String$replace,
											'[three-actions]',
											'<%ACTION.TYPES#4%%>',
											A3(
												$elm$core$String$replace,
												'[two-actions]',
												'<%ACTION.TYPES#3%%>',
												A3($elm$core$String$replace, '[one-action]', '<%ACTION.TYPES#2%%>', model.c)))))
							}),
						$elm$core$Platform$Cmd$none);
				case 6:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								c: A4(
									$elm_community$string_extra$String$Extra$replaceSlice,
									function (s) {
										return '<ul><li>' + (s + '</li></ul>');
									}(
										A2(
											$elm$core$String$join,
											'</li><li>',
											A2(
												$elm$core$List$filter,
												A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
												A2(
													$elm$core$List$map,
													$elm$core$String$trim,
													A2(
														$elm$regex$Regex$split,
														$author$project$AonTool$regexFromString('[\n•]|[\\*\\-] '),
														model.d.c))))),
									model.d.l,
									model.d.t,
									model.c),
								q: $elm$core$Maybe$Just(
									$author$project$AonTool$undoFromModel(model))
							}),
						$elm$core$Platform$Cmd$none);
				case 7:
					return _Utils_Tuple2(
						model,
						$author$project$AonTool$clipboard_set(
							A2(
								$elm$core$String$join,
								'\t',
								A2(
									$elm$core$List$map,
									function (column) {
										return function (s) {
											return (s === '') ? 'NULL' : s;
										}(
											A2(
												$elm$core$Maybe$withDefault,
												'NULL',
												A2($elm$core$Dict$get, column, model.k)));
									},
									$author$project$AonTool$currentTableColumns(model)))));
				case 8:
					return _Utils_Tuple2(
						model,
						$author$project$AonTool$clipboard_set(model.c));
				case 9:
					return _Utils_Tuple2(
						model,
						$author$project$AonTool$clipboard_set(
							function (s) {
								return s + '.';
							}(
								A2($elm_community$string_extra$String$Extra$leftOf, '.', model.c))));
				case 10:
					var debounce = msg.a;
					return _Utils_eq(model.F, debounce) ? $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 11:
					var value = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aa: value}),
						A2($author$project$AonTool$saveToLocalStorage, 'elasticsearch-url', value));
				case 12:
					var lines = A2($elm$core$String$split, '\n', model.c);
					var median = A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm_community$list_extra$List$Extra$getAt,
							($elm$core$List$length(lines) / 2) | 0,
							A2($elm$core$List$map, $elm$core$String$length, lines)));
					var fixed = $elm$core$String$trim(
						A2(
							$elm$core$String$join,
							'<br /><br />',
							A2(
								$elm$core$List$map,
								function (_v2) {
									var first = _v2.a;
									var rest = _v2.b;
									return first + (' ' + A2($elm$core$String$join, ' ', rest));
								},
								A2(
									$elm_community$list_extra$List$Extra$groupWhile,
									F2(
										function (a, b) {
											return (!A2($elm$core$String$endsWith, '.', a)) || (A2($elm$core$String$startsWith, '• ', b) || (_Utils_cmp(
												$elm$core$String$length(a),
												median - 10) > 0));
										}),
									A2(
										$elm$core$List$filter,
										A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
										A2($elm$core$List$map, $elm$core$String$trim, lines))))));
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									c: fixed,
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 13:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									c: A2(
										$elm$core$String$join,
										'\n',
										A2(
											$elm$core$List$map,
											function (trait) {
												return trait.y + ('\t' + trait.g);
											},
											A2(
												$elm$core$List$sortBy,
												function ($) {
													return $.g;
												},
												A3(
													$elm$core$List$foldl,
													F2(
														function (document, result) {
															if (A2(
																$elm$core$String$contains,
																$elm$core$String$toLower(document.g),
																result.c)) {
																var traitId = A3($elm$core$String$replace, 'trait-', '', document.y);
																var firstMatch = $elm$core$List$head(
																	A2(
																		$elm$regex$Regex$find,
																		$author$project$AonTool$regexFromString(
																			'(?<![a-zA-Z%])' + ($author$project$AonTool$escapeRegex(document.g) + '(?![a-zA-Z%])')),
																		result.c));
																if (!firstMatch.$) {
																	var match = firstMatch.a;
																	return _Utils_update(
																		result,
																		{
																			c: A4(
																				$elm_community$string_extra$String$Extra$replaceSlice,
																				'',
																				match.i,
																				match.i + $elm$core$String$length(document.g),
																				result.c),
																			aC: A2(
																				$elm$core$List$cons,
																				{y: traitId, g: document.g},
																				result.aC)
																		});
																} else {
																	return result;
																}
															} else {
																return result;
															}
														}),
													{
														c: $elm$core$String$toLower(model.c),
														aC: _List_Nil
													},
													$elm$core$List$reverse(
														A2(
															$elm$core$List$sortBy,
															A2(
																$elm$core$Basics$composeR,
																function ($) {
																	return $.g;
																},
																$elm$core$String$length),
															A2(
																$elm$core$List$filter,
																A2(
																	$elm$core$Basics$composeR,
																	function ($) {
																		return $.M;
																	},
																	$elm$core$Basics$eq('trait')),
																model.x)))).aC)))
								}),
							$elm$core$Platform$Cmd$none));
				case 14:
					var value = msg.a;
					return model.ak ? $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									Q: $elm$core$Maybe$Nothing,
									A: '',
									d: $author$project$AonTool$emptySelection,
									k: $elm$core$Dict$fromList(
										A2(
											$elm_community$list_extra$List$Extra$zip,
											$author$project$AonTool$currentTableColumns(model),
											A2($elm$core$String$split, '\t', value))),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none)) : $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									A: '',
									d: $author$project$AonTool$emptySelection,
									c: A3($elm$core$String$replace, '\r', '', value),
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 15:
					var result = msg.a;
					if (!result.$) {
						var searchResult = result.a;
						return ((_Utils_cmp(
							$elm$core$List$length(searchResult.x),
							$author$project$AonTool$dataSize) < 0) ? function (_v5) {
							var m = _v5.a;
							var cmd = _v5.b;
							return _Utils_Tuple2(
								m,
								A2(
									$author$project$AonTool$saveToLocalStorage,
									'data',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										A2($elm$json$Json$Encode$list, $author$project$AonTool$encodeDocument, m.x))));
						} : $author$project$AonTool$fetchData(
							$elm$core$Maybe$Just(searchResult.aJ)))(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										x: A2(
											$elm$core$List$append,
											model.x,
											A2($elm$core$List$concatMap, $author$project$AonTool$explodePersistentDamage, searchResult.x))
									}),
								$elm$core$Platform$Cmd$none));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 16:
					var event = msg.a;
					if (event.N && (event.R === 'b')) {
						var $temp$msg = A2($author$project$AonTool$WrapWithPressed, '<b>', '</b>'),
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						if (event.N && (event.R === 'i')) {
							var $temp$msg = A2($author$project$AonTool$WrapWithPressed, '<i>', '</i>'),
								$temp$model = model;
							msg = $temp$msg;
							model = $temp$model;
							continue update;
						} else {
							if (event.N && (event.R === 'u')) {
								var $temp$msg = A2($author$project$AonTool$WrapWithPressed, '<u>', '</u>'),
									$temp$model = model;
								msg = $temp$msg;
								model = $temp$model;
								continue update;
							} else {
								if (event.N && (event.R === 'z')) {
									var $temp$msg = $author$project$AonTool$UndoPressed,
										$temp$model = model;
									msg = $temp$msg;
									model = $temp$model;
									continue update;
								} else {
									if (event.N && (event.R === ' ')) {
										var $temp$msg = $author$project$AonTool$FixNewlinesPressed,
											$temp$model = model;
										msg = $temp$msg;
										model = $temp$model;
										continue update;
									} else {
										if (event.N && (event.R === 'Enter')) {
											var $temp$msg = $author$project$AonTool$AddBrPressed,
												$temp$model = model;
											msg = $temp$msg;
											model = $temp$model;
											continue update;
										} else {
											return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
										}
									}
								}
							}
						}
					}
				case 17:
					var value = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: model.F + 1, A: value}),
						A2(
							$elm$core$Task$perform,
							function (_v6) {
								return $author$project$AonTool$DebouncePassed(model.F + 1);
							},
							$elm$core$Process$sleep(250)));
				case 18:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v7 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$regexFromString('(?:Activate—)?(.+) (\\[.+\\]) (\\(.+\\))? ?(?:Trigger (.+?);? ?)?(?:Frequency (.+?);? ?)?(?:Requirements (.+?);? ?)?(?:Effects? (.+))'),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v7.b) {
											var match = _v7.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2('ActionsID', ''),
															_Utils_Tuple2(
															'Name',
															A3($author$project$AonTool$getSubmatch, 2, '', match)),
															_Utils_Tuple2(
															'NameDisplay',
															A3($author$project$AonTool$getSubmatch, 2, '', match)),
															_Utils_Tuple2(
															'TitleName',
															A3($author$project$AonTool$getSubmatch, 0, '', match)),
															_Utils_Tuple2('SourcesID', ''),
															_Utils_Tuple2('Page', ''),
															_Utils_Tuple2('TableName', ''),
															_Utils_Tuple2('ObjectID', ''),
															_Utils_Tuple2(
															'ActionTypesID',
															$author$project$AonTool$actionIdFromString(
																A3($author$project$AonTool$getSubmatch, 1, '', match))),
															_Utils_Tuple2(
															'Description',
															A3($author$project$AonTool$getSubmatch, 6, '', match)),
															_Utils_Tuple2('ProficienciesID', ''),
															_Utils_Tuple2('BasicAction', '0'),
															_Utils_Tuple2('SpecialBasicAction', '0'),
															_Utils_Tuple2('Prerequisites', ''),
															_Utils_Tuple2(
															'Trigger',
															A3($author$project$AonTool$getSubmatch, 3, '', match)),
															_Utils_Tuple2(
															'Requirements',
															A3($author$project$AonTool$getSubmatch, 5, '', match)),
															_Utils_Tuple2(
															'Frequency',
															A3($author$project$AonTool$getSubmatch, 4, '', match)),
															_Utils_Tuple2('Cost', ''),
															_Utils_Tuple2('CriticalEffectsID', ''),
															_Utils_Tuple2('ActivateAction', '1'),
															_Utils_Tuple2('ActivateSource', ''),
															_Utils_Tuple2('LegacyID', '')
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 19:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v8 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$headersRegex(
												_List_fromArray(
													['Size', 'Melee', 'Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha', 'Hit Points', 'Skill', 'Senses', 'Speed', 'Special', 'Support Benefit', 'Advanced Maneuver'])),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v8.b) {
											var match = _v8.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2(
															'Size',
															A3($author$project$AonTool$getSubmatch, 0, '', match)),
															_Utils_Tuple2(
															'STR',
															A3(
																$elm$core$String$replace,
																',',
																'',
																A3(
																	$elm$core$String$replace,
																	'+',
																	'',
																	A3($author$project$AonTool$getSubmatch, 2, '', match)))),
															_Utils_Tuple2(
															'DEX',
															A3(
																$elm$core$String$replace,
																',',
																'',
																A3(
																	$elm$core$String$replace,
																	'+',
																	'',
																	A3($author$project$AonTool$getSubmatch, 3, '', match)))),
															_Utils_Tuple2(
															'CON',
															A3(
																$elm$core$String$replace,
																',',
																'',
																A3(
																	$elm$core$String$replace,
																	'+',
																	'',
																	A3($author$project$AonTool$getSubmatch, 4, '', match)))),
															_Utils_Tuple2(
															'INT',
															A3(
																$elm$core$String$replace,
																',',
																'',
																A3(
																	$elm$core$String$replace,
																	'+',
																	'',
																	A3($author$project$AonTool$getSubmatch, 5, '', match)))),
															_Utils_Tuple2(
															'WIS',
															A3(
																$elm$core$String$replace,
																',',
																'',
																A3(
																	$elm$core$String$replace,
																	'+',
																	'',
																	A3($author$project$AonTool$getSubmatch, 6, '', match)))),
															_Utils_Tuple2(
															'CHA',
															A3(
																$elm$core$String$replace,
																'+',
																'',
																A3($author$project$AonTool$getSubmatch, 7, '', match))),
															_Utils_Tuple2(
															'HitPoints',
															A3($author$project$AonTool$getSubmatch, 8, '', match)),
															_Utils_Tuple2(
															'SkillsID',
															A3($author$project$AonTool$getSubmatch, 9, '', match)),
															_Utils_Tuple2(
															'Senses',
															A3($author$project$AonTool$getSubmatch, 10, '', match)),
															_Utils_Tuple2(
															'Speed',
															A3($author$project$AonTool$getSubmatch, 11, '', match)),
															_Utils_Tuple2(
															'Special',
															A3($author$project$AonTool$getSubmatch, 12, '', match)),
															_Utils_Tuple2(
															'SupportBenefit',
															A3($author$project$AonTool$getSubmatch, 13, '', match)),
															_Utils_Tuple2(
															'AdvancedManeuver',
															A3($author$project$AonTool$getSubmatch, 14, '', match))
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 20:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v9 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$headersRegex(
												_List_fromArray(
													['Critical Success', 'Success', 'Failure', 'Critical Failure'])),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v9.b) {
											var match = _v9.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2(
															'CritSuccess',
															A3($author$project$AonTool$getSubmatch, 0, '', match)),
															_Utils_Tuple2(
															'Success',
															A3($author$project$AonTool$getSubmatch, 1, '', match)),
															_Utils_Tuple2(
															'Failure',
															A3($author$project$AonTool$getSubmatch, 2, '', match)),
															_Utils_Tuple2(
															'CritFailure',
															A3($author$project$AonTool$getSubmatch, 3, '', match))
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 21:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v10 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$headersRegex(
												_List_fromArray(
													['Access', 'Cost', 'Prerequisites', 'Frequency', 'Trigger', 'Requirements', 'Duration'])),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v10.b) {
											var match = _v10.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2(
															'Access',
															A3($author$project$AonTool$getSubmatch, 0, '', match)),
															_Utils_Tuple2(
															'Cost',
															A3($author$project$AonTool$getSubmatch, 1, '', match)),
															_Utils_Tuple2(
															'Prerequisites',
															A3($author$project$AonTool$getSubmatch, 2, '', match)),
															_Utils_Tuple2(
															'Frequency',
															A3($author$project$AonTool$getSubmatch, 3, '', match)),
															_Utils_Tuple2(
															'Trigger',
															A3($author$project$AonTool$getSubmatch, 4, '', match)),
															_Utils_Tuple2(
															'Requirements',
															A3($author$project$AonTool$getSubmatch, 5, '', match)),
															_Utils_Tuple2(
															'Duration',
															A3($author$project$AonTool$getSubmatch, 6, '', match))
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 22:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								k: function () {
									var _v11 = A2(
										$elm$regex$Regex$find,
										$author$project$AonTool$headersRegex(
											_List_fromArray(
												['Access', 'Cast', 'Cost', 'Secondary Casters', 'Primary Check', 'Secondary Checks', 'Requirements', 'Range', 'Area', 'Targets', 'Defense', 'Duration'])),
										$elm_community$string_extra$String$Extra$clean(
											A3(
												$elm$core$String$replace,
												'\n',
												' ',
												A3($elm$core$String$replace, '\r', '', model.c))));
									if (_v11.b) {
										var match = _v11.a;
										return $elm$core$Dict$fromList(
											A2(
												$elm$core$List$map,
												$elm$core$Tuple$mapSecond($elm$core$String$trim),
												_List_fromArray(
													[
														_Utils_Tuple2(
														'Access',
														A3($author$project$AonTool$getSubmatch, 0, '', match)),
														_Utils_Tuple2(
														'Cast',
														A3($author$project$AonTool$getSubmatch, 1, '', match)),
														_Utils_Tuple2(
														'Cost',
														A3($author$project$AonTool$getSubmatch, 2, '', match)),
														_Utils_Tuple2(
														'SecondaryCasters',
														A3($author$project$AonTool$getSubmatch, 3, '', match)),
														_Utils_Tuple2(
														'PrimaryChecks',
														A3($author$project$AonTool$getSubmatch, 4, '', match)),
														_Utils_Tuple2(
														'SecondaryChecks',
														A3($author$project$AonTool$getSubmatch, 5, '', match)),
														_Utils_Tuple2(
														'Requirements',
														A3($author$project$AonTool$getSubmatch, 6, '', match)),
														_Utils_Tuple2(
														'Range',
														A3($author$project$AonTool$getSubmatch, 7, '', match)),
														_Utils_Tuple2(
														'Area',
														A3($author$project$AonTool$getSubmatch, 8, '', match)),
														_Utils_Tuple2(
														'Targets',
														A3($author$project$AonTool$getSubmatch, 9, '', match)),
														_Utils_Tuple2(
														'Defense',
														A3($author$project$AonTool$getSubmatch, 10, '', match)),
														_Utils_Tuple2(
														'Duration',
														A3($author$project$AonTool$getSubmatch, 11, '', match))
													])));
									} else {
										return $elm$core$Dict$empty;
									}
								}(),
								c: '',
								q: $elm$core$Maybe$Just(
									$author$project$AonTool$undoFromModel(model))
							}),
						$elm$core$Platform$Cmd$none);
				case 23:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v12 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$headersRegex(
												_List_fromArray(
													['Traditions', 'Cast', 'Cost', 'Trigger', 'Requirements', 'Range', 'Area', 'Targets', 'Defense', 'Duration'])),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v12.b) {
											var match = _v12.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2(
															'CastString',
															A3($author$project$AonTool$getSubmatch, 1, '', match)),
															_Utils_Tuple2(
															'Cost',
															A3($author$project$AonTool$getSubmatch, 2, '', match)),
															_Utils_Tuple2(
															'Trigger',
															A3($author$project$AonTool$getSubmatch, 3, '', match)),
															_Utils_Tuple2(
															'Requirements',
															A3($author$project$AonTool$getSubmatch, 4, '', match)),
															_Utils_Tuple2(
															'Range',
															A3($author$project$AonTool$getSubmatch, 5, '', match)),
															_Utils_Tuple2(
															'Area',
															A3($author$project$AonTool$getSubmatch, 6, '', match)),
															_Utils_Tuple2(
															'Targets',
															A3($author$project$AonTool$getSubmatch, 7, '', match)),
															_Utils_Tuple2(
															'Defense',
															A3($author$project$AonTool$getSubmatch, 8, '', match)),
															_Utils_Tuple2(
															'Duration',
															A3($author$project$AonTool$getSubmatch, 9, '', match))
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 24:
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									k: function () {
										var _v13 = A2(
											$elm$regex$Regex$find,
											$author$project$AonTool$headersRegex(
												_List_fromArray(
													['Ammunition', 'Price', 'Ammunition', 'Usage', 'Bulk', 'Access'])),
											$elm_community$string_extra$String$Extra$clean(
												A3(
													$elm$core$String$replace,
													'\n',
													' ',
													A3($elm$core$String$replace, '\r', '', model.c))));
										if (_v13.b) {
											var match = _v13.a;
											return $elm$core$Dict$fromList(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$core$String$trim),
													_List_fromArray(
														[
															_Utils_Tuple2(
															'Price',
															$author$project$AonTool$parsePrice(
																A3($author$project$AonTool$getSubmatch, 1, '', match))),
															_Utils_Tuple2(
															'Ammunition',
															A2(
																$elm$core$Maybe$withDefault,
																'',
																$elm_community$maybe_extra$Maybe$Extra$orList(
																	_List_fromArray(
																		[
																			$elm_community$string_extra$String$Extra$nonEmpty(
																			A3($author$project$AonTool$getSubmatch, 0, '', match)),
																			$elm_community$string_extra$String$Extra$nonEmpty(
																			A3($author$project$AonTool$getSubmatch, 2, '', match))
																		])))),
															_Utils_Tuple2(
															'Usage',
															A3($author$project$AonTool$getSubmatch, 3, '', match)),
															_Utils_Tuple2(
															'Bulk',
															function () {
																var _v14 = A3($author$project$AonTool$getSubmatch, 4, '', match);
																switch (_v14) {
																	case 'L':
																		return '0';
																	case '—':
																		return '-1';
																	case '':
																		return '-1';
																	default:
																		var s = _v14;
																		return s;
																}
															}()),
															_Utils_Tuple2(
															'Access',
															A3($author$project$AonTool$getSubmatch, 5, '', match))
														])));
										} else {
											return $elm$core$Dict$empty;
										}
									}(),
									c: '',
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							$elm$core$Platform$Cmd$none));
				case 25:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ak: false}),
						$author$project$AonTool$clipboard_get(0));
				case 26:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ak: true}),
						$author$project$AonTool$clipboard_get(0));
				case 27:
					return A2(
						$author$project$AonTool$fetchData,
						$elm$core$Maybe$Nothing,
						_Utils_Tuple2(
							_Utils_update(
								model,
								{x: _List_Nil}),
							$elm$core$Platform$Cmd$none));
				case 28:
					var value = msg.a;
					var selection = A2(
						$elm$core$Result$withDefault,
						$author$project$AonTool$emptySelection,
						A2($elm$json$Json$Decode$decodeValue, $author$project$AonTool$selectionDecoder, value));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: model.F + 1,
								ag: false,
								A: $elm$core$String$trim(selection.c),
								d: selection
							}),
						A2(
							$elm$core$Task$perform,
							function (_v15) {
								return $author$project$AonTool$DebouncePassed(model.F + 1);
							},
							$elm$core$Process$sleep(250)));
				case 29:
					var column = msg.a;
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									Q: $elm$core$Maybe$Just(column),
									c: A2(
										$elm$core$Maybe$withDefault,
										'',
										A2($elm$core$Dict$get, column, model.k))
								}),
							$elm$core$Platform$Cmd$none));
				case 30:
					var table = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								P: _Utils_eq(
									model.P,
									$elm$core$Maybe$Just(table)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(table),
								Q: $elm$core$Maybe$Nothing,
								k: $elm$core$Dict$empty
							}),
						$elm$core$Platform$Cmd$none);
				case 31:
					var text = msg.a;
					return model.ag ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: model.F + 1,
								d: $author$project$AonTool$emptySelection,
								k: function () {
									var _v16 = model.Q;
									if (!_v16.$) {
										var column = _v16.a;
										return A3(
											$elm$core$Dict$insert,
											column,
											A3($elm$core$String$replace, '\r', '', text),
											model.k);
									} else {
										return model.k;
									}
								}(),
								c: A3($elm$core$String$replace, '\r', '', text),
								q: $elm$core$Maybe$Nothing
							}),
						$elm$core$Platform$Cmd$none);
				case 32:
					var focused = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aM: focused}),
						$elm$core$Platform$Cmd$none);
				case 33:
					var _v17 = model.q;
					if (!_v17.$) {
						var undo = _v17.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{ag: true, k: undo.k, c: undo.c, q: $elm$core$Maybe$Nothing}),
							A2($author$project$AonTool$setSelection, undo.d.l, undo.d.t));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				default:
					var start = msg.a;
					var end = msg.b;
					var length = $elm$core$String$length(start) + $elm$core$String$length(end);
					return $author$project$AonTool$updateCandidates(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									c: A3(
										$elm_community$string_extra$String$Extra$insertAt,
										start,
										model.d.l,
										A3($elm_community$string_extra$String$Extra$insertAt, end, model.d.t, model.c)),
									q: $elm$core$Maybe$Just(
										$author$project$AonTool$undoFromModel(model))
								}),
							_Utils_eq(model.d.l, model.d.t) ? A2($author$project$AonTool$setSelection, model.d.l + length, model.d.l + length) : A2($author$project$AonTool$setSelection, model.d.l, model.d.t + length)));
			}
		}
	});
var $author$project$AonTool$TextChanged = function (a) {
	return {$: 31, a: a};
};
var $author$project$AonTool$TextFocused = function (a) {
	return {$: 32, a: a};
};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$AonTool$css = '\n    body {\n        background-color: #0f0f0f;\n        margin: 8px;\n        color: #eeeeee;\n    }\n\n    a {\n        color: inherit;\n    }\n\n    a p, b p, i p, u p, li p, span p {\n        display: inline;\n    }\n\n    p {\n        margin: 0;\n    }\n\n    .row {\n        display: flex;\n        flex-direction: row;\n    }\n\n    .column {\n        display: flex;\n        flex-direction: column;\n    }\n\n    .gap-large {\n        gap: 20px;\n    }\n\n    .gap-medium {\n        gap: 12px;\n    }\n\n    .gap-medium.row, .gap-large.row {\n        row-gap: var(--gap-tiny);\n    }\n\n    .gap-small {\n        gap: 8px;\n    }\n\n    .gap-tiny {\n        gap: 4px;\n    }\n\n    .align-center {\n        align-items: center;\n    }\n\n    .wrap {\n        flex-wrap: wrap;\n    }\n\n    .title {\n        background-color: #522e2c;\n        border-radius: 2px;\n        color: #cbc18f;\n        padding: 2px 4px;\n    }\n\n    h2 {\n        margin: 8px 0;\n    }\n\n    h2.title {\n        background-color: #806e45;\n        color: #0f0f0f;\n    }\n\n    .highlight-candidate, .highlight-candidate .highlight-selection {\n        color: #ff00ff;\n    }\n\n    .highlight-selection {\n        color: #00ffff;\n    }\n\n    .icon-font {\n        font-family: "Pathfinder-Icons";\n        font-variant-caps: normal;\n        font-weight: normal;\n        vertical-align: text-bottom;\n    }\n\n    @font-face {\n        font-family: "Pathfinder-Icons";\n        src: url("Pathfinder-Icons.ttf");\n        font-display: swap;\n    }\n    ';
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm_community$list_extra$List$Extra$gatherWith = F2(
	function (testFn, list) {
		var helper = F2(
			function (scattered, gathered) {
				helper:
				while (true) {
					if (!scattered.b) {
						return $elm$core$List$reverse(gathered);
					} else {
						var toGather = scattered.a;
						var population = scattered.b;
						var _v1 = A2(
							$elm$core$List$partition,
							testFn(toGather),
							population);
						var gathering = _v1.a;
						var remaining = _v1.b;
						var $temp$scattered = remaining,
							$temp$gathered = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(toGather, gathering),
							gathered);
						scattered = $temp$scattered;
						gathered = $temp$gathered;
						continue helper;
					}
				}
			});
		return A2(helper, list, _List_Nil);
	});
var $elm_community$list_extra$List$Extra$gatherEqualsBy = F2(
	function (extract, list) {
		return A2(
			$elm_community$list_extra$List$Extra$gatherWith,
			F2(
				function (a, b) {
					return _Utils_eq(
						extract(a),
						extract(b));
				}),
			list);
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$AonTool$ApplyCandidatePressed = function (a) {
	return {$: 3, a: a};
};
var $author$project$AonTool$CandidateSelected = function (a) {
	return {$: 4, a: a};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm_community$html_extra$Html$Attributes$Extra$empty = $elm$html$Html$Attributes$classList(_List_Nil);
var $elm_community$html_extra$Html$Attributes$Extra$attributeIf = F2(
	function (condition, attr) {
		return condition ? attr : $elm_community$html_extra$Html$Attributes$Extra$empty;
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$core$String$indices = _String_indexes;
var $author$project$AonTool$isCandidateInATag = F2(
	function (candidate, rawText) {
		var text = A3(
			$elm$regex$Regex$replace,
			$author$project$AonTool$regexFromString('<%(ACTION(S|.TYPES)|TABLESHTML)#(.+?)%%>'),
			function (match) {
				return '';
			},
			rawText);
		var openIndices = A2($elm$core$String$indices, '%%>', text);
		var openIndicesBefore = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (i) {
					return _Utils_cmp(i, candidate.i) < 0;
				},
				openIndices));
		var closeIndices = A2($elm$core$String$indices, '<%END>', text);
		var closeIndicesBefore = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (i) {
					return _Utils_cmp(i, candidate.i) < 0;
				},
				closeIndices));
		return !_Utils_eq(openIndicesBefore, closeIndicesBefore);
	});
var $author$project$AonTool$isCandidateLinkApplied = F2(
	function (candidate, text) {
		return A2(
			$elm$core$String$contains,
			$author$project$AonTool$getDocumentLink(candidate.r),
			text);
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$AonTool$viewCandidate = F2(
	function (model, candidate) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('column'),
					$elm$html$Html$Attributes$class('gap-tiny'),
					A2($elm$html$Html$Attributes$style, 'border', 'transparent 1px solid'),
					A2($elm$html$Html$Attributes$style, 'padding', '4px'),
					A2(
					$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
					_Utils_eq(
						model.O,
						$elm$core$Maybe$Just(candidate)),
					A2($elm$html$Html$Attributes$style, 'border', 'white 1px solid')),
					$elm$html$Html$Events$onMouseOver(
					$author$project$AonTool$CandidateSelected(candidate))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#808080')
								]),
							_List_fromArray(
								[
									(candidate.i < 10) ? $elm$html$Html$text('') : $elm$html$Html$text('...'),
									$elm$html$Html$text(
									A3(
										$elm$core$String$slice,
										A2($elm$core$Basics$max, 0, candidate.i - 10),
										candidate.i,
										model.c))
								])),
							$elm$html$Html$text(
							A3(
								$elm$core$String$slice,
								candidate.i,
								candidate.i + $elm$core$String$length(candidate.r.g),
								model.c)),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#808080')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A3(
										$elm$core$String$slice,
										candidate.i + $elm$core$String$length(candidate.r.g),
										(candidate.i + $elm$core$String$length(candidate.r.g)) + 10,
										model.c)),
									(_Utils_cmp(
									(candidate.i + $elm$core$String$length(candidate.r.g)) + 10,
									$elm$core$String$length(model.c)) > -1) ? $elm$html$Html$text('') : $elm$html$Html$text('...')
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'align-self', 'flex-start'),
							$elm$html$Html$Attributes$disabled(
							A2($author$project$AonTool$isCandidateInATag, candidate, model.c) || (A2($author$project$AonTool$isCandidateLinkApplied, candidate, model.c) && (!model._))),
							$elm$html$Html$Events$onClick(
							$author$project$AonTool$ApplyCandidatePressed(candidate))
						]),
					_List_fromArray(
						[
							A2($author$project$AonTool$isCandidateLinkApplied, candidate, model.c) ? $elm$html$Html$text('Applied') : (A2($author$project$AonTool$isCandidateInATag, candidate, model.c) ? $elm$html$Html$text('Already in a tag') : $elm$html$Html$text('Apply'))
						]))
				]));
	});
var $author$project$AonTool$viewCandidates = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-medium'),
				A2($elm$html$Html$Attributes$style, 'max-height', '800px'),
				A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
				A2($elm$html$Html$Attributes$style, 'flex', '1')
			]),
		A2(
			$elm$core$List$map,
			function (_v0) {
				var candidate = _v0.a;
				var candidates = _v0.b;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('column'),
							$elm$html$Html$Attributes$class('gap-tiny')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row'),
									$elm$html$Html$Attributes$class('gap-medium'),
									$elm$html$Html$Attributes$class('title'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '4px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(candidate.r.g),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											_Utils_ap(model.J, candidate.r.V)),
											$elm$html$Html$Attributes$target('_blank')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(candidate.r.V)
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row'),
									$elm$html$Html$Attributes$class('gap-medium'),
									$elm$html$Html$Attributes$class('wrap')
								]),
							A2(
								$elm$core$List$map,
								$author$project$AonTool$viewCandidate(model),
								A2($elm$core$List$cons, candidate, candidates)))
						]));
			},
			A2(
				$elm_community$list_extra$List$Extra$gatherEqualsBy,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.r;
					},
					function ($) {
						return $.y;
					}),
				model.ar)));
};
var $author$project$AonTool$CopyFirstSentenceToClipboardPressed = {$: 9};
var $author$project$AonTool$CopyToClipboardPressed = {$: 8};
var $author$project$AonTool$PasteFromClipboardPressed = {$: 25};
var $author$project$AonTool$viewClipboard = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('row'),
			$elm$html$Html$Attributes$class('gap-small'),
			$elm$html$Html$Attributes$class('align-center'),
			$elm$html$Html$Attributes$class('wrap')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('Clipboard'),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$PasteFromClipboardPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Paste')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$CopyToClipboardPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Copy')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$CopyFirstSentenceToClipboardPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Copy first sentence')
				]))
		]));
var $author$project$AonTool$ManualSearchChanged = function (a) {
	return {$: 17, a: a};
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$AonTool$viewManual = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-small'),
				A2($elm$html$Html$Attributes$style, 'flex', '1')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(model.A),
						$elm$html$Html$Events$onInput($author$project$AonTool$ManualSearchChanged)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('column'),
						$elm$html$Html$Attributes$class('gap-medium'),
						A2($elm$html$Html$Attributes$style, 'max-height', '775px'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto')
					]),
				A2(
					$elm$core$List$map,
					function (document) {
						var candidate = {
							r: _Utils_update(
								document,
								{g: model.d.c}),
							i: model.d.l
						};
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('column'),
									$elm$html$Html$Attributes$class('gap-tiny'),
									A2($elm$html$Html$Attributes$style, 'border', 'transparent 1px solid'),
									A2($elm$html$Html$Attributes$style, 'padding', '4px'),
									A2(
									$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
									_Utils_eq(
										model.O,
										$elm$core$Maybe$Just(candidate)),
									A2($elm$html$Html$Attributes$style, 'border', 'white 1px solid')),
									$elm$html$Html$Events$onMouseOver(
									$author$project$AonTool$CandidateSelected(candidate))
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('row'),
											$elm$html$Html$Attributes$class('gap-medium'),
											$elm$html$Html$Attributes$class('title')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(document.g),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$href(
													_Utils_ap(model.J, document.V)),
													$elm$html$Html$Attributes$target('_blank')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(document.V)
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'align-self', 'flex-start'),
											$elm$html$Html$Attributes$disabled(
											A2($author$project$AonTool$isCandidateInATag, candidate, model.c) || (A2($author$project$AonTool$isCandidateLinkApplied, candidate, model.c) && (!model._))),
											$elm$html$Html$Events$onClick(
											$author$project$AonTool$ApplyCandidatePressed(candidate))
										]),
									_List_fromArray(
										[
											A2($author$project$AonTool$isCandidateLinkApplied, candidate, model.c) ? $elm$html$Html$text('Applied') : (A2($author$project$AonTool$isCandidateInATag, candidate, model.c) ? $elm$html$Html$text('Already in a tag') : $elm$html$Html$text('Apply'))
										]))
								]));
					},
					A2(
						$elm$core$List$take,
						20,
						A2(
							$elm$core$List$sortWith,
							F2(
								function (a, b) {
									return (_Utils_eq(
										$elm$core$String$toLower(a.g),
										$elm$core$String$toLower(model.A)) && _Utils_eq(
										$elm$core$String$toLower(b.g),
										$elm$core$String$toLower(model.A))) ? A2($elm$core$Basics$compare, a.y, b.y) : (_Utils_eq(
										$elm$core$String$toLower(a.g),
										$elm$core$String$toLower(model.A)) ? 0 : (_Utils_eq(
										$elm$core$String$toLower(b.g),
										$elm$core$String$toLower(model.A)) ? 2 : A2($elm$core$Basics$compare, a.y, b.y)));
								}),
							A2(
								$elm$core$List$filter,
								function (document) {
									return (model.A !== '') && A2(
										$elm$core$String$contains,
										$elm$core$String$toLower(model.A),
										$elm$core$String$toLower(document.g));
								},
								model.x)))))
			]));
};
var $author$project$AonTool$AllowDuplicateLinksChanged = function (a) {
	return {$: 1, a: a};
};
var $author$project$AonTool$AonUrlChanged = function (a) {
	return {$: 2, a: a};
};
var $author$project$AonTool$ElasticUrlChanged = function (a) {
	return {$: 11, a: a};
};
var $author$project$AonTool$RefreshDataPressed = {$: 27};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$AonTool$viewOptions = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row'),
				$elm$html$Html$Attributes$class('gap-medium'),
				$elm$html$Html$Attributes$class('wrap')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-small'),
						$elm$html$Html$Attributes$class('align-center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$elm$core$List$length(model.x)) + ' documents loaded'),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$AonTool$RefreshDataPressed)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Refresh')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('align-center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Elasticsearch URL'),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '300px'),
								$elm$html$Html$Attributes$placeholder($author$project$AonTool$defaultElasticsearchUrl),
								$elm$html$Html$Attributes$value(model.aa),
								$elm$html$Html$Events$onInput($author$project$AonTool$ElasticUrlChanged)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('align-center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('AoN URL'),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'width', '300px'),
								$elm$html$Html$Attributes$placeholder($author$project$AonTool$defaultAonUrl),
								$elm$html$Html$Attributes$value(model.J),
								$elm$html$Html$Events$onInput($author$project$AonTool$AonUrlChanged)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-tiny'),
						$elm$html$Html$Attributes$class('align-center')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('checkbox'),
								$elm$html$Html$Attributes$checked(model._),
								$elm$html$Html$Events$onCheck($author$project$AonTool$AllowDuplicateLinksChanged)
							]),
						_List_Nil),
						$elm$html$Html$text('Allow duplicate links')
					]))
			]));
};
var $author$project$AonTool$highlightCandidate = F2(
	function (model, text) {
		var _v0 = model.O;
		if (!_v0.$) {
			var candidate = _v0.a;
			var endIndex = candidate.i + $elm$core$String$length(candidate.r.g);
			return A4(
				$elm_community$string_extra$String$Extra$replaceSlice,
				A2(
					$elm$core$String$join,
					'',
					_List_fromArray(
						[
							'<highlight-candidate>',
							A3($elm$core$String$slice, candidate.i, endIndex, text),
							'</highlight-candidate>'
						])),
				candidate.i,
				endIndex,
				model.c);
		} else {
			return text;
		}
	});
var $author$project$AonTool$highlightSelection = F2(
	function (model, text) {
		if (_Utils_eq(model.d.l, model.d.t)) {
			return text;
		} else {
			var _v0 = function () {
				var _v1 = model.O;
				if (!_v1.$) {
					var candidate = _v1.a;
					var candidateEnd = candidate.i + $elm$core$String$length(candidate.r.g);
					return _Utils_Tuple2(
						model.d.l,
						((_Utils_cmp(candidate.i, model.d.l) > -1) && (_Utils_cmp(candidateEnd, model.d.t) < 1)) ? (model.d.t + $elm$core$String$length('<highlight-candidate></highlight-candidate>')) : (((_Utils_cmp(candidate.i, model.d.l) > -1) && (_Utils_cmp(candidateEnd, model.d.t) > 0)) ? (candidate.i + $elm$core$String$length('<highlight-candidate>')) : model.d.t));
				} else {
					return _Utils_Tuple2(model.d.l, model.d.t);
				}
			}();
			var start = _v0.a;
			var end = _v0.b;
			return A4(
				$elm_community$string_extra$String$Extra$replaceSlice,
				A2(
					$elm$core$String$join,
					'',
					_List_fromArray(
						[
							'<highlight-selection>',
							A3(
							$elm$regex$Regex$replace,
							$author$project$AonTool$regexFromString('<.+?>'),
							function (match) {
								return '</highlight-selection>' + (match.cg + '<highlight-selection>');
							},
							A3($elm$core$String$slice, start, end, text)),
							'</highlight-selection>'
						])),
				start,
				end,
				text);
		}
	});
var $author$project$Markdown$Parser$problemToString = function (problem) {
	switch (problem.$) {
		case 0:
			var string = problem.a;
			return 'Expecting ' + string;
		case 1:
			return 'Expecting int';
		case 2:
			return 'Expecting hex';
		case 3:
			return 'Expecting octal';
		case 4:
			return 'Expecting binary';
		case 5:
			return 'Expecting float';
		case 6:
			return 'Expecting number';
		case 7:
			return 'Expecting variable';
		case 8:
			var string = problem.a;
			return 'Expecting symbol ' + string;
		case 9:
			var string = problem.a;
			return 'Expecting keyword ' + string;
		case 10:
			return 'Expecting keyword end';
		case 11:
			return 'Unexpected char';
		case 12:
			var problemDescription = problem.a;
			return problemDescription;
		default:
			return 'Bad repeat';
	}
};
var $author$project$Markdown$Parser$deadEndToString = function (deadEnd) {
	return 'Problem at row ' + ($elm$core$String$fromInt(deadEnd.cr) + ('\n' + $author$project$Markdown$Parser$problemToString(deadEnd.co)));
};
var $author$project$Markdown$Block$HtmlBlock = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$Block$HtmlElement = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Markdown$Block$HtmlInline = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$Block$Paragraph = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$Block$Text = function (a) {
	return {$: 7, a: a};
};
var $elm$regex$Regex$contains = _Regex_contains;
var $author$project$AonTool$addSpaces = function (inline) {
	if (inline.$ === 7) {
		var text = inline.a;
		return A2(
			$elm$regex$Regex$contains,
			$author$project$AonTool$regexFromString('^[\\W].*'),
			text) ? $author$project$Markdown$Block$Text(text + ' ') : $author$project$Markdown$Block$Text(' ' + (text + ' '));
	} else {
		return inline;
	}
};
var $author$project$AonTool$fixMarkdownSpacing = function (block) {
	return A2(
		$author$project$AonTool$mapHtmlElementChildren,
		A2(
			$elm$core$List$foldl,
			F2(
				function (child, previous) {
					if (child.$ === 5) {
						var inlines = child.a;
						var _v5 = $elm_community$list_extra$List$Extra$last(previous);
						if ((!_v5.$) && (!_v5.a.$)) {
							return A2(
								$elm$core$List$append,
								previous,
								_List_fromArray(
									[
										$author$project$Markdown$Block$Paragraph(
										A2($elm$core$List$map, $author$project$AonTool$addSpaces, inlines))
									]));
						} else {
							return A2(
								$elm$core$List$append,
								previous,
								_List_fromArray(
									[child]));
						}
					} else {
						return A2(
							$elm$core$List$append,
							previous,
							_List_fromArray(
								[child]));
					}
				}),
			_List_Nil),
		block);
};
var $author$project$AonTool$mapHtmlElementChildren = F2(
	function (mapFun, block) {
		_v0$2:
		while (true) {
			switch (block.$) {
				case 0:
					if (!block.a.$) {
						var _v1 = block.a;
						var name = _v1.a;
						var attrs = _v1.b;
						var children = _v1.c;
						return $author$project$Markdown$Block$HtmlBlock(
							A3(
								$author$project$Markdown$Block$HtmlElement,
								name,
								attrs,
								mapFun(children)));
					} else {
						break _v0$2;
					}
				case 5:
					var inlines = block.a;
					return $author$project$Markdown$Block$Paragraph(
						A2(
							$elm$core$List$map,
							function (inline) {
								if ((!inline.$) && (!inline.a.$)) {
									var _v3 = inline.a;
									var name = _v3.a;
									var attrs = _v3.b;
									var children = _v3.c;
									return $author$project$Markdown$Block$HtmlInline(
										A3(
											$author$project$Markdown$Block$HtmlElement,
											name,
											attrs,
											A2($elm$core$List$map, $author$project$AonTool$fixMarkdownSpacing, children)));
								} else {
									return inline;
								}
							},
							inlines));
				default:
					break _v0$2;
			}
		}
		return block;
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $author$project$Markdown$Block$ListItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$html$Html$Attributes$align = $elm$html$Html$Attributes$stringProperty('align');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$blockquote = _VirtualDom_node('blockquote');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$del = _VirtualDom_node('del');
var $elm$html$Html$em = _VirtualDom_node('em');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $author$project$Markdown$HtmlRenderer$HtmlRenderer = $elm$core$Basics$identity;
var $author$project$Markdown$Html$resultOr = F2(
	function (ra, rb) {
		if (ra.$ === 1) {
			var singleError = ra.a;
			if (!rb.$) {
				var okValue = rb.a;
				return $elm$core$Result$Ok(okValue);
			} else {
				var errorsSoFar = rb.a;
				return $elm$core$Result$Err(
					A2($elm$core$List$cons, singleError, errorsSoFar));
			}
		} else {
			var okValue = ra.a;
			return $elm$core$Result$Ok(okValue);
		}
	});
var $author$project$Markdown$Html$attributesToString = function (attributes) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$map,
			function (_v0) {
				var name = _v0.g;
				var value = _v0.bR;
				return name + ('=\"' + (value + '\"'));
			},
			attributes));
};
var $author$project$Markdown$Html$tagToString = F2(
	function (tagName, attributes) {
		return $elm$core$List$isEmpty(attributes) ? ('<' + (tagName + '>')) : ('<' + (tagName + (' ' + ($author$project$Markdown$Html$attributesToString(attributes) + '>'))));
	});
var $author$project$Markdown$Html$oneOf = function (decoders) {
	var unwrappedDecoders = A2(
		$elm$core$List$map,
		function (_v4) {
			var rawDecoder = _v4;
			return rawDecoder;
		},
		decoders);
	return function (rawDecoder) {
		return F3(
			function (tagName, attributes, innerBlocks) {
				return A2(
					$elm$core$Result$mapError,
					function (errors) {
						if (!errors.b) {
							return 'Ran into a oneOf with no possibilities!';
						} else {
							if (!errors.b.b) {
								var singleError = errors.a;
								return 'Problem with the given value:\n\n' + (A2($author$project$Markdown$Html$tagToString, tagName, attributes) + ('\n\n' + (singleError + '\n')));
							} else {
								return 'oneOf failed parsing this value:\n    ' + (A2($author$project$Markdown$Html$tagToString, tagName, attributes) + ('\n\nParsing failed in the following 2 ways:\n\n\n' + (A2(
									$elm$core$String$join,
									'\n\n',
									A2(
										$elm$core$List$indexedMap,
										F2(
											function (index, error) {
												return '(' + ($elm$core$String$fromInt(index + 1) + (') ' + error));
											}),
										errors)) + '\n')));
							}
						}
					},
					A3(rawDecoder, tagName, attributes, innerBlocks));
			});
	}(
		A3(
			$elm$core$List$foldl,
			F2(
				function (decoder, soFar) {
					return F3(
						function (tagName, attributes, children) {
							return A2(
								$author$project$Markdown$Html$resultOr,
								A3(decoder, tagName, attributes, children),
								A3(soFar, tagName, attributes, children));
						});
				}),
			F3(
				function (_v0, _v1, _v2) {
					return $elm$core$Result$Err(_List_Nil);
				}),
			unwrappedDecoders));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$start = function (n) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'start',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$core$String$words = _String_words;
var $author$project$Markdown$Renderer$defaultHtmlRenderer = {
	aQ: $elm$html$Html$blockquote(_List_Nil),
	aT: function (_v0) {
		var body = _v0.bZ;
		var language = _v0.ce;
		var classes = function () {
			var _v1 = A2($elm$core$Maybe$map, $elm$core$String$words, language);
			if ((!_v1.$) && _v1.a.b) {
				var _v2 = _v1.a;
				var actualLanguage = _v2.a;
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$class('language-' + actualLanguage)
					]);
			} else {
				return _List_Nil;
			}
		}();
		return A2(
			$elm$html$Html$pre,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$code,
					classes,
					_List_fromArray(
						[
							$elm$html$Html$text(body)
						]))
				]));
	},
	aU: function (content) {
		return A2(
			$elm$html$Html$code,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text(content)
				]));
	},
	aX: function (children) {
		return A2($elm$html$Html$em, _List_Nil, children);
	},
	a3: A2($elm$html$Html$br, _List_Nil, _List_Nil),
	a4: function (_v3) {
		var level = _v3.bd;
		var children = _v3.aS;
		switch (level) {
			case 0:
				return A2($elm$html$Html$h1, _List_Nil, children);
			case 1:
				return A2($elm$html$Html$h2, _List_Nil, children);
			case 2:
				return A2($elm$html$Html$h3, _List_Nil, children);
			case 3:
				return A2($elm$html$Html$h4, _List_Nil, children);
			case 4:
				return A2($elm$html$Html$h5, _List_Nil, children);
			default:
				return A2($elm$html$Html$h6, _List_Nil, children);
		}
	},
	b8: $author$project$Markdown$Html$oneOf(_List_Nil),
	a9: function (imageInfo) {
		var _v5 = imageInfo.cx;
		if (!_v5.$) {
			var title = _v5.a;
			return A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(imageInfo.az),
						$elm$html$Html$Attributes$alt(imageInfo.aq),
						$elm$html$Html$Attributes$title(title)
					]),
				_List_Nil);
		} else {
			return A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(imageInfo.az),
						$elm$html$Html$Attributes$alt(imageInfo.aq)
					]),
				_List_Nil);
		}
	},
	cb: $elm$html$Html$p(_List_Nil),
	be: F2(
		function (link, content) {
			var _v6 = link.cx;
			if (!_v6.$) {
				var title = _v6.a;
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(link.b1),
							$elm$html$Html$Attributes$title(title)
						]),
					content);
			} else {
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(link.b1)
						]),
					content);
			}
		}),
	bh: F2(
		function (startingIndex, items) {
			return A2(
				$elm$html$Html$ol,
				function () {
					if (startingIndex === 1) {
						return _List_fromArray(
							[
								$elm$html$Html$Attributes$start(startingIndex)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(
					$elm$core$List$map,
					function (itemBlocks) {
						return A2($elm$html$Html$li, _List_Nil, itemBlocks);
					},
					items));
		}),
	bi: $elm$html$Html$p(_List_Nil),
	bB: function (children) {
		return A2($elm$html$Html$del, _List_Nil, children);
	},
	bC: function (children) {
		return A2($elm$html$Html$strong, _List_Nil, children);
	},
	bF: $elm$html$Html$table(_List_Nil),
	bG: $elm$html$Html$tbody(_List_Nil),
	bH: function (maybeAlignment) {
		var attrs = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$html$Html$Attributes$align,
					A2(
						$elm$core$Maybe$map,
						function (alignment) {
							switch (alignment) {
								case 0:
									return 'left';
								case 2:
									return 'center';
								default:
									return 'right';
							}
						},
						maybeAlignment))));
		return $elm$html$Html$td(attrs);
	},
	bI: $elm$html$Html$thead(_List_Nil),
	bJ: function (maybeAlignment) {
		var attrs = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2(
					$elm$core$Maybe$map,
					$elm$html$Html$Attributes$align,
					A2(
						$elm$core$Maybe$map,
						function (alignment) {
							switch (alignment) {
								case 0:
									return 'left';
								case 2:
									return 'center';
								default:
									return 'right';
							}
						},
						maybeAlignment))));
		return $elm$html$Html$th(attrs);
	},
	bK: $elm$html$Html$tr(_List_Nil),
	c: $elm$html$Html$text,
	bM: A2($elm$html$Html$hr, _List_Nil, _List_Nil),
	bQ: function (items) {
		return A2(
			$elm$html$Html$ul,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (item) {
					var task = item.a;
					var children = item.b;
					var checkbox = function () {
						switch (task) {
							case 0:
								return $elm$html$Html$text('');
							case 1:
								return A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(true),
											$elm$html$Html$Attributes$checked(false),
											$elm$html$Html$Attributes$type_('checkbox')
										]),
									_List_Nil);
							default:
								return A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(true),
											$elm$html$Html$Attributes$checked(true),
											$elm$html$Html$Attributes$type_('checkbox')
										]),
									_List_Nil);
						}
					}();
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						A2($elm$core$List$cons, checkbox, children));
				},
				items));
	}
};
var $author$project$AonTool$actionIdToString = function (id) {
	switch (id) {
		case '2':
			return '[one-action]';
		case '3':
			return '[two-actions]';
		case '4':
			return '[three-actions]';
		case '5':
			return '[reaction]';
		case '6':
			return '[free-action]';
		default:
			return '[action-' + (id + ']');
	}
};
var $elm$html$Html$b = _VirtualDom_node('b');
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$AonTool$linkCodeToUrl = function (code) {
	switch (code) {
		case 'ACTIONS':
			return '/Actions.aspx?ID=';
		case 'ALCHEMICAL.CATEGORIES':
			return '/Equipment.aspx?Category=6&Subcategory=';
		case 'ANCESTRIES':
			return '/Ancestries.aspx?ID=';
		case 'ANIMAL.COMPANIONS.ADVANCED':
			return '/AnimalCompanions.aspx?Advanced=true&ID=';
		case 'ANIMAL.COMPANIONS.SPECIALIZED':
			return '/AnimalCompanions.aspx?Specialized=true&ID=';
		case 'ANIMAL.COMPANIONS.UNIQUE':
			return '/AnimalCompanions.aspx?Unique=true&ID=';
		case 'ARCHETYPES':
			return '/Archetypes.aspx?ID=';
		case 'ARMOR':
			return '/Armor.aspx?ID=';
		case 'ARMOR.GROUPS':
			return '/ArmorGroups.aspx?ID=';
		case 'ARTICLES':
			return '/Articles.aspx?ID=';
		case 'BACKGROUNDS':
			return '/Backgrounds.aspx?ID=';
		case 'CAMPSITE.MEALS':
			return '/CampMeals.aspx?ID=';
		case 'CLASS.ARCANE.SCHOOLS':
			return '/ArcaneSchools.aspx?ID=';
		case 'CLASS.ARCANE.THESIS':
			return '/ArcaneThesis.aspx?ID=';
		case 'CLASS.BLOODLINES':
			return '/Bloodlines.aspx?ID=';
		case 'CLASS.CHAMPION.CAUSES':
			return '/Causes.aspx?ID=';
		case 'CLASS.CONSCIOUS.MINDS':
			return '/ConsciousMinds.aspx?ID=';
		case 'CLASS.DOCTRINES':
			return '/Doctrines.aspx?ID=';
		case 'CLASS.DRUID.ORDERS':
			return '/DruidicOrders.aspx?ID=';
		case 'CLASS.ELEMENTS':
			return '/Elements.aspx?ID=';
		case 'CLASS.HUNTERS.EDGES':
			return '/HuntersEdge.aspx?ID=';
		case 'CLASS.HYBRID.STUDIES':
			return '/HybridStudies.aspx?ID=';
		case 'CLASS.IMPLEMENTS':
			return '/Implements.aspx?ID=';
		case 'CLASS.INNOVATIONS':
			return '/Innovations.aspx?ID=';
		case 'CLASS.INSTINCTS':
			return '/Instincts.aspx?ID=';
		case 'CLASS.METHODOLOGIES':
			return '/Methodologies.aspx?ID=';
		case 'CLASS.MUSES':
			return '/Muses.aspx?ID=';
		case 'CLASS.MYSTERIES':
			return '/Mysteries.aspx?ID=';
		case 'CLASS.RACKETS':
			return '/Rackets.aspx?ID=';
		case 'CLASS.RESEARCH.FIELDS':
			return '/ResearchFields.aspx?ID=';
		case 'CLASS.SUBCONSCIOUS.MINDS':
			return '/SubconsciousMinds.aspx?ID=';
		case 'CLASS.SWASH.STYLES':
			return '/Styles.aspx?ID=';
		case 'CLASS.TENETS':
			return '/Tenets.aspx?ID=';
		case 'CLASS.WAYS':
			return '/Ways.aspx?ID=';
		case 'CLASS.WITCH.LESSONS':
			return '/Lessons.aspx?ID=';
		case 'CLASS.WITCH.PATRONS':
			return '/Patrons.aspx?ID=';
		case 'CLASSES':
			return '/Classes.aspx?ID=';
		case 'COMPANIONS':
			return '/AnimalCompanions.aspx?ID=';
		case 'CONDITIONS':
			return '/Conditions.aspx?ID=';
		case 'CURSES':
			return '/Curses.aspx?ID=';
		case 'DEITIES':
			return '/Deities.aspx?ID=';
		case 'DEITY.CATEGORIES':
			return '/DeityCategories.aspx?ID=';
		case 'DISEASES':
			return '/Diseases.aspx?ID=';
		case 'DOMAINS':
			return '/Domains.aspx?ID=';
		case 'EIDOLONS':
			return '/Eidolons.aspx?ID=';
		case 'EQUIPMENT':
			return '/Equipment.aspx?ID=';
		case 'FAMILIAR.ABILITIES':
			return '/Familiars.aspx?ID=';
		case 'FAMILIARS.SPECIFIC':
			return '/Familiars.aspx?Specific=true&ID=';
		case 'FEATS':
			return '/Feats.aspx?ID=';
		case 'FEATS.DEVIANT':
			return '/DeviantFeats.aspx?ID=';
		case 'GEAR.ARMOR.CATEGORY':
			return '/Equipment.aspx?Category=11&Subcategory=';
		case 'GEAR.SHIELDS.ALL':
			return '/Shields.aspx';
		case 'GEAR.WEAPONS.CATEGORY':
			return '/Equipment.aspx?Category=37&Subcategory=';
		case 'HAZARDS':
			return '/Hazards.aspx?ID=';
		case 'HAZARDS.WEATHER':
			return '/WeatherHazards.aspx?ID=';
		case 'HERITAGES':
			return '/Heritages.aspx?ID=';
		case 'KINGDOM.EVENTS':
			return '/KMEvents.aspx?ID=';
		case 'KINGDOM.STRUCTURES':
			return '/KMStructures.aspx?ID=';
		case 'LANGUAGES':
			return '/Languages.aspx?ID=';
		case 'MON.FAMILY':
			return '/MonsterFamilies.aspx?ID=';
		case 'MONSTERS':
			return '/Monsters.aspx?ID=';
		case 'PLANES':
			return '/Planes.aspx?ID=';
		case 'RELIC.GIFTS':
			return '/Relics.aspx?ID=';
		case 'RITUALS':
			return '/Rituals.aspx?ID=';
		case 'RULES':
			return '/Rules.aspx?ID=';
		case 'RUNES':
			return '/Equipment.aspx?Category=23&Subcategory=';
		case 'SHIELDS':
			return '/Shields.aspx?ID=';
		case 'SIEGE.WEAPONS':
			return '/SiegeWeapons.aspx?ID=';
		case 'SKILLS':
			return '/Skills.aspx?ID=';
		case 'SKILLS.GENERAL':
			return '/Skills.aspx?General=true&ID=';
		case 'SOURCES':
			return '/Sources.aspx?ID=';
		case 'SPELLS':
			return '/Spells.aspx?ID=';
		case 'TEMPLATES':
			return '/MonsterTemplates.aspx?ID=';
		case 'TRADITIONS':
			return '/Spells.aspx?Tradition=';
		case 'TRAITS':
			return '/Traits.aspx?ID=';
		case 'UMR':
			return '/MonsterAbilities.aspx?ID=';
		case 'VEHICLES':
			return '/Vehicles.aspx?ID=';
		case 'WARFARE.TACTICS':
			return '/KMWarTactics.aspx?ID=';
		case 'WEAPON.GROUPS':
			return '/WeaponGroups.aspx?ID=';
		case 'WEAPONS':
			return '/Weapons.aspx?ID=';
		default:
			return '/';
	}
};
var $author$project$Markdown$Html$tag = F2(
	function (expectedTag, a) {
		return F3(
			function (tagName, _v0, _v1) {
				return _Utils_eq(tagName, expectedTag) ? $elm$core$Result$Ok(a) : $elm$core$Result$Err('Expected ' + (expectedTag + (' but was ' + tagName)));
			});
	});
var $elm$html$Html$u = _VirtualDom_node('u');
var $author$project$List$Helpers$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Markdown$Html$withAttribute = F2(
	function (attributeName, _v0) {
		var renderer = _v0;
		return F3(
			function (tagName, attributes, innerBlocks) {
				return function () {
					var _v1 = A2(
						$author$project$List$Helpers$find,
						function (_v2) {
							var name = _v2.g;
							return _Utils_eq(name, attributeName);
						},
						attributes);
					if (!_v1.$) {
						var value = _v1.a.bR;
						return $elm$core$Result$map(
							$elm$core$Basics$apR(value));
					} else {
						return function (_v3) {
							return $elm$core$Result$Err('Expecting attribute \"' + (attributeName + '\".'));
						};
					}
				}()(
					A3(renderer, tagName, attributes, innerBlocks));
			});
	});
var $author$project$Markdown$Html$withOptionalAttribute = F2(
	function (attributeName, _v0) {
		var renderer = _v0;
		return F3(
			function (tagName, attributes, innerBlocks) {
				return function () {
					var _v1 = A2(
						$author$project$List$Helpers$find,
						function (_v2) {
							var name = _v2.g;
							return _Utils_eq(name, attributeName);
						},
						attributes);
					if (!_v1.$) {
						var value = _v1.a.bR;
						return $elm$core$Result$map(
							$elm$core$Basics$apR(
								$elm$core$Maybe$Just(value)));
					} else {
						return $elm$core$Result$map(
							$elm$core$Basics$apR($elm$core$Maybe$Nothing));
					}
				}()(
					A3(renderer, tagName, attributes, innerBlocks));
			});
	});
var $author$project$AonTool$markdownHtmlRenderer = function (model) {
	return $author$project$Markdown$Html$oneOf(
		_List_fromArray(
			[
				A2(
				$author$project$Markdown$Html$withAttribute,
				'id',
				A2(
					$author$project$Markdown$Html$tag,
					'action',
					F2(
						function (id, _v0) {
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('icon-font')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$AonTool$actionIdToString(id))
										]))
								]);
						}))),
				A2(
				$author$project$Markdown$Html$tag,
				'b',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$b,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'br',
				function (children) {
					return _List_fromArray(
						[
							A2($elm$html$Html$br, _List_Nil, _List_Nil)
						]);
				}),
				A2(
				$author$project$Markdown$Html$withOptionalAttribute,
				'class',
				A2(
					$author$project$Markdown$Html$tag,
					'h2',
					F2(
						function (_class, children) {
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											A2($elm$core$Maybe$withDefault, '', _class))
										]),
									$elm$core$List$concat(children))
								]);
						}))),
				A2(
				$author$project$Markdown$Html$withOptionalAttribute,
				'class',
				A2(
					$author$project$Markdown$Html$tag,
					'h3',
					F2(
						function (_class, children) {
							return _List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(
											A2($elm$core$Maybe$withDefault, '', _class))
										]),
									$elm$core$List$concat(children))
								]);
						}))),
				A2(
				$author$project$Markdown$Html$tag,
				'highlight-candidate',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('highlight-candidate'),
									$elm$html$Html$Attributes$id('current-candidate')
								]),
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'highlight-selection',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('highlight-selection')
								]),
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'i',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$i,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'li',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$li,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$withOptionalAttribute,
				'id',
				A2(
					$author$project$Markdown$Html$withAttribute,
					'code',
					A2(
						$author$project$Markdown$Html$tag,
						'link',
						F3(
							function (code, maybeId, children) {
								return _List_fromArray(
									[
										function () {
										if (!maybeId.$) {
											var id = maybeId.a;
											return A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href(
														_Utils_ap(
															model.J,
															_Utils_ap(
																$author$project$AonTool$linkCodeToUrl(code),
																id))),
														A2($elm$html$Html$Attributes$style, 'text-decoration', 'underline'),
														$elm$html$Html$Attributes$title('<%' + (code + ('%' + (id + '%%>'))))
													]),
												$elm$core$List$concat(children));
										} else {
											return A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href(
														_Utils_ap(
															model.J,
															$author$project$AonTool$linkCodeToUrl(code))),
														A2($elm$html$Html$Attributes$style, 'text-decoration', 'underline'),
														$elm$html$Html$Attributes$title('<%' + (code + '%%>'))
													]),
												$elm$core$List$concat(children));
										}
									}()
									]);
							})))),
				A2(
				$author$project$Markdown$Html$tag,
				'p',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'span',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'table',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$table,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'td',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'th',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$th,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'tr',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'u',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$u,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'ol',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$ol,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				}),
				A2(
				$author$project$Markdown$Html$tag,
				'ul',
				function (children) {
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$ul,
							_List_Nil,
							$elm$core$List$concat(children))
						]);
				})
			]));
};
var $author$project$AonTool$markdownRenderer = function (model) {
	var defaultRenderer = $author$project$Markdown$Renderer$defaultHtmlRenderer;
	return {
		aQ: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.aQ, $elm$core$List$singleton)),
		aT: A2($elm$core$Basics$composeR, defaultRenderer.aT, $elm$core$List$singleton),
		aU: A2($elm$core$Basics$composeR, defaultRenderer.aU, $elm$core$List$singleton),
		aX: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.aX, $elm$core$List$singleton)),
		a3: $elm$core$List$singleton(defaultRenderer.a3),
		a4: function (heading) {
			return _List_fromArray(
				[
					defaultRenderer.a4(
					{
						aS: $elm$core$List$concat(heading.aS),
						bd: heading.bd,
						br: heading.br
					})
				]);
		},
		b8: $author$project$AonTool$markdownHtmlRenderer(model),
		a9: A2($elm$core$Basics$composeR, defaultRenderer.a9, $elm$core$List$singleton),
		cb: $elm$core$List$concat,
		be: function (linkData) {
			return A2(
				$elm$core$Basics$composeR,
				$elm$core$List$concat,
				A2(
					$elm$core$Basics$composeR,
					defaultRenderer.be(linkData),
					$elm$core$List$singleton));
		},
		bh: function (startingIndex) {
			return A2(
				$elm$core$Basics$composeR,
				$elm$core$List$concat,
				A2(
					$elm$core$Basics$composeR,
					defaultRenderer.bh(startingIndex),
					$elm$core$List$singleton));
		},
		bi: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bi, $elm$core$List$singleton)),
		bB: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bB, $elm$core$List$singleton)),
		bC: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bC, $elm$core$List$singleton)),
		bF: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bF, $elm$core$List$singleton)),
		bG: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bG, $elm$core$List$singleton)),
		bH: function (alignment) {
			return A2(
				$elm$core$Basics$composeR,
				$elm$core$List$concat,
				A2(
					$elm$core$Basics$composeR,
					defaultRenderer.bH(alignment),
					$elm$core$List$singleton));
		},
		bI: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bI, $elm$core$List$singleton)),
		bJ: function (alignment) {
			return A2(
				$elm$core$Basics$composeR,
				$elm$core$List$concat,
				A2(
					$elm$core$Basics$composeR,
					defaultRenderer.bJ(alignment),
					$elm$core$List$singleton));
		},
		bK: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concat,
			A2($elm$core$Basics$composeR, defaultRenderer.bK, $elm$core$List$singleton)),
		c: A2($elm$core$Basics$composeR, defaultRenderer.c, $elm$core$List$singleton),
		bM: $elm$core$List$singleton(defaultRenderer.bM),
		bQ: A2(
			$elm$core$Basics$composeR,
			$elm$core$List$map(
				function (item) {
					var task = item.a;
					var children = item.b;
					return A2(
						$author$project$Markdown$Block$ListItem,
						task,
						$elm$core$List$concat(children));
				}),
			A2($elm$core$Basics$composeR, defaultRenderer.bQ, $elm$core$List$singleton))
	};
};
var $author$project$Markdown$RawBlock$BlankLine = {$: 10};
var $author$project$Markdown$Block$BlockQuote = function (a) {
	return {$: 3, a: a};
};
var $author$project$Markdown$RawBlock$BlockQuote = function (a) {
	return {$: 11, a: a};
};
var $author$project$Markdown$Block$Cdata = function (a) {
	return {$: 4, a: a};
};
var $author$project$Markdown$Block$CodeBlock = function (a) {
	return {$: 8, a: a};
};
var $author$project$Markdown$RawBlock$CodeBlock = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$Block$CodeSpan = function (a) {
	return {$: 6, a: a};
};
var $author$project$Markdown$Block$CompletedTask = 2;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$Block$Emphasis = function (a) {
	return {$: 3, a: a};
};
var $author$project$Markdown$Inline$Emphasis = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Markdown$Parser$EmptyBlock = {$: 0};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $author$project$Markdown$Block$HardLineBreak = {$: 8};
var $author$project$Markdown$Block$Heading = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Markdown$RawBlock$Heading = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$RawBlock$Html = function (a) {
	return {$: 2, a: a};
};
var $author$project$Markdown$Block$HtmlComment = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$Block$HtmlDeclaration = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Markdown$Block$Image = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Markdown$Block$IncompleteTask = 1;
var $author$project$Markdown$RawBlock$IndentedCodeBlock = function (a) {
	return {$: 6, a: a};
};
var $author$project$Markdown$Parser$InlineProblem = function (a) {
	return {$: 2, a: a};
};
var $author$project$Markdown$Block$Link = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$Block$NoTask = 0;
var $author$project$Markdown$RawBlock$OpenBlockOrParagraph = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$Block$OrderedList = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Markdown$RawBlock$OrderedListBlock = F6(
	function (a, b, c, d, e, f) {
		return {$: 4, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $author$project$Markdown$Parser$ParsedBlock = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$RawBlock$ParsedBlockQuote = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $author$project$Markdown$Block$ProcessingInstruction = function (a) {
	return {$: 2, a: a};
};
var $author$project$Markdown$Block$Strikethrough = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$Block$Strong = function (a) {
	return {$: 4, a: a};
};
var $author$project$Markdown$Block$Table = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Markdown$RawBlock$Table = function (a) {
	return {$: 8, a: a};
};
var $author$project$Markdown$Table$Table = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$Table$TableDelimiterRow = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$Block$ThematicBreak = {$: 9};
var $author$project$Markdown$RawBlock$ThematicBreak = {$: 7};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$Block$UnorderedList = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Markdown$RawBlock$UnorderedListBlock = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $author$project$Markdown$RawBlock$UnparsedInlines = $elm$core$Basics$identity;
var $author$project$Markdown$Parser$addReference = F2(
	function (state, linkRef) {
		return {
			a: A2($elm$core$List$cons, linkRef, state.a),
			b: state.b
		};
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.az);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.e, offset) < 0,
					0,
					{aV: col, h: s0.h, j: s0.j, e: offset, cr: row, az: s0.az});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.e, s.cr, s.aV, s);
	};
};
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $author$project$Whitespace$isSpaceOrTab = function (_char) {
	switch (_char) {
		case ' ':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $author$project$Parser$Token$carriageReturn = A2(
	$elm$parser$Parser$Advanced$Token,
	'\u000D',
	$elm$parser$Parser$Expecting('a carriage return'));
var $author$project$Parser$Token$newline = A2(
	$elm$parser$Parser$Advanced$Token,
	'\n',
	$elm$parser$Parser$Expecting('a newline'));
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {aV: col, b0: contextStack, co: problem, cr: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.cr, s.aV, x, s.h));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.e, s.cr, s.aV, s.az);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{aV: newCol, h: s.h, j: s.j, e: newOffset, cr: newRow, az: s.az});
	};
};
var $author$project$Whitespace$lineEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token($author$project$Parser$Token$newline),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$token($author$project$Parser$Token$carriageReturn),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token($author$project$Parser$Token$newline),
						$elm$parser$Parser$Advanced$succeed(0)
					])))
		]));
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $author$project$Markdown$Parser$blankLine = A2(
	$elm$parser$Parser$Advanced$map,
	function (_v0) {
		return $author$project$Markdown$RawBlock$BlankLine;
	},
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab)),
		$author$project$Whitespace$lineEnd));
var $author$project$Parser$Token$space = A2(
	$elm$parser$Parser$Advanced$Token,
	' ',
	$elm$parser$Parser$Expecting('a space'));
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $author$project$Markdown$Parser$blockQuoteStarts = _List_fromArray(
	[
		$elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			'>',
			$elm$parser$Parser$Expecting('>'))),
		A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$backtrackable(
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$space)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'>',
						$elm$parser$Parser$Expecting(' >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						' >',
						$elm$parser$Parser$Expecting('  >'))),
					$elm$parser$Parser$Advanced$symbol(
					A2(
						$elm$parser$Parser$Advanced$Token,
						'  >',
						$elm$parser$Parser$Expecting('   >')))
				])))
	]);
var $author$project$Whitespace$isLineEnd = function (_char) {
	switch (_char) {
		case '\n':
			return true;
		case '\u000D':
			return true;
		default:
			return false;
	}
};
var $author$project$Helpers$chompUntilLineEndOrEnd = $elm$parser$Parser$Advanced$chompWhile(
	A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Whitespace$isLineEnd));
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.e, s1.e, s0.az),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.az),
			s.e) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $author$project$Helpers$endOfFile = $elm$parser$Parser$Advanced$end(
	$elm$parser$Parser$Expecting('the end of the input'));
var $author$project$Helpers$lineEndOrEnd = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[$author$project$Whitespace$lineEnd, $author$project$Helpers$endOfFile]));
var $author$project$Markdown$Parser$blockQuote = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($author$project$Markdown$RawBlock$BlockQuote),
			$elm$parser$Parser$Advanced$oneOf($author$project$Markdown$Parser$blockQuoteStarts)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$space),
					$elm$parser$Parser$Advanced$succeed(0)
				]))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
		$author$project$Helpers$lineEndOrEnd));
var $author$project$Markdown$Parser$deadEndsToString = function (deadEnds) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$map, $author$project$Markdown$Parser$deadEndToString, deadEnds));
};
var $author$project$Markdown$Parser$endWithOpenBlockOrParagraph = function (block) {
	endWithOpenBlockOrParagraph:
	while (true) {
		switch (block.$) {
			case 1:
				var str = block.a;
				return !A2($elm$core$String$endsWith, str, '\n');
			case 12:
				var blocks = block.a;
				if (blocks.b) {
					var last = blocks.a;
					var $temp$block = last;
					block = $temp$block;
					continue endWithOpenBlockOrParagraph;
				} else {
					return false;
				}
			case 4:
				var blockslist = block.e;
				if (blockslist.b) {
					var blocks = blockslist.a;
					if (blocks.b) {
						var last = blocks.a;
						var $temp$block = last;
						block = $temp$block;
						continue endWithOpenBlockOrParagraph;
					} else {
						return false;
					}
				} else {
					return false;
				}
			case 0:
				return true;
			default:
				return false;
		}
	}
};
var $author$project$HtmlParser$Cdata = function (a) {
	return {$: 3, a: a};
};
var $author$project$HtmlParser$Element = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$HtmlParser$Text = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.e, s.az);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{aV: 1, h: s.h, j: s.j, e: s.e + 1, cr: s.cr + 1, az: s.az}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{aV: s.aV + 1, h: s.h, j: s.j, e: newOffset, cr: s.cr, az: s.az}));
		};
	});
var $author$project$HtmlParser$expectTagNameCharacter = $elm$parser$Parser$Expecting('at least 1 tag name character');
var $author$project$HtmlParser$tagNameCharacter = function (c) {
	switch (c) {
		case ' ':
			return false;
		case '\u000D':
			return false;
		case '\n':
			return false;
		case '\t':
			return false;
		case '/':
			return false;
		case '<':
			return false;
		case '>':
			return false;
		case '\"':
			return false;
		case '\'':
			return false;
		case '=':
			return false;
		default:
			return true;
	}
};
var $author$project$HtmlParser$tagName = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (name, _v0) {
			return $elm$core$String$toLower(name);
		}),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $author$project$HtmlParser$tagNameCharacter, $author$project$HtmlParser$expectTagNameCharacter),
		$elm$parser$Parser$Advanced$chompWhile($author$project$HtmlParser$tagNameCharacter)));
var $author$project$HtmlParser$attributeName = $author$project$HtmlParser$tagName;
var $author$project$HtmlParser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $author$project$HtmlParser$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('amp', '&'),
			_Utils_Tuple2('lt', '<'),
			_Utils_Tuple2('gt', '>'),
			_Utils_Tuple2('apos', '\''),
			_Utils_Tuple2('quot', '\"')
		]));
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $author$project$HtmlParser$decodeEscape = function (s) {
	return A2($elm$core$String$startsWith, '#x', s) ? A2(
		$elm$core$Result$mapError,
		$elm$parser$Parser$Problem,
		A2(
			$elm$core$Result$map,
			$elm$core$Char$fromCode,
			$rtfeldman$elm_hex$Hex$fromString(
				A2($elm$core$String$dropLeft, 2, s)))) : (A2($elm$core$String$startsWith, '#', s) ? A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('Invalid escaped character: ' + s),
		A2(
			$elm$core$Maybe$map,
			$elm$core$Char$fromCode,
			$elm$core$String$toInt(
				A2($elm$core$String$dropLeft, 1, s)))) : A2(
		$elm$core$Result$fromMaybe,
		$elm$parser$Parser$Problem('No entity named \"&' + (s + ';\" found.')),
		A2($elm$core$Dict$get, s, $author$project$HtmlParser$entities)));
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $author$project$HtmlParser$escapedChar = function (end_) {
	var process = function (entityStr) {
		var _v0 = $author$project$HtmlParser$decodeEscape(entityStr);
		if (!_v0.$) {
			var c = _v0.a;
			return $elm$parser$Parser$Advanced$succeed(c);
		} else {
			var e = _v0.a;
			return $elm$parser$Parser$Advanced$problem(e);
		}
	};
	var isEntityChar = function (c) {
		return (!_Utils_eq(c, end_)) && (c !== ';');
	};
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$author$project$HtmlParser$symbol('&')),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$andThen,
				process,
				$elm$parser$Parser$Advanced$getChompedString(
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$chompIf,
							isEntityChar,
							$elm$parser$Parser$Expecting('an entity character')),
						$elm$parser$Parser$Advanced$chompWhile(isEntityChar)))),
			$author$project$HtmlParser$symbol(';')));
};
var $author$project$HtmlParser$textStringStep = F3(
	function (closingChar, predicate, accum) {
		return A2(
			$elm$parser$Parser$Advanced$andThen,
			function (soFar) {
				return $elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$Advanced$map,
							function (escaped) {
								return $elm$parser$Parser$Advanced$Loop(
									_Utils_ap(
										accum,
										_Utils_ap(
											soFar,
											$elm$core$String$fromChar(escaped))));
							},
							$author$project$HtmlParser$escapedChar(closingChar)),
							$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(
								_Utils_ap(accum, soFar)))
						]));
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile(predicate)));
	});
var $author$project$HtmlParser$textString = function (closingChar) {
	var predicate = function (c) {
		return (!_Utils_eq(c, closingChar)) && (c !== '&');
	};
	return A2(
		$elm$parser$Parser$Advanced$loop,
		'',
		A2($author$project$HtmlParser$textStringStep, closingChar, predicate));
};
var $author$project$HtmlParser$attributeValue = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$author$project$HtmlParser$symbol('\"')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$author$project$HtmlParser$textString('\"'),
				$author$project$HtmlParser$symbol('\"'))),
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$author$project$HtmlParser$symbol('\'')),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$author$project$HtmlParser$textString('\''),
				$author$project$HtmlParser$symbol('\'')))
		]));
var $author$project$HtmlParser$keepOldest = F2(
	function (_new, mValue) {
		if (!mValue.$) {
			var v = mValue.a;
			return $elm$core$Maybe$Just(v);
		} else {
			return $elm$core$Maybe$Just(_new);
		}
	});
var $author$project$HtmlParser$isWhitespace = function (c) {
	switch (c) {
		case ' ':
			return true;
		case '\u000D':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		default:
			return false;
	}
};
var $author$project$HtmlParser$whiteSpace = $elm$parser$Parser$Advanced$chompWhile($author$project$HtmlParser$isWhitespace);
var $author$project$HtmlParser$attributesStep = function (attrs) {
	var process = F2(
		function (name, value) {
			return $elm$parser$Parser$Advanced$Loop(
				A3(
					$elm$core$Dict$update,
					$elm$core$String$toLower(name),
					$author$project$HtmlParser$keepOldest(value),
					attrs));
		});
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(process),
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2($elm$parser$Parser$Advanced$ignorer, $author$project$HtmlParser$attributeName, $author$project$HtmlParser$whiteSpace),
							$author$project$HtmlParser$symbol('=')),
						$author$project$HtmlParser$whiteSpace)),
				A2($elm$parser$Parser$Advanced$ignorer, $author$project$HtmlParser$attributeValue, $author$project$HtmlParser$whiteSpace)),
				$elm$parser$Parser$Advanced$succeed(
				$elm$parser$Parser$Advanced$Done(attrs))
			]));
};
var $author$project$HtmlParser$attributes = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$Dict$foldl,
		F3(
			function (key, value, accum) {
				return A2(
					$elm$core$List$cons,
					{g: key, bR: value},
					accum);
			}),
		_List_Nil),
	A2($elm$parser$Parser$Advanced$loop, $elm$core$Dict$empty, $author$project$HtmlParser$attributesStep));
var $elm$parser$Parser$Advanced$chompUntilEndOr = function (str) {
	return function (s) {
		var _v0 = A5(_Parser_findSubString, str, s.e, s.cr, s.aV, s.az);
		var newOffset = _v0.a;
		var newRow = _v0.b;
		var newCol = _v0.c;
		var adjustedOffset = (newOffset < 0) ? $elm$core$String$length(s.az) : newOffset;
		return A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.e, adjustedOffset) < 0,
			0,
			{aV: newCol, h: s.h, j: s.j, e: adjustedOffset, cr: newRow, az: s.az});
	};
};
var $author$project$HtmlParser$cdata = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$author$project$HtmlParser$symbol('<![CDATA[')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr(']]>')),
		$author$project$HtmlParser$symbol(']]>')));
var $author$project$HtmlParser$childrenStep = F2(
	function (options, accum) {
		return A2(
			$elm$parser$Parser$Advanced$map,
			function (f) {
				return f(accum);
			},
			$elm$parser$Parser$Advanced$oneOf(options));
	});
var $author$project$HtmlParser$fail = function (str) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(str));
};
var $author$project$HtmlParser$closingTag = function (startTagName) {
	var closingTagName = A2(
		$elm$parser$Parser$Advanced$andThen,
		function (endTagName) {
			return _Utils_eq(startTagName, endTagName) ? $elm$parser$Parser$Advanced$succeed(0) : $author$project$HtmlParser$fail('tag name mismatch: ' + (startTagName + (' and ' + endTagName)));
		},
		$author$project$HtmlParser$tagName);
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$author$project$HtmlParser$symbol('</'),
					$author$project$HtmlParser$whiteSpace),
				closingTagName),
			$author$project$HtmlParser$whiteSpace),
		$author$project$HtmlParser$symbol('>'));
};
var $author$project$HtmlParser$Comment = function (a) {
	return {$: 2, a: a};
};
var $author$project$HtmlParser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $author$project$HtmlParser$comment = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($author$project$HtmlParser$Comment),
		$elm$parser$Parser$Advanced$token(
			$author$project$HtmlParser$toToken('<!--'))),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('-->')),
		$elm$parser$Parser$Advanced$token(
			$author$project$HtmlParser$toToken('-->'))));
var $author$project$HtmlParser$Declaration = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$HtmlParser$expectUppercaseCharacter = $elm$parser$Parser$Expecting('at least 1 uppercase character');
var $author$project$HtmlParser$allUppercase = $elm$parser$Parser$Advanced$getChompedString(
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2($elm$parser$Parser$Advanced$chompIf, $elm$core$Char$isUpper, $author$project$HtmlParser$expectUppercaseCharacter),
		$elm$parser$Parser$Advanced$chompWhile($elm$core$Char$isUpper)));
var $author$project$HtmlParser$oneOrMoreWhiteSpace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$author$project$HtmlParser$isWhitespace,
		$elm$parser$Parser$Expecting('at least one whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($author$project$HtmlParser$isWhitespace));
var $author$project$HtmlParser$docType = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($author$project$HtmlParser$Declaration),
			$author$project$HtmlParser$symbol('<!')),
		A2($elm$parser$Parser$Advanced$ignorer, $author$project$HtmlParser$allUppercase, $author$project$HtmlParser$oneOrMoreWhiteSpace)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('>')),
		$author$project$HtmlParser$symbol('>')));
var $author$project$HtmlParser$ProcessingInstruction = function (a) {
	return {$: 4, a: a};
};
var $author$project$HtmlParser$processingInstruction = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($author$project$HtmlParser$ProcessingInstruction),
		$author$project$HtmlParser$symbol('<?')),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntilEndOr('?>')),
		$author$project$HtmlParser$symbol('?>')));
var $author$project$HtmlParser$isNotTextNodeIgnoreChar = function (c) {
	switch (c) {
		case '<':
			return false;
		case '&':
			return false;
		default:
			return true;
	}
};
var $author$project$HtmlParser$textNodeStringStepOptions = _List_fromArray(
	[
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			return $elm$parser$Parser$Advanced$Loop(0);
		},
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$chompIf,
				$author$project$HtmlParser$isNotTextNodeIgnoreChar,
				$elm$parser$Parser$Expecting('is not & or <')),
			$elm$parser$Parser$Advanced$chompWhile($author$project$HtmlParser$isNotTextNodeIgnoreChar))),
		A2(
		$elm$parser$Parser$Advanced$map,
		function (_v1) {
			return $elm$parser$Parser$Advanced$Loop(0);
		},
		$author$project$HtmlParser$escapedChar('<')),
		$elm$parser$Parser$Advanced$succeed(
		$elm$parser$Parser$Advanced$Done(0))
	]);
var $author$project$HtmlParser$textNodeStringStep = function (_v0) {
	return $elm$parser$Parser$Advanced$oneOf($author$project$HtmlParser$textNodeStringStepOptions);
};
var $author$project$HtmlParser$textNodeString = $elm$parser$Parser$Advanced$getChompedString(
	A2($elm$parser$Parser$Advanced$loop, 0, $author$project$HtmlParser$textNodeStringStep));
var $author$project$HtmlParser$children = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_List_Nil,
		$author$project$HtmlParser$childrenStep(
			$author$project$HtmlParser$childrenStepOptions(startTagName)));
};
var $author$project$HtmlParser$childrenStepOptions = function (startTagName) {
	return _List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_v1, accum) {
					return $elm$parser$Parser$Advanced$Done(
						$elm$core$List$reverse(accum));
				}),
			$author$project$HtmlParser$closingTag(startTagName)),
			A2(
			$elm$parser$Parser$Advanced$andThen,
			function (text) {
				return $elm$core$String$isEmpty(text) ? A2(
					$elm$parser$Parser$Advanced$map,
					F2(
						function (_v2, accum) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(accum));
						}),
					$author$project$HtmlParser$closingTag(startTagName)) : $elm$parser$Parser$Advanced$succeed(
					function (accum) {
						return $elm$parser$Parser$Advanced$Loop(
							A2(
								$elm$core$List$cons,
								$author$project$HtmlParser$Text(text),
								accum));
					});
			},
			$author$project$HtmlParser$textNodeString),
			A2(
			$elm$parser$Parser$Advanced$map,
			F2(
				function (_new, accum) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($elm$core$List$cons, _new, accum));
				}),
			$author$project$HtmlParser$cyclic$html())
		]);
};
var $author$project$HtmlParser$elementContinuation = function (startTagName) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$author$project$HtmlParser$Element(startTagName)),
				$author$project$HtmlParser$whiteSpace),
			A2($elm$parser$Parser$Advanced$ignorer, $author$project$HtmlParser$attributes, $author$project$HtmlParser$whiteSpace)),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					$author$project$HtmlParser$symbol('/>')),
					A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$author$project$HtmlParser$symbol('>')),
					$author$project$HtmlParser$children(startTagName))
				])));
};
function $author$project$HtmlParser$cyclic$html() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$Advanced$map, $author$project$HtmlParser$Cdata, $author$project$HtmlParser$cdata),
				$author$project$HtmlParser$processingInstruction,
				$author$project$HtmlParser$comment,
				$author$project$HtmlParser$docType,
				$author$project$HtmlParser$cyclic$element()
			]));
}
function $author$project$HtmlParser$cyclic$element() {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			$author$project$HtmlParser$symbol('<')),
		A2($elm$parser$Parser$Advanced$andThen, $author$project$HtmlParser$elementContinuation, $author$project$HtmlParser$tagName));
}
var $author$project$HtmlParser$html = $author$project$HtmlParser$cyclic$html();
$author$project$HtmlParser$cyclic$html = function () {
	return $author$project$HtmlParser$html;
};
var $author$project$HtmlParser$element = $author$project$HtmlParser$cyclic$element();
$author$project$HtmlParser$cyclic$element = function () {
	return $author$project$HtmlParser$element;
};
var $author$project$Parser$Token$tab = A2(
	$elm$parser$Parser$Advanced$Token,
	'\t',
	$elm$parser$Parser$Expecting('a tab'));
var $author$project$Markdown$Parser$exactlyFourSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$tab),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$backtrackable(
				$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$space)),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'   ',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							' \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation'))),
						$elm$parser$Parser$Advanced$symbol(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'  \t',
							$elm$parser$Parser$ExpectingSymbol('Indentation')))
					])))
		]));
var $author$project$Markdown$Parser$indentedCodeBlock = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($author$project$Markdown$RawBlock$IndentedCodeBlock),
		$author$project$Markdown$Parser$exactlyFourSpaces),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
		$author$project$Helpers$lineEndOrEnd));
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Markdown$Helpers$isEven = function (_int) {
	return !A2($elm$core$Basics$modBy, 2, _int);
};
var $author$project$Markdown$Block$Loose = 0;
var $author$project$Markdown$Block$Tight = 1;
var $author$project$Markdown$Parser$isTightBoolToListDisplay = function (isTight) {
	return isTight ? 1 : 0;
};
var $author$project$Markdown$Parser$joinRawStringsWith = F3(
	function (joinWith, string1, string2) {
		var _v0 = _Utils_Tuple2(string1, string2);
		if (_v0.a === '') {
			return string2;
		} else {
			if (_v0.b === '') {
				return string1;
			} else {
				return _Utils_ap(
					string1,
					_Utils_ap(joinWith, string2));
			}
		}
	});
var $author$project$Markdown$Parser$joinStringsPreserveAll = F2(
	function (string1, string2) {
		return string1 + ('\n' + string2);
	});
var $author$project$Markdown$Parser$innerParagraphParser = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (rawLine, _v0) {
			return $author$project$Markdown$RawBlock$OpenBlockOrParagraph(rawLine);
		}),
	$author$project$Helpers$chompUntilLineEndOrEnd);
var $author$project$Markdown$Parser$openBlockOrParagraphParser = A2($elm$parser$Parser$Advanced$ignorer, $author$project$Markdown$Parser$innerParagraphParser, $author$project$Helpers$lineEndOrEnd);
var $author$project$Markdown$OrderedList$ListItem = F4(
	function (order, intended, marker, body) {
		return {bZ: body, cc: intended, cf: marker, cn: order};
	});
var $elm$parser$Parser$Advanced$getCol = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.aV, s);
};
var $author$project$Markdown$OrderedList$orderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, '');
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $author$project$Helpers$lineEndOrEnd));
var $author$project$Parser$Extra$chompOneOrMore = function (condition) {
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$chompIf,
			condition,
			$elm$parser$Parser$Problem('Expected one or more character')),
		$elm$parser$Parser$Advanced$chompWhile(condition));
};
var $author$project$Markdown$OrderedList$orderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$author$project$Parser$Extra$chompOneOrMore($author$project$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
		$author$project$Helpers$lineEndOrEnd));
var $author$project$Markdown$OrderedList$Dot = 0;
var $author$project$Markdown$OrderedList$Paren = 1;
var $author$project$Parser$Token$closingParen = A2(
	$elm$parser$Parser$Advanced$Token,
	')',
	$elm$parser$Parser$Expecting('a `)`'));
var $author$project$Parser$Token$dot = A2(
	$elm$parser$Parser$Advanced$Token,
	'.',
	$elm$parser$Parser$Expecting('a `.`'));
var $author$project$Markdown$OrderedList$orderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(0),
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$dot)),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$closingParen))
		]));
var $author$project$Parser$Extra$positiveInteger = A2(
	$elm$parser$Parser$Advanced$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$author$project$Parser$Extra$chompOneOrMore($elm$core$Char$isDigit));
var $author$project$Markdown$OrderedList$positiveIntegerMaxOf9Digits = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (parsed) {
		return (parsed <= 999999999) ? $elm$parser$Parser$Advanced$succeed(parsed) : $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Starting numbers must be nine digits or less.'));
	},
	$author$project$Parser$Extra$positiveInteger);
var $author$project$Whitespace$space = $elm$parser$Parser$Advanced$token($author$project$Parser$Token$space);
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Parser$Extra$upTo = F2(
	function (n, parser) {
		var _v0 = A2($elm$core$List$repeat, n, parser);
		if (!_v0.b) {
			return $elm$parser$Parser$Advanced$succeed(0);
		} else {
			var firstParser = _v0.a;
			var remainingParsers = _v0.b;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (p, parsers) {
						return $elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									A2($elm$parser$Parser$Advanced$ignorer, p, parsers),
									$elm$parser$Parser$Advanced$succeed(0)
								]));
					}),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							firstParser,
							$elm$parser$Parser$Advanced$succeed(0)
						])),
				remainingParsers);
		}
	});
var $author$project$Markdown$OrderedList$validateStartsWith1 = function (parsed) {
	if (parsed === 1) {
		return $elm$parser$Parser$Advanced$succeed(parsed);
	} else {
		return $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Lists inside a paragraph or after a paragraph without a blank line must start with 1'));
	}
};
var $author$project$Markdown$OrderedList$orderedListOrderParser = function (previousWasBody) {
	return previousWasBody ? A2(
		$elm$parser$Parser$Advanced$andThen,
		$author$project$Markdown$OrderedList$validateStartsWith1,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				A2($author$project$Parser$Extra$upTo, 3, $author$project$Whitespace$space)),
			$author$project$Markdown$OrderedList$positiveIntegerMaxOf9Digits)) : A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($author$project$Parser$Extra$upTo, 3, $author$project$Whitespace$space)),
		$author$project$Markdown$OrderedList$positiveIntegerMaxOf9Digits);
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $author$project$Markdown$OrderedList$parser = function (previousWasBody) {
	var parseSubsequentItem = F5(
		function (start, order, marker, mid, _v0) {
			var end = _v0.a;
			var body = _v0.b;
			return ((end - mid) <= 4) ? A4($author$project$Markdown$OrderedList$ListItem, order, end - start, marker, body) : A4(
				$author$project$Markdown$OrderedList$ListItem,
				order,
				(mid - start) + 1,
				marker,
				_Utils_ap(
					A2($elm$core$String$repeat, (end - mid) - 1, ' '),
					body));
		});
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(parseSubsequentItem),
						$elm$parser$Parser$Advanced$getCol),
					$elm$parser$Parser$Advanced$backtrackable(
						$author$project$Markdown$OrderedList$orderedListOrderParser(previousWasBody))),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$OrderedList$orderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $author$project$Markdown$OrderedList$orderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$author$project$Markdown$OrderedList$orderedListEmptyItemParser, $author$project$Markdown$OrderedList$orderedListItemBodyParser])));
};
var $author$project$Markdown$Parser$orderedListBlock = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (item) {
			return A6($author$project$Markdown$RawBlock$OrderedListBlock, true, item.cc, item.cf, item.cn, _List_Nil, item.bZ);
		},
		$author$project$Markdown$OrderedList$parser(previousWasBody));
};
var $author$project$Markdown$Inline$CodeInline = function (a) {
	return {$: 2, a: a};
};
var $author$project$Markdown$Inline$HardLineBreak = {$: 1};
var $author$project$Markdown$Inline$HtmlInline = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$Inline$Image = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $author$project$Markdown$Inline$Link = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $author$project$Markdown$Inline$Strikethrough = function (a) {
	return {$: 7, a: a};
};
var $author$project$Markdown$Inline$Text = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$InlineParser$matchToInline = function (_v0) {
	var match = _v0;
	var _v1 = match.m;
	switch (_v1.$) {
		case 0:
			return $author$project$Markdown$Inline$Text(match.c);
		case 1:
			return $author$project$Markdown$Inline$HardLineBreak;
		case 2:
			return $author$project$Markdown$Inline$CodeInline(match.c);
		case 3:
			var _v2 = _v1.a;
			var text = _v2.a;
			var url = _v2.b;
			return A3(
				$author$project$Markdown$Inline$Link,
				url,
				$elm$core$Maybe$Nothing,
				_List_fromArray(
					[
						$author$project$Markdown$Inline$Text(text)
					]));
		case 4:
			var _v3 = _v1.a;
			var url = _v3.a;
			var maybeTitle = _v3.b;
			return A3(
				$author$project$Markdown$Inline$Link,
				url,
				maybeTitle,
				$author$project$Markdown$InlineParser$matchesToInlines(match.u));
		case 5:
			var _v4 = _v1.a;
			var url = _v4.a;
			var maybeTitle = _v4.b;
			return A3(
				$author$project$Markdown$Inline$Image,
				url,
				maybeTitle,
				$author$project$Markdown$InlineParser$matchesToInlines(match.u));
		case 6:
			var model = _v1.a;
			return $author$project$Markdown$Inline$HtmlInline(model);
		case 7:
			var length = _v1.a;
			return A2(
				$author$project$Markdown$Inline$Emphasis,
				length,
				$author$project$Markdown$InlineParser$matchesToInlines(match.u));
		default:
			return $author$project$Markdown$Inline$Strikethrough(
				$author$project$Markdown$InlineParser$matchesToInlines(match.u));
	}
};
var $author$project$Markdown$InlineParser$matchesToInlines = function (matches) {
	return A2($elm$core$List$map, $author$project$Markdown$InlineParser$matchToInline, matches);
};
var $author$project$Markdown$InlineParser$Match = $elm$core$Basics$identity;
var $author$project$Markdown$InlineParser$prepareChildMatch = F2(
	function (parentMatch, childMatch) {
		return {t: childMatch.t - parentMatch.w, u: childMatch.u, l: childMatch.l - parentMatch.w, c: childMatch.c, C: childMatch.C - parentMatch.w, w: childMatch.w - parentMatch.w, m: childMatch.m};
	});
var $author$project$Markdown$InlineParser$addChild = F2(
	function (parentMatch, childMatch) {
		return {
			t: parentMatch.t,
			u: A2(
				$elm$core$List$cons,
				A2($author$project$Markdown$InlineParser$prepareChildMatch, parentMatch, childMatch),
				parentMatch.u),
			l: parentMatch.l,
			c: parentMatch.c,
			C: parentMatch.C,
			w: parentMatch.w,
			m: parentMatch.m
		};
	});
var $author$project$Markdown$InlineParser$organizeChildren = function (_v4) {
	var match = _v4;
	return {
		t: match.t,
		u: $author$project$Markdown$InlineParser$organizeMatches(match.u),
		l: match.l,
		c: match.c,
		C: match.C,
		w: match.w,
		m: match.m
	};
};
var $author$project$Markdown$InlineParser$organizeMatches = function (matches) {
	var _v2 = A2(
		$elm$core$List$sortBy,
		function (_v3) {
			var match = _v3;
			return match.l;
		},
		matches);
	if (!_v2.b) {
		return _List_Nil;
	} else {
		var first = _v2.a;
		var rest = _v2.b;
		return A3($author$project$Markdown$InlineParser$organizeMatchesHelp, rest, first, _List_Nil);
	}
};
var $author$project$Markdown$InlineParser$organizeMatchesHelp = F3(
	function (remaining, _v0, matchesTail) {
		organizeMatchesHelp:
		while (true) {
			var prevMatch = _v0;
			if (!remaining.b) {
				return A2(
					$elm$core$List$cons,
					$author$project$Markdown$InlineParser$organizeChildren(prevMatch),
					matchesTail);
			} else {
				var match = remaining.a;
				var rest = remaining.b;
				if (_Utils_cmp(prevMatch.t, match.l) < 1) {
					var $temp$remaining = rest,
						$temp$_v0 = match,
						$temp$matchesTail = A2(
						$elm$core$List$cons,
						$author$project$Markdown$InlineParser$organizeChildren(prevMatch),
						matchesTail);
					remaining = $temp$remaining;
					_v0 = $temp$_v0;
					matchesTail = $temp$matchesTail;
					continue organizeMatchesHelp;
				} else {
					if ((_Utils_cmp(prevMatch.l, match.l) < 0) && (_Utils_cmp(prevMatch.t, match.t) > 0)) {
						var $temp$remaining = rest,
							$temp$_v0 = A2($author$project$Markdown$InlineParser$addChild, prevMatch, match),
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					} else {
						var $temp$remaining = rest,
							$temp$_v0 = prevMatch,
							$temp$matchesTail = matchesTail;
						remaining = $temp$remaining;
						_v0 = $temp$_v0;
						matchesTail = $temp$matchesTail;
						continue organizeMatchesHelp;
					}
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$NormalType = {$: 0};
var $author$project$Markdown$Helpers$containsAmpersand = function (string) {
	return A2($elm$core$String$contains, '&', string);
};
var $author$project$Markdown$Entity$decimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#([0-9]{1,8});'));
var $author$project$Markdown$Entity$isBadEndUnicode = function (_int) {
	var remain_ = A2($elm$core$Basics$modBy, 16, _int);
	var remain = A2($elm$core$Basics$modBy, 131070, _int);
	return (_int >= 131070) && ((((0 <= remain) && (remain <= 15)) || ((65536 <= remain) && (remain <= 65551))) && ((remain_ === 14) || (remain_ === 15)));
};
var $author$project$Markdown$Entity$isValidUnicode = function (_int) {
	return (_int === 9) || ((_int === 10) || ((_int === 13) || ((_int === 133) || (((32 <= _int) && (_int <= 126)) || (((160 <= _int) && (_int <= 55295)) || (((57344 <= _int) && (_int <= 64975)) || (((65008 <= _int) && (_int <= 65533)) || ((65536 <= _int) && (_int <= 1114109)))))))));
};
var $author$project$Markdown$Entity$validUnicode = function (_int) {
	return ($author$project$Markdown$Entity$isValidUnicode(_int) && (!$author$project$Markdown$Entity$isBadEndUnicode(_int))) ? $elm$core$String$fromChar(
		$elm$core$Char$fromCode(_int)) : $elm$core$String$fromChar(
		$elm$core$Char$fromCode(65533));
};
var $author$project$Markdown$Entity$replaceDecimal = function (match) {
	var _v0 = match.bD;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		var _v1 = $elm$core$String$toInt(first);
		if (!_v1.$) {
			var v = _v1.a;
			return $author$project$Markdown$Entity$validUnicode(v);
		} else {
			return match.cg;
		}
	} else {
		return match.cg;
	}
};
var $author$project$Markdown$Entity$replaceDecimals = A2($elm$regex$Regex$replace, $author$project$Markdown$Entity$decimalRegex, $author$project$Markdown$Entity$replaceDecimal);
var $author$project$Markdown$Entity$entitiesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&([0-9a-zA-Z]+);'));
var $author$project$Markdown$Entity$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('quot', 34),
			_Utils_Tuple2('amp', 38),
			_Utils_Tuple2('apos', 39),
			_Utils_Tuple2('lt', 60),
			_Utils_Tuple2('gt', 62),
			_Utils_Tuple2('nbsp', 160),
			_Utils_Tuple2('iexcl', 161),
			_Utils_Tuple2('cent', 162),
			_Utils_Tuple2('pound', 163),
			_Utils_Tuple2('curren', 164),
			_Utils_Tuple2('yen', 165),
			_Utils_Tuple2('brvbar', 166),
			_Utils_Tuple2('sect', 167),
			_Utils_Tuple2('uml', 168),
			_Utils_Tuple2('copy', 169),
			_Utils_Tuple2('ordf', 170),
			_Utils_Tuple2('laquo', 171),
			_Utils_Tuple2('not', 172),
			_Utils_Tuple2('shy', 173),
			_Utils_Tuple2('reg', 174),
			_Utils_Tuple2('macr', 175),
			_Utils_Tuple2('deg', 176),
			_Utils_Tuple2('plusmn', 177),
			_Utils_Tuple2('sup2', 178),
			_Utils_Tuple2('sup3', 179),
			_Utils_Tuple2('acute', 180),
			_Utils_Tuple2('micro', 181),
			_Utils_Tuple2('para', 182),
			_Utils_Tuple2('middot', 183),
			_Utils_Tuple2('cedil', 184),
			_Utils_Tuple2('sup1', 185),
			_Utils_Tuple2('ordm', 186),
			_Utils_Tuple2('raquo', 187),
			_Utils_Tuple2('frac14', 188),
			_Utils_Tuple2('frac12', 189),
			_Utils_Tuple2('frac34', 190),
			_Utils_Tuple2('iquest', 191),
			_Utils_Tuple2('Agrave', 192),
			_Utils_Tuple2('Aacute', 193),
			_Utils_Tuple2('Acirc', 194),
			_Utils_Tuple2('Atilde', 195),
			_Utils_Tuple2('Auml', 196),
			_Utils_Tuple2('Aring', 197),
			_Utils_Tuple2('AElig', 198),
			_Utils_Tuple2('Ccedil', 199),
			_Utils_Tuple2('Egrave', 200),
			_Utils_Tuple2('Eacute', 201),
			_Utils_Tuple2('Ecirc', 202),
			_Utils_Tuple2('Euml', 203),
			_Utils_Tuple2('Igrave', 204),
			_Utils_Tuple2('Iacute', 205),
			_Utils_Tuple2('Icirc', 206),
			_Utils_Tuple2('Iuml', 207),
			_Utils_Tuple2('ETH', 208),
			_Utils_Tuple2('Ntilde', 209),
			_Utils_Tuple2('Ograve', 210),
			_Utils_Tuple2('Oacute', 211),
			_Utils_Tuple2('Ocirc', 212),
			_Utils_Tuple2('Otilde', 213),
			_Utils_Tuple2('Ouml', 214),
			_Utils_Tuple2('times', 215),
			_Utils_Tuple2('Oslash', 216),
			_Utils_Tuple2('Ugrave', 217),
			_Utils_Tuple2('Uacute', 218),
			_Utils_Tuple2('Ucirc', 219),
			_Utils_Tuple2('Uuml', 220),
			_Utils_Tuple2('Yacute', 221),
			_Utils_Tuple2('THORN', 222),
			_Utils_Tuple2('szlig', 223),
			_Utils_Tuple2('agrave', 224),
			_Utils_Tuple2('aacute', 225),
			_Utils_Tuple2('acirc', 226),
			_Utils_Tuple2('atilde', 227),
			_Utils_Tuple2('auml', 228),
			_Utils_Tuple2('aring', 229),
			_Utils_Tuple2('aelig', 230),
			_Utils_Tuple2('ccedil', 231),
			_Utils_Tuple2('egrave', 232),
			_Utils_Tuple2('eacute', 233),
			_Utils_Tuple2('ecirc', 234),
			_Utils_Tuple2('euml', 235),
			_Utils_Tuple2('igrave', 236),
			_Utils_Tuple2('iacute', 237),
			_Utils_Tuple2('icirc', 238),
			_Utils_Tuple2('iuml', 239),
			_Utils_Tuple2('eth', 240),
			_Utils_Tuple2('ntilde', 241),
			_Utils_Tuple2('ograve', 242),
			_Utils_Tuple2('oacute', 243),
			_Utils_Tuple2('ocirc', 244),
			_Utils_Tuple2('otilde', 245),
			_Utils_Tuple2('ouml', 246),
			_Utils_Tuple2('divide', 247),
			_Utils_Tuple2('oslash', 248),
			_Utils_Tuple2('ugrave', 249),
			_Utils_Tuple2('uacute', 250),
			_Utils_Tuple2('ucirc', 251),
			_Utils_Tuple2('uuml', 252),
			_Utils_Tuple2('yacute', 253),
			_Utils_Tuple2('thorn', 254),
			_Utils_Tuple2('yuml', 255),
			_Utils_Tuple2('OElig', 338),
			_Utils_Tuple2('oelig', 339),
			_Utils_Tuple2('Scaron', 352),
			_Utils_Tuple2('scaron', 353),
			_Utils_Tuple2('Yuml', 376),
			_Utils_Tuple2('fnof', 402),
			_Utils_Tuple2('circ', 710),
			_Utils_Tuple2('tilde', 732),
			_Utils_Tuple2('Alpha', 913),
			_Utils_Tuple2('Beta', 914),
			_Utils_Tuple2('Gamma', 915),
			_Utils_Tuple2('Delta', 916),
			_Utils_Tuple2('Epsilon', 917),
			_Utils_Tuple2('Zeta', 918),
			_Utils_Tuple2('Eta', 919),
			_Utils_Tuple2('Theta', 920),
			_Utils_Tuple2('Iota', 921),
			_Utils_Tuple2('Kappa', 922),
			_Utils_Tuple2('Lambda', 923),
			_Utils_Tuple2('Mu', 924),
			_Utils_Tuple2('Nu', 925),
			_Utils_Tuple2('Xi', 926),
			_Utils_Tuple2('Omicron', 927),
			_Utils_Tuple2('Pi', 928),
			_Utils_Tuple2('Rho', 929),
			_Utils_Tuple2('Sigma', 931),
			_Utils_Tuple2('Tau', 932),
			_Utils_Tuple2('Upsilon', 933),
			_Utils_Tuple2('Phi', 934),
			_Utils_Tuple2('Chi', 935),
			_Utils_Tuple2('Psi', 936),
			_Utils_Tuple2('Omega', 937),
			_Utils_Tuple2('alpha', 945),
			_Utils_Tuple2('beta', 946),
			_Utils_Tuple2('gamma', 947),
			_Utils_Tuple2('delta', 948),
			_Utils_Tuple2('epsilon', 949),
			_Utils_Tuple2('zeta', 950),
			_Utils_Tuple2('eta', 951),
			_Utils_Tuple2('theta', 952),
			_Utils_Tuple2('iota', 953),
			_Utils_Tuple2('kappa', 954),
			_Utils_Tuple2('lambda', 955),
			_Utils_Tuple2('mu', 956),
			_Utils_Tuple2('nu', 957),
			_Utils_Tuple2('xi', 958),
			_Utils_Tuple2('omicron', 959),
			_Utils_Tuple2('pi', 960),
			_Utils_Tuple2('rho', 961),
			_Utils_Tuple2('sigmaf', 962),
			_Utils_Tuple2('sigma', 963),
			_Utils_Tuple2('tau', 964),
			_Utils_Tuple2('upsilon', 965),
			_Utils_Tuple2('phi', 966),
			_Utils_Tuple2('chi', 967),
			_Utils_Tuple2('psi', 968),
			_Utils_Tuple2('omega', 969),
			_Utils_Tuple2('thetasym', 977),
			_Utils_Tuple2('upsih', 978),
			_Utils_Tuple2('piv', 982),
			_Utils_Tuple2('ensp', 8194),
			_Utils_Tuple2('emsp', 8195),
			_Utils_Tuple2('thinsp', 8201),
			_Utils_Tuple2('zwnj', 8204),
			_Utils_Tuple2('zwj', 8205),
			_Utils_Tuple2('lrm', 8206),
			_Utils_Tuple2('rlm', 8207),
			_Utils_Tuple2('ndash', 8211),
			_Utils_Tuple2('mdash', 8212),
			_Utils_Tuple2('lsquo', 8216),
			_Utils_Tuple2('rsquo', 8217),
			_Utils_Tuple2('sbquo', 8218),
			_Utils_Tuple2('ldquo', 8220),
			_Utils_Tuple2('rdquo', 8221),
			_Utils_Tuple2('bdquo', 8222),
			_Utils_Tuple2('dagger', 8224),
			_Utils_Tuple2('Dagger', 8225),
			_Utils_Tuple2('bull', 8226),
			_Utils_Tuple2('hellip', 8230),
			_Utils_Tuple2('permil', 8240),
			_Utils_Tuple2('prime', 8242),
			_Utils_Tuple2('Prime', 8243),
			_Utils_Tuple2('lsaquo', 8249),
			_Utils_Tuple2('rsaquo', 8250),
			_Utils_Tuple2('oline', 8254),
			_Utils_Tuple2('frasl', 8260),
			_Utils_Tuple2('euro', 8364),
			_Utils_Tuple2('image', 8465),
			_Utils_Tuple2('weierp', 8472),
			_Utils_Tuple2('real', 8476),
			_Utils_Tuple2('trade', 8482),
			_Utils_Tuple2('alefsym', 8501),
			_Utils_Tuple2('larr', 8592),
			_Utils_Tuple2('uarr', 8593),
			_Utils_Tuple2('rarr', 8594),
			_Utils_Tuple2('darr', 8595),
			_Utils_Tuple2('harr', 8596),
			_Utils_Tuple2('crarr', 8629),
			_Utils_Tuple2('lArr', 8656),
			_Utils_Tuple2('uArr', 8657),
			_Utils_Tuple2('rArr', 8658),
			_Utils_Tuple2('dArr', 8659),
			_Utils_Tuple2('hArr', 8660),
			_Utils_Tuple2('forall', 8704),
			_Utils_Tuple2('part', 8706),
			_Utils_Tuple2('exist', 8707),
			_Utils_Tuple2('empty', 8709),
			_Utils_Tuple2('nabla', 8711),
			_Utils_Tuple2('isin', 8712),
			_Utils_Tuple2('notin', 8713),
			_Utils_Tuple2('ni', 8715),
			_Utils_Tuple2('prod', 8719),
			_Utils_Tuple2('sum', 8721),
			_Utils_Tuple2('minus', 8722),
			_Utils_Tuple2('lowast', 8727),
			_Utils_Tuple2('radic', 8730),
			_Utils_Tuple2('prop', 8733),
			_Utils_Tuple2('infin', 8734),
			_Utils_Tuple2('ang', 8736),
			_Utils_Tuple2('and', 8743),
			_Utils_Tuple2('or', 8744),
			_Utils_Tuple2('cap', 8745),
			_Utils_Tuple2('cup', 8746),
			_Utils_Tuple2('int', 8747),
			_Utils_Tuple2('there4', 8756),
			_Utils_Tuple2('sim', 8764),
			_Utils_Tuple2('cong', 8773),
			_Utils_Tuple2('asymp', 8776),
			_Utils_Tuple2('ne', 8800),
			_Utils_Tuple2('equiv', 8801),
			_Utils_Tuple2('le', 8804),
			_Utils_Tuple2('ge', 8805),
			_Utils_Tuple2('sub', 8834),
			_Utils_Tuple2('sup', 8835),
			_Utils_Tuple2('nsub', 8836),
			_Utils_Tuple2('sube', 8838),
			_Utils_Tuple2('supe', 8839),
			_Utils_Tuple2('oplus', 8853),
			_Utils_Tuple2('otimes', 8855),
			_Utils_Tuple2('perp', 8869),
			_Utils_Tuple2('sdot', 8901),
			_Utils_Tuple2('lceil', 8968),
			_Utils_Tuple2('rceil', 8969),
			_Utils_Tuple2('lfloor', 8970),
			_Utils_Tuple2('rfloor', 8971),
			_Utils_Tuple2('lang', 9001),
			_Utils_Tuple2('rang', 9002),
			_Utils_Tuple2('loz', 9674),
			_Utils_Tuple2('spades', 9824),
			_Utils_Tuple2('clubs', 9827),
			_Utils_Tuple2('hearts', 9829),
			_Utils_Tuple2('diams', 9830)
		]));
var $author$project$Markdown$Entity$replaceEntity = function (match) {
	var _v0 = match.bD;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		var _v1 = A2($elm$core$Dict$get, first, $author$project$Markdown$Entity$entities);
		if (!_v1.$) {
			var code = _v1.a;
			return $elm$core$String$fromChar(
				$elm$core$Char$fromCode(code));
		} else {
			return match.cg;
		}
	} else {
		return match.cg;
	}
};
var $author$project$Markdown$Entity$replaceEntities = A2($elm$regex$Regex$replace, $author$project$Markdown$Entity$entitiesRegex, $author$project$Markdown$Entity$replaceEntity);
var $author$project$Markdown$Helpers$escapableRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\+)([!\"#$%&\\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])'));
var $author$project$Markdown$Helpers$replaceEscapable = A2(
	$elm$regex$Regex$replace,
	$author$project$Markdown$Helpers$escapableRegex,
	function (regexMatch) {
		var _v0 = regexMatch.bD;
		if (((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) {
			var backslashes = _v0.a.a;
			var _v1 = _v0.b;
			var escapedStr = _v1.a.a;
			return _Utils_ap(
				A2(
					$elm$core$String$repeat,
					($elm$core$String$length(backslashes) / 2) | 0,
					'\\'),
				escapedStr);
		} else {
			return regexMatch.cg;
		}
	});
var $author$project$Markdown$Entity$hexadecimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#[Xx]([0-9a-fA-F]{1,8});'));
var $elm$core$String$foldl = _String_foldl;
var $author$project$Markdown$Entity$hexToInt = function (string) {
	var folder = F2(
		function (hexDigit, _int) {
			return ((_int * 16) + A2(
				$elm$core$Basics$modBy,
				39,
				$elm$core$Char$toCode(hexDigit))) - 9;
		});
	return A3(
		$elm$core$String$foldl,
		folder,
		0,
		$elm$core$String$toLower(string));
};
var $author$project$Markdown$Entity$replaceHexadecimal = function (match) {
	var _v0 = match.bD;
	if (_v0.b && (!_v0.a.$)) {
		var first = _v0.a.a;
		return $author$project$Markdown$Entity$validUnicode(
			$author$project$Markdown$Entity$hexToInt(first));
	} else {
		return match.cg;
	}
};
var $author$project$Markdown$Entity$replaceHexadecimals = A2($elm$regex$Regex$replace, $author$project$Markdown$Entity$hexadecimalRegex, $author$project$Markdown$Entity$replaceHexadecimal);
var $author$project$Markdown$Helpers$formatStr = function (str) {
	var withEscapes = $author$project$Markdown$Helpers$replaceEscapable(str);
	return $author$project$Markdown$Helpers$containsAmpersand(withEscapes) ? $author$project$Markdown$Entity$replaceHexadecimals(
		$author$project$Markdown$Entity$replaceDecimals(
			$author$project$Markdown$Entity$replaceEntities(withEscapes))) : withEscapes;
};
var $author$project$Markdown$InlineParser$normalMatch = function (text) {
	return {
		t: 0,
		u: _List_Nil,
		l: 0,
		c: $author$project$Markdown$Helpers$formatStr(text),
		C: 0,
		w: 0,
		m: $author$project$Markdown$InlineParser$NormalType
	};
};
var $author$project$Markdown$InlineParser$parseTextMatch = F3(
	function (rawText, _v2, parsedMatches) {
		var matchModel = _v2;
		var updtMatch = {
			t: matchModel.t,
			u: A3($author$project$Markdown$InlineParser$parseTextMatches, matchModel.c, _List_Nil, matchModel.u),
			l: matchModel.l,
			c: matchModel.c,
			C: matchModel.C,
			w: matchModel.w,
			m: matchModel.m
		};
		if (!parsedMatches.b) {
			var finalStr = A2($elm$core$String$dropLeft, matchModel.t, rawText);
			return $elm$core$String$isEmpty(finalStr) ? _List_fromArray(
				[updtMatch]) : _List_fromArray(
				[
					updtMatch,
					$author$project$Markdown$InlineParser$normalMatch(finalStr)
				]);
		} else {
			var matchHead = parsedMatches.a;
			var _v4 = matchHead.m;
			if (!_v4.$) {
				return A2($elm$core$List$cons, updtMatch, parsedMatches);
			} else {
				return _Utils_eq(matchModel.t, matchHead.l) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : ((_Utils_cmp(matchModel.t, matchHead.l) < 0) ? A2(
					$elm$core$List$cons,
					updtMatch,
					A2(
						$elm$core$List$cons,
						$author$project$Markdown$InlineParser$normalMatch(
							A3($elm$core$String$slice, matchModel.t, matchHead.l, rawText)),
						parsedMatches)) : parsedMatches);
			}
		}
	});
var $author$project$Markdown$InlineParser$parseTextMatches = F3(
	function (rawText, parsedMatches, matches) {
		parseTextMatches:
		while (true) {
			if (!matches.b) {
				if (!parsedMatches.b) {
					return $elm$core$String$isEmpty(rawText) ? _List_Nil : _List_fromArray(
						[
							$author$project$Markdown$InlineParser$normalMatch(rawText)
						]);
				} else {
					var matchModel = parsedMatches.a;
					return (matchModel.l > 0) ? A2(
						$elm$core$List$cons,
						$author$project$Markdown$InlineParser$normalMatch(
							A2($elm$core$String$left, matchModel.l, rawText)),
						parsedMatches) : parsedMatches;
				}
			} else {
				var match = matches.a;
				var matchesTail = matches.b;
				var $temp$rawText = rawText,
					$temp$parsedMatches = A3($author$project$Markdown$InlineParser$parseTextMatch, rawText, match, parsedMatches),
					$temp$matches = matchesTail;
				rawText = $temp$rawText;
				parsedMatches = $temp$parsedMatches;
				matches = $temp$matches;
				continue parseTextMatches;
			}
		}
	});
var $author$project$Markdown$InlineParser$cleanAngleBracketTokens = F3(
	function (tokensL, tokensR, countL) {
		cleanAngleBracketTokens:
		while (true) {
			if (!tokensR.b) {
				return _List_Nil;
			} else {
				var hd1 = tokensR.a;
				var rest1 = tokensR.b;
				if (!tokensL.b) {
					if (countL > 1) {
						var $temp$tokensL = tokensL,
							$temp$tokensR = rest1,
							$temp$countL = countL - 1;
						tokensL = $temp$tokensL;
						tokensR = $temp$tokensR;
						countL = $temp$countL;
						continue cleanAngleBracketTokens;
					} else {
						if (countL === 1) {
							return A2(
								$elm$core$List$cons,
								hd1,
								A3($author$project$Markdown$InlineParser$cleanAngleBracketTokens, tokensL, rest1, countL - 1));
						} else {
							var $temp$tokensL = tokensL,
								$temp$tokensR = rest1,
								$temp$countL = 0;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						}
					}
				} else {
					var hd = tokensL.a;
					var rest = tokensL.b;
					if (_Utils_cmp(hd.i, hd1.i) < 0) {
						if (!countL) {
							return A2(
								$elm$core$List$cons,
								hd,
								A3($author$project$Markdown$InlineParser$cleanAngleBracketTokens, rest, tokensR, countL + 1));
						} else {
							var $temp$tokensL = rest,
								$temp$tokensR = tokensR,
								$temp$countL = countL + 1;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						}
					} else {
						if (countL > 1) {
							var $temp$tokensL = tokensL,
								$temp$tokensR = rest1,
								$temp$countL = countL - 1;
							tokensL = $temp$tokensL;
							tokensR = $temp$tokensR;
							countL = $temp$countL;
							continue cleanAngleBracketTokens;
						} else {
							if (countL === 1) {
								return A2(
									$elm$core$List$cons,
									hd1,
									A3($author$project$Markdown$InlineParser$cleanAngleBracketTokens, tokensL, rest1, countL - 1));
							} else {
								var $temp$tokensL = tokensL,
									$temp$tokensR = rest1,
									$temp$countL = 0;
								tokensL = $temp$tokensL;
								tokensR = $temp$tokensR;
								countL = $temp$countL;
								continue cleanAngleBracketTokens;
							}
						}
					}
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$angleBracketLTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\<)'));
var $author$project$Markdown$InlineParser$AngleBracketOpen = {$: 4};
var $author$project$Markdown$InlineParser$regMatchToAngleBracketLToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $author$project$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{i: regMatch.i + backslashesLength, aF: 1, f: $author$project$Markdown$InlineParser$AngleBracketOpen}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$findAngleBracketLTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToAngleBracketLToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$angleBracketLTokenRegex, str));
};
var $author$project$Markdown$InlineParser$angleBracketRTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\>)'));
var $author$project$Markdown$InlineParser$AngleBracketClose = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$InlineParser$Escaped = 0;
var $author$project$Markdown$InlineParser$NotEscaped = 1;
var $author$project$Markdown$InlineParser$regMatchToAngleBracketRToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				i: regMatch.i + backslashesLength,
				aF: 1,
				f: $author$project$Markdown$Helpers$isEven(backslashesLength) ? $author$project$Markdown$InlineParser$AngleBracketClose(1) : $author$project$Markdown$InlineParser$AngleBracketClose(0)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$findAngleBracketRTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToAngleBracketRToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$angleBracketRTokenRegex, str));
};
var $author$project$Markdown$InlineParser$asteriskEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^*])?(\\*+)([^*])?'));
var $author$project$Markdown$InlineParser$EmphasisToken = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Markdown$InlineParser$isPunctuation = function (c) {
	switch (c) {
		case '!':
			return true;
		case '\"':
			return true;
		case '#':
			return true;
		case '%':
			return true;
		case '&':
			return true;
		case '\'':
			return true;
		case '(':
			return true;
		case ')':
			return true;
		case '*':
			return true;
		case ',':
			return true;
		case '-':
			return true;
		case '.':
			return true;
		case '/':
			return true;
		case ':':
			return true;
		case ';':
			return true;
		case '?':
			return true;
		case '@':
			return true;
		case '[':
			return true;
		case ']':
			return true;
		case '_':
			return true;
		case '{':
			return true;
		case '}':
			return true;
		case '~':
			return true;
		default:
			return false;
	}
};
var $author$project$Markdown$InlineParser$containPunctuation = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $author$project$Markdown$InlineParser$isPunctuation(c);
		}),
	false);
var $author$project$Markdown$InlineParser$isWhitespace = function (c) {
	switch (c) {
		case ' ':
			return true;
		case '\u000C':
			return true;
		case '\n':
			return true;
		case '\u000D':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u00A0':
			return true;
		case '\u2028':
			return true;
		case '\u2029':
			return true;
		default:
			return false;
	}
};
var $author$project$Markdown$InlineParser$containSpace = A2(
	$elm$core$String$foldl,
	F2(
		function (c, accum) {
			return accum || $author$project$Markdown$InlineParser$isWhitespace(c);
		}),
	false);
var $author$project$Markdown$InlineParser$getFringeRank = function (mstring) {
	if (!mstring.$) {
		var string = mstring.a;
		return ($elm$core$String$isEmpty(string) || $author$project$Markdown$InlineParser$containSpace(string)) ? 0 : ($author$project$Markdown$InlineParser$containPunctuation(string) ? 1 : 2);
	} else {
		return 0;
	}
};
var $author$project$Markdown$InlineParser$regMatchToEmphasisToken = F3(
	function (_char, rawText, regMatch) {
		var _v0 = regMatch.bD;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) && _v0.b.b.b.b) {
			var maybeBackslashes = _v0.a;
			var _v1 = _v0.b;
			var maybeLeftFringe = _v1.a;
			var _v2 = _v1.b;
			var delimiter = _v2.a.a;
			var _v3 = _v2.b;
			var maybeRightFringe = _v3.a;
			var rFringeRank = $author$project$Markdown$InlineParser$getFringeRank(maybeRightFringe);
			var leftFringeLength = function () {
				if (!maybeLeftFringe.$) {
					var left = maybeLeftFringe.a;
					return $elm$core$String$length(left);
				} else {
					return 0;
				}
			}();
			var mLeftFringe = ((!(!regMatch.i)) && (!leftFringeLength)) ? $elm$core$Maybe$Just(
				A3($elm$core$String$slice, regMatch.i - 1, regMatch.i, rawText)) : maybeLeftFringe;
			var backslashesLength = function () {
				if (!maybeBackslashes.$) {
					var backslashes = maybeBackslashes.a;
					return $elm$core$String$length(backslashes);
				} else {
					return 0;
				}
			}();
			var isEscaped = ((!$author$project$Markdown$Helpers$isEven(backslashesLength)) && (!leftFringeLength)) || function () {
				if ((!mLeftFringe.$) && (mLeftFringe.a === '\\')) {
					return true;
				} else {
					return false;
				}
			}();
			var delimiterLength = isEscaped ? ($elm$core$String$length(delimiter) - 1) : $elm$core$String$length(delimiter);
			var lFringeRank = isEscaped ? 1 : $author$project$Markdown$InlineParser$getFringeRank(mLeftFringe);
			if ((delimiterLength <= 0) || ((_char === '_') && ((lFringeRank === 2) && (rFringeRank === 2)))) {
				return $elm$core$Maybe$Nothing;
			} else {
				var index = ((regMatch.i + backslashesLength) + leftFringeLength) + (isEscaped ? 1 : 0);
				return $elm$core$Maybe$Just(
					{
						i: index,
						aF: delimiterLength,
						f: A2(
							$author$project$Markdown$InlineParser$EmphasisToken,
							_char,
							{aw: lFringeRank, ay: rFringeRank})
					});
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$InlineParser$findAsteriskEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($author$project$Markdown$InlineParser$regMatchToEmphasisToken, '*', str),
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$asteriskEmphasisTokenRegex, str));
};
var $author$project$Markdown$InlineParser$codeTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\`+)'));
var $author$project$Markdown$InlineParser$CodeToken = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$InlineParser$regMatchToCodeToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backtick = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				i: regMatch.i + backslashesLength,
				aF: $elm$core$String$length(backtick),
				f: $author$project$Markdown$Helpers$isEven(backslashesLength) ? $author$project$Markdown$InlineParser$CodeToken(1) : $author$project$Markdown$InlineParser$CodeToken(0)
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$findCodeTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToCodeToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$codeTokenRegex, str));
};
var $author$project$Markdown$InlineParser$hardBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( {2,}))\\n'));
var $author$project$Markdown$InlineParser$HardLineBreakToken = {$: 8};
var $author$project$Markdown$InlineParser$regMatchToHardBreakToken = function (regMatch) {
	var _v0 = regMatch.bD;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return (!$author$project$Markdown$Helpers$isEven(backslashesLength)) ? $elm$core$Maybe$Just(
					{i: (regMatch.i + backslashesLength) - 1, aF: 2, f: $author$project$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Nothing;
			} else {
				if (_v0.b.b && (!_v0.b.a.$)) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							i: regMatch.i,
							aF: $elm$core$String$length(regMatch.cg),
							f: $author$project$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Markdown$InlineParser$regMatchToSoftHardBreakToken = function (regMatch) {
	var _v0 = regMatch.bD;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return $author$project$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
					{i: regMatch.i + backslashesLength, aF: 1, f: $author$project$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Just(
					{i: (regMatch.i + backslashesLength) - 1, aF: 2, f: $author$project$Markdown$InlineParser$HardLineBreakToken});
			} else {
				if (_v0.b.b) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							i: regMatch.i,
							aF: $elm$core$String$length(regMatch.cg),
							f: $author$project$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Markdown$InlineParser$softAsHardLineBreak = false;
var $author$project$Markdown$InlineParser$softAsHardLineBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( *))\\n'));
var $author$project$Markdown$InlineParser$findHardBreakTokens = function (str) {
	return $author$project$Markdown$InlineParser$softAsHardLineBreak ? A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToSoftHardBreakToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$softAsHardLineBreakTokenRegex, str)) : A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToHardBreakToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$hardBreakTokenRegex, str));
};
var $author$project$Markdown$InlineParser$linkImageCloseTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\])'));
var $author$project$Markdown$InlineParser$SquareBracketClose = {$: 3};
var $author$project$Markdown$InlineParser$regMatchToLinkImageCloseToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $author$project$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{i: regMatch.i + backslashesLength, aF: 1, f: $author$project$Markdown$InlineParser$SquareBracketClose}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$findLinkImageCloseTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToLinkImageCloseToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$linkImageCloseTokenRegex, str));
};
var $author$project$Markdown$InlineParser$linkImageOpenTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\!)?(\\[)'));
var $author$project$Markdown$InlineParser$Active = 0;
var $author$project$Markdown$InlineParser$ImageOpenToken = {$: 2};
var $author$project$Markdown$InlineParser$LinkOpenToken = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$InlineParser$regMatchToLinkImageOpenToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var maybeImageOpen = _v1.a;
		var _v2 = _v1.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var isEscaped = !$author$project$Markdown$Helpers$isEven(backslashesLength);
		var index = isEscaped ? ((regMatch.i + backslashesLength) + 1) : (regMatch.i + backslashesLength);
		if (isEscaped) {
			if (!maybeImageOpen.$) {
				return $elm$core$Maybe$Just(
					{
						i: index,
						aF: 1,
						f: $author$project$Markdown$InlineParser$LinkOpenToken(0)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			if (!maybeImageOpen.$) {
				return $elm$core$Maybe$Just(
					{i: index, aF: 2, f: $author$project$Markdown$InlineParser$ImageOpenToken});
			} else {
				return $elm$core$Maybe$Just(
					{
						i: index,
						aF: 1,
						f: $author$project$Markdown$InlineParser$LinkOpenToken(0)
					});
			}
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$findLinkImageOpenTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToLinkImageOpenToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$linkImageOpenTokenRegex, str));
};
var $author$project$Markdown$InlineParser$StrikethroughToken = function (a) {
	return {$: 9, a: a};
};
var $author$project$Markdown$InlineParser$regMatchToStrikethroughToken = function (regMatch) {
	var _v0 = regMatch.bD;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var tilde = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var _v2 = $author$project$Markdown$Helpers$isEven(backslashesLength) ? _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$author$project$Markdown$InlineParser$StrikethroughToken(1)) : _Utils_Tuple2(
			$elm$core$String$length(tilde),
			$author$project$Markdown$InlineParser$StrikethroughToken(0));
		var length = _v2.a;
		var meaning = _v2.b;
		return $elm$core$Maybe$Just(
			{i: regMatch.i + backslashesLength, aF: length, f: meaning});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$InlineParser$strikethroughTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(~{2,})([^~])?'));
var $author$project$Markdown$InlineParser$findStrikethroughTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$author$project$Markdown$InlineParser$regMatchToStrikethroughToken,
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$strikethroughTokenRegex, str));
};
var $author$project$Markdown$InlineParser$underlineEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^_])?(\\_+)([^_])?'));
var $author$project$Markdown$InlineParser$findUnderlineEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($author$project$Markdown$InlineParser$regMatchToEmphasisToken, '_', str),
		A2($elm$regex$Regex$find, $author$project$Markdown$InlineParser$underlineEmphasisTokenRegex, str));
};
var $author$project$Markdown$InlineParser$mergeByIndex = F2(
	function (left, right) {
		if (left.b) {
			var lfirst = left.a;
			var lrest = left.b;
			if (right.b) {
				var rfirst = right.a;
				var rrest = right.b;
				return (_Utils_cmp(lfirst.i, rfirst.i) < 0) ? A2(
					$elm$core$List$cons,
					lfirst,
					A2($author$project$Markdown$InlineParser$mergeByIndex, lrest, right)) : A2(
					$elm$core$List$cons,
					rfirst,
					A2($author$project$Markdown$InlineParser$mergeByIndex, left, rrest));
			} else {
				return left;
			}
		} else {
			return right;
		}
	});
var $author$project$Markdown$InlineParser$tokenize = function (rawText) {
	return A2(
		$author$project$Markdown$InlineParser$mergeByIndex,
		A3(
			$author$project$Markdown$InlineParser$cleanAngleBracketTokens,
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.i;
				},
				$author$project$Markdown$InlineParser$findAngleBracketLTokens(rawText)),
			A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.i;
				},
				$author$project$Markdown$InlineParser$findAngleBracketRTokens(rawText)),
			0),
		A2(
			$author$project$Markdown$InlineParser$mergeByIndex,
			$author$project$Markdown$InlineParser$findHardBreakTokens(rawText),
			A2(
				$author$project$Markdown$InlineParser$mergeByIndex,
				$author$project$Markdown$InlineParser$findLinkImageCloseTokens(rawText),
				A2(
					$author$project$Markdown$InlineParser$mergeByIndex,
					$author$project$Markdown$InlineParser$findLinkImageOpenTokens(rawText),
					A2(
						$author$project$Markdown$InlineParser$mergeByIndex,
						$author$project$Markdown$InlineParser$findStrikethroughTokens(rawText),
						A2(
							$author$project$Markdown$InlineParser$mergeByIndex,
							$author$project$Markdown$InlineParser$findUnderlineEmphasisTokens(rawText),
							A2(
								$author$project$Markdown$InlineParser$mergeByIndex,
								$author$project$Markdown$InlineParser$findAsteriskEmphasisTokens(rawText),
								$author$project$Markdown$InlineParser$findCodeTokens(rawText))))))));
};
var $author$project$Markdown$InlineParser$CodeType = {$: 2};
var $author$project$Markdown$InlineParser$EmphasisType = function (a) {
	return {$: 7, a: a};
};
var $author$project$Markdown$InlineParser$HtmlType = function (a) {
	return {$: 6, a: a};
};
var $author$project$Markdown$InlineParser$ImageType = function (a) {
	return {$: 5, a: a};
};
var $author$project$Markdown$InlineParser$Inactive = 1;
var $author$project$Markdown$InlineParser$LinkType = function (a) {
	return {$: 4, a: a};
};
var $author$project$Markdown$InlineParser$StrikethroughType = {$: 8};
var $author$project$Markdown$InlineParser$AutolinkType = function (a) {
	return {$: 3, a: a};
};
var $author$project$Markdown$InlineParser$decodeUrlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)'));
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $author$project$Markdown$InlineParser$encodeUrl = A2(
	$elm$core$Basics$composeR,
	$elm$url$Url$percentEncode,
	A2(
		$elm$regex$Regex$replace,
		$author$project$Markdown$InlineParser$decodeUrlRegex,
		function (match) {
			return A2(
				$elm$core$Maybe$withDefault,
				match.cg,
				$elm$url$Url$percentDecode(match.cg));
		}));
var $author$project$Markdown$InlineParser$urlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$'));
var $author$project$Markdown$InlineParser$autolinkToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $author$project$Markdown$InlineParser$urlRegex, match.c) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				m: $author$project$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.c,
						$author$project$Markdown$InlineParser$encodeUrl(match.c)))
			})) : $elm$core$Result$Err(match);
};
var $author$project$Markdown$Helpers$insideSquareBracketRegex = '[^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*';
var $author$project$Markdown$InlineParser$refLabelRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\[\\s*(' + ($author$project$Markdown$Helpers$insideSquareBracketRegex + ')\\s*\\]')));
var $author$project$Markdown$Helpers$cleanWhitespaces = function (original) {
	return original;
};
var $author$project$Markdown$Helpers$prepareRefLabel = A2($elm$core$Basics$composeR, $author$project$Markdown$Helpers$cleanWhitespaces, $elm$core$String$toLower);
var $author$project$Markdown$InlineParser$prepareUrlAndTitle = F2(
	function (rawUrl, maybeTitle) {
		return _Utils_Tuple2(
			$author$project$Markdown$InlineParser$encodeUrl(
				$author$project$Markdown$Helpers$formatStr(rawUrl)),
			A2($elm$core$Maybe$map, $author$project$Markdown$Helpers$formatStr, maybeTitle));
	});
var $author$project$Markdown$InlineParser$refRegexToMatch = F3(
	function (matchModel, references, maybeRegexMatch) {
		var refLabel = function (str) {
			return $elm$core$String$isEmpty(str) ? matchModel.c : str;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				matchModel.c,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$andThen,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.bD;
							},
							$elm$core$List$head),
						maybeRegexMatch))));
		var _v0 = A2(
			$elm$core$Dict$get,
			$author$project$Markdown$Helpers$prepareRefLabel(refLabel),
			references);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var rawUrl = _v1.a;
			var maybeTitle = _v1.b;
			var type_ = function () {
				var _v3 = matchModel.m;
				if (_v3.$ === 5) {
					return $author$project$Markdown$InlineParser$ImageType(
						A2($author$project$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				} else {
					return $author$project$Markdown$InlineParser$LinkType(
						A2($author$project$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle));
				}
			}();
			var regexMatchLength = function () {
				if (!maybeRegexMatch.$) {
					var match = maybeRegexMatch.a.cg;
					return $elm$core$String$length(match);
				} else {
					return 0;
				}
			}();
			return $elm$core$Maybe$Just(
				_Utils_update(
					matchModel,
					{t: matchModel.t + regexMatchLength, m: type_}));
		}
	});
var $author$project$Markdown$InlineParser$checkForInlineReferences = F3(
	function (remainText, _v0, references) {
		var tempMatch = _v0;
		var matches = A3($elm$regex$Regex$findAtMost, 1, $author$project$Markdown$InlineParser$refLabelRegex, remainText);
		return A3(
			$author$project$Markdown$InlineParser$refRegexToMatch,
			tempMatch,
			references,
			$elm$core$List$head(matches));
	});
var $author$project$Markdown$Helpers$lineEndChars = '\\f\\v\\r\\n';
var $author$project$Markdown$Helpers$whiteSpaceChars = ' \\t\\f\\v\\r\\n';
var $author$project$Markdown$InlineParser$hrefRegex = '(?:<([^<>' + ($author$project$Markdown$Helpers$lineEndChars + (']*)>|([^' + ($author$project$Markdown$Helpers$whiteSpaceChars + ('\\(\\)\\\\]*(?:\\\\.[^' + ($author$project$Markdown$Helpers$whiteSpaceChars + '\\(\\)\\\\]*)*))')))));
var $author$project$Markdown$Helpers$titleRegex = '(?:[' + ($author$project$Markdown$Helpers$whiteSpaceChars + (']+' + ('(?:\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'|' + ('\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|' + '\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?'))));
var $author$project$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\(\\s*' + ($author$project$Markdown$InlineParser$hrefRegex + ($author$project$Markdown$Helpers$titleRegex + '\\s*\\)'))));
var $author$project$Markdown$Helpers$returnFirstJust = function (maybes) {
	var process = F2(
		function (a, maybeFound) {
			if (!maybeFound.$) {
				var found = maybeFound.a;
				return $elm$core$Maybe$Just(found);
			} else {
				return a;
			}
		});
	return A3($elm$core$List$foldl, process, $elm$core$Maybe$Nothing, maybes);
};
var $author$project$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch = F2(
	function (matchModel, regexMatch) {
		var _v0 = regexMatch.bD;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
			var maybeRawUrlAngleBrackets = _v0.a;
			var _v1 = _v0.b;
			var maybeRawUrlWithoutBrackets = _v1.a;
			var _v2 = _v1.b;
			var maybeTitleSingleQuotes = _v2.a;
			var _v3 = _v2.b;
			var maybeTitleDoubleQuotes = _v3.a;
			var _v4 = _v3.b;
			var maybeTitleParenthesis = _v4.a;
			var maybeTitle = $author$project$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeTitleSingleQuotes, maybeTitleDoubleQuotes, maybeTitleParenthesis]));
			var toMatch = function (rawUrl) {
				return _Utils_update(
					matchModel,
					{
						t: matchModel.t + $elm$core$String$length(regexMatch.cg),
						m: function () {
							var _v5 = matchModel.m;
							if (_v5.$ === 5) {
								return $author$project$Markdown$InlineParser$ImageType;
							} else {
								return $author$project$Markdown$InlineParser$LinkType;
							}
						}()(
							A2($author$project$Markdown$InlineParser$prepareUrlAndTitle, rawUrl, maybeTitle))
					});
			};
			var maybeRawUrl = $author$project$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeRawUrlAngleBrackets, maybeRawUrlWithoutBrackets]));
			return $elm$core$Maybe$Just(
				toMatch(
					A2($elm$core$Maybe$withDefault, '', maybeRawUrl)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$InlineParser$checkForInlineLinkTypeOrImageType = F3(
	function (remainText, _v0, refs) {
		var tempMatch = _v0;
		var _v1 = A3($elm$regex$Regex$findAtMost, 1, $author$project$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex, remainText);
		if (_v1.b) {
			var first = _v1.a;
			var _v2 = A2($author$project$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch, tempMatch, first);
			if (!_v2.$) {
				var match = _v2.a;
				return $elm$core$Maybe$Just(match);
			} else {
				return A3($author$project$Markdown$InlineParser$checkForInlineReferences, remainText, tempMatch, refs);
			}
		} else {
			return A3($author$project$Markdown$InlineParser$checkForInlineReferences, remainText, tempMatch, refs);
		}
	});
var $author$project$Markdown$InlineParser$checkParsedAheadOverlapping = F2(
	function (_v0, remainMatches) {
		var match = _v0;
		var overlappingMatches = $elm$core$List$filter(
			function (_v1) {
				var testMatch = _v1;
				return (_Utils_cmp(match.t, testMatch.l) > 0) && (_Utils_cmp(match.t, testMatch.t) < 0);
			});
		return ($elm$core$List$isEmpty(remainMatches) || $elm$core$List$isEmpty(
			overlappingMatches(remainMatches))) ? $elm$core$Maybe$Just(
			A2($elm$core$List$cons, match, remainMatches)) : $elm$core$Maybe$Nothing;
	});
var $author$project$Markdown$InlineParser$emailRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$'));
var $author$project$Markdown$InlineParser$emailAutolinkTypeToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $author$project$Markdown$InlineParser$emailRegex, match.c) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				m: $author$project$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.c,
						'mailto:' + $author$project$Markdown$InlineParser$encodeUrl(match.c)))
			})) : $elm$core$Result$Err(match);
};
var $author$project$Markdown$InlineParser$findTokenHelp = F3(
	function (innerTokens, isToken, tokens) {
		findTokenHelp:
		while (true) {
			if (!tokens.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var nextToken = tokens.a;
				var remainingTokens = tokens.b;
				if (isToken(nextToken)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple3(
							nextToken,
							$elm$core$List$reverse(innerTokens),
							remainingTokens));
				} else {
					var $temp$innerTokens = A2($elm$core$List$cons, nextToken, innerTokens),
						$temp$isToken = isToken,
						$temp$tokens = remainingTokens;
					innerTokens = $temp$innerTokens;
					isToken = $temp$isToken;
					tokens = $temp$tokens;
					continue findTokenHelp;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$findToken = F2(
	function (isToken, tokens) {
		return A3($author$project$Markdown$InlineParser$findTokenHelp, _List_Nil, isToken, tokens);
	});
var $author$project$Markdown$InlineParser$HtmlToken = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Markdown$InlineParser$NotOpening = 0;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.e, s);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{aV: 1, h: _List_Nil, j: 1, e: 0, cr: 1, az: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $author$project$Markdown$InlineParser$htmlToToken = F2(
	function (rawText, _v0) {
		var match = _v0;
		var consumedCharacters = A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (startOffset, htmlTag, endOffset) {
								return {a8: htmlTag, aF: endOffset - startOffset};
							})),
					$elm$parser$Parser$Advanced$getOffset),
				$author$project$HtmlParser$html),
			$elm$parser$Parser$Advanced$getOffset);
		var parsed = A2(
			$elm$parser$Parser$Advanced$run,
			consumedCharacters,
			A2($elm$core$String$dropLeft, match.l, rawText));
		if (!parsed.$) {
			var htmlTag = parsed.a.a8;
			var length = parsed.a.aF;
			var htmlToken = A2($author$project$Markdown$InlineParser$HtmlToken, 0, htmlTag);
			return $elm$core$Maybe$Just(
				{i: match.l, aF: length, f: htmlToken});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$Helpers$ifError = F2(
	function (_function, result) {
		if (!result.$) {
			return result;
		} else {
			var err = result.a;
			return _function(err);
		}
	});
var $author$project$Markdown$InlineParser$isCodeTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.f;
		if (!_v0.$) {
			if (!_v0.a) {
				var _v1 = _v0.a;
				return _Utils_eq(openToken.aF - 1, closeToken.aF);
			} else {
				var _v2 = _v0.a;
				return _Utils_eq(openToken.aF, closeToken.aF);
			}
		} else {
			return false;
		}
	});
var $author$project$Markdown$InlineParser$isLinkTypeOrImageOpenToken = function (token) {
	var _v0 = token.f;
	switch (_v0.$) {
		case 1:
			return true;
		case 2:
			return true;
		default:
			return false;
	}
};
var $author$project$Markdown$InlineParser$isOpenEmphasisToken = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.f;
		if (_v0.$ === 7) {
			var openChar = _v0.a;
			var open = _v0.b;
			var _v1 = closeToken.f;
			if (_v1.$ === 7) {
				var closeChar = _v1.a;
				var close = _v1.b;
				return _Utils_eq(openChar, closeChar) ? ((_Utils_eq(open.aw, open.ay) || _Utils_eq(close.aw, close.ay)) ? ((!(!A2($elm$core$Basics$modBy, 3, closeToken.aF + openToken.aF))) || ((!A2($elm$core$Basics$modBy, 3, closeToken.aF)) && (!A2($elm$core$Basics$modBy, 3, openToken.aF)))) : true) : false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $author$project$Markdown$InlineParser$isStrikethroughTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = function () {
			var _v1 = openToken.f;
			if (_v1.$ === 9) {
				if (!_v1.a) {
					var _v2 = _v1.a;
					return _Utils_Tuple2(true, openToken.aF - 1);
				} else {
					var _v3 = _v1.a;
					return _Utils_Tuple2(true, openToken.aF);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var openTokenIsStrikethrough = _v0.a;
		var openTokenLength = _v0.b;
		var _v4 = function () {
			var _v5 = closeToken.f;
			if (_v5.$ === 9) {
				if (!_v5.a) {
					var _v6 = _v5.a;
					return _Utils_Tuple2(true, closeToken.aF - 1);
				} else {
					var _v7 = _v5.a;
					return _Utils_Tuple2(true, closeToken.aF);
				}
			} else {
				return _Utils_Tuple2(false, 0);
			}
		}();
		var closeTokenIsStrikethrough = _v4.a;
		var closeTokenLength = _v4.b;
		return closeTokenIsStrikethrough && (openTokenIsStrikethrough && _Utils_eq(closeTokenLength, openTokenLength));
	});
var $author$project$Markdown$InlineParser$HardLineBreakType = {$: 1};
var $author$project$Markdown$InlineParser$tokenToMatch = F2(
	function (token, type_) {
		return {t: token.i + token.aF, u: _List_Nil, l: token.i, c: '', C: 0, w: 0, m: type_};
	});
var $author$project$Markdown$InlineParser$lineBreakTTM = F2(
	function (remaining, matches) {
		lineBreakTTM:
		while (true) {
			if (!remaining.b) {
				return matches;
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v1 = token.f;
				if (_v1.$ === 8) {
					var $temp$remaining = tokensTail,
						$temp$matches = A2(
						$elm$core$List$cons,
						A2($author$project$Markdown$InlineParser$tokenToMatch, token, $author$project$Markdown$InlineParser$HardLineBreakType),
						matches);
					remaining = $temp$remaining;
					matches = $temp$matches;
					continue lineBreakTTM;
				} else {
					var $temp$remaining = tokensTail,
						$temp$matches = matches;
					remaining = $temp$remaining;
					matches = $temp$matches;
					continue lineBreakTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$removeParsedAheadTokens = F2(
	function (_v0, tokensTail) {
		var match = _v0;
		return A2(
			$elm$core$List$filter,
			function (token) {
				return _Utils_cmp(token.i, match.t) > -1;
			},
			tokensTail);
	});
var $author$project$Markdown$InlineParser$angleBracketsToMatch = F6(
	function (closeToken, escaped, matches, references, rawText, _v44) {
		var openToken = _v44.a;
		var remainTokens = _v44.c;
		var result = A2(
			$author$project$Markdown$Helpers$ifError,
			$author$project$Markdown$InlineParser$emailAutolinkTypeToMatch,
			$author$project$Markdown$InlineParser$autolinkToMatch(
				A7(
					$author$project$Markdown$InlineParser$tokenPairToMatch,
					references,
					rawText,
					function (s) {
						return s;
					},
					$author$project$Markdown$InlineParser$CodeType,
					openToken,
					closeToken,
					_List_Nil)));
		if (result.$ === 1) {
			var tempMatch = result.a;
			if (escaped === 1) {
				var _v47 = A2($author$project$Markdown$InlineParser$htmlToToken, rawText, tempMatch);
				if (!_v47.$) {
					var newToken = _v47.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2($elm$core$List$cons, newToken, remainTokens),
							matches));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var newMatch = result.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(
					remainTokens,
					A2($elm$core$List$cons, newMatch, matches)));
		}
	});
var $author$project$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		codeAutolinkTypeHtmlTagTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$author$project$Markdown$InlineParser$htmlElementTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v36 = token.f;
				switch (_v36.$) {
					case 0:
						var _v37 = A2(
							$author$project$Markdown$InlineParser$findToken,
							$author$project$Markdown$InlineParser$isCodeTokenPair(token),
							tokens);
						if (!_v37.$) {
							var code = _v37.a;
							var _v38 = A5($author$project$Markdown$InlineParser$codeToMatch, token, matches, references, rawText, code);
							var newTokens = _v38.a;
							var newMatches = _v38.b;
							var $temp$remaining = tokensTail,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					case 5:
						var isEscaped = _v36.a;
						var isAngleBracketOpen = function (_v43) {
							var meaning = _v43.f;
							if (meaning.$ === 4) {
								return true;
							} else {
								return false;
							}
						};
						var _v39 = A2($author$project$Markdown$InlineParser$findToken, isAngleBracketOpen, tokens);
						if (!_v39.$) {
							var found = _v39.a;
							var _v40 = A6($author$project$Markdown$InlineParser$angleBracketsToMatch, token, isEscaped, matches, references, rawText, found);
							if (!_v40.$) {
								var _v41 = _v40.a;
								var newTokens = _v41.a;
								var newMatches = _v41.b;
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									newTokens),
									$temp$matches = newMatches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2(
									$elm$core$List$filter,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
									tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue codeAutolinkTypeHtmlTagTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, isAngleBracketOpen),
								tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue codeAutolinkTypeHtmlTagTTM;
						}
					default:
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue codeAutolinkTypeHtmlTagTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$codeToMatch = F5(
	function (closeToken, matches, references, rawText, _v32) {
		var openToken = _v32.a;
		var remainTokens = _v32.c;
		var updatedOpenToken = function () {
			var _v33 = openToken.f;
			if ((!_v33.$) && (!_v33.a)) {
				var _v34 = _v33.a;
				return _Utils_update(
					openToken,
					{i: openToken.i + 1, aF: openToken.aF - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($author$project$Markdown$InlineParser$tokenPairToMatch, references, rawText, $author$project$Markdown$Helpers$cleanWhitespaces, $author$project$Markdown$InlineParser$CodeType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $author$project$Markdown$InlineParser$emphasisTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		emphasisTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$author$project$Markdown$InlineParser$strikethroughTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v27 = token.f;
				if (_v27.$ === 7) {
					var _char = _v27.a;
					var leftFringeRank = _v27.b.aw;
					var rightFringeRank = _v27.b.ay;
					if (_Utils_eq(leftFringeRank, rightFringeRank)) {
						if ((!(!rightFringeRank)) && ((_char !== '_') || (rightFringeRank === 1))) {
							var _v28 = A2(
								$author$project$Markdown$InlineParser$findToken,
								$author$project$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (!_v28.$) {
								var found = _v28.a;
								var _v29 = A5($author$project$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v29.a;
								var match = _v29.b;
								var newTokens = _v29.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = A2($elm$core$List$cons, token, tokens),
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						}
					} else {
						if (_Utils_cmp(leftFringeRank, rightFringeRank) < 0) {
							var $temp$remaining = tokensTail,
								$temp$tokens = A2($elm$core$List$cons, token, tokens),
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue emphasisTTM;
						} else {
							var _v30 = A2(
								$author$project$Markdown$InlineParser$findToken,
								$author$project$Markdown$InlineParser$isOpenEmphasisToken(token),
								tokens);
							if (!_v30.$) {
								var found = _v30.a;
								var _v31 = A5($author$project$Markdown$InlineParser$emphasisToMatch, references, rawText, token, tokensTail, found);
								var newRemaining = _v31.a;
								var match = _v31.b;
								var newTokens = _v31.c;
								var $temp$remaining = newRemaining,
									$temp$tokens = newTokens,
									$temp$matches = A2($elm$core$List$cons, match, matches),
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							} else {
								var $temp$remaining = tokensTail,
									$temp$tokens = tokens,
									$temp$matches = matches,
									$temp$references = references,
									$temp$rawText = rawText;
								remaining = $temp$remaining;
								tokens = $temp$tokens;
								matches = $temp$matches;
								references = $temp$references;
								rawText = $temp$rawText;
								continue emphasisTTM;
							}
						}
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue emphasisTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$emphasisToMatch = F5(
	function (references, rawText, closeToken, tokensTail, _v25) {
		var openToken = _v25.a;
		var innerTokens = _v25.b;
		var remainTokens = _v25.c;
		var remainLength = openToken.aF - closeToken.aF;
		var updt = (!remainLength) ? {au: closeToken, aj: openToken, ax: remainTokens, aB: tokensTail} : ((remainLength > 0) ? {
			au: closeToken,
			aj: _Utils_update(
				openToken,
				{i: openToken.i + remainLength, aF: closeToken.aF}),
			ax: A2(
				$elm$core$List$cons,
				_Utils_update(
					openToken,
					{aF: remainLength}),
				remainTokens),
			aB: tokensTail
		} : {
			au: _Utils_update(
				closeToken,
				{aF: openToken.aF}),
			aj: openToken,
			ax: remainTokens,
			aB: A2(
				$elm$core$List$cons,
				_Utils_update(
					closeToken,
					{i: closeToken.i + openToken.aF, aF: -remainLength}),
				tokensTail)
		});
		var match = A7(
			$author$project$Markdown$InlineParser$tokenPairToMatch,
			references,
			rawText,
			function (s) {
				return s;
			},
			$author$project$Markdown$InlineParser$EmphasisType(updt.aj.aF),
			updt.aj,
			updt.au,
			$elm$core$List$reverse(innerTokens));
		return _Utils_Tuple3(updt.aB, match, updt.ax);
	});
var $author$project$Markdown$InlineParser$htmlElementTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		htmlElementTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$author$project$Markdown$InlineParser$linkImageTypeTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v23 = token.f;
				if (_v23.$ === 6) {
					var isOpen = _v23.a;
					var htmlModel = _v23.b;
					var $temp$remaining = tokensTail,
						$temp$tokens = tokens,
						$temp$matches = A2(
						$elm$core$List$cons,
						A2(
							$author$project$Markdown$InlineParser$tokenToMatch,
							token,
							$author$project$Markdown$InlineParser$HtmlType(htmlModel)),
						matches),
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue htmlElementTTM;
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue htmlElementTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$linkImageTypeTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		linkImageTypeTTM:
		while (true) {
			if (!remaining.b) {
				return A5(
					$author$project$Markdown$InlineParser$emphasisTTM,
					$elm$core$List$reverse(tokens),
					_List_Nil,
					matches,
					references,
					rawText);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v18 = token.f;
				if (_v18.$ === 3) {
					var _v19 = A2($author$project$Markdown$InlineParser$findToken, $author$project$Markdown$InlineParser$isLinkTypeOrImageOpenToken, tokens);
					if (!_v19.$) {
						var found = _v19.a;
						var _v20 = A6($author$project$Markdown$InlineParser$linkOrImageTypeToMatch, token, tokensTail, matches, references, rawText, found);
						if (!_v20.$) {
							var _v21 = _v20.a;
							var x = _v21.a;
							var newMatches = _v21.b;
							var newTokens = _v21.c;
							var $temp$remaining = x,
								$temp$tokens = newTokens,
								$temp$matches = newMatches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						} else {
							var $temp$remaining = tokensTail,
								$temp$tokens = tokens,
								$temp$matches = matches,
								$temp$references = references,
								$temp$rawText = rawText;
							remaining = $temp$remaining;
							tokens = $temp$tokens;
							matches = $temp$matches;
							references = $temp$references;
							rawText = $temp$rawText;
							continue linkImageTypeTTM;
						}
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = tokens,
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue linkImageTypeTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue linkImageTypeTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$linkOrImageTypeToMatch = F6(
	function (closeToken, tokensTail, oldMatches, references, rawText, _v8) {
		var openToken = _v8.a;
		var innerTokens = _v8.b;
		var remainTokens = _v8.c;
		var removeOpenToken = _Utils_Tuple3(
			tokensTail,
			oldMatches,
			_Utils_ap(innerTokens, remainTokens));
		var remainText = A2($elm$core$String$dropLeft, closeToken.i + 1, rawText);
		var inactivateLinkOpenToken = function (token) {
			var _v16 = token.f;
			if (_v16.$ === 1) {
				return _Utils_update(
					token,
					{
						f: $author$project$Markdown$InlineParser$LinkOpenToken(1)
					});
			} else {
				return token;
			}
		};
		var findTempMatch = function (isLinkType) {
			return A7(
				$author$project$Markdown$InlineParser$tokenPairToMatch,
				references,
				rawText,
				function (s) {
					return s;
				},
				isLinkType ? $author$project$Markdown$InlineParser$LinkType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)) : $author$project$Markdown$InlineParser$ImageType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)),
				openToken,
				closeToken,
				$elm$core$List$reverse(innerTokens));
		};
		var _v9 = openToken.f;
		switch (_v9.$) {
			case 2:
				var tempMatch = findTempMatch(false);
				var _v10 = A3($author$project$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
				if (_v10.$ === 1) {
					return $elm$core$Maybe$Just(removeOpenToken);
				} else {
					var match = _v10.a;
					var _v11 = A2($author$project$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
					if (!_v11.$) {
						var matches = _v11.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple3(
								A2($author$project$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
								matches,
								remainTokens));
					} else {
						return $elm$core$Maybe$Just(removeOpenToken);
					}
				}
			case 1:
				if (!_v9.a) {
					var _v12 = _v9.a;
					var tempMatch = findTempMatch(true);
					var _v13 = A3($author$project$Markdown$InlineParser$checkForInlineLinkTypeOrImageType, remainText, tempMatch, references);
					if (_v13.$ === 1) {
						return $elm$core$Maybe$Just(removeOpenToken);
					} else {
						var match = _v13.a;
						var _v14 = A2($author$project$Markdown$InlineParser$checkParsedAheadOverlapping, match, oldMatches);
						if (!_v14.$) {
							var matches = _v14.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple3(
									A2($author$project$Markdown$InlineParser$removeParsedAheadTokens, match, tokensTail),
									matches,
									A2($elm$core$List$map, inactivateLinkOpenToken, remainTokens)));
						} else {
							return $elm$core$Maybe$Just(removeOpenToken);
						}
					}
				} else {
					var _v15 = _v9.a;
					return $elm$core$Maybe$Just(removeOpenToken);
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$InlineParser$strikethroughTTM = F5(
	function (remaining, tokens, matches, references, rawText) {
		strikethroughTTM:
		while (true) {
			if (!remaining.b) {
				return A2(
					$author$project$Markdown$InlineParser$lineBreakTTM,
					$elm$core$List$reverse(tokens),
					matches);
			} else {
				var token = remaining.a;
				var tokensTail = remaining.b;
				var _v5 = token.f;
				if (_v5.$ === 9) {
					var _v6 = A2(
						$author$project$Markdown$InlineParser$findToken,
						$author$project$Markdown$InlineParser$isStrikethroughTokenPair(token),
						tokens);
					if (!_v6.$) {
						var content = _v6.a;
						var _v7 = A5($author$project$Markdown$InlineParser$strikethroughToMatch, token, matches, references, rawText, content);
						var newTokens = _v7.a;
						var newMatches = _v7.b;
						var $temp$remaining = tokensTail,
							$temp$tokens = newTokens,
							$temp$matches = newMatches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					} else {
						var $temp$remaining = tokensTail,
							$temp$tokens = A2($elm$core$List$cons, token, tokens),
							$temp$matches = matches,
							$temp$references = references,
							$temp$rawText = rawText;
						remaining = $temp$remaining;
						tokens = $temp$tokens;
						matches = $temp$matches;
						references = $temp$references;
						rawText = $temp$rawText;
						continue strikethroughTTM;
					}
				} else {
					var $temp$remaining = tokensTail,
						$temp$tokens = A2($elm$core$List$cons, token, tokens),
						$temp$matches = matches,
						$temp$references = references,
						$temp$rawText = rawText;
					remaining = $temp$remaining;
					tokens = $temp$tokens;
					matches = $temp$matches;
					references = $temp$references;
					rawText = $temp$rawText;
					continue strikethroughTTM;
				}
			}
		}
	});
var $author$project$Markdown$InlineParser$strikethroughToMatch = F5(
	function (closeToken, matches, references, rawText, _v1) {
		var openToken = _v1.a;
		var remainTokens = _v1.c;
		var updatedOpenToken = function () {
			var _v2 = openToken.f;
			if ((_v2.$ === 9) && (!_v2.a)) {
				var _v3 = _v2.a;
				return _Utils_update(
					openToken,
					{i: openToken.i + 1, aF: openToken.aF - 1});
			} else {
				return openToken;
			}
		}();
		var match = A7($author$project$Markdown$InlineParser$tokenPairToMatch, references, rawText, $author$project$Markdown$Helpers$cleanWhitespaces, $author$project$Markdown$InlineParser$StrikethroughType, updatedOpenToken, closeToken, _List_Nil);
		return _Utils_Tuple2(
			remainTokens,
			A2($elm$core$List$cons, match, matches));
	});
var $author$project$Markdown$InlineParser$tokenPairToMatch = F7(
	function (references, rawText, processText, type_, openToken, closeToken, innerTokens) {
		var textStart = openToken.i + openToken.aF;
		var textEnd = closeToken.i;
		var text = processText(
			A3($elm$core$String$slice, textStart, textEnd, rawText));
		var start = openToken.i;
		var end = closeToken.i + closeToken.aF;
		var match = {t: end, u: _List_Nil, l: start, c: text, C: textEnd, w: textStart, m: type_};
		var matches = A2(
			$elm$core$List$map,
			function (_v0) {
				var matchModel = _v0;
				return A2($author$project$Markdown$InlineParser$prepareChildMatch, match, matchModel);
			},
			A4($author$project$Markdown$InlineParser$tokensToMatches, innerTokens, _List_Nil, references, rawText));
		return {t: end, u: matches, l: start, c: text, C: textEnd, w: textStart, m: type_};
	});
var $author$project$Markdown$InlineParser$tokensToMatches = F4(
	function (tokens, matches, references, rawText) {
		return A5($author$project$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM, tokens, _List_Nil, matches, references, rawText);
	});
var $author$project$Markdown$InlineParser$parse = F2(
	function (refs, rawText_) {
		var rawText = ($elm$core$String$trim(rawText_) === '') ? '' : rawText_;
		var tokens = $author$project$Markdown$InlineParser$tokenize(rawText);
		return $author$project$Markdown$InlineParser$matchesToInlines(
			A3(
				$author$project$Markdown$InlineParser$parseTextMatches,
				rawText,
				_List_Nil,
				$author$project$Markdown$InlineParser$organizeMatches(
					A4($author$project$Markdown$InlineParser$tokensToMatches, tokens, _List_Nil, refs, rawText))));
	});
var $author$project$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				' ',
				$elm$parser$Parser$Expecting(' '))),
			$elm$parser$Parser$Advanced$token(
			A2(
				$elm$parser$Parser$Advanced$Token,
				'>',
				$elm$parser$Parser$Expecting('>'))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Char$isAlpha,
					$elm$parser$Parser$Expecting('Alpha')),
				$elm$parser$Parser$Advanced$chompWhile(
					function (c) {
						return $elm$core$Char$isAlphaNum(c) || (c === '-');
					})),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							':',
							$elm$parser$Parser$Expecting(':'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'@',
							$elm$parser$Parser$Expecting('@'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'\\',
							$elm$parser$Parser$Expecting('\\'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'+',
							$elm$parser$Parser$Expecting('+'))),
						$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'.',
							$elm$parser$Parser$Expecting('.')))
					])))
		]));
var $author$project$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock = $elm$parser$Parser$Advanced$backtrackable(
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (rawLine, _v0) {
				return $author$project$Markdown$RawBlock$OpenBlockOrParagraph(rawLine);
			}),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$token(
						A2(
							$elm$parser$Parser$Advanced$Token,
							'<',
							$elm$parser$Parser$Expecting('<'))),
					$author$project$Markdown$Parser$thisIsDefinitelyNotAnHtmlTag),
				$author$project$Helpers$chompUntilLineEndOrEnd),
			$author$project$Helpers$lineEndOrEnd)));
var $author$project$Markdown$Table$TableHeader = $elm$core$Basics$identity;
var $author$project$Parser$Token$parseString = function (str) {
	return $elm$parser$Parser$Advanced$token(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$Expecting(str)));
};
var $author$project$Markdown$TableParser$parseCellHelper = function (_v0) {
	var curr = _v0.a;
	var acc = _v0.b;
	var _return = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Done(acc),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Done(
					A2($elm$core$List$cons, cell, acc));
			},
			curr));
	var finishCell = A2(
		$elm$core$Maybe$withDefault,
		$elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2($elm$core$Maybe$Nothing, acc)),
		A2(
			$elm$core$Maybe$map,
			function (cell) {
				return $elm$parser$Parser$Advanced$Loop(
					_Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						A2($elm$core$List$cons, cell, acc)));
			},
			curr));
	var addToCurrent = function (c) {
		return _Utils_ap(
			A2($elm$core$Maybe$withDefault, '', curr),
			c);
	};
	var continueCell = function (c) {
		return $elm$parser$Parser$Advanced$Loop(
			_Utils_Tuple2(
				$elm$core$Maybe$Just(
					addToCurrent(c)),
				acc));
	};
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return _return;
				},
				$author$project$Parser$Token$parseString('|\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return _return;
				},
				$author$project$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v3) {
					return _return;
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$author$project$Parser$Token$parseString('\\\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('\\'))),
				$author$project$Parser$Token$parseString('\\\\')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(
						continueCell('|'))),
				$author$project$Parser$Token$parseString('\\|')),
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$backtrackable(
					$elm$parser$Parser$Advanced$succeed(finishCell)),
				$author$project$Parser$Token$parseString('|')),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (_char, _v4) {
						return continueCell(_char);
					}),
				A2(
					$elm$parser$Parser$Advanced$chompIf,
					$elm$core$Basics$always(true),
					$elm$parser$Parser$Problem('No character found')))
			]));
};
var $author$project$Markdown$TableParser$parseCells = A2(
	$elm$parser$Parser$Advanced$map,
	A2(
		$elm$core$List$foldl,
		F2(
			function (cell, acc) {
				return A2(
					$elm$core$List$cons,
					$elm$core$String$trim(cell),
					acc);
			}),
		_List_Nil),
	A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2($elm$core$Maybe$Nothing, _List_Nil),
		$author$project$Markdown$TableParser$parseCellHelper));
var $author$project$Markdown$TableParser$rowParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$author$project$Parser$Token$parseString('|'),
					$elm$parser$Parser$Advanced$succeed(0)
				]))),
	$author$project$Markdown$TableParser$parseCells);
var $author$project$Markdown$TableParser$parseHeader = F2(
	function (_v0, headersRow) {
		var columnAlignments = _v0.b;
		var headersWithAlignment = function (headers) {
			return A3(
				$elm$core$List$map2,
				F2(
					function (headerCell, alignment) {
						return {ap: alignment, ac: headerCell};
					}),
				headers,
				columnAlignments);
		};
		var combineHeaderAndDelimiter = function (headers) {
			return _Utils_eq(
				$elm$core$List$length(headers),
				$elm$core$List$length(columnAlignments)) ? $elm$core$Result$Ok(
				headersWithAlignment(headers)) : $elm$core$Result$Err(
				'Tables must have the same number of header columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(headers)) + (') as delimiter columns (' + ($elm$core$String$fromInt(
					$elm$core$List$length(columnAlignments)) + ')'))));
		};
		var _v1 = A2($elm$parser$Parser$Advanced$run, $author$project$Markdown$TableParser$rowParser, headersRow);
		if (!_v1.$) {
			var headers = _v1.a;
			return combineHeaderAndDelimiter(headers);
		} else {
			return $elm$core$Result$Err('Unable to parse previous line as a table header');
		}
	});
var $author$project$Markdown$CodeBlock$CodeBlock = F2(
	function (language, body) {
		return {bZ: body, ce: language};
	});
var $author$project$Markdown$CodeBlock$infoString = function (fenceCharacter) {
	var toInfoString = F2(
		function (str, _v2) {
			var _v1 = $elm$core$String$trim(str);
			if (_v1 === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				var trimmed = _v1;
				return $elm$core$Maybe$Just(trimmed);
			}
		});
	var _v0 = fenceCharacter.av;
	if (!_v0) {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return (c !== '`') && (!$author$project$Whitespace$isLineEnd(c));
				}));
	} else {
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			toInfoString,
			$elm$parser$Parser$Advanced$chompWhile(
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Whitespace$isLineEnd)));
	}
};
var $author$project$Markdown$CodeBlock$Backtick = 0;
var $author$project$Parser$Token$backtick = A2(
	$elm$parser$Parser$Advanced$Token,
	'`',
	$elm$parser$Parser$Expecting('a \'`\''));
var $author$project$Markdown$CodeBlock$backtick = {as: '`', av: 0, aA: $author$project$Parser$Token$backtick};
var $author$project$Markdown$CodeBlock$colToIndentation = function (_int) {
	switch (_int) {
		case 1:
			return $elm$parser$Parser$Advanced$succeed(0);
		case 2:
			return $elm$parser$Parser$Advanced$succeed(1);
		case 3:
			return $elm$parser$Parser$Advanced$succeed(2);
		case 4:
			return $elm$parser$Parser$Advanced$succeed(3);
		default:
			return $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Expecting('Fenced code blocks should be indented no more than 3 spaces'));
	}
};
var $author$project$Markdown$CodeBlock$fenceOfAtLeast = F2(
	function (minLength, fenceCharacter) {
		var builtTokens = A3(
			$elm$core$List$foldl,
			F2(
				function (t, p) {
					return A2($elm$parser$Parser$Advanced$ignorer, p, t);
				}),
			$elm$parser$Parser$Advanced$succeed(0),
			A2(
				$elm$core$List$repeat,
				minLength,
				$elm$parser$Parser$Advanced$token(fenceCharacter.aA)));
		return A2(
			$elm$parser$Parser$Advanced$mapChompedString,
			F2(
				function (str, _v0) {
					return _Utils_Tuple2(
						fenceCharacter,
						$elm$core$String$length(str));
				}),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				builtTokens,
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(fenceCharacter.as))));
	});
var $author$project$Markdown$CodeBlock$Tilde = 1;
var $author$project$Parser$Token$tilde = A2(
	$elm$parser$Parser$Advanced$Token,
	'~',
	$elm$parser$Parser$Expecting('a `~`'));
var $author$project$Markdown$CodeBlock$tilde = {as: '~', av: 1, aA: $author$project$Parser$Token$tilde};
var $author$project$Whitespace$upToThreeSpaces = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$author$project$Whitespace$space,
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$author$project$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(0)
						]))),
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						$author$project$Whitespace$space,
						$elm$parser$Parser$Advanced$succeed(0)
					]))),
			$elm$parser$Parser$Advanced$succeed(0)
		]));
var $author$project$Markdown$CodeBlock$openingFence = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (indent, _v0) {
						var character = _v0.a;
						var length = _v0.b;
						return {at: character, aE: indent, aF: length};
					})),
			$author$project$Whitespace$upToThreeSpaces),
		A2($elm$parser$Parser$Advanced$andThen, $author$project$Markdown$CodeBlock$colToIndentation, $elm$parser$Parser$Advanced$getCol)),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2($author$project$Markdown$CodeBlock$fenceOfAtLeast, 3, $author$project$Markdown$CodeBlock$backtick),
				A2($author$project$Markdown$CodeBlock$fenceOfAtLeast, 3, $author$project$Markdown$CodeBlock$tilde)
			])));
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $author$project$Whitespace$isSpace = $elm$core$Basics$eq(' ');
var $author$project$Markdown$CodeBlock$closingFence = F2(
	function (minLength, fenceCharacter) {
		return A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(0),
						$author$project$Whitespace$upToThreeSpaces),
					A2($author$project$Markdown$CodeBlock$fenceOfAtLeast, minLength, fenceCharacter)),
				$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpace)),
			$author$project$Helpers$lineEndOrEnd);
	});
var $author$project$Markdown$CodeBlock$codeBlockLine = function (indented) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
			A2($author$project$Parser$Extra$upTo, indented, $author$project$Whitespace$space)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getOffset, $author$project$Helpers$chompUntilLineEndOrEnd),
			$author$project$Helpers$lineEndOrEnd));
};
var $elm$parser$Parser$Advanced$getSource = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.az, s);
};
var $author$project$Markdown$CodeBlock$remainingBlockHelp = function (_v0) {
	var fence = _v0.a;
	var body = _v0.b;
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(
					$elm$parser$Parser$Advanced$Done(body)),
				$elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd)),
				A2(
				$elm$parser$Parser$Advanced$mapChompedString,
				F2(
					function (lineEnd, _v1) {
						return $elm$parser$Parser$Advanced$Loop(
							_Utils_Tuple2(
								fence,
								_Utils_ap(body, lineEnd)));
					}),
				$author$project$Whitespace$lineEnd),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						$elm$parser$Parser$Advanced$Done(body)),
					A2($author$project$Markdown$CodeBlock$closingFence, fence.aF, fence.at))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					A2(
						$elm$parser$Parser$Advanced$keeper,
						$elm$parser$Parser$Advanced$succeed(
							F3(
								function (start, end, source) {
									return $elm$parser$Parser$Advanced$Loop(
										_Utils_Tuple2(
											fence,
											_Utils_ap(
												body,
												A3($elm$core$String$slice, start, end, source))));
								})),
						$author$project$Markdown$CodeBlock$codeBlockLine(fence.aE)),
					$elm$parser$Parser$Advanced$getOffset),
				$elm$parser$Parser$Advanced$getSource)
			]));
};
var $author$project$Markdown$CodeBlock$remainingBlock = function (fence) {
	return A2(
		$elm$parser$Parser$Advanced$loop,
		_Utils_Tuple2(fence, ''),
		$author$project$Markdown$CodeBlock$remainingBlockHelp);
};
var $author$project$Markdown$CodeBlock$parser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (fence) {
		return A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($author$project$Markdown$CodeBlock$CodeBlock),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$author$project$Markdown$CodeBlock$infoString(fence.at),
					$author$project$Helpers$lineEndOrEnd)),
			$author$project$Markdown$CodeBlock$remainingBlock(fence));
	},
	$author$project$Markdown$CodeBlock$openingFence);
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $author$project$Markdown$Heading$dropTrailingHashes = function (headingString) {
	dropTrailingHashes:
	while (true) {
		if (A2($elm$core$String$endsWith, '#', headingString)) {
			var $temp$headingString = A2($elm$core$String$dropRight, 1, headingString);
			headingString = $temp$headingString;
			continue dropTrailingHashes;
		} else {
			return headingString;
		}
	}
};
var $elm$core$String$trimRight = _String_trimRight;
var $author$project$Markdown$Heading$dropClosingSequence = function (headingString) {
	var droppedTrailingHashesString = $author$project$Markdown$Heading$dropTrailingHashes(headingString);
	return (A2($elm$core$String$endsWith, ' ', droppedTrailingHashesString) || $elm$core$String$isEmpty(droppedTrailingHashesString)) ? $elm$core$String$trimRight(droppedTrailingHashesString) : headingString;
};
var $author$project$Parser$Token$hash = A2(
	$elm$parser$Parser$Advanced$Token,
	'#',
	$elm$parser$Parser$Expecting('a `#`'));
var $author$project$Markdown$Heading$isHash = function (c) {
	if ('#' === c) {
		return true;
	} else {
		return false;
	}
};
var $elm$parser$Parser$Advanced$spaces = $elm$parser$Parser$Advanced$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || (c === '\r'));
	});
var $author$project$Markdown$Heading$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($author$project$Markdown$RawBlock$Heading),
				A2(
					$elm$parser$Parser$Advanced$andThen,
					function (startingSpaces) {
						var startSpace = $elm$core$String$length(startingSpaces);
						return (startSpace >= 4) ? $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Expecting('heading with < 4 spaces in front')) : $elm$parser$Parser$Advanced$succeed(startSpace);
					},
					$elm$parser$Parser$Advanced$getChompedString($elm$parser$Parser$Advanced$spaces))),
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$hash)),
		A2(
			$elm$parser$Parser$Advanced$andThen,
			function (additionalHashes) {
				var level = $elm$core$String$length(additionalHashes) + 1;
				return (level >= 7) ? $elm$parser$Parser$Advanced$problem(
					$elm$parser$Parser$Expecting('heading with < 7 #\'s')) : $elm$parser$Parser$Advanced$succeed(level);
			},
			$elm$parser$Parser$Advanced$getChompedString(
				$elm$parser$Parser$Advanced$chompWhile($author$project$Markdown$Heading$isHash)))),
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(''),
				$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$newline)),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$space),
								$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$tab)
							]))),
				A2(
					$elm$parser$Parser$Advanced$mapChompedString,
					F2(
						function (headingText, _v0) {
							return $author$project$Markdown$Heading$dropClosingSequence(
								$elm$core$String$trim(headingText));
						}),
					$author$project$Helpers$chompUntilLineEndOrEnd))
			])));
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.e, s.cr, s.aV, s.az);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.h)) : A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.e, newOffset) < 0,
			0,
			{aV: newCol, h: s.h, j: s.j, e: newOffset, cr: newRow, az: s.az});
	};
};
var $author$project$Parser$Token$greaterThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'>',
	$elm$parser$Parser$Expecting('a `>`'));
var $elm$parser$Parser$Advanced$Located = F3(
	function (row, col, context) {
		return {aV: col, h: context, cr: row};
	});
var $elm$parser$Parser$Advanced$changeContext = F2(
	function (newContext, s) {
		return {aV: s.aV, h: newContext, j: s.j, e: s.e, cr: s.cr, az: s.az};
	});
var $elm$parser$Parser$Advanced$inContext = F2(
	function (context, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(
				A2(
					$elm$parser$Parser$Advanced$changeContext,
					A2(
						$elm$core$List$cons,
						A3($elm$parser$Parser$Advanced$Located, s0.cr, s0.aV, context),
						s0.h),
					s0));
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					a,
					A2($elm$parser$Parser$Advanced$changeContext, s0.h, s1));
			} else {
				var step = _v1;
				return step;
			}
		};
	});
var $author$project$Whitespace$isWhitespace = function (_char) {
	switch (_char) {
		case ' ':
			return true;
		case '\n':
			return true;
		case '\t':
			return true;
		case '\u000B':
			return true;
		case '\u000C':
			return true;
		case '\u000D':
			return true;
		default:
			return false;
	}
};
var $author$project$Parser$Token$lessThan = A2(
	$elm$parser$Parser$Advanced$Token,
	'<',
	$elm$parser$Parser$Expecting('a `<`'));
var $author$project$Markdown$LinkReferenceDefinition$destinationParser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link destination',
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$url$Url$percentEncode),
					$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$lessThan)),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($author$project$Parser$Token$greaterThan)),
					$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$greaterThan))),
				$elm$parser$Parser$Advanced$getChompedString(
				$author$project$Parser$Extra$chompOneOrMore(
					A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Whitespace$isWhitespace)))
			])));
var $author$project$Parser$Token$closingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	']',
	$elm$parser$Parser$Expecting('a `]`'));
var $author$project$Parser$Token$openingSquareBracket = A2(
	$elm$parser$Parser$Advanced$Token,
	'[',
	$elm$parser$Parser$Expecting('a `[`'));
var $author$project$Markdown$LinkReferenceDefinition$labelParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$succeed($author$project$Markdown$Helpers$prepareRefLabel),
		$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$openingSquareBracket)),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString(
			$elm$parser$Parser$Advanced$chompUntil($author$project$Parser$Token$closingSquareBracket)),
		$elm$parser$Parser$Advanced$symbol(
			A2(
				$elm$parser$Parser$Advanced$Token,
				']:',
				$elm$parser$Parser$Expecting(']:')))));
var $author$project$Parser$Token$doubleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\"',
	$elm$parser$Parser$Expecting('a double quote'));
var $author$project$Markdown$LinkReferenceDefinition$hasNoBlankLine = function (str) {
	return A2($elm$core$String$contains, '\n\n', str) ? $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Expecting('no blank line')) : $elm$parser$Parser$Advanced$succeed(str);
};
var $author$project$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline = A2(
	$elm$parser$Parser$Advanced$ignorer,
	$elm$parser$Parser$Advanced$chompWhile(
		function (c) {
			return (!$author$project$Whitespace$isLineEnd(c)) && $author$project$Whitespace$isWhitespace(c);
		}),
	$author$project$Helpers$lineEndOrEnd);
var $author$project$Whitespace$requiredWhitespace = A2(
	$elm$parser$Parser$Advanced$ignorer,
	A2(
		$elm$parser$Parser$Advanced$chompIf,
		$author$project$Whitespace$isWhitespace,
		$elm$parser$Parser$Expecting('Required whitespace')),
	$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isWhitespace));
var $author$project$Parser$Token$singleQuote = A2(
	$elm$parser$Parser$Advanced$Token,
	'\'',
	$elm$parser$Parser$Expecting('a single quote'));
var $author$project$Markdown$LinkReferenceDefinition$titleParser = function () {
	var inSingleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$singleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$author$project$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($author$project$Parser$Token$singleQuote))),
				$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$singleQuote)),
			$author$project$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	var inDoubleQuotes = A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Just),
			$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$doubleQuote)),
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$author$project$Markdown$LinkReferenceDefinition$hasNoBlankLine,
					$elm$parser$Parser$Advanced$getChompedString(
						$elm$parser$Parser$Advanced$chompUntil($author$project$Parser$Token$doubleQuote))),
				$elm$parser$Parser$Advanced$symbol($author$project$Parser$Token$doubleQuote)),
			$author$project$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline));
	return A2(
		$elm$parser$Parser$Advanced$inContext,
		'title',
		$elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$Advanced$backtrackable(
					A2(
						$elm$parser$Parser$Advanced$keeper,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
							$author$project$Whitespace$requiredWhitespace),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									inDoubleQuotes,
									inSingleQuotes,
									$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing)
								])))),
					A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed($elm$core$Maybe$Nothing),
					$author$project$Markdown$LinkReferenceDefinition$onlyWhitespaceTillNewline)
				])));
}();
var $author$project$Markdown$LinkReferenceDefinition$parser = A2(
	$elm$parser$Parser$Advanced$inContext,
	'link reference definition',
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(
						F3(
							function (label, destination, title) {
								return _Utils_Tuple2(
									label,
									{b1: destination, cx: title});
							})),
					$author$project$Whitespace$upToThreeSpaces),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							$author$project$Markdown$LinkReferenceDefinition$labelParser,
							$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab)),
						$elm$parser$Parser$Advanced$oneOf(
							_List_fromArray(
								[
									$author$project$Whitespace$lineEnd,
									$elm$parser$Parser$Advanced$succeed(0)
								]))),
					$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab))),
			$author$project$Markdown$LinkReferenceDefinition$destinationParser),
		$author$project$Markdown$LinkReferenceDefinition$titleParser));
var $author$project$ThematicBreak$ThematicBreak = 0;
var $author$project$ThematicBreak$whitespace = $elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab);
var $author$project$ThematicBreak$withChar = function (tchar) {
	var token = $author$project$Parser$Token$parseString(
		$elm$core$String$fromChar(tchar));
	return A2(
		$elm$parser$Parser$Advanced$ignorer,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								$elm$parser$Parser$Advanced$succeed(0),
								token),
							$author$project$ThematicBreak$whitespace),
						token),
					$author$project$ThematicBreak$whitespace),
				token),
			$elm$parser$Parser$Advanced$chompWhile(
				function (c) {
					return _Utils_eq(c, tchar) || $author$project$Whitespace$isSpaceOrTab(c);
				})),
		$author$project$Helpers$lineEndOrEnd);
};
var $author$project$ThematicBreak$parseThematicBreak = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			$author$project$ThematicBreak$withChar('-'),
			$author$project$ThematicBreak$withChar('*'),
			$author$project$ThematicBreak$withChar('_')
		]));
var $author$project$ThematicBreak$parser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
						$author$project$Whitespace$space),
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								$author$project$Whitespace$space,
								$elm$parser$Parser$Advanced$succeed(0)
							]))),
				$elm$parser$Parser$Advanced$oneOf(
					_List_fromArray(
						[
							$author$project$Whitespace$space,
							$elm$parser$Parser$Advanced$succeed(0)
						]))),
			$author$project$ThematicBreak$parseThematicBreak),
			$author$project$ThematicBreak$parseThematicBreak
		]));
var $author$project$Markdown$RawBlock$LevelOne = 0;
var $author$project$Markdown$RawBlock$LevelTwo = 1;
var $author$project$Markdown$RawBlock$SetextLine = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $author$project$Parser$Token$equals = A2(
	$elm$parser$Parser$Advanced$Token,
	'=',
	$elm$parser$Parser$Expecting('a `=`'));
var $author$project$Parser$Token$minus = A2(
	$elm$parser$Parser$Advanced$Token,
	'-',
	$elm$parser$Parser$Expecting('a `-`'));
var $author$project$Markdown$Parser$setextLineParser = function () {
	var setextLevel = F3(
		function (level, levelToken, levelChar) {
			return A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$succeed(level),
					$elm$parser$Parser$Advanced$token(levelToken)),
				$elm$parser$Parser$Advanced$chompWhile(
					$elm$core$Basics$eq(levelChar)));
		});
	return A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (raw, level) {
				return A2($author$project$Markdown$RawBlock$SetextLine, level, raw);
			}),
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
				$author$project$Whitespace$upToThreeSpaces),
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$oneOf(
						_List_fromArray(
							[
								A3(setextLevel, 0, $author$project$Parser$Token$equals, '='),
								A3(setextLevel, 1, $author$project$Parser$Token$minus, '-')
							])),
					$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab)),
				$author$project$Helpers$lineEndOrEnd)));
}();
var $author$project$Markdown$RawBlock$TableDelimiter = function (a) {
	return {$: 9, a: a};
};
var $author$project$Markdown$TableParser$chompSinglelineWhitespace = $elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab);
var $author$project$Parser$Extra$maybeChomp = function (condition) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$chompIf,
				condition,
				$elm$parser$Parser$Problem('Character not found')),
				$elm$parser$Parser$Advanced$succeed(0)
			]));
};
var $author$project$Markdown$TableParser$requirePipeIfNotFirst = function (columns) {
	return $elm$core$List$isEmpty(columns) ? $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$author$project$Parser$Token$parseString('|'),
				$elm$parser$Parser$Advanced$succeed(0)
			])) : $author$project$Parser$Token$parseString('|');
};
var $author$project$Markdown$TableParser$delimiterRowHelp = function (revDelimiterColumns) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
					},
					$author$project$Parser$Token$parseString('|\n'))),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v1) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$author$project$Parser$Token$parseString('\n')),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revDelimiterColumns);
				},
				$elm$parser$Parser$Advanced$end(
					$elm$parser$Parser$Expecting('end'))),
				$elm$parser$Parser$Advanced$backtrackable(
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							$elm$parser$Parser$Advanced$Done(revDelimiterColumns)),
						$author$project$Parser$Token$parseString('|')),
					$elm$parser$Parser$Advanced$end(
						$elm$parser$Parser$Expecting('end')))),
				A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						$elm$parser$Parser$Advanced$succeed(
							function (column) {
								return $elm$parser$Parser$Advanced$Loop(
									A2($elm$core$List$cons, column, revDelimiterColumns));
							}),
						$author$project$Markdown$TableParser$requirePipeIfNotFirst(revDelimiterColumns)),
					$author$project$Markdown$TableParser$chompSinglelineWhitespace),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$elm$parser$Parser$Advanced$getChompedString(
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							A2(
								$elm$parser$Parser$Advanced$ignorer,
								A2(
									$elm$parser$Parser$Advanced$ignorer,
									$elm$parser$Parser$Advanced$succeed(0),
									$author$project$Parser$Extra$maybeChomp(
										function (c) {
											return c === ':';
										})),
								$author$project$Parser$Extra$chompOneOrMore(
									function (c) {
										return c === '-';
									})),
							$author$project$Parser$Extra$maybeChomp(
								function (c) {
									return c === ':';
								}))),
					$author$project$Markdown$TableParser$chompSinglelineWhitespace))
			]));
};
var $author$project$Markdown$Block$AlignCenter = 2;
var $author$project$Markdown$Block$AlignLeft = 0;
var $author$project$Markdown$Block$AlignRight = 1;
var $author$project$Markdown$TableParser$delimiterToAlignment = function (cell) {
	var _v0 = _Utils_Tuple2(
		A2($elm$core$String$startsWith, ':', cell),
		A2($elm$core$String$endsWith, ':', cell));
	if (_v0.a) {
		if (_v0.b) {
			return $elm$core$Maybe$Just(2);
		} else {
			return $elm$core$Maybe$Just(0);
		}
	} else {
		if (_v0.b) {
			return $elm$core$Maybe$Just(1);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$Markdown$TableParser$delimiterRowParser = A2(
	$elm$parser$Parser$Advanced$andThen,
	function (delimiterRow) {
		var trimmed = delimiterRow.a.bP;
		var headers = delimiterRow.b;
		return $elm$core$List$isEmpty(headers) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Expecting('Must have at least one column in delimiter row.')) : ((($elm$core$List$length(headers) === 1) && (!(A2($elm$core$String$startsWith, '|', trimmed) && A2($elm$core$String$endsWith, '|', trimmed)))) ? $elm$parser$Parser$Advanced$problem(
			$elm$parser$Parser$Problem('Tables with a single column must have pipes at the start and end of the delimiter row to avoid ambiguity.')) : $elm$parser$Parser$Advanced$succeed(delimiterRow));
	},
	A2(
		$elm$parser$Parser$Advanced$mapChompedString,
		F2(
			function (delimiterText, revDelimiterColumns) {
				return A2(
					$author$project$Markdown$Table$TableDelimiterRow,
					{
						bq: delimiterText,
						bP: $elm$core$String$trim(delimiterText)
					},
					A2(
						$elm$core$List$map,
						$author$project$Markdown$TableParser$delimiterToAlignment,
						$elm$core$List$reverse(revDelimiterColumns)));
			}),
		A2($elm$parser$Parser$Advanced$loop, _List_Nil, $author$project$Markdown$TableParser$delimiterRowHelp)));
var $author$project$Markdown$Parser$tableDelimiterInOpenParagraph = A2($elm$parser$Parser$Advanced$map, $author$project$Markdown$RawBlock$TableDelimiter, $author$project$Markdown$TableParser$delimiterRowParser);
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Markdown$TableParser$standardizeRowLength = F2(
	function (expectedLength, row) {
		var rowLength = $elm$core$List$length(row);
		var _v0 = A2($elm$core$Basics$compare, expectedLength, rowLength);
		switch (_v0) {
			case 0:
				return A2($elm$core$List$take, expectedLength, row);
			case 1:
				return row;
			default:
				return _Utils_ap(
					row,
					A2($elm$core$List$repeat, expectedLength - rowLength, ''));
		}
	});
var $author$project$Markdown$TableParser$bodyRowParser = function (expectedRowLength) {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		function (row) {
			return ($elm$core$List$isEmpty(row) || A2($elm$core$List$all, $elm$core$String$isEmpty, row)) ? $elm$parser$Parser$Advanced$problem(
				$elm$parser$Parser$Problem('A line must have at least one column')) : $elm$parser$Parser$Advanced$succeed(
				A2($author$project$Markdown$TableParser$standardizeRowLength, expectedRowLength, row));
		},
		$author$project$Markdown$TableParser$rowParser);
};
var $author$project$Markdown$Parser$tableRowIfTableStarted = function (_v0) {
	var headers = _v0.a;
	var body = _v0.b;
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (row) {
			return $author$project$Markdown$RawBlock$Table(
				A2(
					$author$project$Markdown$Table$Table,
					headers,
					_Utils_ap(
						body,
						_List_fromArray(
							[row]))));
		},
		$author$project$Markdown$TableParser$bodyRowParser(
			$elm$core$List$length(headers)));
};
var $author$project$Markdown$Block$H1 = 0;
var $author$project$Markdown$Block$H2 = 1;
var $author$project$Markdown$Block$H3 = 2;
var $author$project$Markdown$Block$H4 = 3;
var $author$project$Markdown$Block$H5 = 4;
var $author$project$Markdown$Block$H6 = 5;
var $author$project$Markdown$Parser$toHeading = function (level) {
	switch (level) {
		case 1:
			return $elm$core$Result$Ok(0);
		case 2:
			return $elm$core$Result$Ok(1);
		case 3:
			return $elm$core$Result$Ok(2);
		case 4:
			return $elm$core$Result$Ok(3);
		case 5:
			return $elm$core$Result$Ok(4);
		case 6:
			return $elm$core$Result$Ok(5);
		default:
			return $elm$core$Result$Err(
				$elm$parser$Parser$Expecting(
					'A heading with 1 to 6 #\'s, but found ' + $elm$core$String$fromInt(level)));
	}
};
var $author$project$Markdown$ListItem$EmptyItem = {$: 2};
var $author$project$Markdown$ListItem$PlainItem = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$ListItem$TaskItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$UnorderedList$getIntendedCodeItem = F4(
	function (markerStartPos, listMarker, markerEndPos, _v0) {
		var bodyStartPos = _v0.a;
		var item = _v0.b;
		var spaceNum = bodyStartPos - markerEndPos;
		if (spaceNum <= 4) {
			return _Utils_Tuple3(listMarker, bodyStartPos - markerStartPos, item);
		} else {
			var intendedCodeItem = function () {
				switch (item.$) {
					case 0:
						var completion = item.a;
						var string = item.b;
						return A2(
							$author$project$Markdown$ListItem$TaskItem,
							completion,
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					case 1:
						var string = item.a;
						return $author$project$Markdown$ListItem$PlainItem(
							_Utils_ap(
								A2($elm$core$String$repeat, spaceNum - 1, ' '),
								string));
					default:
						return $author$project$Markdown$ListItem$EmptyItem;
				}
			}();
			return _Utils_Tuple3(listMarker, (markerEndPos - markerStartPos) + 1, intendedCodeItem);
		}
	});
var $author$project$Markdown$UnorderedList$unorderedListEmptyItemParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$succeed(
		function (bodyStartPos) {
			return _Utils_Tuple2(bodyStartPos, $author$project$Markdown$ListItem$EmptyItem);
		}),
	A2($elm$parser$Parser$Advanced$ignorer, $elm$parser$Parser$Advanced$getCol, $author$project$Helpers$lineEndOrEnd));
var $author$project$Markdown$ListItem$Complete = 1;
var $author$project$Markdown$ListItem$Incomplete = 0;
var $author$project$Markdown$ListItem$taskItemParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[x] ',
					$elm$parser$Parser$ExpectingSymbol('[x] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[X] ',
					$elm$parser$Parser$ExpectingSymbol('[X] ')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(0),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'[ ] ',
					$elm$parser$Parser$ExpectingSymbol('[ ] '))))
		]));
var $author$project$Markdown$ListItem$parser = A2(
	$elm$parser$Parser$Advanced$keeper,
	$elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$keeper,
				$elm$parser$Parser$Advanced$succeed($author$project$Markdown$ListItem$TaskItem),
				A2(
					$elm$parser$Parser$Advanced$ignorer,
					$author$project$Markdown$ListItem$taskItemParser,
					$elm$parser$Parser$Advanced$chompWhile($author$project$Whitespace$isSpaceOrTab))),
				$elm$parser$Parser$Advanced$succeed($author$project$Markdown$ListItem$PlainItem)
			])),
	A2(
		$elm$parser$Parser$Advanced$ignorer,
		$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
		$author$project$Helpers$lineEndOrEnd));
var $author$project$Markdown$UnorderedList$unorderedListItemBodyParser = A2(
	$elm$parser$Parser$Advanced$keeper,
	A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(
				F2(
					function (bodyStartPos, item) {
						return _Utils_Tuple2(bodyStartPos, item);
					})),
			$author$project$Parser$Extra$chompOneOrMore($author$project$Whitespace$isSpaceOrTab)),
		$elm$parser$Parser$Advanced$getCol),
	$author$project$Markdown$ListItem$parser);
var $author$project$Markdown$UnorderedList$Asterisk = 2;
var $author$project$Markdown$UnorderedList$Minus = 0;
var $author$project$Markdown$UnorderedList$Plus = 1;
var $author$project$Markdown$UnorderedList$unorderedListMarkerParser = $elm$parser$Parser$Advanced$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			A2(
				$elm$parser$Parser$Advanced$ignorer,
				$elm$parser$Parser$Advanced$succeed(0),
				A2($author$project$Parser$Extra$upTo, 3, $author$project$Whitespace$space)),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'-',
					$elm$parser$Parser$ExpectingSymbol('-')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(1),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'+',
					$elm$parser$Parser$ExpectingSymbol('+')))),
			A2(
			$elm$parser$Parser$Advanced$ignorer,
			$elm$parser$Parser$Advanced$succeed(2),
			$elm$parser$Parser$Advanced$symbol(
				A2(
					$elm$parser$Parser$Advanced$Token,
					'*',
					$elm$parser$Parser$ExpectingSymbol('*'))))
		]));
var $author$project$Markdown$UnorderedList$parser = function (previousWasBody) {
	return A2(
		$elm$parser$Parser$Advanced$keeper,
		A2(
			$elm$parser$Parser$Advanced$keeper,
			A2(
				$elm$parser$Parser$Advanced$keeper,
				A2(
					$elm$parser$Parser$Advanced$keeper,
					$elm$parser$Parser$Advanced$succeed($author$project$Markdown$UnorderedList$getIntendedCodeItem),
					$elm$parser$Parser$Advanced$getCol),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$UnorderedList$unorderedListMarkerParser)),
			$elm$parser$Parser$Advanced$getCol),
		previousWasBody ? $author$project$Markdown$UnorderedList$unorderedListItemBodyParser : $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[$author$project$Markdown$UnorderedList$unorderedListEmptyItemParser, $author$project$Markdown$UnorderedList$unorderedListItemBodyParser])));
};
var $author$project$Markdown$Parser$unorderedListBlock = function (previousWasBody) {
	var parseListItem = F2(
		function (listmarker, unparsedListItem) {
			switch (unparsedListItem.$) {
				case 0:
					var completion = unparsedListItem.a;
					var body = unparsedListItem.b;
					return {
						bZ: body,
						cf: listmarker,
						n: $elm$core$Maybe$Just(
							function () {
								if (completion === 1) {
									return true;
								} else {
									return false;
								}
							}())
					};
				case 1:
					var body = unparsedListItem.a;
					return {bZ: body, cf: listmarker, n: $elm$core$Maybe$Nothing};
				default:
					return {bZ: '', cf: listmarker, n: $elm$core$Maybe$Nothing};
			}
		});
	return A2(
		$elm$parser$Parser$Advanced$map,
		function (_v0) {
			var listmarker = _v0.a;
			var intended = _v0.b;
			var unparsedListItem = _v0.c;
			return A4(
				$author$project$Markdown$RawBlock$UnorderedListBlock,
				true,
				intended,
				_List_Nil,
				A2(parseListItem, listmarker, unparsedListItem));
		},
		$author$project$Markdown$UnorderedList$parser(previousWasBody));
};
var $author$project$Markdown$Parser$childToBlocks = F2(
	function (node, blocks) {
		switch (node.$) {
			case 0:
				var tag = node.a;
				var attributes = node.b;
				var children = node.c;
				var _v106 = $author$project$Markdown$Parser$nodesToBlocks(children);
				if (!_v106.$) {
					var childrenAsBlocks = _v106.a;
					var block = $author$project$Markdown$Block$HtmlBlock(
						A3($author$project$Markdown$Block$HtmlElement, tag, attributes, childrenAsBlocks));
					return $elm$core$Result$Ok(
						A2($elm$core$List$cons, block, blocks));
				} else {
					var err = _v106.a;
					return $elm$core$Result$Err(err);
				}
			case 1:
				var innerText = node.a;
				var _v107 = $author$project$Markdown$Parser$parse(innerText);
				if (!_v107.$) {
					var value = _v107.a;
					return $elm$core$Result$Ok(
						_Utils_ap(
							$elm$core$List$reverse(value),
							blocks));
				} else {
					var error = _v107.a;
					return $elm$core$Result$Err(
						$elm$parser$Parser$Expecting(
							A2(
								$elm$core$String$join,
								'\n',
								A2($elm$core$List$map, $author$project$Markdown$Parser$deadEndToString, error))));
				}
			case 2:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$author$project$Markdown$Block$HtmlBlock(
							$author$project$Markdown$Block$HtmlComment(string)),
						blocks));
			case 3:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$author$project$Markdown$Block$HtmlBlock(
							$author$project$Markdown$Block$Cdata(string)),
						blocks));
			case 4:
				var string = node.a;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$author$project$Markdown$Block$HtmlBlock(
							$author$project$Markdown$Block$ProcessingInstruction(string)),
						blocks));
			default:
				var declarationType = node.a;
				var content = node.b;
				return $elm$core$Result$Ok(
					A2(
						$elm$core$List$cons,
						$author$project$Markdown$Block$HtmlBlock(
							A2($author$project$Markdown$Block$HtmlDeclaration, declarationType, content)),
						blocks));
		}
	});
var $author$project$Markdown$Parser$completeBlocks = function (state) {
	var _v91 = state.b;
	_v91$5:
	while (true) {
		if (_v91.b) {
			switch (_v91.a.$) {
				case 11:
					var body2 = _v91.a.a;
					var rest = _v91.b;
					var _v92 = A2(
						$elm$parser$Parser$Advanced$run,
						$author$project$Markdown$Parser$cyclic$rawBlockParser(),
						body2);
					if (!_v92.$) {
						var value = _v92.a;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									$author$project$Markdown$RawBlock$ParsedBlockQuote(value.b),
									rest)
							});
					} else {
						var error = _v92.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$author$project$Markdown$Parser$deadEndsToString(error)));
					}
				case 3:
					var _v93 = _v91.a;
					var tight = _v93.a;
					var intended = _v93.b;
					var closeListItems = _v93.c;
					var openListItem = _v93.d;
					var rest = _v91.b;
					var _v94 = A2(
						$elm$parser$Parser$Advanced$run,
						$author$project$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem.bZ);
					if (!_v94.$) {
						var value = _v94.a;
						var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									A4(
										$author$project$Markdown$RawBlock$UnorderedListBlock,
										tight2,
										intended,
										A2(
											$elm$core$List$cons,
											{bZ: value.b, n: openListItem.n},
											closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v94.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$author$project$Markdown$Parser$deadEndsToString(e)));
					}
				case 4:
					var _v99 = _v91.a;
					var tight = _v99.a;
					var intended = _v99.b;
					var marker = _v99.c;
					var order = _v99.d;
					var closeListItems = _v99.e;
					var openListItem = _v99.f;
					var rest = _v91.b;
					var _v100 = A2(
						$elm$parser$Parser$Advanced$run,
						$author$project$Markdown$Parser$cyclic$rawBlockParser(),
						openListItem);
					if (!_v100.$) {
						var value = _v100.a;
						var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
						return $elm$parser$Parser$Advanced$succeed(
							{
								a: _Utils_ap(state.a, value.a),
								b: A2(
									$elm$core$List$cons,
									A6(
										$author$project$Markdown$RawBlock$OrderedListBlock,
										tight2,
										intended,
										marker,
										order,
										A2($elm$core$List$cons, value.b, closeListItems),
										openListItem),
									rest)
							});
					} else {
						var e = _v100.a;
						return $elm$parser$Parser$Advanced$problem(
							$elm$parser$Parser$Problem(
								$author$project$Markdown$Parser$deadEndsToString(e)));
					}
				case 10:
					if (_v91.b.b) {
						switch (_v91.b.a.$) {
							case 3:
								var _v95 = _v91.a;
								var _v96 = _v91.b;
								var _v97 = _v96.a;
								var tight = _v97.a;
								var intended = _v97.b;
								var closeListItems = _v97.c;
								var openListItem = _v97.d;
								var rest = _v96.b;
								var _v98 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem.bZ);
								if (!_v98.$) {
									var value = _v98.a;
									var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												A4(
													$author$project$Markdown$RawBlock$UnorderedListBlock,
													tight2,
													intended,
													A2(
														$elm$core$List$cons,
														{bZ: value.b, n: openListItem.n},
														closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v98.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
							case 4:
								var _v101 = _v91.a;
								var _v102 = _v91.b;
								var _v103 = _v102.a;
								var tight = _v103.a;
								var intended = _v103.b;
								var marker = _v103.c;
								var order = _v103.d;
								var closeListItems = _v103.e;
								var openListItem = _v103.f;
								var rest = _v102.b;
								var _v104 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem);
								if (!_v104.$) {
									var value = _v104.a;
									var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												A6(
													$author$project$Markdown$RawBlock$OrderedListBlock,
													tight2,
													intended,
													marker,
													order,
													A2($elm$core$List$cons, value.b, closeListItems),
													openListItem),
												rest)
										});
								} else {
									var e = _v104.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
							default:
								break _v91$5;
						}
					} else {
						break _v91$5;
					}
				default:
					break _v91$5;
			}
		} else {
			break _v91$5;
		}
	}
	return $elm$parser$Parser$Advanced$succeed(state);
};
var $author$project$Markdown$Parser$completeOrMergeBlocks = F2(
	function (state, newRawBlock) {
		var _v41 = _Utils_Tuple2(newRawBlock, state.b);
		_v41$13:
		while (true) {
			if (_v41.b.b) {
				switch (_v41.b.a.$) {
					case 5:
						if (_v41.a.$ === 5) {
							var block1 = _v41.a.a;
							var _v42 = _v41.b;
							var block2 = _v42.a.a;
							var rest = _v42.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									a: state.a,
									b: A2(
										$elm$core$List$cons,
										$author$project$Markdown$RawBlock$CodeBlock(
											{
												bZ: A2($author$project$Markdown$Parser$joinStringsPreserveAll, block2.bZ, block1.bZ),
												ce: $elm$core$Maybe$Nothing
											}),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 6:
						switch (_v41.a.$) {
							case 6:
								var block1 = _v41.a.a;
								var _v43 = _v41.b;
								var block2 = _v43.a.a;
								var rest = _v43.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$author$project$Markdown$RawBlock$IndentedCodeBlock(
												A2($author$project$Markdown$Parser$joinStringsPreserveAll, block2, block1)),
											rest)
									});
							case 10:
								var _v44 = _v41.a;
								var _v45 = _v41.b;
								var block = _v45.a.a;
								var rest = _v45.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$author$project$Markdown$RawBlock$IndentedCodeBlock(
												A2($author$project$Markdown$Parser$joinStringsPreserveAll, block, '\n')),
											rest)
									});
							default:
								break _v41$13;
						}
					case 11:
						var _v46 = _v41.b;
						var body2 = _v46.a.a;
						var rest = _v46.b;
						switch (newRawBlock.$) {
							case 11:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$author$project$Markdown$RawBlock$BlockQuote(
												A2($author$project$Markdown$Parser$joinStringsPreserveAll, body2, body1)),
											rest)
									});
							case 1:
								var body1 = newRawBlock.a;
								var _v48 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v48.$) {
									var value = _v48.a;
									var _v49 = value.b;
									if (_v49.b) {
										var last = _v49.a;
										if ($author$project$Markdown$Parser$endWithOpenBlockOrParagraph(last) && (!A2($elm$core$String$endsWith, '\n', body2))) {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: state.a,
													b: A2(
														$elm$core$List$cons,
														$author$project$Markdown$RawBlock$BlockQuote(
															A2($author$project$Markdown$Parser$joinStringsPreserveAll, body2, body1)),
														rest)
												});
										} else {
											var _v50 = A2(
												$elm$parser$Parser$Advanced$run,
												$author$project$Markdown$Parser$cyclic$rawBlockParser(),
												body2);
											if (!_v50.$) {
												var value1 = _v50.a;
												return $elm$parser$Parser$Advanced$succeed(
													{
														a: _Utils_ap(state.a, value.a),
														b: A2(
															$elm$core$List$cons,
															newRawBlock,
															A2(
																$elm$core$List$cons,
																$author$project$Markdown$RawBlock$ParsedBlockQuote(value1.b),
																rest))
													});
											} else {
												var e1 = _v50.a;
												return $elm$parser$Parser$Advanced$problem(
													$elm$parser$Parser$Problem(
														$author$project$Markdown$Parser$deadEndsToString(e1)));
											}
										}
									} else {
										var _v51 = A2(
											$elm$parser$Parser$Advanced$run,
											$author$project$Markdown$Parser$cyclic$rawBlockParser(),
											body2);
										if (!_v51.$) {
											var value1 = _v51.a;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$author$project$Markdown$RawBlock$ParsedBlockQuote(value1.b),
															rest))
												});
										} else {
											var e1 = _v51.a;
											return $elm$parser$Parser$Advanced$problem(
												$elm$parser$Parser$Problem(
													$author$project$Markdown$Parser$deadEndsToString(e1)));
										}
									}
								} else {
									var e = _v48.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
							case 6:
								var body1 = newRawBlock.a;
								var _v52 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v52.$) {
									var value = _v52.a;
									var _v53 = value.b;
									if (_v53.b && (_v53.a.$ === 1)) {
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: state.a,
												b: A2(
													$elm$core$List$cons,
													$author$project$Markdown$RawBlock$BlockQuote(
														A3($author$project$Markdown$Parser$joinRawStringsWith, ' ', body2, body1)),
													rest)
											});
									} else {
										var _v54 = A2(
											$elm$parser$Parser$Advanced$run,
											$author$project$Markdown$Parser$cyclic$rawBlockParser(),
											body2);
										if (!_v54.$) {
											var value1 = _v54.a;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$author$project$Markdown$RawBlock$ParsedBlockQuote(value1.b),
															rest))
												});
										} else {
											var e1 = _v54.a;
											return $elm$parser$Parser$Advanced$problem(
												$elm$parser$Parser$Problem(
													$author$project$Markdown$Parser$deadEndsToString(e1)));
										}
									}
								} else {
									var e = _v52.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
							default:
								var _v55 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									body2);
								if (!_v55.$) {
									var value = _v55.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													$author$project$Markdown$RawBlock$ParsedBlockQuote(value.b),
													rest))
										});
								} else {
									var e = _v55.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 3:
						var _v56 = _v41.b;
						var _v57 = _v56.a;
						var tight = _v57.a;
						var intended1 = _v57.b;
						var closeListItems2 = _v57.c;
						var openListItem2 = _v57.d;
						var rest = _v56.b;
						switch (newRawBlock.$) {
							case 3:
								var intended2 = newRawBlock.b;
								var openListItem1 = newRawBlock.d;
								if (_Utils_eq(openListItem2.cf, openListItem1.cf)) {
									var _v59 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.bZ);
									if (!_v59.$) {
										var value = _v59.a;
										return A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A4(
														$author$project$Markdown$RawBlock$UnorderedListBlock,
														false,
														intended2,
														A2(
															$elm$core$List$cons,
															{bZ: value.b, n: openListItem2.n},
															closeListItems2),
														openListItem1),
													rest)
											}) : $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A4(
														$author$project$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended2,
														A2(
															$elm$core$List$cons,
															{bZ: value.b, n: openListItem2.n},
															closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v59.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v60 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.bZ);
									if (!_v60.$) {
										var value = _v60.a;
										var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A4(
															$author$project$Markdown$RawBlock$UnorderedListBlock,
															tight2,
															intended1,
															A2(
																$elm$core$List$cons,
																{bZ: value.b, n: openListItem2.n},
																closeListItems2),
															openListItem1),
														rest))
											});
									} else {
										var e = _v60.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 1:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											A4(
												$author$project$Markdown$RawBlock$UnorderedListBlock,
												tight,
												intended1,
												closeListItems2,
												_Utils_update(
													openListItem2,
													{
														bZ: A3($author$project$Markdown$Parser$joinRawStringsWith, '\n', openListItem2.bZ, body1)
													})),
											rest)
									});
							default:
								var _v61 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2.bZ);
								if (!_v61.$) {
									var value = _v61.a;
									var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A4(
														$author$project$Markdown$RawBlock$UnorderedListBlock,
														tight2,
														intended1,
														A2(
															$elm$core$List$cons,
															{bZ: value.b, n: openListItem2.n},
															closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v61.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 4:
						var _v62 = _v41.b;
						var _v63 = _v62.a;
						var tight = _v63.a;
						var intended1 = _v63.b;
						var marker = _v63.c;
						var order = _v63.d;
						var closeListItems2 = _v63.e;
						var openListItem2 = _v63.f;
						var rest = _v62.b;
						switch (newRawBlock.$) {
							case 4:
								var intended2 = newRawBlock.b;
								var marker2 = newRawBlock.c;
								var openListItem1 = newRawBlock.f;
								if (_Utils_eq(marker, marker2)) {
									var _v65 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v65.$) {
										var value = _v65.a;
										var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													A6(
														$author$project$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended2,
														marker,
														order,
														A2($elm$core$List$cons, value.b, closeListItems2),
														openListItem1),
													rest)
											});
									} else {
										var e = _v65.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								} else {
									var _v66 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v66.$) {
										var value = _v66.a;
										var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
										return $elm$parser$Parser$Advanced$succeed(
											{
												a: _Utils_ap(state.a, value.a),
												b: A2(
													$elm$core$List$cons,
													newRawBlock,
													A2(
														$elm$core$List$cons,
														A6(
															$author$project$Markdown$RawBlock$OrderedListBlock,
															tight2,
															intended1,
															marker,
															order,
															A2($elm$core$List$cons, value.b, closeListItems2),
															openListItem2),
														rest))
											});
									} else {
										var e = _v66.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								}
							case 1:
								var body1 = newRawBlock.a;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											A6($author$project$Markdown$RawBlock$OrderedListBlock, tight, intended1, marker, order, closeListItems2, openListItem2 + ('\n' + body1)),
											rest)
									});
							default:
								var _v67 = A2(
									$elm$parser$Parser$Advanced$run,
									$author$project$Markdown$Parser$cyclic$rawBlockParser(),
									openListItem2);
								if (!_v67.$) {
									var value = _v67.a;
									var tight2 = A2($elm$core$List$member, $author$project$Markdown$RawBlock$BlankLine, value.b) ? false : tight;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: _Utils_ap(state.a, value.a),
											b: A2(
												$elm$core$List$cons,
												newRawBlock,
												A2(
													$elm$core$List$cons,
													A6(
														$author$project$Markdown$RawBlock$OrderedListBlock,
														tight2,
														intended1,
														marker,
														order,
														A2($elm$core$List$cons, value.b, closeListItems2),
														openListItem2),
													rest))
										});
								} else {
									var e = _v67.a;
									return $elm$parser$Parser$Advanced$problem(
										$elm$parser$Parser$Problem(
											$author$project$Markdown$Parser$deadEndsToString(e)));
								}
						}
					case 1:
						switch (_v41.a.$) {
							case 1:
								var body1 = _v41.a.a;
								var _v68 = _v41.b;
								var body2 = _v68.a.a;
								var rest = _v68.b;
								return $elm$parser$Parser$Advanced$succeed(
									{
										a: state.a,
										b: A2(
											$elm$core$List$cons,
											$author$project$Markdown$RawBlock$OpenBlockOrParagraph(
												A3($author$project$Markdown$Parser$joinRawStringsWith, '\n', body2, body1)),
											rest)
									});
							case 13:
								if (!_v41.a.a) {
									var _v69 = _v41.a;
									var _v70 = _v69.a;
									var _v71 = _v41.b;
									var unparsedInlines = _v71.a.a;
									var rest = _v71.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												A2($author$project$Markdown$RawBlock$Heading, 1, unparsedInlines),
												rest)
										});
								} else {
									var _v72 = _v41.a;
									var _v73 = _v72.a;
									var _v74 = _v41.b;
									var unparsedInlines = _v74.a.a;
									var rest = _v74.b;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												A2($author$project$Markdown$RawBlock$Heading, 2, unparsedInlines),
												rest)
										});
								}
							case 9:
								var _v75 = _v41.a.a;
								var text = _v75.a;
								var alignments = _v75.b;
								var _v76 = _v41.b;
								var rawHeaders = _v76.a.a;
								var rest = _v76.b;
								var _v77 = A2(
									$author$project$Markdown$TableParser$parseHeader,
									A2($author$project$Markdown$Table$TableDelimiterRow, text, alignments),
									rawHeaders);
								if (!_v77.$) {
									var headers = _v77.a;
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												$author$project$Markdown$RawBlock$Table(
													A2($author$project$Markdown$Table$Table, headers, _List_Nil)),
												rest)
										});
								} else {
									return $elm$parser$Parser$Advanced$succeed(
										{
											a: state.a,
											b: A2(
												$elm$core$List$cons,
												$author$project$Markdown$RawBlock$OpenBlockOrParagraph(
													A3($author$project$Markdown$Parser$joinRawStringsWith, '\n', rawHeaders, text.bq)),
												rest)
										});
								}
							default:
								break _v41$13;
						}
					case 8:
						if (_v41.a.$ === 8) {
							var updatedTable = _v41.a.a;
							var _v78 = _v41.b;
							var rest = _v78.b;
							return $elm$parser$Parser$Advanced$succeed(
								{
									a: state.a,
									b: A2(
										$elm$core$List$cons,
										$author$project$Markdown$RawBlock$Table(updatedTable),
										rest)
								});
						} else {
							break _v41$13;
						}
					case 10:
						if (_v41.b.b.b) {
							switch (_v41.b.b.a.$) {
								case 4:
									var _v79 = _v41.b;
									var _v80 = _v79.a;
									var _v81 = _v79.b;
									var _v82 = _v81.a;
									var tight = _v82.a;
									var intended1 = _v82.b;
									var marker = _v82.c;
									var order = _v82.d;
									var closeListItems2 = _v82.e;
									var openListItem2 = _v82.f;
									var rest = _v81.b;
									var _v83 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2);
									if (!_v83.$) {
										var value = _v83.a;
										if (newRawBlock.$ === 4) {
											var intended2 = newRawBlock.b;
											var openListItem = newRawBlock.f;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														A6(
															$author$project$Markdown$RawBlock$OrderedListBlock,
															false,
															intended2,
															marker,
															order,
															A2($elm$core$List$cons, value.b, closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$author$project$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A6(
																	$author$project$Markdown$RawBlock$OrderedListBlock,
																	tight,
																	intended1,
																	marker,
																	order,
																	A2($elm$core$List$cons, value.b, closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v83.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								case 3:
									var _v85 = _v41.b;
									var _v86 = _v85.a;
									var _v87 = _v85.b;
									var _v88 = _v87.a;
									var tight = _v88.a;
									var intended1 = _v88.b;
									var closeListItems2 = _v88.c;
									var openListItem2 = _v88.d;
									var rest = _v87.b;
									var _v89 = A2(
										$elm$parser$Parser$Advanced$run,
										$author$project$Markdown$Parser$cyclic$rawBlockParser(),
										openListItem2.bZ);
									if (!_v89.$) {
										var value = _v89.a;
										if (newRawBlock.$ === 3) {
											var openListItem = newRawBlock.d;
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														A4(
															$author$project$Markdown$RawBlock$UnorderedListBlock,
															false,
															intended1,
															A2(
																$elm$core$List$cons,
																{bZ: value.b, n: openListItem2.n},
																closeListItems2),
															openListItem),
														rest)
												});
										} else {
											return $elm$parser$Parser$Advanced$succeed(
												{
													a: _Utils_ap(state.a, value.a),
													b: A2(
														$elm$core$List$cons,
														newRawBlock,
														A2(
															$elm$core$List$cons,
															$author$project$Markdown$RawBlock$BlankLine,
															A2(
																$elm$core$List$cons,
																A4(
																	$author$project$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended1,
																	A2(
																		$elm$core$List$cons,
																		{bZ: value.b, n: openListItem2.n},
																		closeListItems2),
																	openListItem2),
																rest)))
												});
										}
									} else {
										var e = _v89.a;
										return $elm$parser$Parser$Advanced$problem(
											$elm$parser$Parser$Problem(
												$author$project$Markdown$Parser$deadEndsToString(e)));
									}
								default:
									break _v41$13;
							}
						} else {
							break _v41$13;
						}
					default:
						break _v41$13;
				}
			} else {
				break _v41$13;
			}
		}
		return $elm$parser$Parser$Advanced$succeed(
			{
				a: state.a,
				b: A2($elm$core$List$cons, newRawBlock, state.b)
			});
	});
var $author$project$Markdown$Parser$inlineParseHelper = F2(
	function (referencesDict, _v36) {
		var unparsedInlines = _v36;
		var mappedReferencesDict = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$mapSecond(
					function (_v37) {
						var destination = _v37.b1;
						var title = _v37.cx;
						return _Utils_Tuple2(destination, title);
					}),
				referencesDict));
		return A2(
			$elm$core$List$map,
			$author$project$Markdown$Parser$mapInline,
			A2($author$project$Markdown$InlineParser$parse, mappedReferencesDict, unparsedInlines));
	});
var $author$project$Markdown$Parser$mapInline = function (inline) {
	switch (inline.$) {
		case 0:
			var string = inline.a;
			return $author$project$Markdown$Block$Text(string);
		case 1:
			return $author$project$Markdown$Block$HardLineBreak;
		case 2:
			var string = inline.a;
			return $author$project$Markdown$Block$CodeSpan(string);
		case 3:
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$author$project$Markdown$Block$Link,
				string,
				maybeString,
				A2($elm$core$List$map, $author$project$Markdown$Parser$mapInline, inlines));
		case 4:
			var string = inline.a;
			var maybeString = inline.b;
			var inlines = inline.c;
			return A3(
				$author$project$Markdown$Block$Image,
				string,
				maybeString,
				A2($elm$core$List$map, $author$project$Markdown$Parser$mapInline, inlines));
		case 5:
			var node = inline.a;
			return $author$project$Markdown$Block$HtmlInline(
				$author$project$Markdown$Parser$nodeToRawBlock(node));
		case 6:
			var level = inline.a;
			var inlines = inline.b;
			switch (level) {
				case 1:
					return $author$project$Markdown$Block$Emphasis(
						A2($elm$core$List$map, $author$project$Markdown$Parser$mapInline, inlines));
				case 2:
					return $author$project$Markdown$Block$Strong(
						A2($elm$core$List$map, $author$project$Markdown$Parser$mapInline, inlines));
				default:
					return $author$project$Markdown$Helpers$isEven(level) ? $author$project$Markdown$Block$Strong(
						_List_fromArray(
							[
								$author$project$Markdown$Parser$mapInline(
								A2($author$project$Markdown$Inline$Emphasis, level - 2, inlines))
							])) : $author$project$Markdown$Block$Emphasis(
						_List_fromArray(
							[
								$author$project$Markdown$Parser$mapInline(
								A2($author$project$Markdown$Inline$Emphasis, level - 1, inlines))
							]));
			}
		default:
			var inlines = inline.a;
			return $author$project$Markdown$Block$Strikethrough(
				A2($elm$core$List$map, $author$project$Markdown$Parser$mapInline, inlines));
	}
};
var $author$project$Markdown$Parser$nodeToRawBlock = function (node) {
	switch (node.$) {
		case 1:
			return $author$project$Markdown$Block$HtmlComment('TODO this never happens, but use types to drop this case.');
		case 0:
			var tag = node.a;
			var attributes = node.b;
			var children = node.c;
			var parseChild = function (child) {
				if (child.$ === 1) {
					var text = child.a;
					return $author$project$Markdown$Parser$textNodeToBlocks(text);
				} else {
					return _List_fromArray(
						[
							$author$project$Markdown$Block$HtmlBlock(
							$author$project$Markdown$Parser$nodeToRawBlock(child))
						]);
				}
			};
			return A3(
				$author$project$Markdown$Block$HtmlElement,
				tag,
				attributes,
				A2($elm$core$List$concatMap, parseChild, children));
		case 2:
			var string = node.a;
			return $author$project$Markdown$Block$HtmlComment(string);
		case 3:
			var string = node.a;
			return $author$project$Markdown$Block$Cdata(string);
		case 4:
			var string = node.a;
			return $author$project$Markdown$Block$ProcessingInstruction(string);
		default:
			var declarationType = node.a;
			var content = node.b;
			return A2($author$project$Markdown$Block$HtmlDeclaration, declarationType, content);
	}
};
var $author$project$Markdown$Parser$nodesToBlocks = function (children) {
	return A2($author$project$Markdown$Parser$nodesToBlocksHelp, children, _List_Nil);
};
var $author$project$Markdown$Parser$nodesToBlocksHelp = F2(
	function (remaining, soFar) {
		nodesToBlocksHelp:
		while (true) {
			if (remaining.b) {
				var node = remaining.a;
				var rest = remaining.b;
				var _v31 = A2($author$project$Markdown$Parser$childToBlocks, node, soFar);
				if (!_v31.$) {
					var newSoFar = _v31.a;
					var $temp$remaining = rest,
						$temp$soFar = newSoFar;
					remaining = $temp$remaining;
					soFar = $temp$soFar;
					continue nodesToBlocksHelp;
				} else {
					var e = _v31.a;
					return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(
					$elm$core$List$reverse(soFar));
			}
		}
	});
var $author$project$Markdown$Parser$parse = function (input) {
	var _v27 = A2(
		$elm$parser$Parser$Advanced$run,
		A2(
			$elm$parser$Parser$Advanced$ignorer,
			$author$project$Markdown$Parser$cyclic$rawBlockParser(),
			$author$project$Helpers$endOfFile),
		input);
	if (_v27.$ === 1) {
		var e = _v27.a;
		return $elm$core$Result$Err(e);
	} else {
		var v = _v27.a;
		var _v28 = $author$project$Markdown$Parser$parseAllInlines(v);
		if (_v28.$ === 1) {
			var e = _v28.a;
			return A2(
				$elm$parser$Parser$Advanced$run,
				$elm$parser$Parser$Advanced$problem(e),
				'');
		} else {
			var blocks = _v28.a;
			var isNotEmptyParagraph = function (block) {
				if ((block.$ === 5) && (!block.a.b)) {
					return false;
				} else {
					return true;
				}
			};
			return $elm$core$Result$Ok(
				A2($elm$core$List$filter, isNotEmptyParagraph, blocks));
		}
	}
};
var $author$project$Markdown$Parser$parseAllInlines = function (state) {
	return A3($author$project$Markdown$Parser$parseAllInlinesHelp, state, state.b, _List_Nil);
};
var $author$project$Markdown$Parser$parseAllInlinesHelp = F3(
	function (state, rawBlocks, parsedBlocks) {
		parseAllInlinesHelp:
		while (true) {
			if (rawBlocks.b) {
				var rawBlock = rawBlocks.a;
				var rest = rawBlocks.b;
				var _v26 = A2($author$project$Markdown$Parser$parseInlines, state.a, rawBlock);
				switch (_v26.$) {
					case 1:
						var newParsedBlock = _v26.a;
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = A2($elm$core$List$cons, newParsedBlock, parsedBlocks);
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					case 0:
						var $temp$state = state,
							$temp$rawBlocks = rest,
							$temp$parsedBlocks = parsedBlocks;
						state = $temp$state;
						rawBlocks = $temp$rawBlocks;
						parsedBlocks = $temp$parsedBlocks;
						continue parseAllInlinesHelp;
					default:
						var e = _v26.a;
						return $elm$core$Result$Err(e);
				}
			} else {
				return $elm$core$Result$Ok(parsedBlocks);
			}
		}
	});
var $author$project$Markdown$Parser$parseHeaderInlines = F2(
	function (linkReferences, header) {
		return A2(
			$elm$core$List$map,
			function (_v24) {
				var label = _v24.ac;
				var alignment = _v24.ap;
				return A3(
					$author$project$Markdown$Parser$parseRawInline,
					linkReferences,
					function (parsedHeaderLabel) {
						return {ap: alignment, ac: parsedHeaderLabel};
					},
					label);
			},
			header);
	});
var $author$project$Markdown$Parser$parseInlines = F2(
	function (linkReferences, rawBlock) {
		switch (rawBlock.$) {
			case 0:
				var level = rawBlock.a;
				var unparsedInlines = rawBlock.b;
				var _v17 = $author$project$Markdown$Parser$toHeading(level);
				if (!_v17.$) {
					var parsedLevel = _v17.a;
					return $author$project$Markdown$Parser$ParsedBlock(
						A2(
							$author$project$Markdown$Block$Heading,
							parsedLevel,
							A2($author$project$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
				} else {
					var e = _v17.a;
					return $author$project$Markdown$Parser$InlineProblem(e);
				}
			case 1:
				var unparsedInlines = rawBlock.a;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$Paragraph(
						A2($author$project$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines)));
			case 2:
				var html = rawBlock.a;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$HtmlBlock(html));
			case 3:
				var tight = rawBlock.a;
				var unparsedItems = rawBlock.c;
				var parseItem = F2(
					function (rawBlockTask, rawBlocks) {
						var blocksTask = function () {
							if (!rawBlockTask.$) {
								if (!rawBlockTask.a) {
									return 1;
								} else {
									return 2;
								}
							} else {
								return 0;
							}
						}();
						var blocks = function () {
							var _v18 = $author$project$Markdown$Parser$parseAllInlines(
								{a: linkReferences, b: rawBlocks});
							if (!_v18.$) {
								var parsedBlocks = _v18.a;
								return parsedBlocks;
							} else {
								return _List_Nil;
							}
						}();
						return A2($author$project$Markdown$Block$ListItem, blocksTask, blocks);
					});
				return $author$project$Markdown$Parser$ParsedBlock(
					A2(
						$author$project$Markdown$Block$UnorderedList,
						$author$project$Markdown$Parser$isTightBoolToListDisplay(tight),
						$elm$core$List$reverse(
							A2(
								$elm$core$List$map,
								function (item) {
									return A2(parseItem, item.n, item.bZ);
								},
								unparsedItems))));
			case 4:
				var tight = rawBlock.a;
				var startingIndex = rawBlock.d;
				var unparsedItems = rawBlock.e;
				var parseItem = function (rawBlocks) {
					var _v20 = $author$project$Markdown$Parser$parseAllInlines(
						{a: linkReferences, b: rawBlocks});
					if (!_v20.$) {
						var parsedBlocks = _v20.a;
						return parsedBlocks;
					} else {
						return _List_Nil;
					}
				};
				return $author$project$Markdown$Parser$ParsedBlock(
					A3(
						$author$project$Markdown$Block$OrderedList,
						$author$project$Markdown$Parser$isTightBoolToListDisplay(tight),
						startingIndex,
						$elm$core$List$reverse(
							A2($elm$core$List$map, parseItem, unparsedItems))));
			case 5:
				var codeBlock = rawBlock.a;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$CodeBlock(codeBlock));
			case 7:
				return $author$project$Markdown$Parser$ParsedBlock($author$project$Markdown$Block$ThematicBreak);
			case 10:
				return $author$project$Markdown$Parser$EmptyBlock;
			case 11:
				return $author$project$Markdown$Parser$EmptyBlock;
			case 12:
				var rawBlocks = rawBlock.a;
				var _v21 = $author$project$Markdown$Parser$parseAllInlines(
					{a: linkReferences, b: rawBlocks});
				if (!_v21.$) {
					var parsedBlocks = _v21.a;
					return $author$project$Markdown$Parser$ParsedBlock(
						$author$project$Markdown$Block$BlockQuote(parsedBlocks));
				} else {
					var e = _v21.a;
					return $author$project$Markdown$Parser$InlineProblem(e);
				}
			case 6:
				var codeBlockBody = rawBlock.a;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$CodeBlock(
						{bZ: codeBlockBody, ce: $elm$core$Maybe$Nothing}));
			case 8:
				var _v22 = rawBlock.a;
				var header = _v22.a;
				var rows = _v22.b;
				return $author$project$Markdown$Parser$ParsedBlock(
					A2(
						$author$project$Markdown$Block$Table,
						A2($author$project$Markdown$Parser$parseHeaderInlines, linkReferences, header),
						A2($author$project$Markdown$Parser$parseRowInlines, linkReferences, rows)));
			case 9:
				var _v23 = rawBlock.a;
				var text = _v23.a;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$Paragraph(
						A2($author$project$Markdown$Parser$inlineParseHelper, linkReferences, text.bq)));
			default:
				var raw = rawBlock.b;
				return $author$project$Markdown$Parser$ParsedBlock(
					$author$project$Markdown$Block$Paragraph(
						A2($author$project$Markdown$Parser$inlineParseHelper, linkReferences, raw)));
		}
	});
var $author$project$Markdown$Parser$parseRawInline = F3(
	function (linkReferences, wrap, unparsedInlines) {
		return wrap(
			A2($author$project$Markdown$Parser$inlineParseHelper, linkReferences, unparsedInlines));
	});
var $author$project$Markdown$Parser$parseRowInlines = F2(
	function (linkReferences, rows) {
		return A2(
			$elm$core$List$map,
			function (row) {
				return A2(
					$elm$core$List$map,
					function (column) {
						return A3($author$project$Markdown$Parser$parseRawInline, linkReferences, $elm$core$Basics$identity, column);
					},
					row);
			},
			rows);
	});
var $author$project$Markdown$Parser$stepRawBlock = function (revStmts) {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v2) {
					return $elm$parser$Parser$Advanced$Done(revStmts);
				},
				$author$project$Helpers$endOfFile),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (reference) {
					return $elm$parser$Parser$Advanced$Loop(
						A2($author$project$Markdown$Parser$addReference, revStmts, reference));
				},
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$LinkReferenceDefinition$parser)),
				function () {
				var _v3 = revStmts.b;
				_v3$6:
				while (true) {
					if (_v3.b) {
						switch (_v3.a.$) {
							case 1:
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$author$project$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser()));
							case 8:
								var table = _v3.a.a;
								return A2(
									$elm$parser$Parser$Advanced$map,
									function (block) {
										return $elm$parser$Parser$Advanced$Loop(block);
									},
									A2(
										$elm$parser$Parser$Advanced$andThen,
										$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
										$elm$parser$Parser$Advanced$oneOf(
											_List_fromArray(
												[
													$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser(),
													$author$project$Markdown$Parser$tableRowIfTableStarted(table)
												]))));
							case 3:
								var _v4 = _v3.a;
								var tight = _v4.a;
								var intended = _v4.b;
								var closeListItems = _v4.c;
								var openListItem = _v4.d;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													$author$project$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A4(
															$author$project$Markdown$RawBlock$UnorderedListBlock,
															tight,
															intended,
															closeListItems,
															_Utils_update(
																openListItem,
																{
																	bZ: A3($author$project$Markdown$Parser$joinRawStringsWith, '', openListItem.bZ, newString)
																})),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													A4(
														$author$project$Markdown$RawBlock$UnorderedListBlock,
														tight,
														intended,
														closeListItems,
														_Utils_update(
															openListItem,
															{
																bZ: A3($author$project$Markdown$Parser$joinRawStringsWith, '\n', openListItem.bZ, newString)
															})),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v5) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$author$project$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
														$author$project$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$author$project$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 4:
								var _v10 = _v3.a;
								var tight = _v10.a;
								var intended = _v10.b;
								var marker = _v10.c;
								var order = _v10.d;
								var closeListItems = _v10.e;
								var openListItem = _v10.f;
								var rest = _v3.b;
								var completeOrMergeUnorderedListBlockBlankLine = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													$author$project$Markdown$RawBlock$BlankLine,
													A2(
														$elm$core$List$cons,
														A6($author$project$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
														rest))
											});
									});
								var completeOrMergeUnorderedListBlock = F2(
									function (state, newString) {
										return _Utils_update(
											state,
											{
												b: A2(
													$elm$core$List$cons,
													A6($author$project$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
													rest)
											});
									});
								return $elm$parser$Parser$Advanced$oneOf(
									_List_fromArray(
										[
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												function (_v11) {
													return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
												},
												$author$project$Markdown$Parser$blankLine)),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$map,
												completeOrMergeUnorderedListBlock(revStmts),
												A2(
													$elm$parser$Parser$Advanced$keeper,
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
														$elm$parser$Parser$Advanced$symbol(
															A2(
																$elm$parser$Parser$Advanced$Token,
																A2($elm$core$String$repeat, intended, ' '),
																$elm$parser$Parser$ExpectingSymbol('Indentation')))),
													A2(
														$elm$parser$Parser$Advanced$ignorer,
														$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
														$author$project$Helpers$lineEndOrEnd)))),
											A2(
											$elm$parser$Parser$Advanced$map,
											function (block) {
												return $elm$parser$Parser$Advanced$Loop(block);
											},
											A2(
												$elm$parser$Parser$Advanced$andThen,
												$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
												$author$project$Markdown$Parser$cyclic$mergeableBlockAfterList()))
										]));
							case 10:
								if (_v3.b.b) {
									switch (_v3.b.a.$) {
										case 3:
											var _v6 = _v3.a;
											var _v7 = _v3.b;
											var _v8 = _v7.a;
											var tight = _v8.a;
											var intended = _v8.b;
											var closeListItems = _v8.c;
											var openListItem = _v8.d;
											var rest = _v7.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																$author$project$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A4(
																		$author$project$Markdown$RawBlock$UnorderedListBlock,
																		tight,
																		intended,
																		closeListItems,
																		_Utils_update(
																			openListItem,
																			{
																				bZ: A3($author$project$Markdown$Parser$joinRawStringsWith, '', openListItem.bZ, newString)
																			})),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																A4(
																	$author$project$Markdown$RawBlock$UnorderedListBlock,
																	tight,
																	intended,
																	closeListItems,
																	_Utils_update(
																		openListItem,
																		{
																			bZ: A3($author$project$Markdown$Parser$joinRawStringsWith, '\n', openListItem.bZ, newString)
																		})),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem.bZ) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v9) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$author$project$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
																	$author$project$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										case 4:
											var _v12 = _v3.a;
											var _v13 = _v3.b;
											var _v14 = _v13.a;
											var tight = _v14.a;
											var intended = _v14.b;
											var marker = _v14.c;
											var order = _v14.d;
											var closeListItems = _v14.e;
											var openListItem = _v14.f;
											var rest = _v13.b;
											var completeOrMergeUnorderedListBlockBlankLine = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																$author$project$Markdown$RawBlock$BlankLine,
																A2(
																	$elm$core$List$cons,
																	A6($author$project$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																	rest))
														});
												});
											var completeOrMergeUnorderedListBlock = F2(
												function (state, newString) {
													return _Utils_update(
														state,
														{
															b: A2(
																$elm$core$List$cons,
																A6($author$project$Markdown$RawBlock$OrderedListBlock, tight, intended, marker, order, closeListItems, openListItem + ('\n' + newString)),
																rest)
														});
												});
											return ($elm$core$String$trim(openListItem) === '') ? A2(
												$elm$parser$Parser$Advanced$map,
												function (block) {
													return $elm$parser$Parser$Advanced$Loop(block);
												},
												A2(
													$elm$parser$Parser$Advanced$andThen,
													$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
													$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser())) : $elm$parser$Parser$Advanced$oneOf(
												_List_fromArray(
													[
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															function (_v15) {
																return A2(completeOrMergeUnorderedListBlockBlankLine, revStmts, '\n');
															},
															$author$project$Markdown$Parser$blankLine)),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$map,
															completeOrMergeUnorderedListBlock(revStmts),
															A2(
																$elm$parser$Parser$Advanced$keeper,
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$succeed($elm$core$Basics$identity),
																	$elm$parser$Parser$Advanced$symbol(
																		A2(
																			$elm$parser$Parser$Advanced$Token,
																			A2($elm$core$String$repeat, intended, ' '),
																			$elm$parser$Parser$ExpectingSymbol('Indentation')))),
																A2(
																	$elm$parser$Parser$Advanced$ignorer,
																	$elm$parser$Parser$Advanced$getChompedString($author$project$Helpers$chompUntilLineEndOrEnd),
																	$author$project$Helpers$lineEndOrEnd)))),
														A2(
														$elm$parser$Parser$Advanced$map,
														function (block) {
															return $elm$parser$Parser$Advanced$Loop(block);
														},
														A2(
															$elm$parser$Parser$Advanced$andThen,
															$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
															$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()))
													]));
										default:
											break _v3$6;
									}
								} else {
									break _v3$6;
								}
							default:
								break _v3$6;
						}
					} else {
						break _v3$6;
					}
				}
				return A2(
					$elm$parser$Parser$Advanced$map,
					function (block) {
						return $elm$parser$Parser$Advanced$Loop(block);
					},
					A2(
						$elm$parser$Parser$Advanced$andThen,
						$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
						$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser()));
			}(),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (block) {
					return $elm$parser$Parser$Advanced$Loop(block);
				},
				A2(
					$elm$parser$Parser$Advanced$andThen,
					$author$project$Markdown$Parser$completeOrMergeBlocks(revStmts),
					$author$project$Markdown$Parser$openBlockOrParagraphParser))
			]));
};
var $author$project$Markdown$Parser$textNodeToBlocks = function (textNodeValue) {
	return A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		$author$project$Markdown$Parser$parse(textNodeValue));
};
var $author$project$Markdown$Parser$xmlNodeToHtmlNode = function (xmlNode) {
	switch (xmlNode.$) {
		case 1:
			var innerText = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$author$project$Markdown$RawBlock$OpenBlockOrParagraph(innerText));
		case 0:
			var tag = xmlNode.a;
			var attributes = xmlNode.b;
			var children = xmlNode.c;
			var _v1 = $author$project$Markdown$Parser$nodesToBlocks(children);
			if (!_v1.$) {
				var parsedChildren = _v1.a;
				return $elm$parser$Parser$Advanced$succeed(
					$author$project$Markdown$RawBlock$Html(
						A3($author$project$Markdown$Block$HtmlElement, tag, attributes, parsedChildren)));
			} else {
				var err = _v1.a;
				return $elm$parser$Parser$Advanced$problem(err);
			}
		case 2:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$author$project$Markdown$RawBlock$Html(
					$author$project$Markdown$Block$HtmlComment(string)));
		case 3:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$author$project$Markdown$RawBlock$Html(
					$author$project$Markdown$Block$Cdata(string)));
		case 4:
			var string = xmlNode.a;
			return $elm$parser$Parser$Advanced$succeed(
				$author$project$Markdown$RawBlock$Html(
					$author$project$Markdown$Block$ProcessingInstruction(string)));
		default:
			var declarationType = xmlNode.a;
			var content = xmlNode.b;
			return $elm$parser$Parser$Advanced$succeed(
				$author$project$Markdown$RawBlock$Html(
					A2($author$project$Markdown$Block$HtmlDeclaration, declarationType, content)));
	}
};
function $author$project$Markdown$Parser$cyclic$rawBlockParser() {
	return A2(
		$elm$parser$Parser$Advanced$andThen,
		$author$project$Markdown$Parser$completeBlocks,
		A2(
			$elm$parser$Parser$Advanced$loop,
			{a: _List_Nil, b: _List_Nil},
			$author$project$Markdown$Parser$stepRawBlock));
}
function $author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$author$project$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$author$project$Markdown$Parser$blankLine,
				$author$project$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$author$project$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$CodeBlock$parser)),
				$author$project$Markdown$Parser$indentedCodeBlock,
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v40) {
					return $author$project$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($author$project$ThematicBreak$parser)),
				$author$project$Markdown$Parser$unorderedListBlock(false),
				$author$project$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$Heading$parser),
				$author$project$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $author$project$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$author$project$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$author$project$Markdown$Parser$blankLine,
				$author$project$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$author$project$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$CodeBlock$parser)),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$Parser$setextLineParser),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v39) {
					return $author$project$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($author$project$ThematicBreak$parser)),
				$author$project$Markdown$Parser$unorderedListBlock(true),
				$author$project$Markdown$Parser$orderedListBlock(true),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$Heading$parser),
				$author$project$Markdown$Parser$cyclic$htmlParser(),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$Parser$tableDelimiterInOpenParagraph)
			]));
}
function $author$project$Markdown$Parser$cyclic$mergeableBlockAfterList() {
	return $elm$parser$Parser$Advanced$oneOf(
		_List_fromArray(
			[
				$author$project$Markdown$Parser$parseAsParagraphInsteadOfHtmlBlock,
				$author$project$Markdown$Parser$blankLine,
				$author$project$Markdown$Parser$blockQuote,
				A2(
				$elm$parser$Parser$Advanced$map,
				$author$project$Markdown$RawBlock$CodeBlock,
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$CodeBlock$parser)),
				A2(
				$elm$parser$Parser$Advanced$map,
				function (_v38) {
					return $author$project$Markdown$RawBlock$ThematicBreak;
				},
				$elm$parser$Parser$Advanced$backtrackable($author$project$ThematicBreak$parser)),
				$author$project$Markdown$Parser$unorderedListBlock(false),
				$author$project$Markdown$Parser$orderedListBlock(false),
				$elm$parser$Parser$Advanced$backtrackable($author$project$Markdown$Heading$parser),
				$author$project$Markdown$Parser$cyclic$htmlParser()
			]));
}
function $author$project$Markdown$Parser$cyclic$htmlParser() {
	return A2($elm$parser$Parser$Advanced$andThen, $author$project$Markdown$Parser$xmlNodeToHtmlNode, $author$project$HtmlParser$html);
}
var $author$project$Markdown$Parser$rawBlockParser = $author$project$Markdown$Parser$cyclic$rawBlockParser();
$author$project$Markdown$Parser$cyclic$rawBlockParser = function () {
	return $author$project$Markdown$Parser$rawBlockParser;
};
var $author$project$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser = $author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser();
$author$project$Markdown$Parser$cyclic$mergeableBlockNotAfterOpenBlockOrParagraphParser = function () {
	return $author$project$Markdown$Parser$mergeableBlockNotAfterOpenBlockOrParagraphParser;
};
var $author$project$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser = $author$project$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser();
$author$project$Markdown$Parser$cyclic$mergeableBlockAfterOpenBlockOrParagraphParser = function () {
	return $author$project$Markdown$Parser$mergeableBlockAfterOpenBlockOrParagraphParser;
};
var $author$project$Markdown$Parser$mergeableBlockAfterList = $author$project$Markdown$Parser$cyclic$mergeableBlockAfterList();
$author$project$Markdown$Parser$cyclic$mergeableBlockAfterList = function () {
	return $author$project$Markdown$Parser$mergeableBlockAfterList;
};
var $author$project$Markdown$Parser$htmlParser = $author$project$Markdown$Parser$cyclic$htmlParser();
$author$project$Markdown$Parser$cyclic$htmlParser = function () {
	return $author$project$Markdown$Parser$htmlParser;
};
var $elm$core$Result$map2 = F3(
	function (func, ra, rb) {
		if (ra.$ === 1) {
			var x = ra.a;
			return $elm$core$Result$Err(x);
		} else {
			var a = ra.a;
			if (rb.$ === 1) {
				var x = rb.a;
				return $elm$core$Result$Err(x);
			} else {
				var b = rb.a;
				return $elm$core$Result$Ok(
					A2(func, a, b));
			}
		}
	});
var $author$project$Markdown$Renderer$combineResults = A2(
	$elm$core$List$foldr,
	$elm$core$Result$map2($elm$core$List$cons),
	$elm$core$Result$Ok(_List_Nil));
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Markdown$Block$foldl = F3(
	function (_function, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var block = list.a;
				var remainingBlocks = list.b;
				switch (block.$) {
					case 0:
						var html = block.a;
						if (!html.$) {
							var children = html.c;
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = _Utils_ap(children, remainingBlocks);
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						} else {
							var $temp$function = _function,
								$temp$acc = A2(_function, block, acc),
								$temp$list = remainingBlocks;
							_function = $temp$function;
							acc = $temp$acc;
							list = $temp$list;
							continue foldl;
						}
					case 1:
						var blocks = block.b;
						var childBlocks = A2(
							$elm$core$List$concatMap,
							function (_v3) {
								var children = _v3.b;
								return children;
							},
							blocks);
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(childBlocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 2:
						var blocks = block.c;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(
							$elm$core$List$concat(blocks),
							remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 3:
						var blocks = block.a;
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = _Utils_ap(blocks, remainingBlocks);
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 4:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 5:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 6:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 8:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					case 9:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
					default:
						var $temp$function = _function,
							$temp$acc = A2(_function, block, acc),
							$temp$list = remainingBlocks;
						_function = $temp$function;
						acc = $temp$acc;
						list = $temp$list;
						continue foldl;
				}
			}
		}
	});
var $author$project$Markdown$Block$extractInlineBlockText = function (block) {
	switch (block.$) {
		case 5:
			var inlines = block.a;
			return $author$project$Markdown$Block$extractInlineText(inlines);
		case 0:
			var html = block.a;
			if (!html.$) {
				var blocks = html.c;
				return A3(
					$author$project$Markdown$Block$foldl,
					F2(
						function (nestedBlock, soFar) {
							return _Utils_ap(
								soFar,
								$author$project$Markdown$Block$extractInlineBlockText(nestedBlock));
						}),
					'',
					blocks);
			} else {
				return '';
			}
		case 1:
			var items = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (_v4) {
						var blocks = _v4.b;
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $author$project$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 2:
			var items = block.c;
			return A2(
				$elm$core$String$join,
				'\n',
				A2(
					$elm$core$List$map,
					function (blocks) {
						return A2(
							$elm$core$String$join,
							'\n',
							A2($elm$core$List$map, $author$project$Markdown$Block$extractInlineBlockText, blocks));
					},
					items));
		case 3:
			var blocks = block.a;
			return A2(
				$elm$core$String$join,
				'\n',
				A2($elm$core$List$map, $author$project$Markdown$Block$extractInlineBlockText, blocks));
		case 4:
			var inlines = block.b;
			return $author$project$Markdown$Block$extractInlineText(inlines);
		case 6:
			var header = block.a;
			var rows = block.b;
			return A2(
				$elm$core$String$join,
				'\n',
				$elm$core$List$concat(
					_List_fromArray(
						[
							A2(
							$elm$core$List$map,
							$author$project$Markdown$Block$extractInlineText,
							A2(
								$elm$core$List$map,
								function ($) {
									return $.ac;
								},
								header)),
							$elm$core$List$concat(
							A2(
								$elm$core$List$map,
								$elm$core$List$map($author$project$Markdown$Block$extractInlineText),
								rows))
						])));
		case 8:
			var body = block.a.bZ;
			return body;
		case 9:
			return '';
		default:
			var inlines = block.a;
			return $author$project$Markdown$Block$extractInlineText(inlines);
	}
};
var $author$project$Markdown$Block$extractInlineText = function (inlines) {
	return A3($elm$core$List$foldl, $author$project$Markdown$Block$extractTextHelp, '', inlines);
};
var $author$project$Markdown$Block$extractTextHelp = F2(
	function (inline, text) {
		switch (inline.$) {
			case 7:
				var str = inline.a;
				return _Utils_ap(text, str);
			case 8:
				return text + ' ';
			case 6:
				var str = inline.a;
				return _Utils_ap(text, str);
			case 1:
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$author$project$Markdown$Block$extractInlineText(inlines));
			case 2:
				var inlines = inline.c;
				return _Utils_ap(
					text,
					$author$project$Markdown$Block$extractInlineText(inlines));
			case 0:
				var html = inline.a;
				if (!html.$) {
					var blocks = html.c;
					return A3(
						$author$project$Markdown$Block$foldl,
						F2(
							function (block, soFar) {
								return _Utils_ap(
									soFar,
									$author$project$Markdown$Block$extractInlineBlockText(block));
							}),
						text,
						blocks);
				} else {
					return text;
				}
			case 4:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$author$project$Markdown$Block$extractInlineText(inlines));
			case 3:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$author$project$Markdown$Block$extractInlineText(inlines));
			default:
				var inlines = inline.a;
				return _Utils_ap(
					text,
					$author$project$Markdown$Block$extractInlineText(inlines));
		}
	});
var $author$project$Markdown$Renderer$renderHtml = F5(
	function (tagName, attributes, children, _v0, renderedChildren) {
		var htmlRenderer = _v0;
		return A2(
			$elm$core$Result$andThen,
			function (okChildren) {
				return A2(
					$elm$core$Result$map,
					function (myRenderer) {
						return myRenderer(okChildren);
					},
					A3(htmlRenderer, tagName, attributes, children));
			},
			$author$project$Markdown$Renderer$combineResults(renderedChildren));
	});
var $author$project$Markdown$Renderer$foldThing = F3(
	function (renderer, topLevelInline, soFar) {
		var _v12 = A2($author$project$Markdown$Renderer$renderSingleInline, renderer, topLevelInline);
		if (!_v12.$) {
			var inline = _v12.a;
			return A2($elm$core$List$cons, inline, soFar);
		} else {
			return soFar;
		}
	});
var $author$project$Markdown$Renderer$renderHelper = F2(
	function (renderer, blocks) {
		return A2(
			$elm$core$List$filterMap,
			$author$project$Markdown$Renderer$renderHelperSingle(renderer),
			blocks);
	});
var $author$project$Markdown$Renderer$renderHelperSingle = function (renderer) {
	return function (block) {
		switch (block.$) {
			case 4:
				var level = block.a;
				var content = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (children) {
							return renderer.a4(
								{
									aS: children,
									bd: level,
									br: $author$project$Markdown$Block$extractInlineText(content)
								});
						},
						A2($author$project$Markdown$Renderer$renderStyled, renderer, content)));
			case 5:
				var content = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.bi,
						A2($author$project$Markdown$Renderer$renderStyled, renderer, content)));
			case 7:
				var content = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.cb,
						A2($author$project$Markdown$Renderer$renderStyled, renderer, content)));
			case 0:
				var html = block.a;
				if (!html.$) {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($author$project$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			case 1:
				var tight = block.a;
				var items = block.b;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return renderer.bQ(
								A2(
									$elm$core$List$map,
									function (_v7) {
										var task = _v7.a;
										var children = _v7.b;
										return A2(
											$author$project$Markdown$Block$ListItem,
											task,
											$elm$core$List$concat(children));
									},
									listItems));
						},
						$author$project$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (_v4) {
									var task = _v4.a;
									var children = _v4.b;
									return A2(
										$elm$core$Result$map,
										$author$project$Markdown$Block$ListItem(task),
										$author$project$Markdown$Renderer$combineResults(
											function (blocks) {
												return A2(
													$elm$core$List$filterMap,
													function (listItemBlock) {
														var _v5 = _Utils_Tuple2(tight, listItemBlock);
														if ((_v5.a === 1) && (_v5.b.$ === 5)) {
															var _v6 = _v5.a;
															var content = _v5.b.a;
															return $elm$core$Maybe$Just(
																A2($author$project$Markdown$Renderer$renderStyled, renderer, content));
														} else {
															return A2(
																$elm$core$Maybe$map,
																$elm$core$Result$map($elm$core$List$singleton),
																A2($author$project$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
														}
													},
													blocks);
											}(children)));
								},
								items))));
			case 2:
				var tight = block.a;
				var startingIndex = block.b;
				var items = block.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						function (listItems) {
							return A2(
								renderer.bh,
								startingIndex,
								A2(
									$elm$core$List$map,
									function (children) {
										return $elm$core$List$concat(children);
									},
									listItems));
						},
						$author$project$Markdown$Renderer$combineResults(
							A2(
								$elm$core$List$map,
								function (itemsblocks) {
									return $author$project$Markdown$Renderer$combineResults(
										function (blocks) {
											return A2(
												$elm$core$List$filterMap,
												function (listItemBlock) {
													var _v8 = _Utils_Tuple2(tight, listItemBlock);
													if ((_v8.a === 1) && (_v8.b.$ === 5)) {
														var _v9 = _v8.a;
														var content = _v8.b.a;
														return $elm$core$Maybe$Just(
															A2($author$project$Markdown$Renderer$renderStyled, renderer, content));
													} else {
														return A2(
															$elm$core$Maybe$map,
															$elm$core$Result$map($elm$core$List$singleton),
															A2($author$project$Markdown$Renderer$renderHelperSingle, renderer, listItemBlock));
													}
												},
												blocks);
										}(itemsblocks));
								},
								items))));
			case 8:
				var codeBlock = block.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.aT(codeBlock)));
			case 9:
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.bM));
			case 3:
				var nestedBlocks = block.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.aQ,
						$author$project$Markdown$Renderer$combineResults(
							A2($author$project$Markdown$Renderer$renderHelper, renderer, nestedBlocks))));
			default:
				var header = block.a;
				var rows = block.b;
				var renderedHeaderCells = $author$project$Markdown$Renderer$combineResults(
					A2(
						$elm$core$List$map,
						function (_v11) {
							var label = _v11.ac;
							var alignment = _v11.ap;
							return A2(
								$elm$core$Result$map,
								$elm$core$Tuple$pair(alignment),
								A2($author$project$Markdown$Renderer$renderStyled, renderer, label));
						},
						header));
				var renderedHeader = A2(
					$elm$core$Result$map,
					function (listListView) {
						return renderer.bI(
							$elm$core$List$singleton(
								renderer.bK(
									A2(
										$elm$core$List$map,
										function (_v10) {
											var maybeAlignment = _v10.a;
											var item = _v10.b;
											return A2(renderer.bJ, maybeAlignment, item);
										},
										listListView))));
					},
					renderedHeaderCells);
				var renderedBody = function (r) {
					return $elm$core$List$isEmpty(r) ? _List_Nil : _List_fromArray(
						[
							renderer.bG(r)
						]);
				};
				var alignmentForColumn = function (columnIndex) {
					return A2(
						$elm$core$Maybe$andThen,
						function ($) {
							return $.ap;
						},
						$elm$core$List$head(
							A2($elm$core$List$drop, columnIndex, header)));
				};
				var renderRow = function (cells) {
					return A2(
						$elm$core$Result$map,
						renderer.bK,
						A2(
							$elm$core$Result$map,
							$elm$core$List$indexedMap(
								F2(
									function (index, cell) {
										return A2(
											renderer.bH,
											alignmentForColumn(index),
											cell);
									})),
							$author$project$Markdown$Renderer$combineResults(
								A2(
									$elm$core$List$map,
									$author$project$Markdown$Renderer$renderStyled(renderer),
									cells))));
				};
				var renderedRows = $author$project$Markdown$Renderer$combineResults(
					A2($elm$core$List$map, renderRow, rows));
				return $elm$core$Maybe$Just(
					A3(
						$elm$core$Result$map2,
						F2(
							function (h, r) {
								return renderer.bF(
									A2(
										$elm$core$List$cons,
										h,
										renderedBody(r)));
							}),
						renderedHeader,
						renderedRows));
		}
	};
};
var $author$project$Markdown$Renderer$renderHtmlNode = F4(
	function (renderer, tag, attributes, children) {
		return A5(
			$author$project$Markdown$Renderer$renderHtml,
			tag,
			attributes,
			children,
			renderer.b8,
			A2($author$project$Markdown$Renderer$renderHelper, renderer, children));
	});
var $author$project$Markdown$Renderer$renderSingleInline = F2(
	function (renderer, inline) {
		switch (inline.$) {
			case 4:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.bC,
						A2($author$project$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 3:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.aX,
						A2($author$project$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 5:
				var innerInlines = inline.a;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$map,
						renderer.bB,
						A2($author$project$Markdown$Renderer$renderStyled, renderer, innerInlines)));
			case 2:
				var src = inline.a;
				var title = inline.b;
				var children = inline.c;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.a9(
							{
								aq: $author$project$Markdown$Block$extractInlineText(children),
								az: src,
								cx: title
							})));
			case 7:
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.c(string)));
			case 6:
				var string = inline.a;
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(
						renderer.aU(string)));
			case 1:
				var destination = inline.a;
				var title = inline.b;
				var inlines = inline.c;
				return $elm$core$Maybe$Just(
					A2(
						$elm$core$Result$andThen,
						function (children) {
							return $elm$core$Result$Ok(
								A2(
									renderer.be,
									{b1: destination, cx: title},
									children));
						},
						A2($author$project$Markdown$Renderer$renderStyled, renderer, inlines)));
			case 8:
				return $elm$core$Maybe$Just(
					$elm$core$Result$Ok(renderer.a3));
			default:
				var html = inline.a;
				if (!html.$) {
					var tag = html.a;
					var attributes = html.b;
					var children = html.c;
					return $elm$core$Maybe$Just(
						A4($author$project$Markdown$Renderer$renderHtmlNode, renderer, tag, attributes, children));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $author$project$Markdown$Renderer$renderStyled = F2(
	function (renderer, styledStrings) {
		return $author$project$Markdown$Renderer$combineResults(
			A3(
				$elm$core$List$foldr,
				$author$project$Markdown$Renderer$foldThing(renderer),
				_List_Nil,
				styledStrings));
	});
var $author$project$Markdown$Renderer$render = F2(
	function (renderer, ast) {
		return $author$project$Markdown$Renderer$combineResults(
			A2($author$project$Markdown$Renderer$renderHelper, renderer, ast));
	});
var $author$project$Markdown$Block$walk = F2(
	function (_function, block) {
		switch (block.$) {
			case 3:
				var blocks = block.a;
				return _function(
					$author$project$Markdown$Block$BlockQuote(
						A2(
							$elm$core$List$map,
							$author$project$Markdown$Block$walk(_function),
							blocks)));
			case 0:
				var html = block.a;
				if (!html.$) {
					var string = html.a;
					var htmlAttributes = html.b;
					var blocks = html.c;
					return _function(
						$author$project$Markdown$Block$HtmlBlock(
							A3(
								$author$project$Markdown$Block$HtmlElement,
								string,
								htmlAttributes,
								A2(
									$elm$core$List$map,
									$author$project$Markdown$Block$walk(_function),
									blocks))));
				} else {
					return _function(block);
				}
			case 1:
				return _function(block);
			case 2:
				return _function(block);
			case 4:
				return _function(block);
			case 5:
				return _function(block);
			case 6:
				return _function(block);
			case 8:
				return _function(block);
			case 9:
				return _function(block);
			default:
				return _function(block);
		}
	});
var $author$project$AonTool$viewMarkdown = F2(
	function (model, text) {
		var markdown = A2(
			$elm$core$Result$mapError,
			$elm$core$List$map($author$project$Markdown$Parser$deadEndToString),
			A2(
				$elm$core$Result$map,
				$elm$core$List$map(
					$author$project$Markdown$Block$walk($author$project$AonTool$fixMarkdownSpacing)),
				$author$project$Markdown$Parser$parse(
					A3(
						$elm$regex$Regex$replace,
						$author$project$AonTool$regexFromString('<%([^%]+?)%%>(.+?)<%END>'),
						function (match) {
							return A2(
								$elm$core$String$join,
								'',
								_List_fromArray(
									[
										'<link code=\"',
										A3($author$project$AonTool$getSubmatch, 0, '', match),
										'\">',
										A3($author$project$AonTool$getSubmatch, 1, '', match),
										'</link>'
									]));
						},
						A3(
							$elm$regex$Regex$replace,
							$author$project$AonTool$regexFromString('<%([^%]+?)%([^%]+?)%%>(.+?)<%END>'),
							function (match) {
								return A2(
									$elm$core$String$join,
									'',
									_List_fromArray(
										[
											'<link code=\"',
											A3($author$project$AonTool$getSubmatch, 0, '', match),
											'\" id=\"',
											A3($author$project$AonTool$getSubmatch, 1, '', match),
											'\">',
											A3($author$project$AonTool$getSubmatch, 2, '', match),
											'</link>'
										]));
							},
							A3(
								$elm$regex$Regex$replace,
								$author$project$AonTool$regexFromString('<%ACTION.TYPES#(.+?)%%>'),
								function (match) {
									return '<action id=\"' + (A3($author$project$AonTool$getSubmatch, 0, '', match) + '\" />');
								},
								A3($elm$core$String$replace, ' & ', ' &amp; ', text)))))));
		if (!markdown.$) {
			var blocks = markdown.a;
			var _v1 = A2(
				$author$project$Markdown$Renderer$render,
				$author$project$AonTool$markdownRenderer(model),
				blocks);
			if (!_v1.$) {
				var v = _v1.a;
				return $elm$core$List$concat(v);
			} else {
				var err = _v1.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', 'red')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Error rendering markdown:')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', 'red')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(err)
							]))
					]);
			}
		} else {
			var errors = markdown.a;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', 'red')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Error parsing markdown:')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', 'red')
						]),
					A2($elm$core$List$map, $elm$html$Html$text, errors))
				]);
		}
	});
var $author$project$AonTool$viewPreview = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'flex', '1'),
				A2($elm$html$Html$Attributes$style, 'max-height', '250px'),
				A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto')
			]),
		A2(
			$author$project$AonTool$viewMarkdown,
			model,
			A2(
				$author$project$AonTool$highlightSelection,
				model,
				A2($author$project$AonTool$highlightCandidate, model, model.c))));
};
var $author$project$AonTool$Actions = 0;
var $author$project$AonTool$AnimalCompanions = 1;
var $author$project$AonTool$CopyRowToClipboardPressed = {$: 7};
var $author$project$AonTool$CriticalEffects = 2;
var $author$project$AonTool$Feats = 3;
var $author$project$AonTool$ParseActionPressed = {$: 18};
var $author$project$AonTool$ParseAnimalCompanionsPressed = {$: 19};
var $author$project$AonTool$ParseCritEffectsPressed = {$: 20};
var $author$project$AonTool$ParseFeatHeadersPressed = {$: 21};
var $author$project$AonTool$ParseRitualHeadersPressed = {$: 22};
var $author$project$AonTool$ParseSpellHeadersPressed = {$: 23};
var $author$project$AonTool$ParseTreasureHeadersPressed = {$: 24};
var $author$project$AonTool$Rituals = 4;
var $author$project$AonTool$Spells = 5;
var $author$project$AonTool$TableColumnInputFocused = function (a) {
	return {$: 29, a: a};
};
var $author$project$AonTool$TableSelected = function (a) {
	return {$: 30, a: a};
};
var $author$project$AonTool$Treasure = 6;
var $elm_community$html_extra$Html$Extra$nothing = $elm$html$Html$text('');
var $elm_community$html_extra$Html$Extra$viewIf = F2(
	function (condition, html) {
		return condition ? html : $elm_community$html_extra$Html$Extra$nothing;
	});
var $author$project$AonTool$viewTables = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-small')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-small'),
						$elm$html$Html$Attributes$class('align-center'),
						$elm$html$Html$Attributes$class('wrap')
					]),
				A2(
					$elm$core$List$append,
					_List_fromArray(
						[
							$elm$html$Html$text('Table helpers')
						]),
					A2(
						$elm$core$List$map,
						function (table) {
							return A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$AonTool$TableSelected(table))
									]),
								_List_fromArray(
									[
										function () {
										switch (table) {
											case 0:
												return $elm$html$Html$text('Actions');
											case 1:
												return $elm$html$Html$text('AnimalCompanions');
											case 2:
												return $elm$html$Html$text('CriticalEffects');
											case 3:
												return $elm$html$Html$text('Feats');
											case 4:
												return $elm$html$Html$text('Rituals');
											case 5:
												return $elm$html$Html$text('Spells');
											default:
												return $elm$html$Html$text('Treasure');
										}
									}()
									]));
						},
						_List_fromArray(
							[0, 1, 2, 3, 4, 5, 6])))),
				A2(
				$elm_community$html_extra$Html$Extra$viewIf,
				!_Utils_eq(model.P, $elm$core$Maybe$Nothing),
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', 'repeat(auto-fill, 200px)')
						]),
					A2(
						$elm$core$List$map,
						function (column) {
							return A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('column'),
										A2($elm$html$Html$Attributes$style, 'padding', '4px'),
										A2($elm$html$Html$Attributes$style, 'border', 'transparent 1px solid'),
										A2(
										$elm_community$html_extra$Html$Attributes$Extra$attributeIf,
										_Utils_eq(
											model.Q,
											$elm$core$Maybe$Just(column)),
										A2($elm$html$Html$Attributes$style, 'border', 'white 1px solid')),
										$elm$html$Html$Events$onInput($author$project$AonTool$TextChanged)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(column),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text'),
												$elm$html$Html$Attributes$placeholder('NULL'),
												$elm$html$Html$Attributes$value(
												A2(
													$elm$core$Maybe$withDefault,
													'',
													A2($elm$core$Dict$get, column, model.k))),
												$elm$html$Html$Events$onFocus(
												$author$project$AonTool$TableColumnInputFocused(column))
											]),
										_List_Nil)
									]));
						},
						$author$project$AonTool$currentTableColumns(model)))),
				A2(
				$elm_community$html_extra$Html$Extra$viewIf,
				!_Utils_eq(model.P, $elm$core$Maybe$Nothing),
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row'),
							$elm$html$Html$Attributes$class('gap-small'),
							$elm$html$Html$Attributes$class('align-center'),
							$elm$html$Html$Attributes$class('wrap')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick($author$project$AonTool$CopyRowToClipboardPressed)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Copy row')
								])),
							function () {
							var _v1 = model.P;
							if (!_v1.$) {
								switch (_v1.a) {
									case 0:
										var _v2 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseActionPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse inline action')
												]));
									case 1:
										var _v3 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseAnimalCompanionsPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse')
												]));
									case 2:
										var _v4 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseCritEffectsPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse')
												]));
									case 3:
										var _v5 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseFeatHeadersPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse headers')
												]));
									case 4:
										var _v6 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseRitualHeadersPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse headers')
												]));
									case 5:
										var _v7 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseSpellHeadersPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse headers')
												]));
									default:
										var _v8 = _v1.a;
										return A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Events$onClick($author$project$AonTool$ParseTreasureHeadersPressed)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Parse headers')
												]));
								}
							} else {
								return $elm$html$Html$text('');
							}
						}()
						])))
			]));
};
var $author$project$AonTool$ConvertActionsPressed = {$: 5};
var $author$project$AonTool$ConvertToListPressed = {$: 6};
var $author$project$AonTool$FormatTraitsPressed = {$: 13};
var $author$project$AonTool$viewUtilities = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('row'),
			$elm$html$Html$Attributes$class('gap-small'),
			$elm$html$Html$Attributes$class('align-center'),
			$elm$html$Html$Attributes$class('wrap')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('Utility'),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$FixNewlinesPressed),
					$elm$html$Html$Attributes$title('Ctrl + Space')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Fix newlines')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$AddBrPressed),
					$elm$html$Html$Attributes$title('Ctrl + Enter')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Add <br />')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					A2($author$project$AonTool$WrapWithPressed, '<b>', '</b>')),
					$elm$html$Html$Attributes$title('Ctrl + B')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Wrap with <b>')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					A2($author$project$AonTool$WrapWithPressed, '<i>', '</i>')),
					$elm$html$Html$Attributes$title('Ctrl + I')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Wrap with <i>')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					A2($author$project$AonTool$WrapWithPressed, '<u>', '</u>')),
					$elm$html$Html$Attributes$title('Ctrl + U')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Wrap with <u>')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					A2($author$project$AonTool$WrapWithPressed, '<h2 class=\"title\">', '</h2>'))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Wrap with <h2 class=\"title\">')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$ConvertToListPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Convert to <ul>')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$ConvertActionsPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Convert actions')
				])),
			A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick($author$project$AonTool$FormatTraitsPressed)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Convert traits to IDs')
				]))
		]));
var $author$project$AonTool$view = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('column'),
				$elm$html$Html$Attributes$class('gap-medium')
			]),
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'style',
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text($author$project$AonTool$css)
					])),
				$author$project$AonTool$viewOptions(model),
				$author$project$AonTool$viewTables(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-small')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$textarea,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text'),
								A2($elm$html$Html$Attributes$style, 'flex', '1'),
								$elm$html$Html$Attributes$value(model.c),
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'height', '250px'),
								$elm$html$Html$Events$onInput($author$project$AonTool$TextChanged),
								$elm$html$Html$Events$onFocus(
								$author$project$AonTool$TextFocused(true)),
								$elm$html$Html$Events$onBlur(
								$author$project$AonTool$TextFocused(false))
							]),
						_List_Nil),
						$author$project$AonTool$viewPreview(model)
					])),
				$author$project$AonTool$viewClipboard,
				$author$project$AonTool$viewUtilities,
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row'),
						$elm$html$Html$Attributes$class('gap-small')
					]),
				_List_fromArray(
					[
						$author$project$AonTool$viewCandidates(model),
						$author$project$AonTool$viewManual(model)
					]))
			]));
};
var $author$project$AonTool$main = $elm$browser$Browser$element(
	{ca: $author$project$AonTool$init, cv: $author$project$AonTool$subscriptions, cz: $author$project$AonTool$update, cA: $author$project$AonTool$view});
_Platform_export({'AonTool':{'init':$author$project$AonTool$main($elm$json$Json$Decode$value)(0)}});}(this));