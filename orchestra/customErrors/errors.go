package customerrors

import "errors"

var ERR_CONTEXT_DONE = errors.New("context done err")
var TASK_404 = errors.New("404_TASK")
var COERCION_ERROR = errors.New("COERCION_ERROR")
var TRANSITION_NOT_SUPPORTED = errors.New("TRANSITION_NOT_SUPPORTED")
var ERR_FUNC_EXEC = errors.New("func execution error")


