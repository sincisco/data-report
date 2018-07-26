SameValue (x, y)#
The internal comparison abstract operation SameValue(x, y), where x and y are ECMAScript language values, produces true or false. Such a comparison is performed as follows:

If Type(x) is different from Type(y), return false.
If Type(x) is Number, then
If x is NaN and y is NaN, return true.
If x is +0 and y is -0, return false.
If x is -0 and y is +0, return false.
If x is the same Number value as y, return true.
Return false.
Return SameValueNonNumber(x, y).
NOTE
This algorithm differs from the Strict Equality Comparison Algorithm in its treatment of signed zeroes and NaNs.





SameValueZero (x, y)#
The internal comparison abstract operation SameValueZero(x, y), 
where x and y are ECMAScript language values, produces true or false. Such a comparison is performed as follows:

If Type(x) is different from Type(y), return false.
If Type(x) is Number, then
If x is NaN and y is NaN, return true.
If x is +0 and y is -0, return true.
If x is -0 and y is +0, return true.
If x is the same Number value as y, return true.
Return false.
Return SameValueNonNumber(x, y).
NOTE
SameValueZero differs from SameValue only in its treatment of +0 and -0.






SameValueNonNumber (x, y)#
The internal comparison abstract operation SameValueNonNumber(x, y), where neither x nor y are Number values, produces true or false. Such a comparison is performed as follows:

Assert: Type(x) is not Number.
Assert: Type(x) is the same as Type(y).
If Type(x) is Undefined, return true.
If Type(x) is Null, return true.
If Type(x) is String, then
If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return true; otherwise, return false.
If Type(x) is Boolean, then
If x and y are both true or both false, return true; otherwise, return false.
If Type(x) is Symbol, then
If x and y are both the same Symbol value, return true; otherwise, return false.
Return true if x and y are the same Object value. Otherwise, return false.
